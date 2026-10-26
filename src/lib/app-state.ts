"use client";

import { createPersistentStore, useStore } from "@/lib/store";
import { seedInspections, type Inspection } from "@/lib/mock-data";

export interface UserProfile {
  fullName: string;
  displayName: string;
  email: string;
  role: string;
  company: string;
}

export interface Preferences {
  emailNotifications: boolean;
  notifyDamage: boolean;
  notifyReview: boolean;
  weeklySummary: boolean;
  compactTables: boolean;
}

export const defaultProfile: UserProfile = {
  fullName: "Stella Olivia Setiadi",
  displayName: "Stella",
  email: "stella.olivia@email.com",
  role: "Vehicle Inspector",
  company: "VehIRIS Rental Operations",
};

export const sessionStore = createPersistentStore<{ email: string } | null>("vehiris-session", null);
export const profileStore = createPersistentStore<UserProfile>("vehiris-profile", defaultProfile);
export const prefsStore = createPersistentStore<Preferences>("vehiris-prefs", {
  emailNotifications: true,
  notifyDamage: true,
  notifyReview: true,
  weeklySummary: false,
  compactTables: false,
});
export const inspectionsStore = createPersistentStore<Inspection[]>("vehiris-inspections", seedInspections);
export const unreadStore = createPersistentStore<boolean>("vehiris-unread", true);

export const useSession = () => useStore(sessionStore);
export const useProfile = () => useStore(profileStore);
export const usePrefs = () => useStore(prefsStore);
export const useInspections = () => useStore(inspectionsStore);
export const useUnread = () => useStore(unreadStore);

export function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  return ((parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "")).toUpperCase() || "?";
}

export function nextInspectionId(list: Inspection[]) {
  const max = list.reduce((m, i) => Math.max(m, Number(i.id.replace(/\D/g, "")) || 0), 0);
  return `VH-${max + 1}`;
}
