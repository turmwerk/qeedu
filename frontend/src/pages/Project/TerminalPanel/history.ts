import { useEffect, useState } from "react";

export type PanelHistoryViewId =
  | "terminal"
  | "output"
  | "problems"
  | "console"
  | "ports";

export interface PanelHistoryRecord<TPayload = unknown, TMeta = unknown> {
  id: string;
  workspaceKey: string;
  viewId: PanelHistoryViewId;
  createdAt: number;
  updatedAt: number;
  title: string;
  payload: TPayload;
  meta?: TMeta;
}

export interface TerminalHistoryChunk {
  id: string;
  text: string;
  timestamp: number;
  kind: "meta" | "output" | "input" | "error";
}

export interface TerminalHistoryPayload {
  sessionId: string;
  chunks: TerminalHistoryChunk[];
}

const DB_NAME = "nju-edu-ai-terminal-panel-history";
const STORE_NAME = "panel-history";
const DB_VERSION = 1;

type HistoryListener = (
  workspaceKey?: string,
  viewId?: PanelHistoryViewId,
) => void;

const listeners = new Set<HistoryListener>();

const emitHistoryChange = (
  workspaceKey?: string,
  viewId?: PanelHistoryViewId,
) => {
  listeners.forEach((listener) => listener(workspaceKey, viewId));
};

export const subscribeHistoryChanges = (listener: HistoryListener) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

const createRequestPromise = <T,>(request: IDBRequest<T>): Promise<T> =>
  new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error("IndexedDB request failed"));
  });

const openDatabase = (): Promise<IDBDatabase> =>
  new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      const store = db.objectStoreNames.contains(STORE_NAME)
        ? request.transaction?.objectStore(STORE_NAME)
        : db.createObjectStore(STORE_NAME, { keyPath: "id" });
      if (!store) return;
      if (!store.indexNames.contains("workspaceViewUpdatedAt")) {
        store.createIndex("workspaceViewUpdatedAt", [
          "workspaceKey",
          "viewId",
          "updatedAt",
        ]);
      }
      if (!store.indexNames.contains("workspaceKey")) {
        store.createIndex("workspaceKey", "workspaceKey");
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () =>
      reject(request.error ?? new Error("Failed to open IndexedDB"));
  });

const withStore = async <T,>(
  mode: IDBTransactionMode,
  run: (store: IDBObjectStore) => Promise<T>,
): Promise<T> => {
  const db = await openDatabase();
  try {
    const tx = db.transaction(STORE_NAME, mode);
    const store = tx.objectStore(STORE_NAME);
    const result = await run(store);
    await new Promise<void>((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error ?? new Error("IndexedDB transaction failed"));
      tx.onabort = () => reject(tx.error ?? new Error("IndexedDB transaction aborted"));
    });
    return result;
  } finally {
    db.close();
  }
};

const createRecordId = (prefix: string): string => {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return `${prefix}:${crypto.randomUUID()}`;
  }
  return `${prefix}:${Date.now()}:${Math.random().toString(36).slice(2, 8)}`;
};

export const listPanelHistory = async <TPayload = unknown, TMeta = unknown>(
  workspaceKey: string,
  viewId: PanelHistoryViewId,
): Promise<Array<PanelHistoryRecord<TPayload, TMeta>>> =>
  withStore("readonly", async (store) => {
    const index = store.index("workspaceViewUpdatedAt");
    const keyRange = IDBKeyRange.bound(
      [workspaceKey, viewId, 0],
      [workspaceKey, viewId, Number.MAX_SAFE_INTEGER],
    );
    const records = await createRequestPromise(index.getAll(keyRange));
    return (records as Array<PanelHistoryRecord<TPayload, TMeta>>).sort(
      (left, right) => right.updatedAt - left.updatedAt,
    );
  });

