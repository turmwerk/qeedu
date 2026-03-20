const EFFECTS_KEY = 'app_effects_enabled';

export function getEffectsEnabled(): boolean {
  const stored = localStorage.getItem(EFFECTS_KEY);
  if (stored === 'true') return true;
  if (stored === 'false') return false;
  // 默认不开启特效
  return false;
}

export function setEffectsEnabled(enabled: boolean) {
  localStorage.setItem(EFFECTS_KEY, String(enabled));
  // Broadcast change for same-window listeners
  try {
    window.dispatchEvent(new CustomEvent('effects-change', { detail: { enabled } }));
  } catch (e) {
    // ignore
  }
}

export function toggleEffects(): boolean {
  const next = !getEffectsEnabled();
  setEffectsEnabled(next);
  return next;
}
