import type { Metadata } from "next";
import { Suspense } from "react";
import { HistoryView } from "@/components/views/HistoryView";

export const metadata: Metadata = {
  title: "Inspection History",
  description: "Browse previous vehicle inspections, statuses, findings and export reports to CSV.",
};

export default function HistoryPage() {
  return (
    // HistoryView reads `?q=` via useSearchParams, which needs a Suspense boundary.
    <Suspense>
      <HistoryView />
    </Suspense>
  );
}
