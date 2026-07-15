# Supabase Integration — How It Works

This doc explains how content (skills, experience, social links, projects) flows between the
admin panel, Supabase, and the public site.

## 1. High-level flow

```
                     ┌─────────────────────────┐
                     │   Supabase Project       │
                     │                          │
                     │  Postgres                │
                     │  ├─ skills               │
                     │  ├─ experiences          │
                     │  ├─ social_links         │
                     │  └─ projects             │
                     │                          │
                     │  Storage                 │
                     │  └─ icons/ (public read) │
                     │                          │
                     │  Auth                    │
                     │  └─ 1 admin user         │
                     └───────────┬──────────────┘
                                 │
              ┌──────────────────┴───────────────────┐
              │ anon key (public, read-only via RLS)  │ signed-in session
              │                                       │ (read + write via RLS)
              ▼                                       ▼
   ┌─────────────────────┐               ┌──────────────────────────┐
   │ Public pages         │               │ /admin panel              │
   │ Home / About /       │               │ (this app, same bundle,   │
   │ Projects             │               │  lazy-loaded route)       │
   │                       │               │                          │
   │ useTable() hook       │               │ EntityAdmin component    │
   │ SELECT ... ORDER BY   │               │ INSERT / UPDATE / DELETE │
   │ sort_order            │               │ + drag-reorder + upload  │
   └───────────────────────┘               └──────────────────────────┘
```

Two credentials are involved, with very different trust levels:

