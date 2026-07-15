-- Run this once in Supabase Dashboard -> SQL Editor.

create table if not exists skills (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  type text not null,
  icon_url text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists experiences (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  company_name text not null,
  icon_url text,
  icon_bg text,
  date text not null,
  points text[] not null default '{}',
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists social_links (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  icon_url text,
  link text not null,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text not null,
  icon_url text,
  theme text,
  link text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

alter table skills enable row level security;
alter table experiences enable row level security;
alter table social_links enable row level security;
alter table projects enable row level security;

create policy "public read skills" on skills for select using (true);
create policy "public read experiences" on experiences for select using (true);
create policy "public read social_links" on social_links for select using (true);
create policy "public read projects" on projects for select using (true);

create policy "authenticated write skills" on skills for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "authenticated write experiences" on experiences for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "authenticated write social_links" on social_links for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "authenticated write projects" on projects for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- Storage bucket for icons (public read). Create via Dashboard -> Storage -> New bucket
-- named "icons", marked Public. Then run the policy below in SQL editor.
insert into storage.buckets (id, name, public)
values ('icons', 'icons', true)
on conflict (id) do nothing;

create policy "public read icons bucket" on storage.objects for select
  using (bucket_id = 'icons');

create policy "authenticated upload icons bucket" on storage.objects for insert
  with check (bucket_id = 'icons' and auth.role() = 'authenticated');

create policy "authenticated update icons bucket" on storage.objects for update
  using (bucket_id = 'icons' and auth.role() = 'authenticated');

create policy "authenticated delete icons bucket" on storage.objects for delete
  using (bucket_id = 'icons' and auth.role() = 'authenticated');
