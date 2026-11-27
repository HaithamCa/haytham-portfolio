/**
 * GitHub API Service
 * 
 * Fetches repository data from GitHub and transforms it to match our Project type.
 */

import type { Project } from '@/content/projects/types';
import {
  GITHUB_USERNAME,
  FEATURED_REPOS,
  EXCLUDED_REPOS,
  REPO_SLUG_MAP,
  REPO_THUMBNAIL_MAP,
  REPO_LIVE_URL_MAP,
  FETCH_MODE,
} from '@/config/github-projects';

const GITHUB_API_BASE = 'https://api.github.com';
const GITHUB_GRAPHQL_API = 'https://api.github.com/graphql';

interface GitHubRepo {
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  stargazers_count: number;
  language: string | null;
  topics: string[];
  updated_at: string;
  default_branch: string;
  fork: boolean;
  archived: boolean;
}

interface ReadmeMetadata {
  description: string | null;
  imageUrl: string | null;
  liveUrl: string | null;
}

/**
 * Generate a live webpage screenshot URL for a project's live demo link
 */
export function getLiveScreenshotUrl(liveUrl: string): string {
  return `https://s0.wp.com/mshots/v1/${encodeURIComponent(liveUrl)}?w=1280&h=800`;
}

/**
 * Extract a live demo URL mentioned inside a README if the repo's homepage field is empty
 */
function extractLiveDemoUrlFromReadme(readme: string, owner: string, repo: string): string | null {
  const lines = readme.split('\n');
  let inCodeBlock = false;

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('```')) {
      inCodeBlock = !inCodeBlock;
      continue;
    }
    if (inCodeBlock) continue;

    // 1. Explicit "Live Demo" / "Demo" / "Deployed" line with URL
    if (/\b(live(\s+interactive)?\s+demo|demo\s+link|deployed|live\s+site|live\s+app)\b/i.test(trimmed)) {
      const urlMatch = trimmed.match(/https?:\/\/[^\s)>\]]+/i);
      if (urlMatch && !urlMatch[0].includes(`github.com/${owner}/${repo}`)) {
        return urlMatch[0].replace(/[.,;]+$/, '');
      }
    }

    // 2. Common deployment host URLs (github.io, vercel.app, netlify.app, onrender.com, railway.app, fly.dev, herokuapp.com)
    const hostMatch = trimmed.match(
      /https?:\/\/[a-z0-9.-]+\.(?:github\.io|vercel\.app|netlify\.app|onrender\.com|railway\.app|fly\.dev|herokuapp\.com)(?:\/[^\s)>\]]*)?/i
    );
    if (hostMatch && !/\.(png|jpg|jpeg|gif|svg|webp)$/i.test(hostMatch[0])) {
      return hostMatch[0].replace(/[.,;]+$/, '');
    }
  }

  return null;
}

/**
 * Determine whether an image URL in a README is a status badge or icon rather than a project screenshot
 */
function isBadgeOrIconUrl(url: string): boolean {
  const lower = url.toLowerCase();
  const badgePatterns = [
    'shields.io',
    'img.shields.io',
    'badge',
    'travis-ci',
    'circleci',
    'codecov',
    'coveralls',
    'github.com/workflows',
    '/actions/workflows/',
    'sonarcloud',
    'david-dm',
    'snyk.io',
    'npmjs.com',
    'pepy.tech',
  ];

  if (badgePatterns.some((pattern) => lower.includes(pattern))) {
    return true;
  }

  if (lower.endsWith('.svg') && !lower.includes('screenshot') && !lower.includes('diagram')) {
    return true;
  }

  return false;
}

/**
 * Resolve a raw README image URL (relative, GitHub blob, or absolute) into a direct image URL
 */
