export interface GitHubRepo {
  name: string;
  stars: number;
  forks: number;
  description: string;
  url: string;
}

export interface HuggingFaceModel {
  downloads: number;
  likes: number;
}

export interface Metrics {
  totalStars: number;
  totalForks: number;
  totalRepos: number;
  featuredRepos: GitHubRepo[];
  huggingfaceStats?: HuggingFaceModel;
  lastUpdated: Date;
}

const REPOS = [
  'OS-nixCfg',
  'CARLA-Autonomous-Driving',
  'hs-faust',
  'DocAssist-LLM',
  'kanata-service',
  'firefox-nixCfg',
  'Vim-Cfg',
  'Emacs-Cfg',
  'TLTR',
  'hammerspoon-nix',
  'Zesta-Car-App',
  'Blinkit-Churn-Analysis',
  'Driver-Drowsiness-Detection',
  'Lagrangian-Reconstruction'
];

const CACHE_KEY = 'divit_metrics_cache';
const CACHE_DURATION = 1000 * 60 * 60; // 1 hour

interface CachedMetrics {
  data: Metrics;
  timestamp: number;
}

function getCachedMetrics(): Metrics | null {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return null;

    const { data, timestamp }: CachedMetrics = JSON.parse(cached);
    const age = Date.now() - timestamp;

    if (age < CACHE_DURATION) {
      // Convert date string back to Date object
      data.lastUpdated = new Date(data.lastUpdated);
      return data;
    }

    return null;
  } catch {
    return null;
  }
}

function setCachedMetrics(metrics: Metrics): void {
  try {
    const cached: CachedMetrics = {
      data: metrics,
      timestamp: Date.now()
    };
    localStorage.setItem(CACHE_KEY, JSON.stringify(cached));
  } catch (error) {
    console.warn('Failed to cache metrics:', error);
  }
}

export async function fetchGitHubStats(): Promise<GitHubRepo[]> {
  const repos: GitHubRepo[] = [];

  for (const repoName of REPOS) {
    try {
      const response = await fetch(`https://api.github.com/repos/DivitMittal/${repoName}`, {
        headers: {
          Accept: 'application/vnd.github.v3+json'
        }
      });

      if (!response.ok) {
        console.warn(`Failed to fetch ${repoName}:`, response.status);
        continue;
      }

      const data = await response.json();

      repos.push({
        name: data.name,
        stars: data.stargazers_count,
        forks: data.forks_count,
        description: data.description || '',
        url: data.html_url
      });
    } catch (error) {
      console.warn(`Error fetching ${repoName}:`, error);
    }
  }

  return repos;
}

export async function fetchHuggingFaceStats(): Promise<HuggingFaceModel | null> {
  try {
    const response = await fetch(
      'https://huggingface.co/api/models/divitmittal/HybridTransformer-MFIF'
    );

    if (!response.ok) {
      console.warn('Failed to fetch HuggingFace stats:', response.status);
      return null;
    }

    const data = await response.json();

    return {
      downloads: data.downloads || 0,
      likes: data.likes || 0
    };
  } catch (error) {
    console.warn('Error fetching HuggingFace stats:', error);
    return null;
  }
}

export async function fetchMetrics(useCache = true): Promise<Metrics> {
  // Check cache first
  if (useCache) {
    const cached = getCachedMetrics();
    if (cached) {
      return cached;
    }
  }

  // Fetch fresh data
  const [repos, hfStats] = await Promise.all([
    fetchGitHubStats(),
    fetchHuggingFaceStats().catch(() => null)
  ]);

  const totalStars = repos.reduce((sum, repo) => sum + repo.stars, 0);
  const totalForks = repos.reduce((sum, repo) => sum + repo.forks, 0);

  // Get top 5 repos by stars
  const featuredRepos = [...repos].sort((a, b) => b.stars - a.stars).slice(0, 5);

  const metrics: Metrics = {
    totalStars,
    totalForks,
    totalRepos: repos.length,
    featuredRepos,
    huggingfaceStats: hfStats || undefined,
    lastUpdated: new Date()
  };

  // Cache the results
  setCachedMetrics(metrics);

  return metrics;
}
