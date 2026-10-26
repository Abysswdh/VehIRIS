"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import clsx from "clsx";
import { Clock3, LayoutGrid, LogOut, ScanLine, UserRound, X } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { useI18n } from "@/lib/i18n";
import { sessionStore } from "@/lib/app-state";

export const navItems = [
  { href: "/dashboard", key: "dashboard", icon: LayoutGrid },
  { href: "/inspections/new", key: "newInspection", icon: ScanLine },
  { href: "/inspections", key: "history", icon: Clock3 },
  { href: "/profile", key: "profile", icon: UserRound },
] as const;

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useI18n();

  const signOut = () => {
    sessionStore.set(null);
    router.push("/login");
  };

  return (
    <>
      {/* Mobile overlay */}
      <div
        aria-hidden
        onClick={onClose}
        className={clsx(
          "fixed inset-0 z-40 bg-ink-950/60 backdrop-blur-sm transition-opacity duration-300 lg:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      />

      <aside
        id="app-sidebar"
        className={clsx(
          "fixed inset-y-0 left-0 z-50 flex w-[264px] flex-col bg-ink-900 text-slate-300 transition-transform duration-300 ease-[cubic-bezier(.22,1,.36,1)] lg:translate-x-0",
          open ? "translate-x-0 shadow-2xl" : "-translate-x-full",
        )}
      >
        {/* Brand */}
        <div className="flex items-start justify-between px-6 pt-8 pb-6">
          <Link href="/dashboard" onClick={onClose} className="group block">
            <Logo tone="dark" className="h-[30px] transition-opacity group-hover:opacity-90" priority />
            <p className="mt-2 text-[11px] font-medium text-slate-400">{t.common.appTagline}</p>
          </Link>
          <button
            type="button"
            onClick={onClose}
            aria-label={t.common.closeMenu}
            className="-mr-2 rounded-lg p-2 text-slate-400 transition hover:bg-white/5 hover:text-white lg:hidden"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="mx-6 h-px bg-white/[0.08]" />

        {/* Navigation */}
        <nav className="scroll-thin flex-1 overflow-y-auto px-4 pt-6">
          <p className="px-3 pb-3 text-[10px] font-semibold tracking-[0.12em] text-slate-500 uppercase">{t.common.workspace}</p>
          <ul className="space-y-1.5">
            {navItems.map(({ href, key, icon: Icon }) => {
              const active = pathname === href;
              return (
                <li key={href}>
                  <Link
                    href={href}
                    onClick={onClose}
                    aria-current={active ? "page" : undefined}
                    className={clsx(
                      "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                      active
                        ? "bg-brand-500/[0.14] text-white"
                        : "text-slate-400 hover:bg-white/[0.04] hover:text-slate-100",
                    )}
                  >
                    <span
                      className={clsx(
                        "absolute top-1/2 -left-4 h-7 w-1 -translate-y-1/2 rounded-r-full bg-brand-500 transition-all duration-300",
                        active ? "opacity-100" : "scale-y-0 opacity-0",
                      )}
                    />
                    <Icon
                      className={clsx(
                        "size-[18px] shrink-0 transition-colors",
                        active ? "text-brand-400" : "text-slate-500 group-hover:text-slate-300",
                      )}
                      strokeWidth={1.8}
                    />
                    <span className={clsx(active && "font-semibold")}>{t.nav[key]}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Workspace + sign out */}
        <div className="px-6 pb-6">
          <div className="h-px bg-white/[0.08]" />
          <div className="py-5">
            <p className="text-[10px] font-semibold tracking-[0.12em] text-slate-500 uppercase">{t.common.vehirisWorkspace}</p>
            <p className="mt-1.5 text-[13px] font-medium text-slate-200">{t.common.rentalOperations}</p>
          </div>
          <div className="h-px bg-white/[0.08]" />
          <button
            type="button"
            onClick={signOut}
            className="group mt-4 -ml-3 flex w-[calc(100%+1.5rem)] items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-400 transition hover:bg-white/[0.04] hover:text-white"
          >
            <LogOut className="size-[18px] transition-transform group-hover:-translate-x-0.5" strokeWidth={1.8} />
            {t.common.signOut}
          </button>
        </div>
      </aside>
    </>
  );
}
