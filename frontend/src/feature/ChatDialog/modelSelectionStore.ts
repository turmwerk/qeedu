import { create } from "zustand";

export interface CustomModelSelection {
  id: string;
  name: string;
  apiKey: string;
  baseUrl: string;
  modelId: string;
  temperature: number;
  maxTokens: number;
}

const CUSTOM_CONFIGS_KEY = "custom_model_configs";
const SELECTED_MODEL_KEY = "selected_ai_model";

function loadSelectedModel(): string {
  try {
    const raw = localStorage.getItem(SELECTED_MODEL_KEY);
    if (raw) return raw;
  } catch {}
  return "";
}

function loadCustomConfigs(): CustomModelSelection[] {
  try {
    const raw = localStorage.getItem(CUSTOM_CONFIGS_KEY);
    const parsed = raw ? (JSON.parse(raw) as CustomModelSelection[]) : [];
    return parsed.map((cfg, index) => ({
      id: cfg.id || `custom_${index.toString(36)}`,
      name: cfg.name,
      apiKey: cfg.apiKey,
      baseUrl: cfg.baseUrl,
      modelId: cfg.modelId,
      temperature: cfg.temperature ?? 0.7,
      maxTokens: cfg.maxTokens ?? 4096,
    }));
  } catch {
    return [];
  }
}

interface ModelSelectionState {
  selectedModel: string;
  customConfigs: CustomModelSelection[];
  setSelectedModel: (modelId: string) => void;
  setCustomConfigs: (configs: CustomModelSelection[]) => void;
  upsertCustomConfig: (config: CustomModelSelection) => void;
}

export const useModelSelectionStore = create<ModelSelectionState>((set) => ({
  selectedModel: loadSelectedModel(),
  customConfigs: loadCustomConfigs(),
  setSelectedModel: (modelId) => {
    try {
      localStorage.setItem(SELECTED_MODEL_KEY, modelId);
    } catch {}
    set({ selectedModel: modelId });
  },
  setCustomConfigs: (configs) => {
    try {
      localStorage.setItem(CUSTOM_CONFIGS_KEY, JSON.stringify(configs));
    } catch {}
    set({ customConfigs: configs });
  },
  upsertCustomConfig: (config) =>
    set((state) => {
      const next = state.customConfigs.some((item) => item.id === config.id)
        ? state.customConfigs.map((item) => (item.id === config.id ? config : item))
        : [...state.customConfigs, config];
      try {
        localStorage.setItem(CUSTOM_CONFIGS_KEY, JSON.stringify(next));
      } catch {}
      return { customConfigs: next };
    }),
}));

export function resolveSelectedModelConfig() {
  const { selectedModel, customConfigs } = useModelSelectionStore.getState();
  if (selectedModel.startsWith("__cfg_")) {
    const cfg = customConfigs.find((item) => `__cfg_${item.id}` === selectedModel);
    if (cfg) {
      return {
        model: cfg.modelId,
        apiKey: cfg.apiKey,
        baseUrl: cfg.baseUrl,
        temperature: cfg.temperature,
        maxTokens: cfg.maxTokens,
      };
    }
  }

  return {
    model: selectedModel || undefined,
  };
}
