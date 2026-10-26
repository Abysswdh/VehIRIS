"use client";

import { useState, type FormEvent } from "react";
import clsx from "clsx";
import { Bell, Check, LayoutGrid, Lock, ShieldCheck, UserRound } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Toggle } from "@/components/ui/Toggle";
import { toast } from "@/components/ui/Toaster";
import { useI18n } from "@/lib/i18n";
import { initials, prefsStore, profileStore, usePrefs, useProfile } from "@/lib/app-state";

export function ProfileView() {
  const { t } = useI18n();
  const profile = useProfile();
  const prefs = usePrefs();
  const [tab, setTab] = useState("personal");

  const tabs = [
    { key: "personal", label: t.profile.tabPersonal, icon: UserRound },
    { key: "security", label: t.profile.tabSecurity, icon: Lock },
    { key: "notifications", label: t.profile.tabNotifications, icon: Bell },
    { key: "preferences", label: t.profile.tabPreferences, icon: LayoutGrid },
  ];

  const onSave = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const fullName = String(f.get("fullName") || profile.fullName);
    profileStore.set({
      ...profile,
      fullName,
      displayName: fullName.split(" ")[0],
      email: String(f.get("email") || profile.email),
      role: String(f.get("role") || profile.role),
      company: String(f.get("company") || profile.company),
    });
    toast(t.common.saved);
  };

  return (
    <>
      <PageHeader title={t.profile.title} subtitle={t.profile.sub} />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[300px_minmax(0,1fr)]">
        {/* Profile card */}
        <aside className="card h-fit animate-slide-up p-6">
          <div className="flex flex-col items-center text-center">
            <span className="grid size-24 place-items-center rounded-full bg-brand-50 text-3xl font-bold text-brand-600 ring-8 ring-brand-50/50">
              {initials(profile.fullName)}
            </span>
            <p className="mt-4 text-lg font-bold text-slate-900">{profile.fullName.split(" ").slice(0, 2).join(" ")}</p>
            <p className="text-xs text-slate-500">{t.common.vehicleInspector}</p>
          </div>
          <div className="my-5 h-px bg-line" />
          <nav className="space-y-1">
            {tabs.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                type="button"
                onClick={() => setTab(key)}
                className={clsx(
                  "flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm transition",
                  tab === key ? "bg-brand-50 font-semibold text-brand-600" : "text-slate-500 hover:bg-slate-50 hover:text-slate-800",
                )}
              >
                <Icon className="size-4" /> {label}
              </button>
            ))}
          </nav>
          <div className="my-5 h-px bg-line" />
          <div className="flex items-start gap-3 px-1">
            <ShieldCheck className="mt-0.5 size-5 text-emerald-600" />
            <div>
              <p className="text-xs text-slate-500">{t.profile.accountStatus}</p>
              <span className="mt-1.5 inline-block rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">{t.profile.verified}</span>
            </div>
          </div>
        </aside>

        <div className="flex flex-col gap-5">
          {/* Personal information */}
          <form key={profile.email + profile.fullName} onSubmit={onSave} className="card animate-slide-up p-5 sm:p-6" style={{ animationDelay: "60ms" }}>
            <h2 className="text-lg font-bold text-slate-900">{t.profile.personal}</h2>
            <p className="mt-1 text-xs text-slate-500">{t.profile.personalSub}</p>
            <div className="my-5 h-px bg-line" />
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              {[
                { name: "fullName", label: t.profile.fullName, value: profile.fullName },
                { name: "email", label: t.profile.email, value: profile.email, type: "email" },
                { name: "role", label: t.profile.role, value: profile.role },
                { name: "company", label: t.profile.company, value: profile.company },
              ].map((f) => (
                <div key={f.name}>
                  <label htmlFor={`profile-${f.name}`} className="field-label">{f.label}</label>
                  <input id={`profile-${f.name}`} name={f.name} type={f.type ?? "text"} defaultValue={f.value} className="field" />
                </div>
              ))}
            </div>
            <div className="mt-7 flex justify-end">
              <button id="save-profile" type="submit" className="btn-primary h-11 px-6">
                <Check className="size-4" strokeWidth={2.5} /> {t.common.saveChanges}
              </button>
            </div>
          </form>

          {/* Workspace preferences */}
          <section className="card animate-slide-up p-5 sm:p-6" style={{ animationDelay: "120ms" }}>
            <h2 className="text-lg font-bold text-slate-900">{t.profile.workspacePrefs}</h2>
            <p className="mt-1 text-xs text-slate-500">{t.profile.workspacePrefsSub}</p>
            <div className="my-5 h-px bg-line" />
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-slate-900">{t.profile.emailNotif}</p>
                <p className="mt-0.5 text-xs text-slate-500">{t.profile.emailNotifSub}</p>
              </div>
              <Toggle
                id="email-notifications"
                label={t.profile.emailNotif}
                checked={prefs.emailNotifications}
                onChange={(v) => prefsStore.set({ ...prefs, emailNotifications: v })}
              />
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
