<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { browser } from '$app/environment';

  let cardElement: HTMLElement | null = null;
  let isMobile = false;
  let hasGyro = false;

  function handleOrientation(event: DeviceOrientationEvent) {
    if (!cardElement || !hasGyro) return;

    const beta = event.beta ?? 0; // Front-to-back tilt (-180 to 180)
    const gamma = event.gamma ?? 0; // Left-to-right tilt (-90 to 90)

    // Normalize values for subtle effect
    const tiltX = (gamma / 90) * 5; // Max 5deg tilt
    const tiltY = (beta / 180) * 5;

    // Apply 3D transform
    cardElement.style.transform = `perspective(1000px) rotateX(${-tiltY}deg) rotateY(${tiltX}deg)`;

    // Optional: Add parallax effect to background
    const bgElements = document.querySelectorAll('.mobile-background, .touch-particles');
    bgElements.forEach((el) => {
      if (el instanceof HTMLElement) {
        el.style.transform = `translate(${tiltX * 2}px, ${tiltY * 2}px)`;
      }
    });
  }

  function handleMotion(event: DeviceMotionEvent) {
    if (!hasGyro) return;

    const acc = event.accelerationIncludingGravity;
    if (!acc || !acc.x || !acc.y) return;

    // Detect shake gesture for fun easter egg
    const threshold = 15;
    if (Math.abs(acc.x) > threshold || Math.abs(acc.y) > threshold) {
      triggerShakeEffect();
    }
  }

  let shakeTimeout: ReturnType<typeof setTimeout>;
  function triggerShakeEffect() {
    // Prevent multiple rapid triggers
    if (document.body.classList.contains('shake-effect')) return;

    document.body.classList.add('shake-effect');

    // Add particles burst at random positions
    const event = new CustomEvent('shake-burst');
    window.dispatchEvent(event);

    // Haptic feedback
    if ('vibrate' in navigator) {
      navigator.vibrate([50, 100, 50, 100, 50]);
    }

    clearTimeout(shakeTimeout);
    shakeTimeout = setTimeout(() => {
      document.body.classList.remove('shake-effect');
    }, 500);
  }

  async function requestPermission() {
    if (
      typeof DeviceOrientationEvent !== 'undefined' &&
      typeof (DeviceOrientationEvent as any).requestPermission === 'function'
    ) {
      try {
        const permission = await (DeviceOrientationEvent as any).requestPermission();
        if (permission === 'granted') {
          hasGyro = true;
          initGyro();
        }
      } catch (error) {
        console.warn('Device orientation permission denied');
      }
    } else {
      // Non-iOS devices or older browsers
      hasGyro = true;
      initGyro();
    }
  }

  function initGyro() {
    window.addEventListener('deviceorientation', handleOrientation, { passive: true });
    window.addEventListener('devicemotion', handleMotion, { passive: true });
  }

  onMount(() => {
    if (typeof window === 'undefined') return;

    isMobile = window.innerWidth <= 500;
    if (!isMobile) return;

    cardElement = document.querySelector('#card');

    // Request permission on user interaction
    document.addEventListener(
      'touchstart',
      () => {
        requestPermission();
      },
      { once: true }
    );
  });

  onDestroy(() => {
    if (!browser) return;

    window.removeEventListener('deviceorientation', handleOrientation);
    window.removeEventListener('devicemotion', handleMotion);
    if (cardElement) {
      cardElement.style.transform = '';
    }
  });
</script>

<svelte:head>
  {#if browser && isMobile}
    <style>
      /* Smooth transitions for gyro movement */
      #card {
        transition: transform 0.1s ease-out;
        transform-style: preserve-3d;
      }

      /* Shake effect animation */
      body.shake-effect {
        animation: shake-animation 0.5s ease-in-out;
      }

      @keyframes shake-animation {
        0%,
        100% {
          transform: translateX(0);
        }
        10%,
        30%,
        50%,
        70%,
        90% {
          transform: translateX(-5px) rotate(-0.5deg);
        }
        20%,
        40%,
        60%,
        80% {
          transform: translateX(5px) rotate(0.5deg);
        }
      }

      /* Add depth to elements with gyro */
      body.mobile-enhanced #card > * {
        transform: translateZ(10px);
      }

      body.mobile-enhanced #image {
        transform: translateZ(30px);
      }

      /* Parallax layers */
      .mobile-background {
        transition: transform 0.2s ease-out;
      }

      .touch-particles {
        transition: transform 0.15s ease-out;
      }

      /* Add subtle glow when tilting */
      #card::before {
        content: '';
        position: absolute;
        top: -2px;
        left: -2px;
        right: -2px;
        bottom: -2px;
        background: linear-gradient(
          135deg,
          rgba(255, 0, 82, 0.2),
          rgba(102, 126, 234, 0.2),
          rgba(118, 75, 162, 0.2)
        );
        border-radius: inherit;
        opacity: 0;
        transition: opacity 0.3s ease;
        pointer-events: none;
        z-index: -1;
      }

      body.mobile-enhanced #card:active::before {
        opacity: 1;
      }
    </style>
  {/if}
</svelte:head>
