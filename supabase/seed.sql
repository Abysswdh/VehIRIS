-- VehIRIS Seed Data (matches src/lib/mock-data.ts)
-- Safe to re-run (uses ON CONFLICT DO NOTHING where applicable).

-- 1. Seed vehicles
insert into public.vehicles (model, plate) values
  ('Toyota Avanza', 'N 1234 AB'),
  ('Honda HR-V', 'L 1789 QX'),
  ('Toyota Fortuner', 'B 2210 KZA'),
  ('Mitsubishi Xpander', 'N 1550 BC'),
  ('Suzuki XL7', 'W 1932 NP'),
  ('Honda BR-V', 'N 1077 AD'),
  ('Daihatsu Xenia', 'AG 1408 RT'),
  ('Toyota Innova Zenix', 'B 1820 SJJ'),
  ('Hyundai Creta', 'L 1311 HC')
on conflict (plate) do nothing;

-- 2. Seed inspections
with rows(code, plate, inspected_at, type, status) as (
  values
    ('VH-2048', 'N 1234 AB',  '2026-10-26T10:42:00+07:00'::timestamptz, 'return', 'pending'),
    ('VH-2047', 'L 1789 QX',  '2026-10-26T09:18:00+07:00'::timestamptz, 'pre',    'completed'),
    ('VH-2046', 'B 2210 KZA', '2026-10-25T16:50:00+07:00'::timestamptz, 'return', 'completed'),
    ('VH-2045', 'N 1550 BC',  '2026-10-25T13:20:00+07:00'::timestamptz, 'return', 'pending'),
    ('VH-2044', 'W 1932 NP',  '2026-10-24T11:10:00+07:00'::timestamptz, 'pre',    'completed'),
    ('VH-2043', 'N 1077 AD',  '2026-10-24T08:35:00+07:00'::timestamptz, 'return', 'completed'),
    ('VH-2042', 'AG 1408 RT', '2026-10-22T15:05:00+07:00'::timestamptz, 'return', 'completed'),
    ('VH-2041', 'B 1820 SJJ', '2026-10-21T10:00:00+07:00'::timestamptz, 'pre',    'completed'),
    ('VH-2040', 'L 1311 HC',  '2026-10-19T14:45:00+07:00'::timestamptz, 'return', 'completed'),
    ('VH-2039', 'N 1234 AB',  '2026-09-30T09:12:00+07:00'::timestamptz, 'pre',    'completed'),
    ('VH-2038', 'N 1550 BC',  '2026-09-28T17:30:00+07:00'::timestamptz, 'return', 'pending'),
    ('VH-2037', 'L 1789 QX',  '2026-09-27T12:20:00+07:00'::timestamptz, 'return', 'completed')
)
insert into public.inspections (code, vehicle_id, inspected_at, type, status)
select r.code, v.id, r.inspected_at, r.type, r.status
from rows r
join public.vehicles v on v.plate = r.plate
on conflict (code) do nothing;

-- 3. Seed damage findings (only if table is currently empty)
insert into public.damage_findings (inspection_id, damage_type, confidence, review_status)
select i.id, f.damage_type, f.confidence, f.review_status
from (
  values
    ('VH-2048', 'scratch', 0.91::real, 'flagged'),
    ('VH-2048', 'dent',    0.84::real, 'flagged'),
    ('VH-2046', 'scratch', 0.94::real, 'confirmed'),
    ('VH-2045', 'scratch', 0.89::real, 'flagged'),
    ('VH-2045', 'scratch', 0.82::real, 'flagged'),
    ('VH-2045', 'dent',    0.79::real, 'flagged'),
    ('VH-2043', 'scratch', 0.92::real, 'confirmed'),
    ('VH-2040', 'scratch', 0.88::real, 'confirmed'),
    ('VH-2040', 'dent',    0.86::real, 'confirmed'),
    ('VH-2038', 'scratch', 0.81::real, 'flagged')
) as f(code, damage_type, confidence, review_status)
join public.inspections i on i.code = f.code
where not exists (select 1 from public.damage_findings);
