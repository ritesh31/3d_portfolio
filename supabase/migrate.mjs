// One-time script: seeds Supabase tables + Storage from the existing hardcoded
// content in src/constants/index.ts and the icon/image files it references.
//
// Run once, locally only:
//   SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... node supabase/migrate.mjs
//
// SUPABASE_SERVICE_ROLE_KEY is found in Supabase Dashboard -> Settings -> API.
// It bypasses RLS -- never commit it, never use it in the frontend.

import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const assetsDir = join(__dirname, "..", "src", "assets");

const supabaseUrl = process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error(
    "Missing SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY env vars. See comment at top of this file."
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function uploadLocalIcon(table, localPath) {
  const fullPath = join(assetsDir, localPath);
  const file = readFileSync(fullPath);
  const ext = localPath.split(".").pop();
  const storagePath = `${table}/${crypto.randomUUID()}.${ext}`;

  const { error } = await supabase.storage
    .from("icons")
    .upload(storagePath, file, { contentType: `image/${ext === "svg" ? "svg+xml" : ext}` });
  if (error) throw new Error(`Upload failed for ${localPath}: ${error.message}`);

  return supabase.storage.from("icons").getPublicUrl(storagePath).data.publicUrl;
}

// Mirrors src/constants/index.ts, with local asset paths instead of imports.
const skills = [
  { name: "CSS", type: "Frontend", icon: "icons/css.svg" },
  { name: "Git", type: "Version Control", icon: "icons/git.svg" },
  { name: "GitHub", type: "Version Control", icon: "icons/github.svg" },
  { name: "HTML", type: "Frontend", icon: "icons/html.svg" },
  { name: "JavaScript", type: "Frontend", icon: "icons/javascript.svg" },
  { name: "Material-UI", type: "Frontend", icon: "icons/mui.svg" },
  { name: "Node.js", type: "Backend", icon: "icons/nodejs.svg" },
  { name: "React", type: "Frontend", icon: "icons/react.svg" },
  { name: "Redux", type: "State Management", icon: "icons/redux.svg" },
  { name: "Tailwind CSS", type: "Frontend", icon: "icons/tailwindcss.svg" },
  { name: "TypeScript", type: "Frontend", icon: "icons/typescript.svg" },
  { name: "Docker", type: "OpenPlatform", icon: "icons/docker.svg" },
  { name: "Angular", type: "Frontend", icon: "icons/angular.svg" },
];

const experiences = [
  {
    title: "Senior Software Engineer",
    company_name: "Amazatic Solutions",
    icon: "images/amazatic.png",
    icon_bg: "#b0e1ac80",
    date: "May 2018 - Present",
    points: [
      "Collaborated with project managers to select ambitious, but realistic coding milestones on pre-release software project development.",
      "Collaborated with clients to define solution requirements, accounting for applicable development variables.",
      "Mentored junior staff members in coding best practices and problem solving techniques.",
      "Utilized Agile methodologies to manage project timelines and deliverables efficiently.",
    ],
  },
  {
    title: "Software Engineer",
    company_name: "Aptlogica Technologies (Vyas Systems)",
    icon: "images/aptlogica.png",
    icon_bg: "#d9363e45",
    date: "Aug 2016 - May 2018",
    points: [
      "Reviewed project specifications and designed technology solutions that met or exceeded performance expectations.",
      "Analyzed user requirements to develop software solutions and created technical specifications.",
      "Coordinated with other engineers to evaluate and improve software.",
      "Participated in continuous learning opportunities to stay current with emerging technologies.",
    ],
  },
];

const socialLinks = [
  { name: "Contact", icon: "icons/contact.svg", link: "/contacts" },
  {
    name: "GitHub",
    icon: "icons/github.svg",
    link: "https://github.com/YourGitHubUsername",
  },
  {
    name: "LinkedIn",
    icon: "icons/linkedin.svg",
    link: "https://www.linkedin.com/in/YourLinkedInUsername",
  },
];

const projects = [
  {
    icon: "icons/hometeamlive.svg",
    theme: "btn-back-red",
    name: "Home Team Live",
    description:
      "HomeTeam Live is a web application that allows users to stream and watch live local sports from anywhere in the world.",
    link: "https://github.com/adrianhajdin/pricewise",
  },
  {
    icon: "icons/proptek.svg",
    theme: "btn-back-green",
    name: "Proptek",
    description:
      "Proptek is pioneering the way for people to generate Property rental passports with verified digital ID, Open Banking, and soft credit checks. It's used for searching the property and keeping track of rental referencing.",
    link: "https://github.com/adrianhajdin/threads",
  },
  {
    icon: "icons/ecofarm.svg",
    theme: "btn-back-blue",
    name: "Eco-Farm",
    description:
      "Marketplace for cannabis farms/vendors/manufacturers/distributors/nurseries to buy and sell different types of cannabis products.",
    link: "https://github.com/adrianhajdin/project_next13_car_showcase",
  },
  {
    icon: "icons/sharebucks.svg",
    theme: "btn-back-pink",
    name: "ShareBucks",
    description:
      "ShareBucks is pioneering the way for people to earn rewards for sharing the products they love.",
    link: "https://github.com/adrianhajdin/social_media_app",
  },
  {
    icon: "icons/mxsponsor.svg",
    theme: "btn-back-brown",
    name: "MX Sponsor",
    description:
      "A Website to help riders get sponsorship discounts and deals from the top motocross companies in the world. Companies choose to offer riders exclusive discounts, deals and products to riders who help promote products and services.",
    link: "https://github.com/adrianhajdin/social_media_app",
  },
  {
    icon: "icons/bektek.svg",
    theme: "btn-back-black",
    name: "BEKTEK",
    description:
      "This Python project is basically used to fetch the data from online platforms like Amazon, Flipkart, eBay, etc., and also store this data on ZOHO using API.",
    link: "https://github.com/adrianhajdin/projects_realestate",
  },
  {
    icon: "icons/sellotap.svg",
    theme: "btn-back-violet",
    name: "Sellotap",
    description:
      "It is a platform for vendors to register products, monitor orders, and analyze finances from different retail platforms like Amazon, Flipkart, and eBay.",
    link: "https://github.com/adrianhajdin/projects_realestate",
  },
  {
    icon: "icons/digital-act.svg",
    theme: "btn-back-yellow",
    name: "Digital-ACT",
    description:
      "Web application design for a company which provides expert guidance to company members for improving their manufacturing competitiveness, and New Product Development.",
    link: "https://github.com/adrianhajdin/project_ai_summarizer",
  },
];

async function seedTable(table, items, mapRow) {
  console.log(`Seeding ${table} (${items.length} rows)...`);
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const icon_url = await uploadLocalIcon(table, item.icon);
    const row = { ...mapRow(item), icon_url, sort_order: i };
    const { error } = await supabase.from(table).insert(row);
    if (error) throw new Error(`Insert failed for ${table} row ${i}: ${error.message}`);
  }
  console.log(`Done: ${table}`);
}

await seedTable("skills", skills, (s) => ({ name: s.name, type: s.type }));
await seedTable("experiences", experiences, (e) => ({
  title: e.title,
  company_name: e.company_name,
  icon_bg: e.icon_bg,
  date: e.date,
  points: e.points,
}));
await seedTable("social_links", socialLinks, (s) => ({
  name: s.name,
  link: s.link,
}));
await seedTable("projects", projects, (p) => ({
  name: p.name,
  description: p.description,
  theme: p.theme,
  link: p.link,
}));

console.log("Migration complete.");
