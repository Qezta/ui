<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { browser } from '$app/environment';

  let audioContext: AudioContext | null = null;
  let clickBuffer: AudioBuffer | null = null;
  let isMobile = false;

  // Enhanced audio with Web Audio API for mobile
  async function setupAudio() {
    if (!isMobile) return;

    try {
      audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();

      // Load click sound
      const response = await fetch('/sounds/click.mp3');
      const arrayBuffer = await response.arrayBuffer();
      clickBuffer = await audioContext.decodeAudioData(arrayBuffer);
    } catch (error) {
      console.warn('Audio setup failed:', error);
    }
  }

  function playTouchSound(x: number, y: number) {
    if (!audioContext || !clickBuffer) return;

    const source = audioContext.createBufferSource();
    const gainNode = audioContext.createGain();
    const panNode = audioContext.createStereoPanner();

    source.buffer = clickBuffer;

    // Vary playback rate based on Y position
    const normalizedY = y / window.innerHeight;
    source.playbackRate.value = 0.8 + normalizedY * 0.6; // 0.8 to 1.4

    // Pan based on X position
    const normalizedX = (x / window.innerWidth) * 2 - 1; // -1 to 1
    panNode.pan.value = normalizedX * 0.5; // -0.5 to 0.5 for subtle effect

    // Volume with slight randomization
    gainNode.gain.value = 0.3 + Math.random() * 0.2;

    source.connect(gainNode);
    gainNode.connect(panNode);
    panNode.connect(audioContext.destination);

    source.start(0);
  }

  function handleTouch(e: TouchEvent) {
    const touch = e.touches[0];
    if (touch && e.type === 'touchstart') {
      playTouchSound(touch.clientX, touch.clientY);

      // Haptic feedback pattern
      if ('vibrate' in navigator) {
        navigator.vibrate([5, 10, 5]);
      }

      // Add visual ripple effect
      createRipple(touch.clientX, touch.clientY);
    }
  }

  function createRipple(x: number, y: number) {
    const ripple = document.createElement('div');
    ripple.className = 'touch-ripple';
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;

    document.body.appendChild(ripple);

    setTimeout(() => {
      ripple.remove();
    }, 600);
  }

  // Add glitch effect on scroll
  let scrollTimeout: ReturnType<typeof setTimeout>;
  function handleScroll() {
    document.documentElement.classList.add('scrolling');

    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      document.documentElement.classList.remove('scrolling');
    }, 150);
  }

  onMount(() => {
    if (typeof window === 'undefined') return;

    isMobile = window.innerWidth <= 500;
    if (!isMobile) return;

    // Setup audio on first user interaction
    const initAudio = () => {
      setupAudio();
      document.removeEventListener('touchstart', initAudio);
    };
    document.addEventListener('touchstart', initAudio, { once: true });

    // Add touch handlers
    document.addEventListener('touchstart', handleTouch, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Add mobile class to body
    document.body.classList.add('mobile-enhanced');
  });

  onDestroy(() => {
    if (!browser) return;

    if (audioContext) {
      audioContext.close();
    }
    document.removeEventListener('touchstart', handleTouch);
    window.removeEventListener('scroll', handleScroll);
    document.body.classList.remove('mobile-enhanced');
  });
</script>

<svelte:head>
  {#if browser && isMobile}
    <style>
      .touch-ripple {
        position: fixed;
        width: 20px;
        height: 20px;
        border: 2px solid #ff0052;
        border-radius: 50%;
        transform: translate(-50%, -50%) scale(0);
        animation: ripple-animation 0.6s ease-out forwards;
        pointer-events: none;
        z-index: 9999;
        box-shadow: 0 0 10px #ff0052;
      }

      @keyframes ripple-animation {
        to {
          transform: translate(-50%, -50%) scale(4);
          opacity: 0;
          border-width: 1px;
        }
      }

      /* Subtle glitch effect on scroll */
      body.mobile-enhanced.scrolling {
        animation: mobile-glitch 0.15s ease-in-out;
      }

      @keyframes mobile-glitch {
        0%,
        100% {
          filter: hue-rotate(0deg);
        }
        25% {
          filter: hue-rotate(5deg);
        }
        75% {
          filter: hue-rotate(-5deg);
        }
      }

      /* Cyberpunk gradient text effect */
      body.mobile-enhanced h1,
      body.mobile-enhanced h2 {
        background: linear-gradient(135deg, #ff0052 0%, #667eea 50%, #ff0052 100%);
        background-size: 200% 100%;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        animation: gradient-shift 3s ease-in-out infinite;
      }

      @keyframes gradient-shift {
        0%,
        100% {
          background-position: 0% 50%;
        }
        50% {
          background-position: 100% 50%;
        }
      }

      /* Pulse animation for stats on mobile */
      body.mobile-enhanced .stat-card {
        animation: stat-pulse 2s ease-in-out infinite;
      }

      body.mobile-enhanced .stat-card:nth-child(2) {
        animation-delay: 0.3s;
      }

      body.mobile-enhanced .stat-card:nth-child(3) {
        animation-delay: 0.6s;
      }

      body.mobile-enhanced .stat-card:nth-child(4) {
        animation-delay: 0.9s;
      }

      body.mobile-enhanced .stat-card:nth-child(5) {
        animation-delay: 1.2s;
      }

      @keyframes stat-pulse {
        0%,
        100% {
          box-shadow: 0 0 5px rgba(255, 0, 82, 0);
        }
        50% {
          box-shadow: 0 0 15px rgba(255, 0, 82, 0.3);
        }
      }

      /* Enhanced border animations */
      body.mobile-enhanced #card {
        border: 1px solid transparent;
        background: linear-gradient(#131313eb, #131313eb) padding-box,
          linear-gradient(135deg, #ff0052 0%, #667eea 50%, #764ba2 100%) border-box;
        animation: border-glow 4s linear infinite;
      }

      @keyframes border-glow {
        0%,
        100% {
          filter: brightness(1);
        }
        50% {
          filter: brightness(1.2);
        }
      }

      /* Animated scrollbar */
      body.mobile-enhanced ::-webkit-scrollbar-thumb {
        background: linear-gradient(180deg, #ff0052 0%, #667eea 100%);
      }

      /* Touch-friendly button enhancement */
      body.mobile-enhanced button,
      body.mobile-enhanced a {
        position: relative;
        overflow: hidden;
      }

      body.mobile-enhanced button::after,
      body.mobile-enhanced a::after {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        width: 0;
        height: 0;
        border-radius: 50%;
        background: rgba(255, 0, 82, 0.3);
        transform: translate(-50%, -50%);
        transition: width 0.6s, height 0.6s;
      }

      body.mobile-enhanced button:active::after,
      body.mobile-enhanced a:active::after {
        width: 300px;
        height: 300px;
      }
    </style>
  {/if}
</svelte:head>
