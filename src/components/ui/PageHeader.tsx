"use client";

import type { ReactNode } from "react";

export function PageHeader({ title, subtitle, action }: { title: string; subtitle: string; action?: ReactNode }) {
  return (
    <div className="mb-7 flex animate-fade-in flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-[26px] leading-tight font-bold tracking-tight text-slate-900 sm:text-[30px]">{title}</h1>
        <p className="mt-1.5 text-sm text-slate-500">{subtitle}</p>
      </div>
      {action}
    </div>
  );
}
