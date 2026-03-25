<script lang="ts">
  import { onMount } from 'svelte';
  import { slide } from 'svelte/transition';
  import {
    fetchMetrics,
    type Metrics as MetricsData,
    type RepoCategory,
    type Project
  } from '../../lib/utils/api';
  import { faChartLine } from '@fortawesome/free-solid-svg-icons';
  import SectionHeader from '../atoms/SectionHeader.svelte';
  import type { ActionReturn } from 'svelte/action';

  let metrics: MetricsData | null = null;
  let loading = true;
  let error = false;
  let expandedCategory: RepoCategory | null = null;

  function animateCounter(node: HTMLElement, target: number): ActionReturn {
    const duration = 1000;
    const startTime = Date.now();

    function update() {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      const current = Math.floor(target * eased);
      node.textContent = current.toString();

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        node.textContent = target.toString();
      }
    }

    update();
    return {};
  }

  onMount(async () => {
    try {
      metrics = await fetchMetrics();
      loading = false;
    } catch (err) {
      console.error('Failed to fetch metrics:', err);
      error = true;
      loading = false;
    }
  });

  function formatDate(date: Date): string {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 1000 / 60);
    const hours = Math.floor(minutes / 60);

    if (minutes < 1) return 'just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return date.toLocaleDateString();
  }

  function toggleCategory(category: RepoCategory) {
    expandedCategory = expandedCategory === category ? null : category;
  }

  function getCategoryIcon(category: RepoCategory): string {
    const icons: Record<RepoCategory, string> = {
      'AI/ML': '◈',
      'System Config': '⚙',
      DevTools: '⊞',
      'Editor Configs': '⌘',
      'Web & Apps': '◎',
      'Audio & DSP': '♪',
      'Forks & Contributions': '⑂',
      Other: '◇'
    };
    return icons[category];
  }

  function getProjectMetric(project: Project): { label: string; value: number } {
    if (project.type === 'github') {
      return { label: '★', value: project.stars || 0 };
    } else if (project.type === 'huggingface') {
      return { label: '⬇', value: project.downloads || 0 };
    } else if (project.type === 'space') {
      return { label: '♥', value: project.likes || 0 };
    } else if (project.type === 'kaggle') {
      return { label: '⬇', value: project.downloads || 0 };
    }
    return { label: '', value: 0 };
  }
</script>

