<script lang="ts">
  import { faAddressCard } from '@fortawesome/free-solid-svg-icons';
  import SectionHeader from '../atoms/SectionHeader.svelte';
</script>

<section>
  <SectionHeader text="About me" icon={faAddressCard} />
  <p>
    Infrastructure engineer & functional programming enthusiast with a data science background. I
    build reproducible systems, tinker with declarative configurations, and occasionally dive into
    computer vision research. Mathematics keeps me grounded.
  </p>
  <p class="terminal-hint">
    Type <code>resume</code> in the terminal to view my CV
  </p>
</section>

<style lang="scss">
  section {
    min-width: 0;
  }

  p {
    text-align: justify;
    line-height: 1.6;
    max-width: 100%;
    overflow-wrap: break-word;
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;

    &:last-of-type {
      margin-bottom: 0;
    }
  }

  .terminal-hint {
    margin-top: 0.75rem;
    font-size: 0.9rem;
    color: #aaa;

    code {
      background: rgba(102, 126, 234, 0.2);
      color: #667eea;
      padding: 0.15rem 0.4rem;
      border-radius: 4px;
      font-family: 'JetBrains Mono', 'Fira Code', 'Courier New', monospace;
      font-size: 0.85em;
      font-weight: 600;
    }
  }

  @media (max-width: 505px) {
    p {
      text-align: left;
      font-size: 0.95rem;
    }
  }
</style>
