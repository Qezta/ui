<script lang="ts">
  import Image from '../atoms/Image.svelte';
  import Title from '../atoms/Title.svelte';
  import About from '../molecules/About.svelte';
  import Socials from '../molecules/Socials.svelte';
  import Metrics from './Metrics.svelte';
  import Terminal from './Terminal.svelte';
  import SourceLink from '../atoms/SourceLink.svelte';
</script>

<div id="card">
  <div id="image">
    <Image />
  </div>
  <div id="card-container">
    <Title />
    <div id="molecules">
      <Socials />
      <About />
      <Metrics />
    </div>
  </div>
</div>

<Terminal />
<SourceLink />

<style lang="scss">
  #card {
    gap: 1rem;
    display: flex;
    flex-direction: row;
  }

  #molecules {
    gap: 2rem;
    display: flex;
    flex-direction: row;

    > :global(*) {
      flex: 1 1 0;
      min-width: 0;
    }
  }

  #card-container {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    min-width: 0; // Prevent flex overflow
  }

  #image {
    transition: margin 1s ease;
    margin-left: -100px;
    margin-top: -100px;
    margin-right: 20px;
  }

  #card {
    border-radius: 15px;
    padding: 25px;
    max-width: 1450px;
    background: #131313eb;
    box-sizing: border-box;

    // Full HD
    @media (max-width: 1800px) {
      max-width: 1300px;
    }

    // Tablet
    @media (max-width: 768px) {
      padding: 20px;
    }

    // Mobile
    @media (max-width: 505px) {
      border-radius: 0;
      width: initial !important;
      padding: 20px 15px;
      gap: 1rem;
    }

    // Mobile
    @media (min-width: 506px) {
      max-height: 85vh; // Prevents overflow when screen height is too small.
    }
  }

  #molecules {
    @media (max-width: 505px) {
      gap: 2rem;
    }
  }

  // Less then Full HD
  @media (max-width: 1550px) {
    #image {
      margin: 0;
    }

    #card {
      overflow: auto; // Allows scrolling when screen height is too small.
      width: min-content;
    }

    #molecules,
    #card {
      flex-direction: column;
    }

    #molecules {
      gap: 2rem;
    }
  }
</style>
