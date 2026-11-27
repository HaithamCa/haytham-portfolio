/**
 * GitHub Projects Configuration
 * 
 * Define which GitHub repositories to fetch and display on the portfolio.
 * These will be merged with any manually curated projects.
 */

export const GITHUB_USERNAME = 'HaithamCa';

/**
 * Fetch mode:
 * - 'pinned': Fetch your pinned repositories from GitHub profile (requires GITHUB_TOKEN)
 * - 'featured': Fetch specific repositories listed in FEATURED_REPOS
 * - 'both': Fetch both pinned and featured repos (pinned repos marked as featured)
 */
export const FETCH_MODE: 'pinned' | 'featured' | 'both' = 'both';

/**
 * List of repository names to feature on the portfolio.
 * Add the exact repository name as it appears on GitHub.
 * Used when FETCH_MODE is 'featured' or 'both'
 */
export const FEATURED_REPOS = [
  'kwezap',
  'scheduler',
  'jungle-rails',
  'fortyguard-heatmap',
  'career-cloud',
  'tweeter',
];

/**
 * Repositories to exclude from the portfolio even if pinned on GitHub.
 */
export const EXCLUDED_REPOS = ['haytham-portfolio'];

/**
 * Optional: Map repository names to custom slugs if needed
 * If not specified, slugs will be generated from repository names
 */
export const REPO_SLUG_MAP: Record<string, string> = {
  // Add custom mappings if needed
};

/**
 * Optional: Override thumbnail image URL or local path (e.g. '/projects/kwezap.png')
 * for specific repositories. If not set, the first screenshot/GIF in the README is used.
 */
export const REPO_THUMBNAIL_MAP: Record<string, string> = {
  'scheduler': 'https://raw.githubusercontent.com/HaithamCa/scheduler/master/Docs/available-appointment.png',
  'fortyguard-heatmap': 'https://raw.githubusercontent.com/HaithamCa/fortyguard-heatmap/main/client/src/assets/hero.png',
};

/**
 * Optional: Map repository names to their live deployed URLs when not set in GitHub repo settings or README.
 */
export const REPO_LIVE_URL_MAP: Record<string, string> = {
  'career-cloud': 'https://haithamca.github.io/career-cloud/',
  'kwezap': 'https://haithamca.github.io/kwezap/',
};