function resolveReadmeImageUrl(
  rawUrl: string,
  owner: string,
  repo: string,
  defaultBranch: string = 'main'
): string | null {
  const trimmed = rawUrl.trim().split(/\s+/)[0].replace(/^['"]|['"]$/g, '');
  if (!trimmed || trimmed.startsWith('data:')) {
    return null;
  }

  if (isBadgeOrIconUrl(trimmed)) {
    return null;
  }

  // Convert GitHub blob URLs (https://github.com/owner/repo/blob/branch/path) to raw URLs
  const githubBlobMatch = trimmed.match(
    /^https?:\/\/github\.com\/([^/]+)\/([^/]+)\/(?:blob|raw)\/([^/]+)\/(.+)$/i
  );
  if (githubBlobMatch) {
    const [, blobOwner, blobRepo, blobBranch, blobPath] = githubBlobMatch;
    return `https://raw.githubusercontent.com/${blobOwner}/${blobRepo}/${blobBranch}/${blobPath.replace(/\?raw=true$/i, '')}`;
  }

  // Already an absolute http(s) URL (e.g. user-images.githubusercontent.com, github.com/user-attachments, imgur, etc.)
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  // Relative path in the repository
  const cleanPath = trimmed.replace(/^(\.\/|\/)+/, '');
  return `https://raw.githubusercontent.com/${owner}/${repo}/${defaultBranch}/${cleanPath}`;
}

/**
 * Extract first screenshot/GIF URL and clean text description from raw README markdown
 */
function extractReadmeMetadata(
  readme: string,
  owner: string,
  repo: string,
  defaultBranch: string = 'main'
): ReadmeMetadata {
  const lines = readme.split('\n');
  let description = '';
  let imageUrl: string | null = null;
  let foundTitle = false;
  let inCodeBlock = false;

  // First pass: find the first non-badge image anywhere in the README outside code blocks
  let scanCodeBlock = false;
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('```')) {
      scanCodeBlock = !scanCodeBlock;
      continue;
    }
    if (scanCodeBlock) continue;

    // Match Markdown images: ![alt](url)
    const mdImageRegex = /!\[[^\]]*\]\(([^)]+)\)/g;
    let mdMatch: RegExpExecArray | null;
    while ((mdMatch = mdImageRegex.exec(trimmed)) !== null) {
      const resolved = resolveReadmeImageUrl(mdMatch[1], owner, repo, defaultBranch);
      if (resolved) {
        imageUrl = resolved;
        break;
      }
    }
    if (imageUrl) break;

    // Match HTML images: <img ... src="url" ...>
    const htmlImageRegex = /<img[^>]+src=["']([^"']+)["'][^>]*>/gi;
    let htmlMatch: RegExpExecArray | null;
    while ((htmlMatch = htmlImageRegex.exec(trimmed)) !== null) {
      const resolved = resolveReadmeImageUrl(htmlMatch[1], owner, repo, defaultBranch);
      if (resolved) {
        imageUrl = resolved;
        break;
      }
    }
    if (imageUrl) break;
  }

  // Second pass: extract clean text description paragraph
  for (const line of lines) {
    const trimmed = line.trim();

    if (trimmed.startsWith('```')) {
      inCodeBlock = !inCodeBlock;
      continue;
    }

    if (inCodeBlock) continue;

    // Skip the main title
    if (trimmed.startsWith('# ') && !foundTitle) {
      foundTitle = true;
      continue;
    }

    // Skip empty lines, images, HTML blocks, tables, and subheadings
    if (
      !trimmed ||
      trimmed.startsWith('![') ||
      trimmed.startsWith('<img') ||
      trimmed.startsWith('##') ||
      trimmed.startsWith('###') ||
      trimmed.startsWith('|') ||
      trimmed.startsWith('---')
    ) {
      if (description.length > 40) break;
      continue;
    }

    // Clean markdown formatting
    const cleanLine = trimmed
      .replace(/^[-*>]\s+/, '')
      .replace(/\*\*(.+?)\*\*/g, '$1')
      .replace(/\*(.+?)\*/g, '$1')
      .replace(/__(.+?)__/g, '$1')
      .replace(/_(.+?)_/g, '$1')
      .replace(/`(.+?)`/g, '$1')
      .replace(/\[(.+?)\]\(.+?\)/g, '$1')
      .replace(/<[^>]+>/g, '')
      .trim();

    // Skip lines that are just bare URLs or "Live Interactive Demo: https://..."
    if (!cleanLine || /^(live\s+(interactive\s+)?demo\s*:?\s*)?https?:\/\/\S+$/i.test(cleanLine)) {
      continue;
    }

    description += cleanLine + ' ';

    if (description.length > 300) break;
  }

  const liveUrl = extractLiveDemoUrlFromReadme(readme, owner, repo);

  return {
    description: description.trim() || null,
    imageUrl,
    liveUrl,
  };
}

/**
 * Create a concise card summary from repo description or README description
 */
