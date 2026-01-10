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
  <p class="cv-link">
    <a
      href="https://europa.eu/europass/eportfolio/screen/share/33683761-9b95-4b23-8184-fa65f7a14e06?lang=en"
      target="_blank"
      rel="noopener noreferrer">Curriculum Vitae</a
    >
  </p>
</section>

<style lang="scss">
  section {
    min-width: 0;
  }

  a {
    white-space: nowrap;
    word-break: keep-all;
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

  .cv-link {
    margin-top: 0.75rem;
  }

  @media (max-width: 505px) {
    p {
      text-align: left;
      font-size: 0.95rem;
    }

    a {
      display: inline-block;
    }
  }
</style>
