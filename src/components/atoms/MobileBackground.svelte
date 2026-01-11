<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { browser } from '$app/environment';

  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D | null;
  let animationId: number;
  let time = 0;

  interface GridCell {
    x: number;
    y: number;
    active: boolean;
    intensity: number;
    targetIntensity: number;
    hue: number;
  }

  let grid: GridCell[] = [];
  const cellSize = 40;
  let cols = 0;
  let rows = 0;

  function initGrid() {
    if (!canvas) return;

    cols = Math.ceil(canvas.width / cellSize);
    rows = Math.ceil(canvas.height / cellSize);
    grid = [];

    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        grid.push({
          x: x * cellSize,
          y: y * cellSize,
          active: Math.random() > 0.7,
          intensity: Math.random() * 0.3,
          targetIntensity: Math.random() * 0.5,
          hue: Math.random() > 0.5 ? 320 : 270 // Pink or purple
        });
      }
    }
  }

  function drawCyberpunkGrid() {
    if (!ctx || !canvas) return;

    // Clear with dark background
    ctx.fillStyle = 'rgba(6, 6, 6, 0.95)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid lines with glow
    ctx.strokeStyle = 'rgba(255, 0, 82, 0.1)';
    ctx.lineWidth = 1;

    // Vertical lines
    for (let x = 0; x < canvas.width; x += cellSize) {
      const offset = Math.sin(time * 0.001 + x * 0.01) * 2;
      ctx.beginPath();
      ctx.moveTo(x + offset, 0);
      ctx.lineTo(x + offset, canvas.height);
      ctx.stroke();
    }

    // Horizontal lines
    for (let y = 0; y < canvas.height; y += cellSize) {
      const offset = Math.sin(time * 0.001 + y * 0.01) * 2;
      ctx.beginPath();
      ctx.moveTo(0, y + offset);
      ctx.lineTo(canvas.width, y + offset);
      ctx.stroke();
    }

    // Draw glowing cells
    grid.forEach((cell) => {
      // Smooth intensity transition
      cell.intensity += (cell.targetIntensity - cell.intensity) * 0.05;

      // Randomly change target intensity
      if (Math.random() > 0.98) {
        cell.targetIntensity = Math.random() * 0.6;
      }

      if (cell.intensity > 0.05) {
        const alpha = cell.intensity;
        const pulseSize = Math.sin(time * 0.003 + cell.x * 0.01 + cell.y * 0.01) * 2 + 2;

        // Draw glow
        const gradient = ctx.createRadialGradient(
          cell.x + cellSize / 2,
          cell.y + cellSize / 2,
          0,
          cell.x + cellSize / 2,
          cell.y + cellSize / 2,
          cellSize / 2 + pulseSize
        );

        gradient.addColorStop(0, `hsla(${cell.hue}, 100%, 60%, ${alpha * 0.6})`);
        gradient.addColorStop(0.5, `hsla(${cell.hue}, 100%, 50%, ${alpha * 0.3})`);
        gradient.addColorStop(1, `hsla(${cell.hue}, 100%, 40%, 0)`);

        ctx.fillStyle = gradient;
        ctx.fillRect(cell.x, cell.y, cellSize, cellSize);

        // Draw cell border
        ctx.strokeStyle = `hsla(${cell.hue}, 100%, 70%, ${alpha * 0.8})`;
        ctx.lineWidth = 1;
        ctx.strokeRect(
          cell.x + 2 + pulseSize / 2,
          cell.y + 2 + pulseSize / 2,
          cellSize - 4 - pulseSize,
          cellSize - 4 - pulseSize
        );
      }
    });

    // Draw scanning line
    const scanY = ((time * 0.5) % canvas.height) + 50;
    const scanGradient = ctx.createLinearGradient(0, scanY - 50, 0, scanY + 50);
    scanGradient.addColorStop(0, 'rgba(255, 0, 82, 0)');
    scanGradient.addColorStop(0.5, 'rgba(255, 0, 82, 0.2)');
    scanGradient.addColorStop(1, 'rgba(255, 0, 82, 0)');

    ctx.fillStyle = scanGradient;
    ctx.fillRect(0, scanY - 50, canvas.width, 100);

    // Draw corner accents
    drawCornerAccent(20, 20);
    drawCornerAccent(canvas.width - 20, 20, true);
    drawCornerAccent(20, canvas.height - 20, false, true);
    drawCornerAccent(canvas.width - 20, canvas.height - 20, true, true);
  }

  function drawCornerAccent(x: number, y: number, flipX = false, flipY = false) {
    if (!ctx) return;

    ctx.save();
    ctx.translate(x, y);
    if (flipX) ctx.scale(-1, 1);
    if (flipY) ctx.scale(1, -1);

    const pulse = Math.sin(time * 0.002) * 0.3 + 0.7;

    ctx.strokeStyle = `rgba(255, 0, 82, ${0.6 * pulse})`;
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.moveTo(-15, 0);
    ctx.lineTo(-5, 0);
    ctx.lineTo(0, -5);
    ctx.lineTo(0, -15);
    ctx.stroke();

    ctx.restore();
  }

  function activateCellAt(x: number, y: number) {
    const cellX = Math.floor(x / cellSize);
    const cellY = Math.floor(y / cellSize);
    const index = cellY * cols + cellX;

    if (index >= 0 && index < grid.length) {
      grid[index].targetIntensity = 0.8;

      // Activate nearby cells
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          const nearIndex = (cellY + dy) * cols + (cellX + dx);
          if (nearIndex >= 0 && nearIndex < grid.length) {
            const distance = Math.sqrt(dx * dx + dy * dy);
            grid[nearIndex].targetIntensity = Math.max(
              grid[nearIndex].targetIntensity,
              0.6 / (distance + 1)
            );
          }
        }
      }
    }
  }

  function handleTouch(e: TouchEvent) {
    const rect = canvas.getBoundingClientRect();
    Array.from(e.touches).forEach((touch) => {
      const x = touch.clientX - rect.left;
      const y = touch.clientY - rect.top;
      activateCellAt(x, y);
    });
  }

  function animate() {
    time++;
    drawCyberpunkGrid();
    animationId = requestAnimationFrame(animate);
  }

  function resizeCanvas() {
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initGrid();
  }

  onMount(() => {
    if (typeof window === 'undefined' || window.innerWidth > 500) return;

    ctx = canvas.getContext('2d');
    resizeCanvas();

    canvas.addEventListener('touchstart', handleTouch, { passive: true });
    canvas.addEventListener('touchmove', handleTouch, { passive: true });
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
  <canvas bind:this={canvas} class="mobile-background" />
{/if}

<style lang="scss">
  .mobile-background {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
    touch-action: none;

    @media (min-width: 501px) {
      display: none;
    }
  }
</style>