function buildSummary(repoDescription: string | null, readmeDescription: string | null): string {
  if (repoDescription && repoDescription.trim()) {
    return repoDescription.trim();
  }
  if (readmeDescription && readmeDescription.trim()) {
    const clean = readmeDescription.trim();
    if (clean.length <= 150) return clean;
    const truncated = clean.slice(0, 147);
    const lastSpace = truncated.lastIndexOf(' ');
    return `${lastSpace > 80 ? truncated.slice(0, lastSpace) : truncated}...`;
  }
  return 'Full-stack software engineering project.';
}

/**
 * Fetch README metadata (description + first screenshot/GIF) for a repository
 */
async function fetchReadme(
  owner: string,
  repo: string,
  defaultBranch: string = 'main'
): Promise<ReadmeMetadata> {
  const token = process.env.GITHUB_TOKEN;

  const headers: HeadersInit = {
    'Accept': 'application/vnd.github.v3.raw',
    ...(token && { 'Authorization': `Bearer ${token}` }),
  };

  try {
    const response = await fetch(`${GITHUB_API_BASE}/repos/${owner}/${repo}/readme`, {
      headers,
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!response.ok) {
      return { description: null, imageUrl: null, liveUrl: null };
    }

    const readme = await response.text();
    return extractReadmeMetadata(readme, owner, repo, defaultBranch);
  } catch (error) {
    console.error(`Error fetching README for ${owner}/${repo}:`, error);
    return { description: null, imageUrl: null, liveUrl: null };
  }
}

/**
 * Fetch a single repository from GitHub API
 */
async function fetchRepo(owner: string, repo: string): Promise<GitHubRepo | null> {
  const token = process.env.GITHUB_TOKEN;
  
  const headers: HeadersInit = {
    'Accept': 'application/vnd.github.v3+json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
  };

  try {
    const response = await fetch(`${GITHUB_API_BASE}/repos/${owner}/${repo}`, {
      headers,
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!response.ok) {
      if (response.status === 404) {
        console.warn(`Repository not found: ${owner}/${repo}`);
        return null;
      }
      throw new Error(`GitHub API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error fetching repo ${owner}/${repo}:`, error);
    return null;
  }
}

/**
 * Transform GitHub repository data to our Project type
 */
function transformRepoToProject(repo: GitHubRepo, readmeMeta?: ReadmeMetadata): Project {
  const slug = REPO_SLUG_MAP[repo.name] || repo.name.toLowerCase().replace(/\s+/g, '-');
  const readmeDescription = readmeMeta?.description ?? null;
  const summary = buildSummary(repo.description, readmeDescription);
  const description = readmeDescription || repo.description || summary;
  const liveHref =
    REPO_LIVE_URL_MAP[repo.name] ||
    repo.homepage?.trim() ||
    readmeMeta?.liveUrl ||
    undefined;
  const readmeImage = REPO_THUMBNAIL_MAP[repo.name] || readmeMeta?.imageUrl || undefined;
  const image = liveHref ? getLiveScreenshotUrl(liveHref) : readmeImage;

  return {
    slug,
    title: repo.name
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' '),
    summary,
    description,
    stack: repo.topics.length > 0 ? repo.topics : (repo.language ? [repo.language] : []),
    href: liveHref,
    repoUrl: repo.html_url,
    featured: false,
    image,
    readmeImage,
    // GitHub-specific metadata
    stars: repo.stargazers_count,
    language: repo.language || undefined,
    lastUpdated: repo.updated_at,
  };
}

/**
 * Fetch repositories from specific list
 */
async function fetchFeaturedRepos(): Promise<Project[]> {
  const projects: Project[] = [];

  for (const repoName of FEATURED_REPOS) {
    const repo = await fetchRepo(GITHUB_USERNAME, repoName);
    
    if (repo && !repo.fork && !repo.archived) {
      const readmeMeta = await fetchReadme(
        GITHUB_USERNAME,
        repoName,
        repo.default_branch || 'main'
      );
      projects.push(transformRepoToProject(repo, readmeMeta));
    }
  }

  return projects;
}

/**
 * Fetch all GitHub projects based on FETCH_MODE configuration
 */
export async function fetchGitHubProjects(): Promise<Project[]> {
  const projectMap = new Map<string, Project>();

  try {
    // Fetch based on mode
    if (FETCH_MODE === 'pinned' || FETCH_MODE === 'both') {
      const pinnedProjects = await fetchPinnedRepositories();
      pinnedProjects.forEach(project => {
        projectMap.set(project.slug, project);
      });
    }

    if (FETCH_MODE === 'featured' || FETCH_MODE === 'both') {
      const featuredProjects = await fetchFeaturedRepos();
      featuredProjects.forEach(project => {
        // Don't override pinned projects with featured ones
        if (!projectMap.has(project.slug)) {
          projectMap.set(project.slug, project);
        }
      });
    }

    return Array.from(projectMap.values());
  } catch (error) {
    console.error('Error fetching GitHub projects:', error);
    return [];
  }
}

/**
 * Fetch pinned repositories using GitHub GraphQL API
 */
export async function fetchPinnedRepositories(): Promise<Project[]> {
  const token = process.env.GITHUB_TOKEN;
  
  // GraphQL requires authentication
  if (!token) {
    console.warn('GitHub token required for fetching pinned repositories. Falling back to featured repos.');
    return [];
  }

  const query = `
    query {
      user(login: "${GITHUB_USERNAME}") {
        pinnedItems(first: 6, types: REPOSITORY) {
          nodes {
            ... on Repository {
              name
              description
              url
              homepageUrl
              stargazerCount
              defaultBranchRef {
                name
              }
              primaryLanguage {
                name
              }
              repositoryTopics(first: 10) {
                nodes {
                  topic {
                    name
                  }
                }
              }
              updatedAt
              isFork
              isArchived
            }
          }
        }
      }
    }
  `;

  const headers: HeadersInit = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };

  try {
    const response = await fetch(GITHUB_GRAPHQL_API, {
      method: 'POST',
      headers,
      body: JSON.stringify({ query }),
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!response.ok) {
      console.error('GitHub GraphQL API error:', response.status);
      return [];
    }

    const result = await response.json();
    
    if (result.errors) {
      console.error('GraphQL errors:', result.errors);
      return [];
    }

    const repos = result.data?.user?.pinnedItems?.nodes || [];
    const filteredRepos = repos.filter(
      (repo: any) => !repo.isFork && !repo.isArchived && !EXCLUDED_REPOS.includes(repo.name)
    );
    
    // Fetch README for each pinned repo for descriptions and screenshots
    const projects: Project[] = [];
    for (const repo of filteredRepos) {
      const slug = REPO_SLUG_MAP[repo.name] || repo.name.toLowerCase().replace(/\s+/g, '-');
      const topics = repo.repositoryTopics.nodes.map((node: any) => node.topic.name);
      const defaultBranch = repo.defaultBranchRef?.name || 'main';
      
      const readmeMeta = await fetchReadme(GITHUB_USERNAME, repo.name, defaultBranch);
      const summary = buildSummary(repo.description, readmeMeta.description);
      const description = readmeMeta.description || repo.description || summary;
      const liveHref =
        REPO_LIVE_URL_MAP[repo.name] ||
        repo.homepageUrl?.trim() ||
        readmeMeta.liveUrl ||
        undefined;
      const readmeImage = REPO_THUMBNAIL_MAP[repo.name] || readmeMeta.imageUrl || undefined;
      const image = liveHref ? getLiveScreenshotUrl(liveHref) : readmeImage;
      
      projects.push({
        slug,
        title: repo.name
          .split('-')
          .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' '),
        summary,
        description,
        stack: topics.length > 0 ? topics : (repo.primaryLanguage?.name ? [repo.primaryLanguage.name] : []),
        href: liveHref,
        repoUrl: repo.url,
        featured: true, // Pinned repos are considered featured
        image,
        readmeImage,
        stars: repo.stargazerCount,
        language: repo.primaryLanguage?.name || undefined,
        lastUpdated: repo.updatedAt,
      });
    }
    
    return projects;
  } catch (error) {
    console.error('Error fetching pinned repositories:', error);
    return [];
  }
}

/**
 * Check GitHub API rate limit status
 */
export async function checkRateLimit(): Promise<{ limit: number; remaining: number; reset: Date } | null> {
  const token = process.env.GITHUB_TOKEN;
  
  const headers: HeadersInit = {
    'Accept': 'application/vnd.github.v3+json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
  };

  try {
    const response = await fetch(`${GITHUB_API_BASE}/rate_limit`, { headers });
    
    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    const core = data.resources.core;
    
    return {
      limit: core.limit,
      remaining: core.remaining,
      reset: new Date(core.reset * 1000),
    };
  } catch (error) {
    console.error('Error checking rate limit:', error);
    return null;
  }
}
