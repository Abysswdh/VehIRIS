import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

interface AiDetection {
  photo_id?: string | null;
  damage_type: "scratch" | "dent" | "other";
  confidence?: number;
  bbox?: Record<string, unknown>;
}

export async function POST(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id: inspectionId } = await context.params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const aiServiceUrl = process.env.AI_SERVICE_URL;
  if (!aiServiceUrl) {
    // AI model is not connected yet; inspection remains 'pending' with uploaded photos ready.
    return NextResponse.json({ mode: "stub", inspectionId, findingsCount: 0 });
  }

  const { data: photos, error: photosErr } = await supabase
    .from("inspection_photos")
    .select("id, storage_path")
    .eq("inspection_id", inspectionId);

  if (photosErr) {
    return NextResponse.json({ error: photosErr.message }, { status: 500 });
  }

  const signedPhotos = await Promise.all(
    (photos ?? []).map(async (p) => {
      const { data } = await supabase.storage
        .from("inspection-photos")
        .createSignedUrl(p.storage_path, 300);
      return { id: p.id, url: data?.signedUrl ?? null };
    }),
  );

  const res = await fetch(`${aiServiceUrl.replace(/\/$/, "")}/analyze`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      inspectionId,
      photos: signedPhotos.filter((p) => p.url),
    }),
  });

  if (!res.ok) {
    return NextResponse.json(
      { error: `AI service returned ${res.status}` },
      { status: 502 },
    );
  }

  const payload = (await res.json()) as { detections?: AiDetection[] };
  const detections = payload.detections ?? [];

  if (detections.length > 0) {
    const { error: insertErr } = await supabase.from("damage_findings").insert(
      detections.map((d) => ({
        inspection_id: inspectionId,
        photo_id: d.photo_id ?? null,
        damage_type: d.damage_type,
        confidence: d.confidence ?? null,
        bbox: d.bbox ?? null,
        review_status: "flagged",
      })),
    );
    if (insertErr) {
      return NextResponse.json({ error: insertErr.message }, { status: 500 });
    }
  }

  return NextResponse.json({
    mode: "ai",
    inspectionId,
    findingsCount: detections.length,
  });
}
