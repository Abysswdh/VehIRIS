"use client";

import Link from "next/link";
import { useState } from "react";
import clsx from "clsx";
import { ArrowRight, CarFront, FileText, Plus, ScanLine, TriangleAlert, ChevronDown } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatCard } from "@/components/ui/StatCard";
import { FindingsPill, useTypeLabel } from "@/components/ui/Badges";
import { useI18n } from "@/lib/i18n";
import { useInspections } from "@/lib/app-state";
import { activity, damageBreakdown, formatShortDate } from "@/lib/mock-data";
import { useClickOutside } from "@/lib/use-click-outside";

export function DashboardView() {
  const { t } = useI18n();

  return (
    <>
      <PageHeader
        title={t.dashboard.title}
        subtitle={t.dashboard.sub}
        action={
          <Link href="/inspections/new" id="new-inspection-cta" className="btn-primary h-12 px-6 self-start sm:self-auto">
            <Plus className="size-4" strokeWidth={2.5} />
            {t.nav.newInspection}
          </Link>
        }
      />

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 xl:gap-5">
        <StatCard icon={CarFront} label={t.dashboard.totalVehicles} value={128} hint={t.dashboard.totalVehiclesHint} hintTone="positive" delay={0} />
        <StatCard icon={ScanLine} label={t.dashboard.inspectionsToday} value={24} hint={t.dashboard.inspectionsTodayHint} delay={60} />
        <StatCard icon={TriangleAlert} iconTone="red" label={t.dashboard.damageDetected} value={17} hint={t.dashboard.damageDetectedHint} delay={120} />
        <StatCard icon={FileText} label={t.dashboard.reportsGenerated} value={96} hint={t.dashboard.reportsGeneratedHint} hintTone="positive" delay={180} />
      </section>

      <section className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <ActivityChart />
        <DamageBreakdown />
      </section>

      <RecentInspections />
    </>
  );
}

