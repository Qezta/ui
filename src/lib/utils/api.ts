export interface GitHubRepo {
  name: string;
  stars: number;
  forks: number;
  description: string;
  url: string;
  language: string | null;
  isFork: boolean;
}

export type { Project, CategorizedProjects };

export interface HuggingFaceModel {
  downloads: number;
  likes: number;
}

export interface HuggingFaceSpace {
  id: string;
  name: string;
  likes: number;
  url: string;
}

export interface KaggleDataset {
  title: string;
  downloads: number;
  views: number;
  url: string;
}

export type RepoCategory =
  | 'AI/ML'
  | 'System Config'
  | 'DevTools'
  | 'Editor Configs'
  | 'Web & Apps'
  | 'Audio & DSP'
  | 'Forks & Contributions'
  | 'Other';

export interface Project {
  name: string;
  url: string;
  type: 'github' | 'huggingface' | 'space' | 'kaggle';
  // GitHub fields
  stars?: number;
  forks?: number;
  language?: string | null;
  description?: string;
  isFork?: boolean;
  // HuggingFace fields
  downloads?: number;
  likes?: number;
  // Kaggle fields
  views?: number;
}

export interface CategorizedRepos {
  category: RepoCategory;
  repos: GitHubRepo[];
}

export interface CategorizedProjects {
  category: RepoCategory;
  projects: Project[];
}

export interface Metrics {
  totalStars: number;
  totalForks: number;
  totalRepos: number;
  followers: number;
  categorizedRepos: CategorizedRepos[];
  categorizedProjects: CategorizedProjects[];
  huggingfaceStats?: HuggingFaceModel;
  huggingfaceSpaces?: HuggingFaceSpace[];
  kaggleStats?: {
    datasets: KaggleDataset[];
    totalDownloads: number;
    totalViews: number;
  };
  lastUpdated: Date;
}

const GITHUB_USERNAME = 'DivitMittal';
const CACHE_KEY = 'divit_metrics_cache_v2';
const CACHE_DURATION_MS = 1000 * 60 * 60;

interface CachedMetrics {
  data: Metrics;
  timestamp: number;
}

const EDITOR_CONFIG_REPOS = ['vim-cfg', 'emacs-cfg', 'pkms'];

const AI_ML_REPOS = [
  'carla-autonomous-driving',
  'docassist-llm',
  'driver-drowsiness-detection',
  'blinkit-churn-analysis',
  'zesta-car-app',
  'datathon-bigdata'
];

const AUDIO_DSP_REPOS = ['hs-faust', 'tidalcycles-nix', 'audioresswitcher-raycast'];

const SYSTEM_CONFIG_REPOS = [
  'os-nixcfg',
  'firefox-nixcfg',
  'hammerspoon-nix',
  'termemulator-cfg',
  'sync-macos',
  'sync-windows',
  'sync-android',
  'playbooks-4-windows'
];

const DEVTOOLS_REPOS = ['ghorg-terraform', 'tltr', 'kanata-service'];

const WEB_APPS_REPOS = [
  'professionalstay-site',
  'zestaads',
  'merinetworth',
  'git-fun',
  'hulk',
  'employee-management'
];

function matchesKeywords(text: string, keywords: string[]): boolean {
  return keywords.some((kw) => text.includes(kw));
}

function categorizeRepo(repo: GitHubRepo): RepoCategory {
  const nameLower = repo.name.toLowerCase();
  const lang = (repo.language || '').toLowerCase();

  if (repo.isFork) return 'Forks & Contributions';

  if (EDITOR_CONFIG_REPOS.includes(nameLower)) return 'Editor Configs';
  if (AI_ML_REPOS.includes(nameLower)) return 'AI/ML';
  if (AUDIO_DSP_REPOS.includes(nameLower)) return 'Audio & DSP';
  if (SYSTEM_CONFIG_REPOS.includes(nameLower)) return 'System Config';
  if (DEVTOOLS_REPOS.includes(nameLower)) return 'DevTools';
  if (WEB_APPS_REPOS.includes(nameLower)) return 'Web & Apps';

  if (lang === 'nix') return 'System Config';
  if (['typescript', 'javascript', 'swift', 'dart', 'html', 'css'].includes(lang))
    return 'Web & Apps';
  if (lang === 'emacs lisp' || lang === 'vim script') return 'Editor Configs';

  return 'Other';
}

