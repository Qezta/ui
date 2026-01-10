<script lang="ts">
  import { onMount } from 'svelte';
  import { slide } from 'svelte/transition';
  import { fetchMetrics, type Metrics as MetricsData } from '../../lib/utils/api';
  import { faChartLine } from '@fortawesome/free-solid-svg-icons';
  import SectionHeader from '../atoms/SectionHeader.svelte';

  let metrics: MetricsData | null = null;
  let loading = true;
  let error = false;
  let isExpanded = false;

  // Animated counter
  function animateCounter(target: number, duration: number = 1000): (node: HTMLElement) => void {
    return (node: HTMLElement) => {
      let start = 0;
      const startTime = Date.now();

      function update() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Easing function (easeOutQuart)
        const eased = 1 - Math.pow(1 - progress, 4);

        const current = Math.floor(start + (target - start) * eased);
        node.textContent = current.toString();

        if (progress < 1) {
          requestAnimationFrame(update);
        } else {
          node.textContent = target.toString();
        }
      }

      update();
    };
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

  function toggleExpanded() {
    isExpanded = !isExpanded;
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
    <!-- Quick Stats -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon">⭐</div>
        <div class="stat-value" use:animateCounter={metrics.totalStars}>{metrics.totalStars}</div>
        <div class="stat-label">Total Stars</div>
      </div>

      <div class="stat-card">
        <div class="stat-icon">🔱</div>
        <div class="stat-value" use:animateCounter={metrics.totalForks}>{metrics.totalForks}</div>
        <div class="stat-label">Total Forks</div>
      </div>

      <div class="stat-card">
        <div class="stat-icon">📦</div>
        <div class="stat-value" use:animateCounter={metrics.totalRepos}>{metrics.totalRepos}</div>
        <div class="stat-label">Public Repos</div>
      </div>

      {#if metrics.huggingfaceStats}
        <div class="stat-card">
          <div class="stat-icon">🤗</div>
          <div class="stat-value" use:animateCounter={metrics.huggingfaceStats.downloads}>
            {metrics.huggingfaceStats.downloads}
          </div>
          <div class="stat-label">HF Downloads</div>
        </div>
      {/if}
    </div>

    <!-- Expandable Section -->
    <button class="expand-button" on:click={toggleExpanded}>
      {isExpanded ? '▼ Hide Details' : '▶ Show Top Projects'}
    </button>

    {#if isExpanded}
      <div class="featured-repos" transition:slide>
        <h4>Top Projects by Stars</h4>
        {#each metrics.featuredRepos as repo}
          <a href={repo.url} target="_blank" rel="noopener noreferrer" class="repo-item">
            <div class="repo-name">{repo.name}</div>
            <div class="repo-stats">
              <span class="repo-stars">⭐ {repo.stars}</span>
              <span class="repo-forks">🔱 {repo.forks}</span>
            </div>
          </a>
        {/each}
      </div>
    {/if}

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
    grid-template-columns: repeat(auto-fit, minmax(110px, 1fr));
    gap: 0.75rem;
    margin-top: 0.5rem;
    margin-bottom: 0.75rem;

    @media (max-width: 505px) {
      grid-template-columns: repeat(2, 1fr);
      gap: 0.6rem;
    }
  }

  .stat-card {
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 10px;
    padding: 0.75rem;
    text-align: center;
    transition: all 0.3s ease;

    &:hover {
      background: rgba(255, 255, 255, 0.05);
      border-color: rgba(102, 126, 234, 0.5);
      transform: translateY(-2px);
    }
  }

  .stat-icon {
    font-size: 1.3rem;
    margin-bottom: 0.4rem;
  }

  .stat-value {
    font-size: 1.6rem;
    font-weight: 700;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-bottom: 0.2rem;
  }

  .stat-label {
    font-size: 0.7rem;
    color: #888;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .expand-button {
    width: 100%;
    background: rgba(102, 126, 234, 0.1);
    border: 1px solid rgba(102, 126, 234, 0.3);
    border-radius: 6px;
    padding: 0.6rem;
    color: #667eea;
    font-size: 0.8rem;
    cursor: pointer;
    transition: all 0.3s ease;
    margin-top: 0.25rem;

    &:hover {
      background: rgba(102, 126, 234, 0.2);
      border-color: rgba(102, 126, 234, 0.5);
    }
  }

  .featured-repos {
    margin-top: 0.75rem;
    background: rgba(255, 255, 255, 0.02);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 6px;
    padding: 0.75rem;

    h4 {
      font-size: 0.8rem;
      color: #888;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin: 0 0 0.6rem 0;
    }
  }

  .repo-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.6rem;
    margin-bottom: 0.4rem;
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

  .repo-name {
    font-size: 0.85rem;
    font-weight: 500;
    color: #e0e0e0;
  }

  .repo-stats {
    display: flex;
    gap: 0.75rem;
    font-size: 0.75rem;
    color: #888;
  }

  .last-updated {
    margin-top: 0.75rem;
    font-size: 0.7rem;
    color: #666;
    text-align: center;
  }

  @media (max-width: 505px) {
    .stat-card {
      padding: 0.6rem;
    }

    .stat-icon {
      font-size: 1.2rem;
      margin-bottom: 0.3rem;
    }

    .stat-value {
      font-size: 1.4rem;
    }

    .stat-label {
      font-size: 0.65rem;
    }

    .repo-stats {
      flex-direction: column;
      gap: 0.2rem;
      align-items: flex-end;
    }

    .featured-repos {
      padding: 0.6rem;
    }

    .repo-item {
      padding: 0.5rem;
    }
  }
</style>
