<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="./public/brand/logo-mark-white.png" />
    <source media="(prefers-color-scheme: light)" srcset="./public/brand/logo-mark.png" />
    <img alt="VehIRIS" src="./public/brand/logo-mark.png" height="56" />
  </picture>
</p>

<p align="center">
  <strong>AI-Assisted Vehicle Inspection &amp; Damage Detection Workspace</strong>
</p>

---

## Overview

**VehIRIS** is a web application for rental vehicle operations to manage pre-rental and return inspections, upload multi-angle vehicle photos, track AI-flagged scratches and dents with human-in-the-loop (HITL) verification, and export inspection reports.

### Key Features

- **Operations Dashboard** — Live KPIs (fleet size, inspections today, detected damage, completed reports), 7-day / 4-week activity chart, scratch vs. dent breakdown, and recent inspections.
- **New Inspection & Photo Upload** — Select a fleet vehicle, record pre-rental or return details, drag-and-drop vehicle photos directly to private Supabase Storage, and trigger the analysis pipeline.
- **Inspection History & CSV Export** — Search by code/vehicle/plate, filter by month or status (`pending` / `completed`), and export filtered records to CSV.
- **Inspector Authentication & Profile** — Email/password auth via Supabase Auth, protected routes via Next.js 16 `proxy.ts`, persistent inspector profiles & notification preferences, and English / Indonesian (`EN` / `ID`) language switching.
- **Pluggable AI Service Hook** — Ready to connect an external vision model (hosted online or running locally) via a single `AI_SERVICE_URL` environment variable.

---

## Tech Stack

- **Framework:** Next.js 16 (App Router, Turbopack), React 19, TypeScript
- **Styling:** Tailwind CSS v4, Lucide Icons
- **Backend & Database:** Supabase (PostgreSQL, Row-Level Security, Auth, Private Storage)

---

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Supabase

1. Create a project in [Supabase](https://supabase.com/dashboard).
2. Open **SQL Editor → New query**, paste and run [`supabase/schema.sql`](./supabase/schema.sql).
3. *(Optional)* Run [`supabase/seed.sql`](./supabase/seed.sql) in SQL Editor to populate sample vehicles, inspections, and findings.
4. Go to **Authentication → Users → Add user** and create an inspector account (check **Auto Confirm User**).

### 3. Configure Environment Variables

Copy `.env.example` to `.env.local` and fill in your Supabase project credentials (found in **Project Settings → API**):

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_your_key_here

# Optional: external AI damage-detection service
# AI_SERVICE_URL=http://localhost:8000
```

### 4. Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and sign in with your Supabase inspector account.

---

## Connecting the AI Service (Optional)

When `AI_SERVICE_URL` is set, `POST /api/inspections/[id]/analyze` generates short-lived signed URLs for the inspection's uploaded photos and sends them to `POST ${AI_SERVICE_URL}/analyze`:

```json
{
  "inspectionId": "uuid",
  "photos": [{ "id": "uuid", "url": "https://..." }]
}
```

Expected response:

```json
{
  "detections": [
    {
      "photo_id": "uuid",
      "damage_type": "scratch",
      "confidence": 0.91,
      "bbox": { "x": 120, "y": 80, "w": 200, "h": 95 }
    }
  ]
}
```

Returned detections are automatically stored in `public.damage_findings` as `flagged` for inspector review. When `AI_SERVICE_URL` is unset, the route acts as a no-op stub so uploads and database persistence still work end-to-end.

---

## Deploying to Vercel

1. Push this repository to GitHub (`.env.local` is gitignored and will not be committed).
2. Import the repository at [vercel.com/new](https://vercel.com/new).
3. In **Project Settings → Environment Variables**, add:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
   - *(Optional, later)* `AI_SERVICE_URL`
4. Click **Deploy**.
