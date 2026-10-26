"use client";

import clsx from "clsx";
import type { LucideIcon } from "lucide-react";
import { CountUp } from "./CountUp";

interface StatCardProps {
  label: string;
  value: number;
  hint?: string;
  hintTone?: "positive" | "muted";
  icon?: LucideIcon;
  iconTone?: "slate" | "red";
  delay?: number;
  size?: "lg" | "md";
}

export function StatCard({ label, value, hint, hintTone = "muted", icon: Icon, iconTone = "slate", delay = 0, size = "lg" }: StatCardProps) {
  return (
    <div
      className="card group animate-slide-up p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-slate-900/[0.04]"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-center gap-3">
        {Icon && (
          <span
            className={clsx(
              "grid size-11 shrink-0 place-items-center rounded-xl transition-transform duration-300 group-hover:scale-105",
              iconTone === "red" ? "bg-brand-50 text-brand-600" : "bg-slate-100 text-slate-600",
            )}
          >
            <Icon className="size-5" strokeWidth={1.8} />
          </span>
        )}
        <p className="text-[13px] font-medium text-slate-500">{label}</p>
      </div>
      <p className={clsx("font-bold tracking-tight text-slate-900 tabular-nums", size === "lg" ? "mt-4 text-[32px] leading-none" : "mt-3 text-[28px] leading-none")}>
        <CountUp value={value} />
      </p>
      {hint && <p className={clsx("mt-3 text-xs font-medium", hintTone === "positive" ? "text-emerald-600" : "text-slate-500")}>{hint}</p>}
    </div>
  );
}
