import type { Locale } from "@/lib/i18n/dictionaries";

export type InspectionType = "return" | "pre";
export type InspectionStatus = "pending" | "completed";

export interface Inspection {
  id: string;
  vehicle: string;
  plate: string;
  /** Local ISO datetime, e.g. 2026-10-26T10:42 */
  date: string;
  type: InspectionType;
  findings: number;
  status: InspectionStatus;
}

export interface Vehicle {
  model: string;
  plate: string;
}

export const vehicles: Vehicle[] = [
  { model: "Toyota Avanza", plate: "N 1234 AB" },
  { model: "Honda HR-V", plate: "L 1789 QX" },
  { model: "Toyota Fortuner", plate: "B 2210 KZA" },
  { model: "Mitsubishi Xpander", plate: "N 1550 BC" },
  { model: "Suzuki XL7", plate: "W 1932 NP" },
  { model: "Honda BR-V", plate: "N 1077 AD" },
  { model: "Daihatsu Xenia", plate: "AG 1408 RT" },
  { model: "Toyota Innova Zenix", plate: "B 1820 SJJ" },
  { model: "Hyundai Creta", plate: "L 1311 HC" },
];

export const seedInspections: Inspection[] = [
  { id: "VH-2048", vehicle: "Toyota Avanza", plate: "N 1234 AB", date: "2026-10-26T10:42", type: "return", findings: 2, status: "pending" },
  { id: "VH-2047", vehicle: "Honda HR-V", plate: "L 1789 QX", date: "2026-10-26T09:18", type: "pre", findings: 0, status: "completed" },
  { id: "VH-2046", vehicle: "Toyota Fortuner", plate: "B 2210 KZA", date: "2026-10-25T16:50", type: "return", findings: 1, status: "completed" },
  { id: "VH-2045", vehicle: "Mitsubishi Xpander", plate: "N 1550 BC", date: "2026-10-25T13:20", type: "return", findings: 3, status: "pending" },
  { id: "VH-2044", vehicle: "Suzuki XL7", plate: "W 1932 NP", date: "2026-10-24T11:10", type: "pre", findings: 0, status: "completed" },
  { id: "VH-2043", vehicle: "Honda BR-V", plate: "N 1077 AD", date: "2026-10-24T08:35", type: "return", findings: 1, status: "completed" },
  { id: "VH-2042", vehicle: "Daihatsu Xenia", plate: "AG 1408 RT", date: "2026-10-22T15:05", type: "return", findings: 0, status: "completed" },
  { id: "VH-2041", vehicle: "Toyota Innova Zenix", plate: "B 1820 SJJ", date: "2026-10-21T10:00", type: "pre", findings: 0, status: "completed" },
  { id: "VH-2040", vehicle: "Hyundai Creta", plate: "L 1311 HC", date: "2026-10-19T14:45", type: "return", findings: 2, status: "completed" },
  { id: "VH-2039", vehicle: "Toyota Avanza", plate: "N 1234 AB", date: "2026-09-30T09:12", type: "pre", findings: 0, status: "completed" },
  { id: "VH-2038", vehicle: "Mitsubishi Xpander", plate: "N 1550 BC", date: "2026-09-28T17:30", type: "return", findings: 1, status: "pending" },
  { id: "VH-2037", vehicle: "Honda HR-V", plate: "L 1789 QX", date: "2026-09-27T12:20", type: "return", findings: 0, status: "completed" },
];

/** Workspace-level totals shown on the KPI cards (beyond the visible page of records). */
export const historyTotals = { total: 324, completed: 287, pending: 21, damage: 76 };

export const activity = {
  week: [
    { key: "mon", value: 14 },
    { key: "tue", value: 19 },
    { key: "wed", value: 16 },
    { key: "thu", value: 23 },
    { key: "fri", value: 21 },
    { key: "sat", value: 28 },
    { key: "sun", value: 24 },
  ],
  month: [
    { key: "w1", value: 118 },
    { key: "w2", value: 134 },
    { key: "w3", value: 127 },
    { key: "w4", value: 145 },
  ],
} as const;

export const damageBreakdown = { scratch: 72, dent: 28 };

const months: Record<Locale, string[]> = {
  en: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  id: ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"],
};

/** "2026-10-26T10:42" -> "26 Oct, 10:42" (timezone-agnostic, no Date parsing). */
export function formatShortDate(iso: string, locale: Locale) {
  const [d, time = ""] = iso.split("T");
  const [, m, day] = d.split("-");
  return `${Number(day)} ${months[locale][Number(m) - 1]}, ${time.slice(0, 5)}`;
}

/** "2026-10" -> "Oct 2026" */
export function formatMonth(ym: string, locale: Locale) {
  const [y, m] = ym.split("-");
  return `${months[locale][Number(m) - 1]} ${y}`;
}
