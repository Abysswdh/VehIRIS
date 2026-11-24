import type { Metadata } from "next";
import { NewInspectionView } from "@/components/views/NewInspectionView";
import { getVehicles } from "@/lib/supabase/queries";

export const metadata: Metadata = {
  title: "New Inspection",
  description: "Upload vehicle photos to start an AI-assisted scratch and dent inspection.",
};

export default async function NewInspectionPage() {
  const vehicles = await getVehicles();
  return <NewInspectionView vehicles={vehicles} />;
}
