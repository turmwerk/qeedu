import type { WorkspaceConfig, WorkspaceRecord } from "./types";

export const getWorkspaceDetailPath = (config: WorkspaceConfig, id: string) =>
  `${config.routeBase}/detail?recordId=${encodeURIComponent(id)}`;

export const getWorkspaceDialogId = (config: WorkspaceConfig, id: string) =>
  `${config.key}-${id}`;

export const loadWorkspaceRecords = (config: WorkspaceConfig): WorkspaceRecord[] => {
  try {
    const raw = localStorage.getItem(config.storageKey);
    if (!raw) return [];
    return JSON.parse(raw) as WorkspaceRecord[];
  } catch {
    return [];
  }
};

export const saveWorkspaceRecords = (
  config: WorkspaceConfig,
  records: WorkspaceRecord[],
) => {
  try {
    localStorage.setItem(config.storageKey, JSON.stringify(records));
    window.dispatchEvent(new Event(config.events.updated));
  } catch (error) {
    console.error(`save records failed for ${config.key}`, error);
  }
};

export const setWorkspaceCurrentId = (config: WorkspaceConfig, id: string) => {
  try {
    localStorage.setItem(config.currentKey, id);
  } catch {}
  window.dispatchEvent(
    new CustomEvent(config.events.currentId, {
      detail: { id },
    }),
  );
};

export const getWorkspaceCurrentId = (config: WorkspaceConfig): string | null => {
  try {
    return localStorage.getItem(config.currentKey);
  } catch {
    return null;
  }
};

export const clearWorkspaceCurrentId = (config: WorkspaceConfig) => {
  try {
    localStorage.removeItem(config.currentKey);
  } catch {}
};

export const getWorkspaceNextId = (config: WorkspaceConfig): string => {
  let next = 1;
  try {
    const rawCounter = localStorage.getItem(config.counterKey);
    if (rawCounter) {
      const parsed = Number.parseInt(rawCounter, 10);
      next = Number.isNaN(parsed) ? 1 : parsed + 1;
    } else {
      const existing = loadWorkspaceRecords(config);
      const maxId = existing.reduce((max, record) => {
        const value = Number.parseInt(record.id, 10);
        return Number.isNaN(value) ? max : Math.max(max, value);
      }, 0);
      next = maxId + 1;
    }
    localStorage.setItem(config.counterKey, String(next));
  } catch {}
  return String(next);
};

