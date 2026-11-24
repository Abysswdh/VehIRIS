"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Preferences, UserProfile } from "@/lib/app-state";

export interface AuthenticatedProfile extends UserProfile {
  id: string;
  preferences: Preferences;
}

interface ProfileContextValue {
  profile: AuthenticatedProfile;
  saveProfile: (updates: Pick<UserProfile, "fullName" | "displayName" | "role" | "company">) => Promise<string | null>;
  savePreferences: (preferences: Preferences) => Promise<string | null>;
}

const ProfileContext = createContext<ProfileContextValue | null>(null);

export function ProfileProvider({
  initialProfile,
  children,
}: {
  initialProfile: AuthenticatedProfile;
  children: ReactNode;
}) {
  const [profile, setProfile] = useState<AuthenticatedProfile>(initialProfile);

  const saveProfile: ProfileContextValue["saveProfile"] = async (updates) => {
    const supabase = createClient();
    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: updates.fullName,
        display_name: updates.displayName,
        role: updates.role,
        company: updates.company,
      })
      .eq("id", profile.id);

    if (error) return error.message;
    setProfile((prev) => ({ ...prev, ...updates }));
    return null;
  };

  const savePreferences: ProfileContextValue["savePreferences"] = async (preferences) => {
    const prev = profile.preferences;
    setProfile((p) => ({ ...p, preferences }));

    const supabase = createClient();
    const { error } = await supabase
      .from("profiles")
      .update({ preferences })
      .eq("id", profile.id);

    if (error) {
      setProfile((p) => ({ ...p, preferences: prev }));
      return error.message;
    }
    return null;
  };

  return (
    <ProfileContext.Provider value={{ profile, saveProfile, savePreferences }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useUserProfile() {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error("useUserProfile must be used inside ProfileProvider");
  return ctx;
}