<section class="metrics-section">
  <SectionHeader text="Live Metrics" icon={faChartLine} />

  {#if loading}
    <div class="loading">
      <div class="spinner"></div>
      <p>Loading metrics...</p>
    </div>
  {:else if error}
    <div class="error-message">
      <p>⚠️ Failed to load metrics. Using cached data or try again later.</p>
    </div>
  {:else if metrics}
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon">★</div>
        <div class="stat-value" use:animateCounter={metrics.totalStars}>{metrics.totalStars}</div>
        <div class="stat-label">Total Stars</div>
      </div>

      <div class="stat-card">
        <div class="stat-icon">◉</div>
        <div class="stat-value" use:animateCounter={metrics.followers}>{metrics.followers}</div>
        <div class="stat-label">Followers</div>
      </div>

      <div class="stat-card">
        <div class="stat-icon">◫</div>
        <div class="stat-value" use:animateCounter={metrics.totalRepos}>{metrics.totalRepos}</div>
        <div class="stat-label">Public Repos</div>
      </div>

      {#if metrics.huggingfaceStats}
        <div class="stat-card">
          <div class="stat-icon">◕</div>
          <div class="stat-value" use:animateCounter={metrics.huggingfaceStats.downloads}>
            {metrics.huggingfaceStats.downloads}
          </div>
          <div class="stat-label">HF Downloads</div>
        </div>
      {/if}

      {#if metrics.kaggleStats}
        <div class="stat-card">
          <div class="stat-icon">▦</div>
          <div class="stat-value" use:animateCounter={metrics.kaggleStats.totalViews}>
            {metrics.kaggleStats.totalViews}
          </div>
          <div class="stat-label">Kaggle Views</div>
        </div>
      {/if}
    </div>

    <div class="categories">
      {#each metrics.categorizedProjects as { category, projects }}
        <button
          class="category-button"
          class:expanded={expandedCategory === category}
          on:click={() => toggleCategory(category)}
        >
          <span class="category-icon">{getCategoryIcon(category)}</span>
          <span class="category-name">{category}</span>
          <span class="category-count">{projects.length}</span>
          <span class="category-arrow">{expandedCategory === category ? '▼' : '▶'}</span>
        </button>

        {#if expandedCategory === category}
          <div class="category-repos" transition:slide>
            {#each projects as project}
              <a href={project.url} target="_blank" rel="noopener noreferrer" class="repo-item">
                <div class="repo-info">
                  <div class="repo-name">{project.name}</div>
                  {#if project.type === 'github' && project.language}
                    <span class="repo-lang">{project.language}</span>
                  {:else if project.type === 'huggingface'}
                    <span class="repo-lang">🤗 Model</span>
                  {:else if project.type === 'space'}
                    <span class="repo-lang">🤗 Space</span>
                  {:else if project.type === 'kaggle'}
                    <span class="repo-lang">📊 Dataset</span>
                  {/if}
                  {#if project.type === 'huggingface' && project.likes !== undefined}
                    <span class="repo-lang">♥ {project.likes}</span>
                  {/if}
                  {#if project.type === 'kaggle' && project.views !== undefined}
                    <span class="repo-lang">👁 {project.views}</span>
                  {/if}
                </div>
                <div class="repo-stats">
                  {#if getProjectMetric(project).value > 0}
                    <span class="repo-stars"
                      >{getProjectMetric(project).label}
                      {getProjectMetric(project).value}</span
                    >
                  {/if}
                </div>
              </a>
            {/each}
          </div>
        {/if}
      {/each}
    </div>

    <div class="last-updated">
      Last updated: {formatDate(metrics.lastUpdated)}
    </div>
  {/if}
</section>

<style lang="scss">
  .metrics-section {
    min-width: 0;
  }

  .loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.75rem;
    padding: 1.5rem;
    color: #888;
    margin-top: 0.5rem;
  }

  .spinner {
    width: 30px;
    height: 30px;
    border: 3px solid rgba(102, 126, 234, 0.3);
    border-top-color: #667eea;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  .error-message {
    padding: 0.75rem;
    background: rgba(255, 107, 107, 0.1);
    border: 1px solid rgba(255, 107, 107, 0.3);
    border-radius: 8px;
    color: #ff6b6b;
    font-size: 0.85rem;
    margin-top: 0.5rem;
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(90px, 1fr));
    gap: 0.6rem;
    margin-top: 0.5rem;
    margin-bottom: 0.75rem;

    @media (max-width: 505px) {
      grid-template-columns: repeat(3, 1fr);
      gap: 0.5rem;
    }
  }

  .stat-card {
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 10px;
    padding: 0.6rem;
    text-align: center;
    transition: all 0.3s ease;

    &:hover {
      background: rgba(255, 255, 255, 0.05);
      border-color: rgba(102, 126, 234, 0.5);
      transform: translateY(-2px);
    }
  }

  .stat-icon {
    font-size: 1.1rem;
    margin-bottom: 0.3rem;
  }

  .stat-value {
    font-size: 1.4rem;
    font-weight: 700;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-bottom: 0.15rem;
  }

  .stat-label {
    font-size: 0.6rem;
    color: #888;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .categories {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
  }

  .category-button {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    width: 100%;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 6px;
    padding: 0.6rem 0.75rem;
    color: #e0e0e0;
    font-size: 0.85rem;
    cursor: pointer;
    transition: all 0.3s ease;
    text-align: left;

    &:hover {
      background: rgba(102, 126, 234, 0.1);
      border-color: rgba(102, 126, 234, 0.3);
    }

    &.expanded {
      background: rgba(102, 126, 234, 0.15);
      border-color: rgba(102, 126, 234, 0.4);
    }
  }

  .category-icon {
    font-size: 1rem;
  }

  .category-name {
    flex: 1;
    font-weight: 500;
  }

  .category-count {
    background: rgba(102, 126, 234, 0.2);
    padding: 0.15rem 0.4rem;
    border-radius: 10px;
    font-size: 0.7rem;
    color: #667eea;
  }

  .category-arrow {
    font-size: 0.7rem;
    color: #666;
  }

  .category-repos {
    background: rgba(255, 255, 255, 0.02);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 6px;
    padding: 0.5rem;
    margin-top: -0.2rem;
    margin-bottom: 0.2rem;
    max-height: 280px;
    overflow-y: auto;
    scrollbar-width: thin;
    scrollbar-color: rgba(102, 126, 234, 0.3) transparent;

    &::-webkit-scrollbar {
      width: 4px;
    }

    &::-webkit-scrollbar-track {
      background: transparent;
    }

    &::-webkit-scrollbar-thumb {
      background: rgba(102, 126, 234, 0.3);
      border-radius: 2px;

      &:hover {
        background: rgba(102, 126, 234, 0.5);
      }
    }
  }

  .repo-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem;
    margin-bottom: 0.3rem;
    background: rgba(255, 255, 255, 0.03);
    border-radius: 4px;
    text-decoration: none;
    color: inherit;
    transition: all 0.3s ease;

    &:hover {
      background: rgba(102, 126, 234, 0.1);
      transform: translateX(4px);
    }

    &:last-child {
      margin-bottom: 0;
    }
  }

  .repo-info {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    min-width: 0;
    flex: 1;
  }

  .repo-name {
    font-size: 0.8rem;
    font-weight: 500;
    color: #e0e0e0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .repo-lang {
    font-size: 0.65rem;
    color: #888;
    background: rgba(255, 255, 255, 0.05);
    padding: 0.1rem 0.35rem;
    border-radius: 3px;
    flex-shrink: 0;
  }

  .repo-stats {
    font-size: 0.7rem;
    color: #888;
    flex-shrink: 0;
  }

  .last-updated {
    margin-top: 0.75rem;
    font-size: 0.7rem;
    color: #666;
    text-align: center;
  }

  @media (max-width: 505px) {
    .stat-card {
      padding: 0.5rem;
    }

    .stat-icon {
      font-size: 1rem;
      margin-bottom: 0.2rem;
    }

    .stat-value {
      font-size: 1.2rem;
    }

    .stat-label {
      font-size: 0.55rem;
    }

    .category-button {
      padding: 0.5rem 0.6rem;
      font-size: 0.8rem;
    }

    .repo-item {
      padding: 0.4rem;
    }

    .repo-name {
      font-size: 0.75rem;
    }
  }
</style>