function getCachedMetrics(): Metrics | null {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return null;

    const { data, timestamp }: CachedMetrics = JSON.parse(cached);
    const age = Date.now() - timestamp;

    if (age < CACHE_DURATION_MS) {
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

export async function fetchGitHubStats(): Promise<{
  repos: GitHubRepo[];
  followers: number;
}> {
  const repos: GitHubRepo[] = [];

  try {
    const userResponse = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}`, {
      headers: { Accept: 'application/vnd.github.v3+json' }
    });

    let followers = 0;
    let totalRepoCount = 0;

    if (userResponse.ok) {
      const userData = await userResponse.json();
      followers = userData.followers || 0;
      totalRepoCount = userData.public_repos || 0;
    }

    const pages = Math.ceil(totalRepoCount / 100);
    const repoPromises = [];

    for (let page = 1; page <= Math.max(pages, 1); page++) {
      repoPromises.push(
        fetch(
          `https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100&page=${page}&sort=updated`,
          {
            headers: { Accept: 'application/vnd.github.v3+json' }
          }
        )
      );
    }

    const responses = await Promise.all(repoPromises);

    for (const response of responses) {
      if (!response.ok) continue;

      const data = await response.json();
      for (const repo of data) {
        repos.push({
          name: repo.name,
          stars: repo.stargazers_count,
          forks: repo.forks_count,
          description: repo.description || '',
          url: repo.html_url,
          language: repo.language,
          isFork: repo.fork
        });
      }
    }

    return { repos, followers };
  } catch (error) {
    console.warn('Error fetching GitHub stats:', error);
    return { repos, followers: 0 };
  }
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

export async function fetchKaggleStats(): Promise<{
  datasets: KaggleDataset[];
  totalDownloads: number;
  totalViews: number;
} | null> {
  try {
    const response = await fetch('https://www.kaggle.com/api/v1/datasets/list?user=divitmittal');

    if (!response.ok) {
      console.warn('Failed to fetch Kaggle stats:', response.status);
      return null;
    }

    const data = await response.json();

    const datasets: KaggleDataset[] = data.map(
      (ds: {
        titleNullable?: string;
        downloadCount?: number;
        viewCount?: number;
        urlNullable?: string;
      }) => ({
        title: ds.titleNullable || 'Untitled',
        downloads: ds.downloadCount || 0,
        views: ds.viewCount || 0,
        url: ds.urlNullable || ''
      })
    );

    const totalDownloads = datasets.reduce((sum, ds) => sum + ds.downloads, 0);
    const totalViews = datasets.reduce((sum, ds) => sum + ds.views, 0);

    return { datasets, totalDownloads, totalViews };
  } catch (error) {
    console.warn('Error fetching Kaggle stats:', error);
    return null;
  }
}

export async function fetchHuggingFaceSpaces(): Promise<HuggingFaceSpace[]> {
  try {
    const response = await fetch('https://huggingface.co/api/spaces?author=divitmittal&limit=100');

    if (!response.ok) {
      console.warn('Failed to fetch HuggingFace Spaces:', response.status);
      return [];
    }

    const data = await response.json();

    return data.map(
      (space: { id: string; likes: number }) => ({
        id: space.id,
        name: space.id.split('/')[1] || space.id,
        likes: space.likes || 0,
        url: `https://huggingface.co/spaces/${space.id}`
      })
    );
  } catch (error) {
    console.warn('Error fetching HuggingFace Spaces:', error);
    return [];
  }
}

const CATEGORY_DISPLAY_ORDER: RepoCategory[] = [
  'AI/ML',
  'System Config',
  'DevTools',
  'Web & Apps',
  'Audio & DSP',
  'Editor Configs',
  'Other',
  'Forks & Contributions'
];

