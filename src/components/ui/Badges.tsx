"use client";

import clsx from "clsx";
import type { ReactNode } from "react";
import { fmt, useI18n } from "@/lib/i18n";
import type { InspectionStatus, InspectionType } from "@/lib/mock-data";

export function Pill({ tone, children, className }: { tone: "red" | "green" | "amber" | "slate"; children: ReactNode; className?: string }) {
  return (
    <span
      className={clsx(
        "inline-flex items-center justify-center rounded-full px-3 py-1 text-xs font-semibold whitespace-nowrap",
        {
          red: "bg-brand-50 text-brand-600",
          green: "bg-emerald-50 text-emerald-700",
          amber: "bg-amber-50 text-amber-700",
          slate: "bg-slate-100 text-slate-600",
        }[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

export function StatusPill({ status, className }: { status: InspectionStatus; className?: string }) {
  const { t } = useI18n();
  return status === "pending" ? (
    <Pill tone="amber" className={className}>{t.common.pending}</Pill>
  ) : (
    <Pill tone="green" className={className}>{t.common.completed}</Pill>
  );
}

export function useFindingsLabel() {
  const { t } = useI18n();
  return (n: number) => (n === 0 ? t.common.noDamage : n === 1 ? t.common.issue : fmt(t.common.issues, { n }));
}

/** Findings as a pill (dashboard) */
export function FindingsPill({ count }: { count: number }) {
  const label = useFindingsLabel();
  return <Pill tone={count > 0 ? "red" : "green"}>{label(count)}</Pill>;
}

/** Findings as colored text (history table) */
export function FindingsText({ count }: { count: number }) {
  const label = useFindingsLabel();
  return <span className={clsx("text-sm font-semibold", count > 0 ? "text-brand-600" : "text-emerald-600")}>{label(count)}</span>;
}

export function useTypeLabel() {
  const { t } = useI18n();
  return (type: InspectionType) => (type === "return" ? t.common.return : t.common.preRental);
}
