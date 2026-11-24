import type { Metadata } from "next";
import { DashboardView } from "@/components/views/DashboardView";
import { getDashboardData } from "@/lib/supabase/queries";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Overview of vehicle inspection activity, detected damage and recent inspections.",
};

export default async function DashboardPage() {
  const data = await getDashboardData();
  return <DashboardView data={data} />;
}
