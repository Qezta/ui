<script lang="ts">
  import { faGithub } from '@fortawesome/free-brands-svg-icons';
  import Fa from 'svelte-fa';

  export let repo = 'https://github.com/Qezta/qezta-website/';
</script>

<a
  href={repo}
  target="_blank"
  rel="noopener noreferrer"
  class="source-link"
  aria-label="View source on GitHub"
>
  <Fa icon={faGithub} />
  <span class="text">Source</span>
</a>

<style lang="scss">
  .source-link {
    position: fixed;
    bottom: 2rem;
    left: 2rem;
    z-index: 999;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.6rem 1rem;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 50px;
    color: #e0e0e0;
    text-decoration: none;
    font-size: 0.85rem;
    font-weight: 500;
    backdrop-filter: blur(10px);
    transition: all 0.3s ease;

    &:hover {
      background: rgba(255, 255, 255, 0.1);
      border-color: rgba(255, 255, 255, 0.3);
      color: #fff;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    }

    :global(svg) {
      font-size: 1.1rem;
    }

    .text {
      @media (max-width: 768px) {
        display: none;
      }
    }

    @media (max-width: 505px) {
      bottom: 1.5rem;
      left: 1.5rem;
      padding: 0.5rem;
      border-radius: 50%;

      :global(svg) {
        font-size: 1.2rem;
      }
    }
  }
</style>
