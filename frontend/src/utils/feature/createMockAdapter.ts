import { chatStream, type ChatMessage, type ChatMode } from "@/api/ai";
import {
  createFeatureId,
  loadFeatureRecords,
  removeFeatureRecord,
  saveFeatureRecords,
  upsertFeatureRecord,
  type FeatureRecordBase,
} from "./storage";

export type MockAdapterConfig<T extends FeatureRecordBase> = {
  storageKey: string;
  idPrefix: string;
  botName: string;
  seedRecords: T[];
  createRecord: (payload: Partial<T> & Record<string, unknown>) => T;
  patchRecord?: (record: T, patch: Partial<T> & Record<string, unknown>) => T;
};

type ChatTransportArgs = {
  messages: ChatMessage[];
  input: string;
  files: File[];
  fileContext?: string;
  mode: ChatMode;
  model?: string;
  apiKey?: string;
  baseUrl?: string;
  temperature?: number;
  maxTokens?: number;
  onDelta: (text: string) => void;
  onDone: () => void;
  onError: (err: string) => void;
};

const buildWorkspaceContext = (
  botName: string,
  contextLabel: string | undefined,
) => {
  return [
    `AI assistant: ${botName}`,
    contextLabel ? `Current workspace: ${contextLabel}` : "",
  ].filter(Boolean);
};

export const createMockAdapter = <T extends FeatureRecordBase>(
  config: MockAdapterConfig<T>,
) => {
  const ensureRecords = () => {
    const stored = loadFeatureRecords<T>(config.storageKey, []);
    if (stored.length > 0) return stored;
    saveFeatureRecords(config.storageKey, config.seedRecords);
    return config.seedRecords;
  };

  return {
    list: () => ensureRecords(),
    get: (id?: string | null) => {
      const items = ensureRecords();
      return id ? items.find((item) => item.id === id) ?? items[0] ?? null : items[0] ?? null;
    },
    create: (payload: Partial<T> & Record<string, unknown>) => {
      const record = {
        ...config.createRecord(payload),
        id: payload.id ? String(payload.id) : createFeatureId(config.idPrefix),
      } as T;
      const items = ensureRecords();
      const updated = upsertFeatureRecord(items, record);
      saveFeatureRecords(config.storageKey, updated);
      return record;
    },
    patch: (id: string, patch: Partial<T> & Record<string, unknown>) => {
      const items = ensureRecords();
      const current = items.find((item) => item.id === id);
      if (!current) return null;
      const next = config.patchRecord
        ? config.patchRecord(current, patch)
        : ({
            ...current,
            ...patch,
            updatedAt: Date.now(),
          } as T);
      const updated = upsertFeatureRecord(items, next);
      saveFeatureRecords(config.storageKey, updated);
      return next;
    },
    remove: (id: string) => {
      const items = ensureRecords();
      const updated = removeFeatureRecord(items, id);
      saveFeatureRecords(config.storageKey, updated);
      return updated;
    },
    duplicate: (id: string) => {
      const items = ensureRecords();
      const current = items.find((item) => item.id === id);
      if (!current) return null;
      const next = {
        ...current,
        id: createFeatureId(config.idPrefix),
        title: `${current.title}（副本）`,
        updatedAt: Date.now(),
      };
      const updated = upsertFeatureRecord(items, next);
      saveFeatureRecords(config.storageKey, updated);
      return next;
    },
    createChatTransport:
      (contextLabel?: string) =>
      ({
        messages,
        fileContext,
        mode,
        model,
        apiKey,
        baseUrl,
        temperature,
        maxTokens,
        onDelta,
        onDone,
        onError,
      }: ChatTransportArgs) => {
        const controller = new AbortController();
        let streamController: AbortController | null = null;

        controller.signal.addEventListener(
          "abort",
          () => {
            streamController?.abort();
          },
          { once: true },
        );

        const generatedContext = buildWorkspaceContext(config.botName, contextLabel);
        const combinedContext = [generatedContext, fileContext].filter(Boolean).join("\n\n");
        streamController = chatStream({
          messages,
          file_context: combinedContext || undefined,
          language: "text",
          mode,
          model,
          api_key: apiKey,
          base_url: baseUrl,
          temperature,
          max_tokens: maxTokens,
          onDelta,
          onDone,
          onError,
        });
        if (controller.signal.aborted) streamController.abort();

        return controller;
      },
  };
};