export async function fetchMetrics(useCache = true): Promise<Metrics> {
  if (useCache) {
    const cached = getCachedMetrics();
    if (cached) return cached;
  }

  const [githubData, hfStats, hfSpaces, kaggleStats] = await Promise.all([
    fetchGitHubStats(),
    fetchHuggingFaceStats().catch(() => null),
    fetchHuggingFaceSpaces().catch(() => []),
    fetchKaggleStats().catch(() => null)
  ]);

  const { repos, followers } = githubData;

  const totalStars = repos.reduce((sum, repo) => sum + repo.stars, 0);
  const totalForks = repos.reduce((sum, repo) => sum + repo.forks, 0);

  const categoryMap = new Map<RepoCategory, GitHubRepo[]>();

  for (const repo of repos) {
    const category = categorizeRepo(repo);
    if (!categoryMap.has(category)) {
      categoryMap.set(category, []);
    }
    categoryMap.get(category)!.push(repo);
  }

  for (const categoryRepos of categoryMap.values()) {
    categoryRepos.sort((a, b) => b.stars - a.stars);
  }

  const categorizedRepos: CategorizedRepos[] = CATEGORY_DISPLAY_ORDER.filter((cat) =>
    categoryMap.has(cat)
  ).map((category) => ({
    category,
    repos: categoryMap.get(category)!
  }));

  // Build categorizedProjects that includes GitHub repos + HF + Kaggle
  const projectCategoryMap = new Map<RepoCategory, Project[]>();

  // Add GitHub repos as projects
  for (const repo of repos) {
    const category = categorizeRepo(repo);
    if (!projectCategoryMap.has(category)) {
      projectCategoryMap.set(category, []);
    }
    projectCategoryMap.get(category)!.push({
      name: repo.name,
      url: repo.url,
      type: 'github',
      stars: repo.stars,
      forks: repo.forks,
      language: repo.language,
      description: repo.description,
      isFork: repo.isFork
    });
  }

  // Add HuggingFace model to AI/ML category
  if (hfStats) {
    if (!projectCategoryMap.has('AI/ML')) {
      projectCategoryMap.set('AI/ML', []);
    }
    projectCategoryMap.get('AI/ML')!.push({
      name: 'HybridTransformer-MFIF',
      url: 'https://huggingface.co/divitmittal/HybridTransformer-MFIF',
      type: 'huggingface',
      downloads: hfStats.downloads,
      likes: hfStats.likes
    });
  }

  // Add HuggingFace Spaces to AI/ML category
  if (hfSpaces.length > 0) {
    if (!projectCategoryMap.has('AI/ML')) {
      projectCategoryMap.set('AI/ML', []);
    }
    hfSpaces.forEach((space) => {
      projectCategoryMap.get('AI/ML')!.push({
        name: space.name,
        url: space.url,
        type: 'space',
        likes: space.likes
      });
    });
  }

  // Add Kaggle datasets to AI/ML category
  if (kaggleStats && kaggleStats.datasets.length > 0) {
    if (!projectCategoryMap.has('AI/ML')) {
      projectCategoryMap.set('AI/ML', []);
    }
    kaggleStats.datasets.forEach((ds) => {
      projectCategoryMap.get('AI/ML')!.push({
        name: ds.title,
        url: ds.url,
        type: 'kaggle',
        downloads: ds.downloads,
        views: ds.views
      });
    });
  }

  // Sort projects within each category
  for (const projects of projectCategoryMap.values()) {
    projects.sort((a, b) => {
      const aMetric = a.stars || a.downloads || a.views || 0;
      const bMetric = b.stars || b.downloads || b.views || 0;
      return bMetric - aMetric;
    });
  }

  const categorizedProjects: CategorizedProjects[] = CATEGORY_DISPLAY_ORDER.filter((cat) =>
    projectCategoryMap.has(cat)
  ).map((category) => ({
    category,
    projects: projectCategoryMap.get(category)!
  }));

  const metrics: Metrics = {
    totalStars,
    totalForks,
    totalRepos: repos.length,
    followers,
    categorizedRepos,
    categorizedProjects,
    huggingfaceStats: hfStats || undefined,
    huggingfaceSpaces: hfSpaces.length > 0 ? hfSpaces : undefined,
    kaggleStats: kaggleStats || undefined,
    lastUpdated: new Date()
  };

  setCachedMetrics(metrics);

  return metrics;
}
