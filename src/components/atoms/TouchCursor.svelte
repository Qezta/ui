<script lang="ts">
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';
  import { burst } from '../../cursor';

  let touchX = -100;
  let touchY = -100;
  let isVisible = false;
  let fadeTimeout: ReturnType<typeof setTimeout>;
  let burstInterval: ReturnType<typeof setInterval>;

  onMount(() => {
    if (!browser || window.innerWidth > 500) return;

    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      if (!touch) return;

      touchX = touch.clientX;
      touchY = touch.clientY;
      isVisible = true;

      // Trigger burst effect (same as desktop)
      if ($burst < 1) burst.increment();

      clearInterval(burstInterval);
      burstInterval = setInterval(() => {
        burst.decrement();
        if ($burst < 0) {
          clearInterval(burstInterval);
          burst.reset();
        }
      }, 100);

      clearTimeout(fadeTimeout);
    };

    const handleTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0];
      if (!touch) return;

      touchX = touch.clientX;
      touchY = touch.clientY;
      isVisible = true;
    };

    const handleTouchEnd = () => {
      clearTimeout(fadeTimeout);
      fadeTimeout = setTimeout(() => {
        isVisible = false;
      }, 300);
    };

    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      clearTimeout(fadeTimeout);
      clearInterval(burstInterval);
    };
  });
</script>

<div
  class="touch-cursor"
  class:visible={isVisible}
  style="
    transform: scale({1 + $burst});
    left: {touchX - 20}px;
    top: {touchY - 20}px;
    box-shadow: 0px 0px {$burst * 50}px var(--white);
  "
/>

<style lang="scss">
  .touch-cursor {
    display: none;
    pointer-events: none;
    height: 40px;
    width: 40px;
    background-color: rgb(255, 255, 255);
    mix-blend-mode: difference;
    border-radius: 100%;
    position: fixed;
    z-index: 1;
    opacity: 0;
    transition:
      opacity 0.2s ease,
      transform 0.3s cubic-bezier(0, 0.68, 0.43, 1.02);

    @media (max-width: 500px) {
      display: block;
    }

    &.visible {
      opacity: 1;
    }
  }
</style>
