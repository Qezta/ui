<script lang="ts">
  import { scale } from '../../cursor';

  export let src = '/pp_ascii.svg';
  export let alt = "Divit Mittal's profile picture";
  export let width = '220';
  export let height = '220';
</script>

<!-- svelte-ignore a11y-mouse-events-have-key-events -->
<img
  {src}
  {alt}
  {width}
  {height}
  on:mouseover={() => scale.set(1.2)}
  on:mouseleave={() => scale.set(0)}
  style="border-radius: {$$props.borderRadius || '8px'}"
/>

<style lang="scss">
  img {
    cursor: pointer;
    display: block;
    max-width: 100%;
    height: auto;
    transition: 0.3s filter ease;
    border-radius: 8px;
    &:hover {
      filter: brightness(1.3);
    }
  }
</style>
