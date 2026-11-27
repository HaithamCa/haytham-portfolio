import type { Project } from "@/content/projects/types";
import { fetchGitHubProjects } from "@/lib/github";

// Manual/curated projects
const manualProjects: Project[] = [];

/**
 * Get all projects (manual + GitHub)
 * Merges manual projects with GitHub repos, preferring manual data when slug matches
 */
export async function getAllProjects(): Promise<Project[]> {
  try {
    const githubProjects = await fetchGitHubProjects();
    
    // Merge projects: manual projects take precedence over GitHub data
    const projectMap = new Map<string, Project>();
    
    // Add GitHub projects first
    githubProjects.forEach(project => {
      projectMap.set(project.slug, project);
    });
    
    // Override with manual projects (they have priority)
    manualProjects.forEach(project => {
      projectMap.set(project.slug, project);
    });
    
    // Convert to array and sort
    const allProjects = Array.from(projectMap.values());
    return allProjects.sort((a, b) => {
      // Sort by featured first, then by stars (if available), then alphabetically
      if (a.featured !== b.featured) {
        return a.featured ? -1 : 1;
      }
      if (a.stars && b.stars && a.stars !== b.stars) {
        return b.stars - a.stars;
      }
      return a.title.localeCompare(b.title);
    });
  } catch (error) {
    console.error('Error fetching projects:', error);
    // Fallback to manual projects only
    return [...manualProjects].sort((a, b) => a.title.localeCompare(b.title));
  }
}

/**
 * Get a project by slug
 */
export async function getProjectBySlug(slug: string): Promise<Project | undefined> {
  const projects = await getAllProjects();
  return projects.find((p) => p.slug === slug);
}

/**
 * Get featured projects
 */
export async function getFeaturedProjects(): Promise<Project[]> {
  const projects = await getAllProjects();
  return projects.filter((p) => p.featured);
}

/**
 * Synchronous version - get manual projects only (for SSG fallback)
 */
export function getManualProjects(): Project[] {
  return [...manualProjects].sort((a, b) => a.title.localeCompare(b.title));
}
