-- Run this once in Supabase Dashboard -> SQL Editor.

create table if not exists contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  created_at timestamptz not null default now()
);

alter table contact_messages enable row level security;

-- Anyone (including anonymous visitors) can submit the contact form.
create policy "public insert contact_messages" on contact_messages for insert
  with check (true);

-- Only the logged-in admin can read or delete submissions.
create policy "authenticated read contact_messages" on contact_messages for select
  using (auth.role() = 'authenticated');

create policy "authenticated delete contact_messages" on contact_messages for delete
  using (auth.role() = 'authenticated');
