const RELOAD_MARKER_PREFIX = "qeedu:chunk-reload:";
const RELOAD_MARKER_TTL_MS = 10 * 60 * 1000;

const CHUNK_ERROR_PATTERNS = [
  /Failed to fetch dynamically imported module/i,
  /Importing a module script failed/i,
  /error loading dynamically imported module/i,
  /ChunkLoadError/i,
  /Loading chunk [\w-]+ failed/i,
];

const getMessage = (error: unknown): string => {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  if (error && typeof error === "object" && "message" in error) {
    return String((error as { message?: unknown }).message ?? "");
  }
  return String(error ?? "");
};

export const isChunkLoadError = (error: unknown): boolean => {
  const message = getMessage(error);
  return CHUNK_ERROR_PATTERNS.some((pattern) => pattern.test(message));
};

const getChunkKey = (error: unknown): string => {
  const message = getMessage(error);
  const url =
    message.match(/https?:\/\/[^\s)]+/)?.[0] ??
    message.match(/\/assets\/[^\s)]+/)?.[0] ??
    window.location.pathname;
  return `${RELOAD_MARKER_PREFIX}${url}`;
};

export const recoverFromChunkLoadError = (error: unknown): boolean => {
  if (typeof window === "undefined" || !isChunkLoadError(error)) return false;

  const key = getChunkKey(error);
  const now = Date.now();
  const lastReloadAt = Number(window.sessionStorage.getItem(key) ?? "0");
  if (lastReloadAt > 0 && now - lastReloadAt < RELOAD_MARKER_TTL_MS) {
    return false;
  }

  window.sessionStorage.setItem(key, String(now));
  window.location.reload();
  return true;
};

export const importWithChunkRecovery = async <T>(importer: () => Promise<T>): Promise<T> => {
  try {
    return await importer();
  } catch (error) {
    if (recoverFromChunkLoadError(error)) {
      return new Promise<T>(() => {});
    }
    throw error;
  }
};

export const installChunkLoadRecovery = () => {
  if (typeof window === "undefined") return;

  window.addEventListener("vite:preloadError", (event) => {
    const preloadEvent = event as Event & { payload?: unknown };
    if (recoverFromChunkLoadError(preloadEvent.payload ?? event)) {
      event.preventDefault();
    }
  });

  window.addEventListener("unhandledrejection", (event) => {
    if (recoverFromChunkLoadError(event.reason)) {
      event.preventDefault();
    }
  });
};
