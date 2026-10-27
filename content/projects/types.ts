export type Project = {
  slug: string;
  title: string;
  summary: string;
  description: string;
  stack: string[];
  href?: string;
  repoUrl?: string;
  featured?: boolean;
};
