"use client";

import clsx from "clsx";

interface ToggleProps {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  id?: string;
}

export function Toggle({ checked, onChange, label, id }: ToggleProps) {
  return (
    <button
      id={id}
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={clsx(
        "relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors duration-300 focus-visible:ring-4 focus-visible:ring-emerald-100 focus-visible:outline-none",
        checked ? "bg-emerald-600" : "bg-slate-300",
      )}
    >
      <span
        className={clsx(
          "inline-block size-5 rounded-full bg-white shadow-md transition-transform duration-300 ease-[cubic-bezier(.22,1,.36,1)]",
          checked ? "translate-x-6" : "translate-x-1",
        )}
      />
    </button>
  );
}