function ActivityChart() {
  const { t } = useI18n();
  const [period, setPeriod] = useState<"week" | "month">("week");
  const [menu, setMenu] = useState(false);
  const menuRef = useClickOutside<HTMLDivElement>(() => setMenu(false), menu);
  const data = activity[period];
  const max = Math.max(...data.map((d) => d.value));
  const scaleMax = Math.ceil((max * 1.1) / 10) * 10;
  const label = (key: string) =>
    period === "week" ? t.dashboard.days[key as keyof typeof t.dashboard.days] : t.dashboard.weeks[key as keyof typeof t.dashboard.weeks];

  return (
    <div className="card animate-slide-up p-5 sm:p-6" style={{ animationDelay: "120ms" }}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 sm:text-lg">{t.dashboard.activity}</h2>
          <p className="mt-1 text-xs text-slate-500">{t.dashboard.activitySub}</p>
        </div>
        <div ref={menuRef} className="relative">
          <button
            id="activity-period"
            type="button"
            onClick={() => setMenu((m) => !m)}
            aria-expanded={menu}
            className="flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-200"
          >
            {period === "week" ? t.dashboard.last7 : t.dashboard.last4w}
            <ChevronDown className={clsx("size-3.5 transition-transform", menu && "rotate-180")} />
          </button>
          {menu && (
            <div className="absolute right-0 z-10 mt-1.5 w-40 animate-slide-up rounded-xl border border-line bg-white p-1 shadow-lg shadow-slate-900/10">
              {(["week", "month"] as const).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => {
                    setPeriod(p);
                    setMenu(false);
                  }}
                  className={clsx(
                    "w-full rounded-lg px-3 py-2 text-left text-xs font-semibold transition",
                    p === period ? "bg-brand-50 text-brand-600" : "text-slate-600 hover:bg-slate-50",
                  )}
                >
                  {p === "week" ? t.dashboard.last7 : t.dashboard.last4w}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Chart */}
      <div className="relative mt-6 h-[230px]">
        {/* grid lines */}
        <div className="pointer-events-none absolute inset-x-0 top-0 bottom-7 flex flex-col justify-between">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-px bg-slate-100" />
          ))}
        </div>
        <div key={period} className="absolute inset-x-0 top-0 bottom-0 flex items-end justify-around gap-2 sm:gap-4">
          {data.map((d, i) => {
            const isMax = d.value === max;
            return (
              <div key={d.key} className="group flex h-full flex-1 flex-col items-center justify-end">
                <div className="relative flex w-full max-w-[52px] flex-1 items-end">
                  <div
                    className={clsx(
                      "relative w-full origin-bottom animate-grow-y rounded-lg transition-colors duration-200",
                      isMax ? "bg-brand-600 shadow-[0_8px_24px_-8px] shadow-brand-600/60" : "bg-brand-300 group-hover:bg-brand-400",
                    )}
                    style={{ height: `${(d.value / scaleMax) * 100}%`, animationDelay: `${150 + i * 60}ms` }}
                  >
                    <span className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 scale-90 rounded-lg bg-ink-900 px-2 py-1 text-[11px] font-semibold whitespace-nowrap text-white opacity-0 shadow-lg transition-all duration-200 group-hover:scale-100 group-hover:opacity-100">
                      {d.value} {t.dashboard.inspections}
                    </span>
                  </div>
                </div>
                <span className={clsx("mt-2.5 h-[18px] text-[11px] font-medium", isMax ? "text-slate-900" : "text-slate-500")}>{label(d.key)}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function DamageBreakdown() {
  const { t } = useI18n();
  const rows = [
    { label: t.dashboard.scratch, value: damageBreakdown.scratch, color: "bg-brand-600" },
    { label: t.dashboard.dent, value: damageBreakdown.dent, color: "bg-brand-300" },
  ];
  return (
    <div className="card flex animate-slide-up flex-col p-5 sm:p-6" style={{ animationDelay: "180ms" }}>
      <h2 className="text-base font-bold text-slate-900 sm:text-lg">{t.dashboard.breakdown}</h2>
      <p className="mt-1 text-xs text-slate-500">{t.dashboard.breakdownSub}</p>

      <div className="mt-8 flex h-2.5 w-full origin-left animate-grow-x gap-1 overflow-hidden" style={{ animationDelay: "300ms" }}>
        {rows.map((r) => (
          <div key={r.label} className={clsx("h-full rounded-full", r.color)} style={{ width: `${r.value}%` }} />
        ))}
      </div>

      <ul className="mt-7 space-y-5">
        {rows.map((r) => (
          <li key={r.label} className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-3 font-medium text-slate-700">
              <span className={clsx("size-2.5 rounded-[3px]", r.color)} />
              {r.label}
            </span>
            <span className="font-bold text-slate-900 tabular-nums">{r.value}%</span>
          </li>
        ))}
      </ul>

      <p className="mt-auto border-t border-line pt-4 text-[11px] text-slate-500 max-lg:mt-8">{t.dashboard.aiFlags}</p>
    </div>
  );
}

function RecentInspections() {
  const { t, locale } = useI18n();
  const inspections = useInspections();
  const typeLabel = useTypeLabel();
  const rows = inspections.slice(0, 5);

  return (
    <section className="card mt-5 animate-slide-up p-5 sm:p-6" style={{ animationDelay: "240ms" }}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 sm:text-lg">{t.dashboard.recent}</h2>
          <p className="mt-1 text-xs text-slate-500">{t.dashboard.recentSub}</p>
        </div>
        <Link href="/inspections" className="btn-outline px-5 shadow-sm">
          {t.common.viewAll}
        </Link>
      </div>

      <div className="scroll-thin -mx-5 mt-5 overflow-x-auto sm:-mx-6">
        <table className="w-full min-w-[640px] text-sm">
          <tbody className="divide-y divide-line border-t border-line">
            {rows.map((r) => (
              <tr key={r.id} className="transition-colors hover:bg-slate-50/70">
                <td className="py-3.5 pl-5 font-bold text-slate-900 sm:pl-6">{r.id}</td>
                <td className="py-3.5 text-slate-700">{r.vehicle}</td>
                <td className="py-3.5 text-slate-500">{formatShortDate(r.date, locale)}</td>
                <td className="py-3.5 text-slate-500">{typeLabel(r.type)}</td>
                <td className="py-3.5">
                  <FindingsPill count={r.findings} />
                </td>
                <td className="py-3.5 pr-5 text-right sm:pr-6">
                  <Link
                    href={`/inspections?q=${r.id}`}
                    className="group inline-flex items-center gap-1 text-xs font-bold text-brand-600 hover:text-brand-700"
                  >
                    {t.common.view}
                    <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
