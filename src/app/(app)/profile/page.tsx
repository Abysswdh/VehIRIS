import type { Metadata } from "next";
import { ProfileView } from "@/components/views/ProfileView";

export const metadata: Metadata = {
  title: "Profile Settings",
  description: "Manage inspector information, security, notifications and workspace preferences.",
};

export default function ProfilePage() {
  return <ProfileView />;
}
