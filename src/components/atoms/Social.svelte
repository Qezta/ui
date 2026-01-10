<script lang="ts">
  import Fa from 'svelte-fa';
  import type { IconDefinition } from '@fortawesome/free-brands-svg-icons';

  export let faIcon: IconDefinition | undefined = undefined;
  export let anchor: string;
  export let link: string;
  export let overrideText: string | boolean = false;
  export let badge: string | undefined = undefined;
</script>

<li id={anchor} class="social">
  <div class="icon">
    {#if faIcon}
      <Fa icon={faIcon} />
    {:else}
      <slot name="icon" />
    {/if}
  </div>
  <div class="link-container">
    <a href={link} target="_blank" rel="noopener noreferrer">
      {overrideText ? overrideText : '#' + anchor}
    </a>
    {#if badge}
      <span class="badge">{badge}</span>
    {/if}
  </div>
</li>

<style lang="scss">
  .social {
    display: flex;
    gap: 0.5rem;
    align-items: center;
    min-height: 2rem;
    padding: 0.2rem 0;

    a {
      word-break: break-word;
      transition: color 0.2s ease;
    }

    a:hover {
      color: var(--white);
    }
  }

  .icon {
    text-align: center;
    width: 1.5rem;
    min-width: 1.5rem; // Prevent icon shrinking
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .link-container {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex-wrap: wrap;
    min-width: 0; // Allow flex shrinking
  }

  .badge {
    font-size: 0.7rem;
    padding: 0.15rem 0.4rem;
    border-radius: 4px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    font-weight: 500;
    white-space: nowrap;
  }

  // Mobile optimization
  @media (max-width: 505px) {
    .social {
      min-height: 2.5rem; // Larger touch targets on mobile
      padding: 0.3rem 0;
    }

    .badge {
      font-size: 0.65rem;
      padding: 0.2rem 0.5rem;
    }
  }

  :target {
    color: #ff0052;
    animation-name: pulse;
    animation-duration: 1s;
    animation-fill-mode: forwards;
    animation-iteration-count: infinite;
    border-radius: 8px;
  }
</style>
