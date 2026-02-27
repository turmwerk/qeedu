/**
 * Snow animation utility
 * Background keeps snowing with white snowballs of varying sizes.
 * Snowballs within the mouse hover radius connect to the cursor with lines.
 *
 * Usage:
 *   const snow = createSnowAnimation('#snow-layer');
 *   // later:
 *   snow.destroy();
 */

export interface SnowOptions {
  /** Number of snowflakes (default: 120) */
  count?: number;
  /** Base radius of snowflakes in px (default: 4) */
  baseSize?: number;
  /** Falling speed in px/frame (default: 1.2) */
  speed?: number;
  /** Snowflake color (default: '#ffffff') */
  color?: string;
  /** Base opacity (default: 0.7) */
  opacity?: number;
  /** Mouse grab radius in px (default: 140) */
  grabDistance?: number;
  /** Opacity of grab lines (default: 0.6) */
  grabLineOpacity?: number;
}

interface Particle {
  x: number;
  y: number;
  radius: number;
  opacity: number;
  vx: number;
  vy: number;
}

interface MouseState {
  x: number | null;
  y: number | null;
  active: boolean;
}

export interface SnowAnimation {
  destroy: () => void;
  pause: () => void;
  resume: () => void;
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const clean = hex.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i, (_, r, g, b) => r + r + g + g + b + b);
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(clean);
  return result
    ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) }
    : { r: 255, g: 255, b: 255 };
}

export function createSnowAnimation(
  containerSelector: string | HTMLElement,
  options: SnowOptions = {}
): SnowAnimation {
  const {
    count = 120,
    baseSize = 4,
    speed = 1.2,
    color = '#ffffff',
    opacity = 0.7,
    grabDistance = 140,
    grabLineOpacity = 0.6,
  } = options;

  const rgb = hexToRgb(color);

  // Resolve container
  const container: HTMLElement | null =
    typeof containerSelector === 'string'
      ? document.querySelector(containerSelector)
      : containerSelector;

  if (!container) {
    console.warn('[SnowAnimation] Container not found:', containerSelector);
    return { destroy: () => {}, pause: () => {}, resume: () => {} };
  }

  // Create canvas – fixed, full-viewport, always on top
  const canvas = document.createElement('canvas');
  canvas.className = 'snow-canvas';
  canvas.style.cssText = [
    'position:fixed',
    'top:0',
    'left:0',
    'width:100vw',
    'height:100vh',
    'pointer-events:none',
    'z-index:9998',
  ].join(';');
  // Mount directly on body so it is never clipped by overflow:hidden ancestors
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d')!;
  let W = 0;
  let H = 0;
  let animFrameId = 0;
  let paused = false;

  const mouse: MouseState = { x: null, y: null, active: false };
  const particles: Particle[] = [];

  // ── helpers ──────────────────────────────────────────────────────────────

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function randomParticle(forceY?: number): Particle {
    const r = (Math.random() * baseSize + baseSize * 0.5); // 0.5× ~ 1.5× base
    return {
      x: Math.random() * W,
      y: forceY !== undefined ? forceY : Math.random() * H,
      radius: r,
      opacity: (Math.random() * 0.4 + 0.3) * opacity / 0.7, // slight variance
      vx: (Math.random() - 0.5) * 0.6,
      vy: (Math.random() * 0.8 + 0.4) * speed,
    };
  }

  function initParticles() {
    particles.length = 0;
    for (let i = 0; i < count; i++) {
      particles.push(randomParticle());
    }
  }

  // ── draw ─────────────────────────────────────────────────────────────────

  function drawParticle(p: Particle) {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${rgb.r},${rgb.g},${rgb.b},${p.opacity})`;
    ctx.fill();
  }

  function drawGrabLines() {
    if (!mouse.active || mouse.x === null || mouse.y === null) return;
    for (const p of particles) {
      const dx = p.x - mouse.x;
      const dy = p.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist <= grabDistance) {
        // Fade line toward edge of grab radius
        const alpha = grabLineOpacity * (1 - dist / grabDistance);
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(mouse.x, mouse.y);
        ctx.strokeStyle = `rgba(${rgb.r},${rgb.g},${rgb.b},${alpha})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }
    }
  }

  function update() {
    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;
      // Wrap: when a flake leaves the bottom, re-enter from top
      if (p.y - p.radius > H) {
        const fresh = randomParticle(-p.radius);
        Object.assign(p, fresh);
        p.y = -p.radius;
      }
      if (p.x + p.radius < 0) p.x = W + p.radius;
      if (p.x - p.radius > W) p.x = -p.radius;
    }
  }

  function frame() {
    if (paused) return;
    ctx.clearRect(0, 0, W, H);
    drawGrabLines();
    for (const p of particles) drawParticle(p);
    update();
    animFrameId = requestAnimationFrame(frame);
  }

  // ── events ────────────────────────────────────────────────────────────────

  function onMouseMove(e: MouseEvent) {
    // canvas is fixed full-viewport, so clientX/Y maps directly to canvas coords
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    mouse.active = true;
  }

  function onMouseLeave() {
    mouse.x = null;
    mouse.y = null;
    mouse.active = false;
  }

  function onResize() {
    resize();
    // Re-scatter particles to fit new viewport
    initParticles();
  }

  window.addEventListener('mousemove', onMouseMove);
  window.addEventListener('mouseleave', onMouseLeave);
  window.addEventListener('resize', onResize);

  // ── boot ─────────────────────────────────────────────────────────────────

  resize();
  initParticles();
  animFrameId = requestAnimationFrame(frame);

  // ── public API ────────────────────────────────────────────────────────────

  return {
    pause() {
      paused = true;
      cancelAnimationFrame(animFrameId);
    },
    resume() {
      if (!paused) return;
      paused = false;
      animFrameId = requestAnimationFrame(frame);
    },
    destroy() {
      cancelAnimationFrame(animFrameId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseleave', onMouseLeave);
      window.removeEventListener('resize', onResize);
      canvas.remove();
    },
  };
}
