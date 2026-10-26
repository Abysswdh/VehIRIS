"use client";

import { useSyncExternalStore } from "react";
import { CheckCircle2, Info, TriangleAlert, X } from "lucide-react";
import clsx from "clsx";

type ToastKind = "success" | "info" | "error";
interface Toast {
  id: number;
  kind: ToastKind;
  message: string;
}

let toasts: Toast[] = [];
let counter = 0;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());
const empty: Toast[] = [];

function dismiss(id: number) {
  toasts = toasts.filter((t) => t.id !== id);
  emit();
}

export function toast(message: string, kind: ToastKind = "success") {
  const id = ++counter;
  toasts = [...toasts, { id, kind, message }];
  emit();
  window.setTimeout(() => dismiss(id), 3800);
}

const icons = {
  success: <CheckCircle2 className="size-5 text-emerald-500" />,
  info: <Info className="size-5 text-sky-500" />,
  error: <TriangleAlert className="size-5 text-brand-500" />,
};

export function Toaster() {
  const list = useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    () => toasts,
    () => empty,
  );

  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 bottom-4 z-[100] flex flex-col items-center gap-2 px-4 sm:inset-x-auto sm:right-6 sm:bottom-6 sm:items-end"
    >
      {list.map((t) => (
        <div
          key={t.id}
          role="status"
          className={clsx(
            "pointer-events-auto flex w-full max-w-sm animate-slide-up items-center gap-3 rounded-xl border bg-white px-4 py-3 text-sm font-medium text-slate-800 shadow-lg shadow-slate-900/10",
            t.kind === "error" ? "border-brand-100" : "border-line",
          )}
        >
          {icons[t.kind]}
          <span className="flex-1">{t.message}</span>
          <button
            type="button"
            onClick={() => dismiss(t.id)}
            className="rounded-md p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
            aria-label="Dismiss"
          >
            <X className="size-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
