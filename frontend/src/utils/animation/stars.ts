/**
 * Stars background animation utility
 * Renders a static star field with tiny slowly-drifting dots.
 * NO mouse interaction, NO connecting lines – completely independent from snow.
 *
 * Usage:
 *   const stars = createStarsAnimation();
 *   // later:
 *   stars.destroy();
 */

export interface StarsOptions {
  /** Total number of stars (default: 200) */
  count?: number;
  /** Max star radius in px (default: 1.6) */
  maxRadius?: number;
  /** Star color (default: '#ffffff') */
  color?: string;
  /** Max drift speed in px/frame (default: 0.08) */
  speed?: number;
}

export interface StarsAnimation {
  destroy: () => void;
  pause: () => void;
  resume: () => void;
}

interface Star {
  x: number;
  y: number;
  r: number;        // radius
  opacity: number;
  vx: number;
  vy: number;
  twinklePhase: number;   // offset for opacity oscillation
  twinkleSpeed: number;
}

function hexToRgb(hex: string) {
  const clean = hex.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i, (_, r, g, b) => r + r + g + g + b + b);
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(clean);
  return m ? { r: parseInt(m[1], 16), g: parseInt(m[2], 16), b: parseInt(m[3], 16) } : { r: 255, g: 255, b: 255 };
}

export function createStarsAnimation(options: StarsOptions = {}): StarsAnimation {
  const {
    count = 220,
    maxRadius = 1.6,
    color = '#b8c8e8',   // slightly blue-tinted white, matches night sky
    speed = 0.06,
  } = options;

  const rgb = hexToRgb(color);

  // Canvas – fixed, full viewport, z-index just below snow (9997)
  const canvas = document.createElement('canvas');
  canvas.className = 'stars-canvas';
  canvas.style.cssText = [
    'position:fixed',
    'top:0',
    'left:0',
    'width:100vw',
    'height:100vh',
    'pointer-events:none',
    'z-index:9997',
  ].join(';');
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d')!;
  let W = 0;
  let H = 0;
  let animId = 0;
  let paused = false;
  const stars: Star[] = [];

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function makeStar(forceX?: number, forceY?: number): Star {
    // bias toward smaller stars (feels realistic)
    const r = Math.pow(Math.random(), 2) * maxRadius + 0.3;
    return {
      x: forceX !== undefined ? forceX : Math.random() * W,
      y: forceY !== undefined ? forceY : Math.random() * H,
      r,
      opacity: Math.random() * 0.5 + 0.3,
      vx: (Math.random() - 0.5) * speed,
      vy: (Math.random() - 0.5) * speed,
      twinklePhase: Math.random() * Math.PI * 2,
      twinkleSpeed: 0.005 + Math.random() * 0.015,
    };
  }

  function init() {
    stars.length = 0;
    for (let i = 0; i < count; i++) stars.push(makeStar());
  }

  function frame() {
    if (paused) return;
    ctx.clearRect(0, 0, W, H);

    for (const s of stars) {
      // Slow twinkle via sine oscillation
      s.twinklePhase += s.twinkleSpeed;
      const alpha = s.opacity * (0.7 + 0.3 * Math.sin(s.twinklePhase));

      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${rgb.r},${rgb.g},${rgb.b},${alpha})`;
      ctx.fill();

      // Drift
      s.x += s.vx;
      s.y += s.vy;

      // Wrap around edges
      if (s.x < -2) s.x = W + 2;
      else if (s.x > W + 2) s.x = -2;
      if (s.y < -2) s.y = H + 2;
      else if (s.y > H + 2) s.y = -2;
    }

    animId = requestAnimationFrame(frame);
  }

  function onResize() {
    resize();
    init();
  }

  window.addEventListener('resize', onResize);
  resize();
  init();
  animId = requestAnimationFrame(frame);

  return {
    pause() {
      paused = true;
      cancelAnimationFrame(animId);
    },
    resume() {
      if (!paused) return;
      paused = false;
      animId = requestAnimationFrame(frame);
    },
    destroy() {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', onResize);
      canvas.remove();
    },
  };
}
