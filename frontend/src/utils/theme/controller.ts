export type Theme = 'light' | 'dark';
const THEME_KEY = 'app_theme';

export function getStoredTheme(): Theme {
  const t = localStorage.getItem(THEME_KEY) as Theme | null;
  if (t === 'dark' || t === 'light') return t;
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';
  return 'light';
}

export function applyTheme(t: Theme) {
  document.documentElement.setAttribute('data-theme', t);
  localStorage.setItem(THEME_KEY, t);
  // Broadcast change for same-window listeners
  try {
    window.dispatchEvent(new CustomEvent('theme-change', { detail: { theme: t } }));
  } catch (e) {
    // ignore
  }
}

export function toggleTheme(): Theme {
  const next = getStoredTheme() === 'dark' ? 'light' : 'dark';
  applyTheme(next);
  return next;
}

export function initTheme() {
  applyTheme(getStoredTheme());
}
