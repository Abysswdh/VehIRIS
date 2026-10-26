"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import clsx from "clsx";
import { Bell, ChevronDown, FileText, LogOut, Menu, Search, TriangleAlert, UserRound, Clock3 } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import { useI18n } from "@/lib/i18n";
import { initials, sessionStore, unreadStore, useProfile, useUnread } from "@/lib/app-state";
import { useClickOutside } from "@/lib/use-click-outside";

export function Header({ onMenu }: { onMenu: () => void }) {
  const { t } = useI18n();
  const router = useRouter();
  const profile = useProfile();
  const unread = useUnread();
  const [query, setQuery] = useState("");
  const [notifOpen, setNotifOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const notifRef = useClickOutside<HTMLDivElement>(() => setNotifOpen(false), notifOpen);
  const userRef = useClickOutside<HTMLDivElement>(() => setUserOpen(false), userOpen);

  const onSearch = (e: FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    router.push(q ? `/inspections?q=${encodeURIComponent(q)}` : "/inspections");
  };

  const notifications = [
    { icon: TriangleAlert, tone: "bg-brand-50 text-brand-600", text: t.notifications.n1, time: t.notifications.t1 },
    { icon: FileText, tone: "bg-emerald-50 text-emerald-600", text: t.notifications.n2, time: t.notifications.t2 },
    { icon: Clock3, tone: "bg-amber-50 text-amber-600", text: t.notifications.n3, time: t.notifications.t3 },
  ];

  return (
    <header className="sticky top-0 z-30 flex h-[72px] items-center gap-3 border-b border-line bg-white/85 px-4 backdrop-blur-xl sm:px-6 lg:px-8">
      {/* Mobile: menu + logo */}
      <button
        type="button"
        onClick={onMenu}
        aria-label={t.common.openMenu}
        aria-controls="app-sidebar"
        className="-ml-1 rounded-xl p-2 text-slate-600 transition hover:bg-slate-100 lg:hidden"
      >
        <Menu className="size-5" />
      </button>
      <Link href="/dashboard" className="mr-auto shrink-0 sm:hidden">
        <Logo tone="light" className="h-6" />
      </Link>

      {/* Search */}
      <form onSubmit={onSearch} role="search" className="relative hidden w-full max-w-[290px] sm:block">
        <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-slate-400" />
        <input
          id="global-search"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t.common.search}
          className="h-11 w-full rounded-xl border border-transparent bg-canvas pr-4 pl-10 text-sm text-slate-700 placeholder:text-slate-400 transition outline-none hover:border-line focus:border-brand-300 focus:bg-white focus:ring-4 focus:ring-brand-100"
        />
      </form>

      <div className="ml-auto flex items-center gap-2 sm:gap-3">
        <LanguageSwitcher className="hidden sm:inline-flex" />

        {/* Notifications */}
        <div ref={notifRef} className="relative">
          <button
            id="notifications-button"
            type="button"
            onClick={() => {
              setNotifOpen((o) => !o);
              setUserOpen(false);
            }}
            aria-label={t.common.notifications}
            aria-expanded={notifOpen}
            className="relative rounded-xl p-2.5 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
          >
            <Bell className="size-5" strokeWidth={1.8} />
            {unread && (
              <span className="absolute top-2 right-2 flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-brand-500 opacity-60" />
                <span className="relative inline-flex size-2 rounded-full bg-brand-500 ring-2 ring-white" />
              </span>
            )}
          </button>
          {notifOpen && (
            <div className="absolute right-0 mt-2 w-[min(22rem,calc(100vw-2rem))] origin-top-right animate-slide-up overflow-hidden rounded-2xl border border-line bg-white shadow-xl shadow-slate-900/10">
              <div className="flex items-center justify-between border-b border-line px-4 py-3">
                <p className="text-sm font-semibold text-slate-900">{t.common.notifications}</p>
                {unread && (
                  <button type="button" onClick={() => unreadStore.set(false)} className="text-xs font-semibold text-brand-600 hover:text-brand-700">
                    {t.common.markAllRead}
                  </button>
                )}
              </div>
              <ul className="divide-y divide-line">
                {notifications.map((n, i) => (
                  <li key={i}>
                    <Link
                      href="/inspections"
                      onClick={() => setNotifOpen(false)}
                      className="flex gap-3 px-4 py-3 transition hover:bg-slate-50"
                    >
                      <span className={clsx("grid size-9 shrink-0 place-items-center rounded-xl", n.tone)}>
                        <n.icon className="size-4" />
                      </span>
                      <span className="min-w-0">
                        <span className={clsx("block text-[13px] leading-snug", unread ? "font-semibold text-slate-800" : "text-slate-600")}>{n.text}</span>
                        <span className="mt-0.5 block text-xs text-slate-400">{n.time}</span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* User */}
        <div ref={userRef} className="relative">
          <button
            id="user-menu-button"
            type="button"
            onClick={() => {
              setUserOpen((o) => !o);
              setNotifOpen(false);
            }}
            aria-expanded={userOpen}
            className="flex items-center gap-2.5 rounded-xl p-1 pr-1.5 transition hover:bg-slate-100"
          >
            <span className="grid size-10 place-items-center rounded-full bg-brand-50 text-sm font-bold text-brand-600 ring-1 ring-brand-100">
              {initials(profile.fullName)}
            </span>
            <span className="hidden text-left md:block">
              <span className="block text-sm leading-tight font-semibold text-slate-900">{profile.displayName}</span>
              <span className="block text-[11px] text-slate-400">{t.common.inspector}</span>
            </span>
            <ChevronDown className={clsx("hidden size-4 text-slate-400 transition-transform md:block", userOpen && "rotate-180")} />
          </button>
          {userOpen && (
            <div className="absolute right-0 mt-2 w-56 origin-top-right animate-slide-up overflow-hidden rounded-2xl border border-line bg-white p-1.5 shadow-xl shadow-slate-900/10">
              <div className="px-3 py-2.5">
                <p className="truncate text-sm font-semibold text-slate-900">{profile.fullName}</p>
                <p className="truncate text-xs text-slate-400">{profile.email}</p>
              </div>
              <div className="my-1 h-px bg-line" />
              <div className="px-3 py-2 sm:hidden">
                <LanguageSwitcher />
              </div>
              <Link
                href="/profile"
                onClick={() => setUserOpen(false)}
                className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-50"
              >
                <UserRound className="size-4 text-slate-400" /> {t.common.profile}
              </Link>
              <button
                type="button"
                onClick={() => {
                  sessionStore.set(null);
                  router.push("/login");
                }}
                className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm text-brand-600 transition hover:bg-brand-50"
              >
                <LogOut className="size-4" /> {t.common.signOut}
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
