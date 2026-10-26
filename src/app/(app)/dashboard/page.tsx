import type { Metadata } from "next";
import { DashboardView } from "@/components/views/DashboardView";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Overview of vehicle inspection activity, detected damage and recent inspections.",
};

export default function DashboardPage() {
  return <DashboardView />;
}
