"use client";

import clsx from "clsx";
import { useI18n } from "@/lib/i18n";
import { locales } from "@/lib/i18n/dictionaries";

/** Segmented EN / ID switch. */
export function LanguageSwitcher({ tone = "light", className }: { tone?: "light" | "dark"; className?: string }) {
  const { locale, setLocale, t } = useI18n();
  return (
    <div
      role="radiogroup"
      aria-label={t.common.language}
      className={clsx(
        "inline-flex items-center rounded-full p-0.5 text-[11px] font-bold tracking-wide",
        tone === "light" ? "border border-line bg-white" : "border border-white/10 bg-white/5",
        className,
      )}
    >
      {locales.map((l) => {
        const active = l === locale;
        return (
          <button
            key={l}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => setLocale(l)}
            className={clsx(
              "rounded-full px-2.5 py-1 uppercase transition-all duration-200",
              active
                ? "bg-brand-600 text-white shadow-sm"
                : tone === "light"
                  ? "text-slate-500 hover:text-slate-800"
                  : "text-slate-400 hover:text-white",
            )}
          >
            {l}
          </button>
        );
      })}
    </div>
  );
}
