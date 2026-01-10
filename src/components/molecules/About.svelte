<script lang="ts">
  import { faAddressCard } from '@fortawesome/free-solid-svg-icons';
  import SectionHeader from '../atoms/SectionHeader.svelte';
</script>

<section>
  <SectionHeader text="About me" icon={faAddressCard} />
  <p>
    A 23-year-old data science student<br />
    My
    <a
      href="https://europa.eu/europass/eportfolio/screen/share/33683761-9b95-4b23-8184-fa65f7a14e06?lang=en"
      >Curriculum Vitae</a
    >
  </p>
</section>

<style lang="scss">
  section {
    min-width: 0; // Prevent flex overflow
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
    margin-bottom: 0;
  }

  // Mobile optimization
  @media (max-width: 505px) {
    p {
      text-align: left;
      font-size: 0.95rem;
    }

    a {
      display: inline-block;
      margin-top: 0.5rem;
    }
  }
</style>
