import { developerPortal } from "@/content/projects/developer-portal";
import { taskTracker } from "@/content/projects/task-tracker";
import type { Project } from "@/content/projects/types";

const projects: Project[] = [developerPortal, taskTracker];

export function getAllProjects(): Project[] {
  return [...projects].sort((a, b) => a.title.localeCompare(b.title));
}

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function getFeaturedProjects(): Project[] {
  return projects.filter((p) => p.featured);
}