| Key | Where it lives | What it can do | Exposed to browser? |
|---|---|---|---|
| **anon key** | `.env.local` → `VITE_SUPABASE_ANON_KEY`, bundled into the client JS | Whatever Row Level Security (RLS) policies allow — public read on all 4 tables, write only if the request carries a signed-in session | Yes, by design (it's meant to be public) |
| **service_role key** | Never stored in the repo. Passed inline on the command line only when running the one-time migration script | Bypasses RLS entirely — full read/write on everything | Never. If this leaks, anyone can wipe or rewrite your data |

## 2. Public pages: reading data

`src/pages/About.tsx` and `src/pages/Projects.tsx` no longer import hardcoded arrays. Instead
they call the shared hook:

```ts
// src/hooks/useTable.ts
const { data: skills } = useTable<SkillRow>("skills");
```

`useTable(table)` (in `src/hooks/useTable.ts`) does, on mount:

```ts
supabase.from(table).select("*").order("sort_order")
```

This works for anonymous (logged-out) visitors because of the RLS `select` policy defined in
`supabase/migrations/001_initial.sql`:

```sql
create policy "public read skills" on skills for select using (true);
```

Same policy exists for the other three tables — `using (true)` means "anyone can read, no
session required." That's what lets the public site fetch content using only the anon key.

If the fetch fails (network issue, RLS misconfigured, etc.) `useTable` exposes an `error` state;
the page just renders with an empty list rather than crashing.

## 3. The Supabase client

`src/lib/supabase.ts` creates one client instance, shared by both the public pages and the admin
panel:

```ts
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

It always uses the **anon key** — even inside the admin panel. Write access isn't granted by a
different key; it's granted by the RLS policies checking whether the current request has an
authenticated session attached (see below). This is the standard Supabase pattern: one client,
one public key, and RLS decides what that key's *current session* is allowed to do.

## 4. Admin auth: how "logged in" changes what the same key can do

1. Admin visits `/admin/login` (`src/admin/AdminLogin.tsx`), submits email/password.
2. `supabase.auth.signInWithPassword({ email, password })` checks against the single admin user
   created manually in the Supabase dashboard (Authentication → Users). There's no self-signup
   flow in this app.
3. On success, `supabase-js` stores a session (JWT) in the browser (localStorage) and attaches it
   to every subsequent request automatically.
4. `src/admin/useAuthSession.ts` wraps `supabase.auth.getSession()` +
   `supabase.auth.onAuthStateChange()` into a hook. `src/admin/ProtectedRoute.tsx` uses it to
   redirect to `/admin/login` if there's no session.
5. Once a session exists, every `insert` / `update` / `delete` call from the admin panel carries
   that session's JWT. The RLS write policies check it:

   ```sql
   create policy "authenticated write skills" on skills for all
     using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
   ```

   `auth.role() = 'authenticated'` is true only when the request includes a valid session JWT —
   i.e. only when someone is signed in as the admin. Logged-out visitors hitting the same
   database with the same anon key get rejected by this policy for any write attempt.

Signing out (`AdminLayout.tsx` → `supabase.auth.signOut()`) clears the session; the next write
attempt would fail RLS again.

## 5. Admin panel: how CRUD + reorder + upload work

All four content types share one generic component, `src/admin/EntityAdmin.tsx`, configured per
table by `src/admin/entityConfigs.ts` (field names, labels, input types, whether it has an icon).
This avoids four near-duplicate CRUD screens — one component driven by config.

**Create / Update** (`save()` in `EntityAdmin.tsx`):
1. Form fields are collected into a plain object (`formToPayload`).
2. If a new icon file was chosen, it's uploaded first (see §6), and the returned public URL is
   merged into the payload as `icon_url`.
3. New row → `supabase.from(table).insert(payload)` with `sort_order = rows.length` (appended to
   the end). Existing row → `supabase.from(table).update(payload).eq("id", editingId)`.
4. On success, the list is re-fetched (`loadRows()`) so the UI reflects the DB exactly — no local
   optimistic state to drift out of sync.

**Delete** (`deleteRow()`): confirms via a native `window.confirm()`, then
`supabase.from(table).delete().eq("id", id)`, then re-fetches.

**Reorder** (`onDragEnd()`): uses `@dnd-kit` for drag-and-drop. On drop, the local list is
reordered immediately (optimistic, for a snappy feel), then every row's `sort_order` is
recalculated to match its new index and pushed to the DB in parallel:

```ts
const updates = reordered.map((row, index) =>
  supabase.from(config.table).update({ sort_order: index }).eq("id", row.id)
);
await Promise.all(updates);
```

Because public pages always `select ... order by sort_order`, a reorder in the admin panel is
immediately reflected on the next page load of `/about` or `/projects` — no separate "publish"
step.

## 6. Icon uploads

`src/admin/uploadIcon.ts`:

```ts
const path = `${table}/${crypto.randomUUID()}.${ext}`;
await supabase.storage.from("icons").upload(path, file);
return supabase.storage.from("icons").getPublicUrl(path).data.publicUrl;
```

Files land in the `icons` bucket under a per-table folder (e.g. `skills/<uuid>.svg`), named with a
random UUID to avoid collisions. The bucket is public-read (`supabase/migrations/001_initial.sql`
creates it with `public: true` and a matching storage RLS policy), so the returned URL works directly in an
`<img src>` on the public site with no auth needed. Only authenticated (admin) requests can upload
to it — same `auth.role() = 'authenticated'` pattern as the table policies, just applied to
`storage.objects` instead.

## 7. One-time migrations (already run)

- `supabase/migrations/001_initial.sql` — creates `skills`, `experiences`, `social_links`,
  `projects`, their RLS policies, and the `icons` storage bucket. Run once in the Supabase SQL
  Editor.
- `supabase/migrations/002_profile.sql` — creates the single-row `profile` table (name/tagline/bio/
  info blurbs) and its RLS policies. Also run once in the SQL Editor. **Both migrations are
  required** — Home.tsx and About.tsx depend on `profile` existing, not just the four list tables.
- `supabase/migrate.mjs` — a standalone Node script (not part of the shipped app) that seeded the
  four list tables once from the site's original hardcoded content in the old
  `src/constants/index.ts`. Used the **service_role key** (passed inline on the command line, never
  saved to disk) to bypass RLS, read each local icon file from `src/assets/`, upload it to Storage,
  and insert the matching row with `sort_order` set to its position in the original array. That
  file (`src/constants/`) has since been deleted from the app.
- `supabase/migrate_profile.mjs` — the equivalent one-time seed script for the `profile` table.

All four files remain in `supabase/` purely as a historical record of how the initial data got
there; none of them run again in normal operation.

## 8. End-to-end example

Editing a skill's name in the admin panel:

1. Admin (signed in) opens `/admin`, clicks **Edit** on a skill row.
2. Changes the name, clicks **Save** → `EntityAdmin.save()` → `supabase.from("skills").update(...)`.
3. RLS checks the session → `auth.role() = 'authenticated'` → passes → row updated in Postgres.
4. `loadRows()` re-fetches → admin list shows the new name immediately.
5. Next time anyone loads `/about` (no login needed), `useTable("skills")` runs
   `select * order by sort_order` → gets the updated row → renders the new name.

No rebuild, no redeploy — the change is live as soon as the write succeeds.

## 9. File map

| File | Role |
|---|---|
| `supabase/migrations/001_initial.sql` | skills/experiences/social_links/projects tables, RLS policies, storage bucket + policies (run once in Supabase SQL Editor) |
| `supabase/migrations/002_profile.sql` | Single-row `profile` table + RLS policies (run once, required alongside 001) |
| `supabase/migrate.mjs` / `supabase/migrate_profile.mjs` | One-time seed scripts (historical, already run) |
| `.env.example` / `.env.local` | `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` (local file is gitignored) |
| `src/lib/supabase.ts` | Shared Supabase client instance |
| `src/hooks/useTable.ts` | Generic read hook used by public pages |
| `src/types/DbTypes.ts` | TS types matching the table schemas |
| `src/admin/entityConfigs.ts` | Per-table field/label config driving the generic admin UI |
| `src/admin/EntityAdmin.tsx` | Generic CRUD + reorder UI, config-driven |
| `src/admin/uploadIcon.ts` | Storage upload helper |
| `src/admin/AdminLogin.tsx` | Sign-in form |
| `src/admin/useAuthSession.ts` | Session state hook |
| `src/admin/ProtectedRoute.tsx` | Redirects to login if no session |
| `src/admin/AdminLayout.tsx` | Admin shell — tab nav across the 4 content types |
