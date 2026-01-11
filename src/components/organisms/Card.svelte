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
    margin-left: -140px;
    margin-top: -140px;
    margin-right: 20px;
  }

  #card {
    border-radius: 15px;
    padding: 25px;
    max-width: 1450px;
    background: #131313eb;
    box-sizing: border-box;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);

    // Full HD
    @media (max-width: 1800px) {
      max-width: 1300px;
    }

    // Tablet
    @media (max-width: 768px) {
      padding: 20px;
    }

    // Mobile - Increase visibility (using pointer type for reliable detection)
    @media (pointer: coarse), (max-width: 505px) and (pointer: none) {
      border-radius: 0;
      width: initial !important;
      padding: 20px 15px;
      gap: 1rem;
      background: #1a1a1af5; // More opaque background
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.6); // Stronger shadow
    }

    // Mobile
    @media (min-width: 506px) {
      max-height: 85vh; // Prevents overflow when screen height is too small.
    }
  }

  #molecules {
    @media (pointer: coarse), (max-width: 505px) and (pointer: none) {
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
