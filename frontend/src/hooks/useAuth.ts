import { useSyncExternalStore, useCallback } from "react";

const TOKEN_KEY = "token";

// Minimal JWT payload decode (no verification — that's the backend's job)
function decodePayload(token: string): Record<string, unknown> | null {
  try {
    const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(base64));
  } catch {
    return null;
  }
}

// ── External store so every component re-renders on login/logout ──

let snapshot = localStorage.getItem(TOKEN_KEY);

function subscribe(cb: () => void) {
  const onStorage = (e: StorageEvent) => {
    if (e.key === TOKEN_KEY) {
      snapshot = e.newValue;
      cb();
    }
  };
  const onAuth = () => {
    snapshot = localStorage.getItem(TOKEN_KEY);
    cb();
  };
  window.addEventListener("storage", onStorage);
  window.addEventListener("auth-change", onAuth);
  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener("auth-change", onAuth);
  };
}

function getSnapshot() {
  return snapshot;
}

export function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
  snapshot = token;
  window.dispatchEvent(new Event("auth-change"));
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
  snapshot = null;
  window.dispatchEvent(new Event("auth-change"));
}

export function useAuth() {
  const token = useSyncExternalStore(subscribe, getSnapshot);

  const payload = token ? decodePayload(token) : null;
  const isAuthenticated = !!payload;
  const user = payload
    ? { id: payload.user_id as number, name: payload.name as string }
    : null;

  const logout = useCallback(() => {
    clearToken();
  }, []);

  return { isAuthenticated, user, token, logout };
}
