-- Run this once in Supabase Dashboard -> SQL Editor.
-- Adds a resume_url column to profile, for the About page resume download.

alter table profile add column if not exists resume_url text;
