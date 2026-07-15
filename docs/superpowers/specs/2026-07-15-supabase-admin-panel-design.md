# Supabase-backed Admin Panel — Design

## Problem
All portfolio content (`skills`, `experiences`, `socialLinks`, `projects`) is hardcoded in
`src/constants/index.ts` as static TS arrays, with icon images statically imported from
`src/assets/icons` / `src/assets/images`. Any content change requires editing code and
redeploying. Need a way to edit content without a code change, reflected live on the frontend.

## Decisions
- **Backend**: Supabase (Postgres + Storage + Auth), free tier — sufficient for this scale
  (see cost note below).
- **Access**: single admin user, email/password via Supabase Auth. No self-signup flow shipped;
  admin account created once via Supabase dashboard.
- **Icons**: uploaded through the admin UI to Supabase Storage (not restricted to pre-bundled
  assets). New/edited entries get a Storage-hosted `icon_url`.
- **Scope**: all four existing content types (`skills`, `experiences`, `social_links`, `projects`)
  get full CRUD in v1.
- **Ordering**: drag-to-reorder in admin UI, backed by a `sort_order` integer column per table.
- **Admin surface**: a new `/admin` route inside the existing Vite/React app (not a separate app,
  not the raw Supabase Studio dashboard) — lazy-loaded so the public bundle size is unaffected.

## Architecture

```
Supabase project
├── Postgres: skills, experiences, social_links, projects tables
├── Storage: "icons" bucket (public read)
└── Auth: email/password, single admin user

Frontend (existing Vite/React SPA)
├── src/lib/supabase.ts          → Supabase client (env: VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY)
├── src/admin/
│   ├── AdminLogin.tsx           → signInWithPassword form
│   ├── ProtectedRoute.tsx       → session check, redirect to /admin/login if none
│   ├── AdminLayout.tsx          → nav shell for CRUD sections
│   └── sections/
│       ├── SkillsAdmin.tsx
│       ├── ExperiencesAdmin.tsx
│       ├── SocialLinksAdmin.tsx
│       └── ProjectsAdmin.tsx
├── src/hooks/
│   ├── useSkills.ts / useExperiences.ts / useSocialLinks.ts / useProjects.ts
│   │   → each: supabase.from(<table>).select('*').order('sort_order'), loading/error state
└── src/pages/{Home,About,Projects}.tsx
    → swap static `constants` imports for the corresponding hook
```

`App.tsx` gains an `/admin/*` route tree, code-split via `React.lazy`.

## DB schema

```sql
create table skills (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  type text not null,
  icon_url text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table experiences (
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

create table social_links (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  icon_url text,
  link text not null,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table projects (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text not null,
  icon_url text,
  theme text,
  link text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);
```

**RLS**: enabled on all four tables.
- `select` policy: `USING (true)` — public/anon read, required for the frontend to fetch.
- `insert`/`update`/`delete` policies: `USING (auth.role() = 'authenticated')` — writes require
  a signed-in session (i.e. the admin).

## Auth flow
- `/admin/login`: email + password form → `supabase.auth.signInWithPassword({ email, password })`.
- `ProtectedRoute` wraps all other `/admin/*` routes: calls `supabase.auth.getSession()` on mount,
  subscribes to `onAuthStateChange`, redirects to `/admin/login` when no session.
- No password-reset / signup UI in v1 — single admin account, credentials managed directly in the
  Supabase dashboard if ever needed.

## Icon upload
- Storage bucket `icons`, public read policy.
- Each admin form (Skills/Experiences/SocialLinks/Projects) includes a file input. On save:
  upload file to `icons/<table>/<uuid>-<filename>`, read back the public URL, store in `icon_url`.
- Existing bundled icon files in `src/assets/icons`/`src/assets/images` are left in place (still
  used by the one-time migration script below); no code deletion required as part of this feature.

## Ordering (drag-to-reorder)
- `@dnd-kit/sortable` for the admin list views (new dependency — no drag library exists in the
  project today; earlier idea of manual up/down buttons was dropped in favor of DnD sortable per
  decision above).
- On drop: reassign `sort_order` (0..n-1) for the affected table, batch `update` in one Supabase
  call.
- Public-facing hooks always `.order('sort_order')` on select — display order fully DB-driven, no
  more relying on array-literal order in code.

## One-time data migration
- Standalone Node script (not part of the shipped app, run once): reads the existing arrays in
  `src/constants/index.ts`, uploads each referenced icon file to the `icons` Storage bucket, and
  inserts a corresponding row (with `sort_order` matching current array index) into the matching
  table.
- Requires the Supabase **service role key** (bypasses RLS) — run locally only, key never
  committed or shipped to the frontend.
- After migration is verified, `src/constants/index.ts` content arrays become dead code and can be
  removed (icon/image imports powering them may still be used elsewhere — check before deleting).

## Error handling
- Login failure (bad credentials): inline error message on the login form, no redirect.
- CRUD failure (network/Supabase error) on any admin action: surfaced via the existing
  `Alert` component / `useAlert` hook already used in `Contacts.tsx` — same pattern, reused not
  reinvented.
- Public page fetch failure: hook exposes an `error` state; page renders an empty-state fallback
  instead of crashing (no content shown rather than a broken layout).

## Testing
- No test suite exists in this repo today (`package.json` has no `test` script). Automated tests
  are out of scope for v1 unless requested separately.
- Manual verification after implementation: run dev server, sign in to `/admin`, perform a CRUD
  round-trip (create/edit/delete/reorder) on each content type, confirm the public page reflects
  the change without a rebuild.

## Cost
Supabase free tier: 500MB DB, 1GB Storage, 5GB bandwidth/month, 50k auth users. This project's
data (4 small tables, a handful of icon images) is well within limits. Free-tier projects pause
after 7 days of inactivity and auto-resume on next request (few-second delay) — acceptable for a
personal portfolio's admin usage pattern. No paid tier needed for this feature.

## Out of scope (v1)
- Multi-user / role-based admin access.
- Password reset / self-signup flows.
- Automated test coverage.
- Deleting the now-redundant `constants/index.ts` arrays and their icon imports (follow-up once
  migration is verified in production).
