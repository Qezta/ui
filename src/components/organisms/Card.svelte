<script lang="ts">
  import Image from '../atoms/Image.svelte';
  import Title from '../atoms/Title.svelte';
  import About from '../molecules/About.svelte';
  import Socials from '../molecules/Socials.svelte';
  import Metrics from './Metrics.svelte';
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

<SourceLink />

<style lang="scss">
  // Layout is driven by viewport width, not pointer type: a portrait tablet or
  // a vertical monitor needs the same single-column card as a narrow window.
  //   > 1550px  two-column card that fits the screen (scrolls internally)
  //   <= 1550px single column, readable width, page scrolls
  //   <= 600px  full-bleed sheet
  #card {
    display: flex;
    flex-direction: row;
    gap: 1rem;
    box-sizing: border-box;
    max-width: 1450px;
    padding: 25px;
    border-radius: 15px;
    background: #131313eb;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);

    @media (max-width: 1800px) {
      max-width: 1300px;
    }
  }

  #card-container {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    min-width: 0; // Prevent flex overflow
  }

  #molecules {
    display: flex;
    flex-direction: row;
    gap: 2rem;

    > :global(*) {
      flex: 1 1 0;
      min-width: 0;
    }
  }

  #image {
    transition: margin 1s ease;
    margin: -140px 20px 0 -140px;
  }

  @media (min-width: 1551px) {
    #card {
      max-height: 85vh;
      overflow-y: auto;
    }
  }

  @media (max-width: 1550px) {
    #card,
    #molecules {
      flex-direction: column;
    }

    #card {
      // `min-content` here collapsed the card to the image width (~200px)
      // on portrait screens; a capped fluid width keeps text readable.
      width: min(100%, 46rem);
      // The card sits inside SvelteKit's wrapper div, not directly in the
      // flex body, so it has to centre itself.
      margin-inline: auto;
    }

    #image {
      margin: 0;
    }
  }

  @media (max-width: 600px) {
    #card {
      width: 100%;
      padding: 20px 16px;
      border-radius: 0;
      background: #1a1a1af5;
      box-shadow: none;
    }
  }
</style>
