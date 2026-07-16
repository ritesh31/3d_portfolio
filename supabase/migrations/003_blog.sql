-- Run this once in Supabase Dashboard -> SQL Editor.

create table if not exists blog_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  excerpt text not null,
  icon_url text,
  link text not null,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

alter table blog_posts enable row level security;

create policy "public read blog_posts" on blog_posts for select using (true);

create policy "authenticated write blog_posts" on blog_posts for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
