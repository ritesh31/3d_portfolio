export type FieldConfig = {
  key: string;
  label: string;
  type: "text" | "textarea" | "color" | "string-array";
};

export type EntityConfig = {
  table: string;
  label: string;
  titleField: string;
  hasIcon: boolean;
  fields: FieldConfig[];
};

export const entityConfigs: Record<string, EntityConfig> = {
  skills: {
    table: "skills",
    label: "Skills",
    titleField: "name",
    hasIcon: true,
    fields: [
      { key: "name", label: "Name", type: "text" },
      { key: "type", label: "Type", type: "text" },
    ],
  },
  experiences: {
    table: "experiences",
    label: "Experience",
    titleField: "title",
    hasIcon: true,
    fields: [
      { key: "title", label: "Title", type: "text" },
      { key: "company_name", label: "Company", type: "text" },
      { key: "date", label: "Date", type: "text" },
      { key: "icon_bg", label: "Icon background (hex)", type: "color" },
      { key: "points", label: "Points (one per line)", type: "string-array" },
    ],
  },
  social_links: {
    table: "social_links",
    label: "Social Links",
    titleField: "name",
    hasIcon: true,
    fields: [
      { key: "name", label: "Name", type: "text" },
      { key: "link", label: "Link (URL)", type: "text" },
    ],
  },
  projects: {
    table: "projects",
    label: "Projects",
    titleField: "name",
    hasIcon: true,
    fields: [
      { key: "name", label: "Name", type: "text" },
      { key: "description", label: "Description", type: "textarea" },
      { key: "theme", label: "Theme class (e.g. btn-back-red)", type: "text" },
      { key: "link", label: "Link (URL)", type: "text" },
    ],
  },
  blog_posts: {
    table: "blog_posts",
    label: "Blog",
    titleField: "title",
    hasIcon: true,
    fields: [
      { key: "title", label: "Title", type: "text" },
      { key: "excerpt", label: "Excerpt", type: "textarea" },
      { key: "link", label: "Link (URL)", type: "text" },
    ],
  },
};
