import { redirect } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { ProfileProvider, type AuthenticatedProfile } from "@/components/providers/ProfileProvider";
import { createClient } from "@/lib/supabase/server";
import type { Preferences } from "@/lib/app-state";

const defaultPreferences: Preferences = {
  emailNotifications: true,
  notifyDamage: true,
  notifyReview: true,
  weeklySummary: false,
  compactTables: false,
};

export const instant = false;

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: row } = await supabase
    .from("profiles")
    .select("id, full_name, display_name, email, role, company, preferences")
    .eq("id", user.id)
    .single();

  const fallbackName = (user.email ?? "Inspector").split("@")[0];
  const initialProfile: AuthenticatedProfile = {
    id: user.id,
    fullName: row?.full_name || fallbackName,
    displayName: row?.display_name || fallbackName,
    email: row?.email || user.email || "",
    role: row?.role || "Vehicle Inspector",
    company: row?.company || "VehIRIS Rental Operations",
    preferences: {
      ...defaultPreferences,
      ...((row?.preferences as Partial<Preferences> | null) ?? {}),
    },
  };

  return (
    <ProfileProvider initialProfile={initialProfile}>
      <AppShell>{children}</AppShell>
    </ProfileProvider>
  );
}
