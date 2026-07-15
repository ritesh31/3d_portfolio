// One-time script: seeds the single "profile" row from the text that used to be
// hardcoded in src/components/Info.tsx and src/pages/About.tsx.
//
// Run once, locally only:
//   SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... node supabase/migrate_profile.mjs
//
// Safe to re-run -- upserts by fixed id=1.

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error(
    "Missing SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY env vars. See comment at top of this file."
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

const { error } = await supabase.from("profile").upsert({
  id: 1,
  name: "Ritesh",
  tagline: "A Lead Engineer from India",
  bio: "Lead Engineer based in India, Specializing in technical education through hands-on learning and building applications.",
  info_stage_2: "Worked with many companies and picked up many skills along the way",
  info_stage_3: "Led multiple projects to success over the years. Curious about the impact?",
  info_stage_4: "Need a project done or looking for a dev? I'm just a few keystokes away",
});

if (error) {
  console.error("Seed failed:", error.message);
  process.exit(1);
}

console.log("Profile seeded.");
