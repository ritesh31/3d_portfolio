export type SkillRow = {
  id: string;
  name: string;
  type: string;
  icon_url: string | null;
  sort_order: number;
  created_at: string;
};

export type ExperienceRow = {
  id: string;
  title: string;
  company_name: string;
  icon_url: string | null;
  icon_bg: string | null;
  date: string;
  points: string[];
  sort_order: number;
  created_at: string;
};

export type SocialLinkRow = {
  id: string;
  name: string;
  icon_url: string | null;
  link: string;
  sort_order: number;
  created_at: string;
};

export type ProfileRow = {
  id: number;
  name: string;
  tagline: string;
  bio: string;
  info_stage_2: string;
  info_stage_3: string;
  info_stage_4: string;
  resume_url: string | null;
  updated_at: string;
};

export type ProjectRow = {
  id: string;
  name: string;
  description: string;
  icon_url: string | null;
  theme: string | null;
  link: string | null;
  sort_order: number;
  created_at: string;
};

export type BlogPostRow = {
  id: string;
  title: string;
  excerpt: string;
  icon_url: string | null;
  link: string;
  sort_order: number;
  created_at: string;
};

export type ContactMessageRow = {
  id: string;
  name: string;
  email: string;
  message: string;
  created_at: string;
};
