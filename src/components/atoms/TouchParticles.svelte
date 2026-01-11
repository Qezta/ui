<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { browser } from '$app/environment';

  interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    life: number;
    maxLife: number;
    size: number;
    hue: number;
  }

  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D | null;
  let particles: Particle[] = [];
  let animationId: number;
  let lastTouchTime = 0;

  const colors = {
    primary: 320, // Pink/magenta hue from --highlight: #ff0052
    secondary: 270 // Purple accent
  };

  function createParticle(x: number, y: number, burst = false): Particle {
    const angle = Math.random() * Math.PI * 2;
    const speed = burst ? Math.random() * 4 + 2 : Math.random() * 2 + 1;
    const hue = Math.random() > 0.5 ? colors.primary : colors.secondary;

    return {
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 1,
      maxLife: burst ? 60 : 40,
      size: burst ? Math.random() * 4 + 3 : Math.random() * 3 + 2,
      hue
    };
  }

  function createBurst(x: number, y: number) {
    const particleCount = 15 + Math.floor(Math.random() * 10);
    for (let i = 0; i < particleCount; i++) {
      particles.push(createParticle(x, y, true));
    }

    // Trigger haptic feedback if available
    if ('vibrate' in navigator) {
      navigator.vibrate(10);
    }
  }

  function handleTouch(e: TouchEvent) {
    e.preventDefault();
    const now = Date.now();
    const touches = Array.from(e.touches);

    touches.forEach((touch) => {
      const rect = canvas.getBoundingClientRect();
      const x = touch.clientX - rect.left;
      const y = touch.clientY - rect.top;

      // Create burst for new touches
      if (e.type === 'touchstart') {
        createBurst(x, y);
      } else {
        // Create trail particles on move (throttled)
        if (now - lastTouchTime > 16) {
          // ~60fps
          particles.push(createParticle(x, y, false));
          lastTouchTime = now;
        }
      }
    });
  }

  function animate() {
    if (!ctx || !canvas) return;

    // Clear with fade effect for trail
    ctx.fillStyle = 'rgba(6, 6, 6, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Update and draw particles
    particles = particles.filter((p) => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.1; // Gravity
      p.vx *= 0.98; // Friction
      p.vy *= 0.98;
      p.life--;

      const alpha = p.life / p.maxLife;
      const currentSize = p.size * alpha;

      if (p.life > 0 && ctx) {
        // Draw glow
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, currentSize * 2);
        gradient.addColorStop(0, `hsla(${p.hue}, 100%, 60%, ${alpha * 0.8})`);
        gradient.addColorStop(0.5, `hsla(${p.hue}, 100%, 50%, ${alpha * 0.4})`);
        gradient.addColorStop(1, `hsla(${p.hue}, 100%, 40%, 0)`);

        ctx.fillStyle = gradient;
        ctx.fillRect(p.x - currentSize * 2, p.y - currentSize * 2, currentSize * 4, currentSize * 4);

        // Draw particle core
        ctx.fillStyle = `hsla(${p.hue}, 100%, 70%, ${alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, currentSize, 0, Math.PI * 2);
        ctx.fill();

        return true;
      }
      return false;
    });

    animationId = requestAnimationFrame(animate);
  }

  function resizeCanvas() {
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  onMount(() => {
    if (typeof window === 'undefined' || window.innerWidth > 500) return; // Only on mobile

    ctx = canvas.getContext('2d');
    resizeCanvas();

    canvas.addEventListener('touchstart', handleTouch, { passive: false });
    canvas.addEventListener('touchmove', handleTouch, { passive: false });
    window.addEventListener('resize', resizeCanvas);

    animate();
  });

  onDestroy(() => {
    if (!browser) return;

    if (animationId) {
      cancelAnimationFrame(animationId);
    }
    if (canvas) {
      canvas.removeEventListener('touchstart', handleTouch);
      canvas.removeEventListener('touchmove', handleTouch);
    }
    window.removeEventListener('resize', resizeCanvas);
  });
</script>

{#if browser}
  <canvas bind:this={canvas} class="touch-particles" />
{/if}

<style lang="scss">
  .touch-particles {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
    pointer-events: none;
    touch-action: none;

    @media (min-width: 501px) {
      display: none;
    }
  }
</style>
