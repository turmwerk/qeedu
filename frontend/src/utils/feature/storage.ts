export type FeatureRecordBase = {
  id: string;
  title: string;
  summary?: string;
  status?: string;
  updatedAt: number;
};

const parse = <T,>(raw: string | null, fallback: T): T => {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
};

export const loadFeatureRecords = <T,>(storageKey: string, fallback: T[]): T[] => {
  if (typeof window === "undefined") return fallback;
  return parse<T[]>(window.localStorage.getItem(storageKey), fallback);
};

export const saveFeatureRecords = <T,>(storageKey: string, items: T[]) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(storageKey, JSON.stringify(items));
};

export const createFeatureId = (prefix: string) =>
  `${prefix}_${Math.random().toString(36).slice(2, 9)}`;

export const upsertFeatureRecord = <T extends FeatureRecordBase>(
  items: T[],
  nextItem: T,
) => {
  const matchedIndex = items.findIndex((item) => item.id === nextItem.id);
  if (matchedIndex === -1) return [nextItem, ...items];
  const updated = [...items];
  updated[matchedIndex] = nextItem;
  return updated;
};

export const removeFeatureRecord = <T extends { id: string }>(
  items: T[],
  id: string,
) => items.filter((item) => item.id !== id);
