-- Run this once in Supabase Dashboard -> SQL Editor.
-- Adds a single-row "profile" table for personal/bio text (previously hardcoded
-- in src/components/Info.tsx and src/pages/About.tsx).

create table if not exists profile (
  id int primary key,
  name text not null,
  tagline text not null,
  bio text not null,
  info_stage_2 text not null,
  info_stage_3 text not null,
  info_stage_4 text not null,
  updated_at timestamptz not null default now()
);

alter table profile enable row level security;

create policy "public read profile" on profile for select using (true);

create policy "authenticated write profile" on profile for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
