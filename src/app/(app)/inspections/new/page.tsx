import type { Metadata } from "next";
import { NewInspectionView } from "@/components/views/NewInspectionView";

export const metadata: Metadata = {
  title: "New Inspection",
  description: "Upload vehicle photos to start an AI-assisted scratch and dent inspection.",
};

export default function NewInspectionPage() {
  return <NewInspectionView />;
}
