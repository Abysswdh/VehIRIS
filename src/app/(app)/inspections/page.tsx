import type { Metadata } from "next";
import { Suspense } from "react";
import { HistoryView } from "@/components/views/HistoryView";
import { getHistoryData } from "@/lib/supabase/queries";

export const metadata: Metadata = {
  title: "Inspection History",
  description: "Browse previous vehicle inspections, statuses, findings and export reports to CSV.",
};

export default async function HistoryPage() {
  const data = await getHistoryData();
  return (
    // HistoryView reads `?q=` via useSearchParams, which needs a Suspense boundary.
    <Suspense>
      <HistoryView inspections={data.inspections} totals={data.totals} />
    </Suspense>
  );
}
