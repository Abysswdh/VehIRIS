-- VehIRIS PostgreSQL Schema (Supabase)
-- Option A: Single shared rental company (all authenticated inspectors share fleet & inspections)

-- 1. Sequence for human-readable inspection codes (VH-2049, VH-2050, ...)
-- Starts at 2049 so seeded records (VH-2037 .. VH-2048) never collide.
create sequence if not exists public.inspection_code_seq start with 2049;

-- 2. Profiles (1-to-1 with auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  display_name text not null default '',
  email text not null,
  role text not null default 'Vehicle Inspector',
  company text not null default 'VehIRIS Rental Operations',
  preferences jsonb not null default '{
  
    "emailNotifications": true,
    "notifyDamage": true,
    "notifyReview": true,
    "weeklySummary": false,
    "compactTables": false
  }'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 3. Vehicles (shared fleet catalog)
create table if not exists public.vehicles (
  id uuid primary key default gen_random_uuid(),
  model text not null,
  plate text not null unique,
  created_at timestamptz not null default now()
);

-- 4. Inspections
create table if not exists public.inspections (
  id uuid primary key default gen_random_uuid(),
  code text not null unique default ('VH-' || nextval('public.inspection_code_seq')),
  vehicle_id uuid not null references public.vehicles(id) on delete restrict,
  inspector_id uuid references public.profiles(id) on delete set null,
  inspected_at timestamptz not null default now(),
  type text not null check (type in ('pre', 'return')),
  status text not null default 'pending' check (status in ('pending', 'completed')),
  created_at timestamptz not null default now()
);

-- 5. Inspection Photos (files stored in Supabase Storage bucket 'inspection-photos')
create table if not exists public.inspection_photos (
  id uuid primary key default gen_random_uuid(),
  inspection_id uuid not null references public.inspections(id) on delete cascade,
  storage_path text not null,
  original_name text not null,
  uploaded_at timestamptz not null default now()
);

-- 6. Damage Findings (AI detections + Human-in-the-Loop review)
create table if not exists public.damage_findings (
  id uuid primary key default gen_random_uuid(),
  inspection_id uuid not null references public.inspections(id) on delete cascade,
  photo_id uuid references public.inspection_photos(id) on delete set null,
  damage_type text not null check (damage_type in ('scratch', 'dent', 'other')),
  confidence real check (confidence >= 0 and confidence <= 1),
  bbox jsonb,
  review_status text not null default 'flagged' check (review_status in ('flagged', 'confirmed', 'dismissed')),
  reviewed_by uuid references public.profiles(id) on delete set null,
  reviewed_at timestamptz,
  created_at timestamptz not null default now()
);

-- Indexes for dashboard & history queries
create index if not exists idx_inspections_inspected_at on public.inspections (inspected_at desc);
create index if not exists idx_inspections_status on public.inspections (status);
create index if not exists idx_inspections_vehicle_id on public.inspections (vehicle_id);
create index if not exists idx_inspection_photos_inspection_id on public.inspection_photos (inspection_id);
create index if not exists idx_damage_findings_inspection_id on public.damage_findings (inspection_id);

-- Auto-update updated_at on profiles
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_profiles_updated_at on public.profiles;
create trigger trg_profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- Auto-create profile row when a new user is created in Supabase Auth
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_full_name text;
begin
  v_full_name := coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1));
  insert into public.profiles (id, full_name, display_name, email)
  values (
    new.id,
    v_full_name,
    split_part(v_full_name, ' ', 1),
    new.email
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Row-Level Security (RLS)
alter table public.profiles enable row level security;
alter table public.vehicles enable row level security;
alter table public.inspections enable row level security;
alter table public.inspection_photos enable row level security;
alter table public.damage_findings enable row level security;

-- Profiles: any authenticated inspector can read; users can only update their own profile
drop policy if exists "profiles_select_authenticated" on public.profiles;
create policy "profiles_select_authenticated"
  on public.profiles for select to authenticated
  using (true);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
  on public.profiles for update to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Shared fleet & inspection tables: full access for authenticated inspectors
drop policy if exists "vehicles_all_authenticated" on public.vehicles;
create policy "vehicles_all_authenticated"
  on public.vehicles for all to authenticated
  using (true) with check (true);

drop policy if exists "inspections_all_authenticated" on public.inspections;
create policy "inspections_all_authenticated"
  on public.inspections for all to authenticated
  using (true) with check (true);

drop policy if exists "inspection_photos_all_authenticated" on public.inspection_photos;
create policy "inspection_photos_all_authenticated"
  on public.inspection_photos for all to authenticated
  using (true) with check (true);

drop policy if exists "damage_findings_all_authenticated" on public.damage_findings;
create policy "damage_findings_all_authenticated"
  on public.damage_findings for all to authenticated
  using (true) with check (true);

-- Storage: private bucket for inspection photos
insert into storage.buckets (id, name, public)
values ('inspection-photos', 'inspection-photos', false)
on conflict (id) do nothing;

drop policy if exists "inspection_photos_bucket_authenticated" on storage.objects;
create policy "inspection_photos_bucket_authenticated"
  on storage.objects for all to authenticated
  using (bucket_id = 'inspection-photos')
  with check (bucket_id = 'inspection-photos');
