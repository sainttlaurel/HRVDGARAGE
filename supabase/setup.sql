-- HRVD / Sacred Garage — Supabase setup
-- Run in Supabase Dashboard → SQL Editor
-- Then: Database → Replication → enable vehicles + parts for Realtime

-- ---------------------------------------------------------------------------
-- Tables (create if missing — adjust types to match your existing schema)
-- ---------------------------------------------------------------------------

create table if not exists public.vehicles (
  id text primary key,
  image text,
  images jsonb default '[]'::jsonb,
  brand text,
  model text,
  year integer,
  price text,
  location text,
  description text,
  specs jsonb default '{}'::jsonb,
  available boolean default true,
  "createdAt" timestamptz default now(),
  "updatedAt" timestamptz default now()
);

create table if not exists public.parts (
  id text primary key,
  image text,
  category text,
  name text,
  brand text,
  price text,
  condition text,
  description text,
  available boolean default true,
  "createdAt" timestamptz default now(),
  "updatedAt" timestamptz default now()
);

create table if not exists public.inquiries (
  id text primary key,
  "firstName" text,
  "lastName" text,
  email text,
  phone text,
  message text,
  status text default 'new',
  "createdAt" timestamptz default now(),
  "updatedAt" timestamptz default now()
);

create table if not exists public.part_orders (
  id text primary key,
  "partId" text,
  "partName" text,
  "partBrand" text,
  "partPrice" text,
  quantity integer,
  "customerName" text,
  "customerEmail" text,
  "customerPhone" text,
  "customerCar" text,
  address text,
  "paymentMethod" text,
  "deliveryOption" text,
  "facebookProfile" text,
  notes text,
  status text default 'new',
  "createdAt" timestamptz default now(),
  "updatedAt" timestamptz default now()
);

create table if not exists public.vehicle_inquiries (
  id text primary key,
  "vehicleId" text,
  "vehicleBrand" text,
  "vehicleModel" text,
  "vehicleYear" integer,
  "vehiclePrice" text,
  "customerName" text,
  "customerEmail" text,
  "customerPhone" text,
  "inquiryType" text,
  message text,
  "facebookProfile" text,
  status text default 'new',
  "createdAt" timestamptz default now(),
  "updatedAt" timestamptz default now()
);

create table if not exists public.business_settings (
  id text primary key,
  "businessName" text,
  email text,
  phone text,
  location text,
  "businessHours" text,
  "createdAt" timestamptz default now(),
  "updatedAt" timestamptz default now()
);

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------

alter table public.vehicles enable row level security;
alter table public.parts enable row level security;
alter table public.inquiries enable row level security;
alter table public.part_orders enable row level security;
alter table public.vehicle_inquiries enable row level security;
alter table public.business_settings enable row level security;

-- Public read: listings
create policy "Public read vehicles"
  on public.vehicles for select
  using (true);

create policy "Public read parts"
  on public.parts for select
  using (true);

create policy "Public read business settings"
  on public.business_settings for select
  using (true);

-- Public insert: forms
create policy "Public insert inquiries"
  on public.inquiries for insert
  with check (true);

create policy "Public insert part orders"
  on public.part_orders for insert
  with check (true);

create policy "Public insert vehicle inquiries"
  on public.vehicle_inquiries for insert
  with check (true);

-- Authenticated admin: full access
create policy "Admin all vehicles"
  on public.vehicles for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "Admin all parts"
  on public.parts for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "Admin all inquiries"
  on public.inquiries for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "Admin all part orders"
  on public.part_orders for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "Admin all vehicle inquiries"
  on public.vehicle_inquiries for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "Admin all business settings"
  on public.business_settings for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');
