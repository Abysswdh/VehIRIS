import { createClient } from "@/lib/supabase/server";
import type { Inspection, InspectionStatus, InspectionType } from "@/lib/mock-data";

export interface InspectionRecord extends Inspection {
  dbId: string;
}

export interface DashboardData {
  stats: {
    totalVehicles: number;
    inspectionsToday: number;
    damageDetected: number;
    reportsGenerated: number;
  };
  activity: {
    week: { key: "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun"; value: number }[];
    month: { key: "w1" | "w2" | "w3" | "w4"; value: number }[];
  };
  damageBreakdown: {
    scratch: number;
    dent: number;
  };
  recentInspections: InspectionRecord[];
}

export interface HistoryData {
  inspections: InspectionRecord[];
  totals: {
    total: number;
    completed: number;
    pending: number;
    damage: number;
  };
}

interface RawInspectionRow {
  id: string;
  code: string;
  inspected_at: string;
  type: InspectionType;
  status: InspectionStatus;
  vehicles: { model: string; plate: string } | { model: string; plate: string }[] | null;
  damage_findings: { id: string; damage_type: string; review_status: string }[] | null;
}

/** Formats a Postgres timestamptz ISO string into local "YYYY-MM-DDTHH:MM" (Asia/Jakarta, UTC+7). */
function toLocalIso(timestamptz: string): string {
  const d = new Date(timestamptz);
  const parts = new Intl.DateTimeFormat("sv-SE", {
    timeZone: "Asia/Jakarta",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(d);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "00";
  return `${get("year")}-${get("month")}-${get("day")}T${get("hour")}:${get("minute")}`;
}

function mapInspection(row: RawInspectionRow): InspectionRecord {
  const vehicleObj = Array.isArray(row.vehicles) ? row.vehicles[0] : row.vehicles;
  const activeFindings = (row.damage_findings ?? []).filter((f) => f.review_status !== "dismissed");
  return {
    dbId: row.id,
    id: row.code,
    vehicle: vehicleObj?.model ?? "Unknown Vehicle",
    plate: vehicleObj?.plate ?? "-",
    date: toLocalIso(row.inspected_at),
    type: row.type,
    findings: activeFindings.length,
    status: row.status,
  };
}

export interface VehicleRecord {
  id: string;
  model: string;
  plate: string;
}

export async function getVehicles(): Promise<VehicleRecord[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("vehicles")
    .select("id, model, plate")
    .order("model", { ascending: true });

  if (error || !data) return [];
  return data;
}

export async function getInspections(): Promise<InspectionRecord[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("inspections")
    .select("id, code, inspected_at, type, status, vehicles(model, plate), damage_findings(id, damage_type, review_status)")
    .order("inspected_at", { ascending: false });

  if (error || !data) return [];
  return (data as unknown as RawInspectionRow[]).map(mapInspection);
}

export async function getHistoryData(): Promise<HistoryData> {
  const inspections = await getInspections();
  const total = inspections.length;
  const completed = inspections.filter((i) => i.status === "completed").length;
  const pending = inspections.filter((i) => i.status === "pending").length;
  const damage = inspections.filter((i) => i.findings > 0).length;

  return {
    inspections,
    totals: { total, completed, pending, damage },
  };
}

export async function getDashboardData(): Promise<DashboardData> {
  const supabase = await createClient();

  const [vehiclesRes, inspectionsRes, findingsRes] = await Promise.all([
    supabase.from("vehicles").select("id", { count: "exact", head: true }),
    supabase
      .from("inspections")
      .select("id, code, inspected_at, type, status, vehicles(model, plate), damage_findings(id, damage_type, review_status)")
      .order("inspected_at", { ascending: false }),
    supabase
      .from("damage_findings")
      .select("damage_type, review_status")
      .neq("review_status", "dismissed"),
  ]);

  const rows = (inspectionsRes.data ?? []) as unknown as RawInspectionRow[];
  const inspections = rows.map(mapInspection);
  const findings = findingsRes.data ?? [];

  const todayPrefix = toLocalIso(new Date().toISOString()).slice(0, 10);
  const inspectionsToday = inspections.filter((i) => i.date.startsWith(todayPrefix)).length;
  const reportsGenerated = inspections.filter((i) => i.status === "completed").length;

  // Weekly activity (mon..sun) over the 7-day window ending at the latest inspection date (or today).
  const dayKeys = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"] as const;
  const weekOrder = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"] as const;
  const weekCounts = Object.fromEntries(weekOrder.map((k) => [k, 0])) as Record<(typeof weekOrder)[number], number>;

  const anchorMs = rows.length > 0 ? Math.max(Date.now(), new Date(rows[0].inspected_at).getTime()) : Date.now();
  const latestMs = rows.length > 0 ? new Date(rows[0].inspected_at).getTime() : anchorMs;
  const weekWindowEnd = latestMs;
  const dayMs = 24 * 60 * 60 * 1000;

  const monthBuckets = [0, 0, 0, 0];

  for (const r of rows) {
    const t = new Date(r.inspected_at).getTime();
    const diffDays = (weekWindowEnd - t) / dayMs;
    if (diffDays >= 0 && diffDays < 7) {
      const localDate = toLocalIso(r.inspected_at).slice(0, 10);
      const dayIdx = new Date(`${localDate}T12:00:00Z`).getUTCDay();
      weekCounts[dayKeys[dayIdx]] += 1;
    }
    if (diffDays >= 0 && diffDays < 28) {
      // w4 is most recent 7 days, w1 is oldest 7 days
      const bucket = 3 - Math.floor(diffDays / 7);
      monthBuckets[bucket] += 1;
    }
  }

  const scratchCount = findings.filter((f) => f.damage_type === "scratch").length;
  const dentCount = findings.filter((f) => f.damage_type === "dent").length;
  const breakdownTotal = scratchCount + dentCount;
  const scratchPct = breakdownTotal > 0 ? Math.round((scratchCount / breakdownTotal) * 100) : 0;
  const dentPct = breakdownTotal > 0 ? 100 - scratchPct : 0;

  return {
    stats: {
      totalVehicles: vehiclesRes.count ?? 0,
      inspectionsToday,
      damageDetected: findings.length,
      reportsGenerated,
    },
    activity: {
      week: weekOrder.map((key) => ({ key, value: weekCounts[key] })),
      month: (["w1", "w2", "w3", "w4"] as const).map((key, idx) => ({ key, value: monthBuckets[idx] })),
    },
    damageBreakdown: {
      scratch: scratchPct,
      dent: dentPct,
    },
    recentInspections: inspections.slice(0, 5),
  };
}
