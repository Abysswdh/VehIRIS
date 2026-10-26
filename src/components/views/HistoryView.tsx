"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import clsx from "clsx";
import { CalendarDays, ChevronDown, Download, Filter, Search } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatCard } from "@/components/ui/StatCard";
import { FindingsText, StatusPill, useTypeLabel } from "@/components/ui/Badges";
import { toast } from "@/components/ui/Toaster";
import { fmt, useI18n } from "@/lib/i18n";
import { useInspections } from "@/lib/app-state";
import { formatMonth, formatShortDate, historyTotals } from "@/lib/mock-data";

export function HistoryView() {
  const q = useSearchParams().get("q") ?? "";
  // Re-mount when the header search changes so the filter picks up the new query.
  return <HistoryContent key={q} initialQuery={q} />;
}

function HistoryContent({ initialQuery }: { initialQuery: string }) {
  const { t, locale } = useI18n();
  const inspections = useInspections();
  const typeLabel = useTypeLabel();
  const [query, setQuery] = useState(initialQuery);
  const [month, setMonth] = useState("2026-10");
  const [status, setStatus] = useState("all");

  const monthOptions = useMemo(() => Array.from(new Set(inspections.map((i) => i.date.slice(0, 7)))).sort().reverse(), [inspections]);

  const rows = inspections.filter((i) => {
    const s = query.trim().toLowerCase();
    const matchQ = !s || [i.id, i.vehicle, i.plate].some((v) => v.toLowerCase().includes(s));
    const matchM = month === "all" || i.date.startsWith(month);
    const matchS = status === "all" || i.status === status;
    return matchQ && matchM && matchS;
  });

  const exportCsv = () => {
    const header = ["Inspection ID", "Vehicle", "Plate", "Date", "Type", "Findings", "Status"];
    const lines = rows.map((r) => [r.id, r.vehicle, r.plate, r.date.replace("T", " "), r.type, r.findings, r.status].join(","));
    const blob = new Blob([[header.join(","), ...lines].join("\n")], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "vehiris-inspections.csv";
    a.click();
    URL.revokeObjectURL(a.href);
    toast(t.history.exported);
  };

  const selectCls = "field appearance-none pr-10 pl-10";

  return (
    <>
      <PageHeader title={t.history.title} subtitle={t.history.sub} />

      <section className="grid grid-cols-2 gap-4 xl:grid-cols-4 xl:gap-5">
        <StatCard size="md" label={t.history.total} value={historyTotals.total} />
        <StatCard size="md" label={t.history.completed} value={historyTotals.completed} delay={60} />
        <StatCard size="md" label={t.history.pending} value={historyTotals.pending} delay={120} />
        <StatCard size="md" label={t.history.damage} value={historyTotals.damage} delay={180} />
      </section>

      {/* Filters */}
      <section className="card mt-5 grid animate-slide-up grid-cols-1 gap-3 p-4 sm:grid-cols-2 lg:grid-cols-[minmax(0,1.6fr)_1fr_1fr_auto]">
        <div className="relative">
          <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-slate-400" />
          <input
            id="history-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.history.searchPh}
            className="field border-transparent bg-canvas pl-10"
          />
        </div>
        <div className="relative">
          <CalendarDays className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-slate-500" />
          <select id="history-month" value={month} onChange={(e) => setMonth(e.target.value)} className={selectCls}>
            <option value="all">{t.history.allMonths}</option>
            {monthOptions.map((m) => (
              <option key={m} value={m}>{formatMonth(m, locale)}</option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute top-1/2 right-3.5 size-4 -translate-y-1/2 text-slate-400" />
        </div>
        <div className="relative">
          <Filter className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-slate-500" />
          <select id="history-status" value={status} onChange={(e) => setStatus(e.target.value)} className={selectCls}>
            <option value="all">{t.history.allStatuses}</option>
            <option value="pending">{t.common.pending}</option>
            <option value="completed">{t.common.completed}</option>
          </select>
          <ChevronDown className="pointer-events-none absolute top-1/2 right-3.5 size-4 -translate-y-1/2 text-slate-400" />
        </div>
        <button id="export-csv" type="button" onClick={exportCsv} className="btn-outline h-[46px] px-5">
          <Download className="size-4" /> {t.history.export}
        </button>
      </section>

      {/* Table */}
      <section className="card mt-5 animate-slide-up p-5 sm:p-6" style={{ animationDelay: "80ms" }}>
        <h2 className="text-lg font-bold text-slate-900">{t.history.all}</h2>
        <p className="mt-1 text-xs text-slate-500">{fmt(t.history.showing, { n: rows.length, total: historyTotals.total })}</p>

        <div className="scroll-thin mt-5 overflow-x-auto">
          <table className="w-full min-w-[760px] text-sm">
            <thead>
              <tr className="bg-slate-50 text-left text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
                <th className="rounded-l-xl px-4 py-3">{t.history.colId}</th>
                <th className="px-4 py-3">{t.history.colVehicle}</th>
                <th className="px-4 py-3">{t.history.colDate}</th>
                <th className="px-4 py-3">{t.history.colType}</th>
                <th className="px-4 py-3">{t.history.colFindings}</th>
                <th className="px-4 py-3">{t.history.colStatus}</th>
                <th className="rounded-r-xl px-4 py-3"><span className="sr-only">Action</span></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {rows.map((r) => (
                <tr key={r.id} className="transition-colors hover:bg-slate-50/70">
                  <td className="px-4 py-3 font-bold text-slate-900">{r.id}</td>
                  <td className="px-4 py-3 text-slate-700">{r.vehicle}</td>
                  <td className="px-4 py-3 text-slate-500">{formatShortDate(r.date, locale)}</td>
                  <td className="px-4 py-3 text-slate-500">{typeLabel(r.type)}</td>
                  <td className="px-4 py-3"><FindingsText count={r.findings} /></td>
                  <td className="px-4 py-3"><StatusPill status={r.status} className="min-w-[84px]" /></td>
                  <td className="px-4 py-3 text-right">
                    <Link href={`/inspections?q=${r.id}`} className="btn-outline px-4 py-1.5">{t.common.view}</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {rows.length === 0 && (
            <div className="py-12 text-center">
              <p className="text-sm text-slate-500">{t.history.empty}</p>
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setMonth("all");
                  setStatus("all");
                }}
                className={clsx("mt-3 text-sm font-semibold text-brand-600 hover:text-brand-700")}
              >
                {t.history.reset}
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