export const putPanelHistoryRecord = async <TPayload = unknown, TMeta = unknown>(
  record: PanelHistoryRecord<TPayload, TMeta>,
): Promise<void> => {
  await withStore("readwrite", async (store) => {
    await createRequestPromise(store.put(record));
    return undefined;
  });
  emitHistoryChange(record.workspaceKey, record.viewId);
};

export const createPanelHistoryRecord = async <
  TPayload = unknown,
  TMeta = unknown,
>(
  input: Omit<PanelHistoryRecord<TPayload, TMeta>, "id"> & { id?: string },
): Promise<PanelHistoryRecord<TPayload, TMeta>> => {
  const record: PanelHistoryRecord<TPayload, TMeta> = {
    ...input,
    id: input.id ?? createRecordId(`${input.viewId}:${input.workspaceKey}`),
  };
  await putPanelHistoryRecord(record);
  return record;
};

export const appendTerminalHistory = async (input: {
  workspaceKey: string;
  sessionId: string;
  title: string;
  text: string;
  timestamp?: number;
  kind?: TerminalHistoryChunk["kind"];
  meta?: Record<string, unknown>;
}): Promise<void> => {
  const timestamp = input.timestamp ?? Date.now();
  const recordId = `terminal:${input.workspaceKey}:${input.sessionId}`;

  await withStore("readwrite", async (store) => {
    const existing = (await createRequestPromise(
      store.get(recordId),
    )) as PanelHistoryRecord<TerminalHistoryPayload> | undefined;
    const previousChunks = existing?.payload?.chunks ?? [];
    const nextRecord: PanelHistoryRecord<TerminalHistoryPayload, Record<string, unknown>> = {
      id: recordId,
      workspaceKey: input.workspaceKey,
      viewId: "terminal",
      title: input.title,
      createdAt: existing?.createdAt ?? timestamp,
      updatedAt: timestamp,
      meta: input.meta,
      payload: {
        sessionId: input.sessionId,
        chunks: [
          ...previousChunks,
          {
            id: createRecordId(recordId),
            text: input.text,
            timestamp,
            kind: input.kind ?? "output",
          },
        ],
      },
    };
    await createRequestPromise(store.put(nextRecord));
    return undefined;
  });

  emitHistoryChange(input.workspaceKey, "terminal");
};

export const clearWorkspaceHistory = async (workspaceKey: string): Promise<void> => {
  await withStore("readwrite", async (store) => {
    const index = store.index("workspaceKey");
    const range = IDBKeyRange.only(workspaceKey);
    await new Promise<void>((resolve, reject) => {
      const cursorRequest = index.openKeyCursor(range);
      cursorRequest.onsuccess = () => {
        const cursor = cursorRequest.result;
        if (!cursor) {
          resolve();
          return;
        }
        store.delete(cursor.primaryKey);
        cursor.continue();
      };
      cursorRequest.onerror = () =>
        reject(cursorRequest.error ?? new Error("Failed to clear workspace history"));
    });
    return undefined;
  });

  emitHistoryChange(workspaceKey);
};

export const usePanelHistoryRecords = <
  TPayload = unknown,
  TMeta = unknown,
>(
  workspaceKey: string,
  viewId: PanelHistoryViewId,
) => {
  const [records, setRecords] = useState<Array<PanelHistoryRecord<TPayload, TMeta>>>([]);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      if (!workspaceKey) {
        if (!cancelled) {
          setRecords([]);
        }
        return;
      }
      try {
        const next = await listPanelHistory<TPayload, TMeta>(workspaceKey, viewId);
        if (!cancelled) {
          setRecords(next);
        }
      } catch {
        if (!cancelled) {
          setRecords([]);
        }
      }
    };

    void load();
    const unsubscribe = subscribeHistoryChanges((changedWorkspace, changedView) => {
      if (changedWorkspace && changedWorkspace !== workspaceKey) {
        return;
      }
      if (changedView && changedView !== viewId) {
        return;
      }
      void load();
    });

    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, [viewId, workspaceKey]);

  return records;
};
