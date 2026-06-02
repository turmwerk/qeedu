export type Theme = 'light' | 'dark';
const THEME_KEY = 'app_theme';
let themeSwitchingTimer: number | null = null;

export function getStoredTheme(): Theme {
  const t = localStorage.getItem(THEME_KEY) as Theme | null;
  if (t === 'dark' || t === 'light') return t;
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';
  return 'light';
}

export function clearStarsCanvases() {
  if (typeof document === 'undefined') return;
  document.querySelectorAll('.stars-canvas').forEach((node) => node.remove());
}

export function applyTheme(t: Theme) {
  const root = document.documentElement;
  root.classList.add('theme-switching');
  root.setAttribute('data-theme', t);
  localStorage.setItem(THEME_KEY, t);
  if (t === 'light') {
    clearStarsCanvases();
  }
  // Broadcast change for same-window listeners
  try {
    window.dispatchEvent(new CustomEvent('theme-change', { detail: { theme: t } }));
  } catch (e) {
    // ignore
  }
  if (themeSwitchingTimer !== null) {
    window.clearTimeout(themeSwitchingTimer);
  }
  themeSwitchingTimer = window.setTimeout(() => {
    root.classList.remove('theme-switching');
    themeSwitchingTimer = null;
  }, 48);
}

export function toggleTheme(): Theme {
  const next = getStoredTheme() === 'dark' ? 'light' : 'dark';
  applyTheme(next);
  return next;
}

export function initTheme() {
  applyTheme(getStoredTheme());
}
