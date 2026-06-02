import React, { useState } from "react";
import { createPortal } from "react-dom";

export interface CustomModelConfig {
  id: string;
  name: string;
  apiKey: string;
  baseUrl: string;
  modelId: string;
  temperature: number;
  maxTokens: number;
}

interface Preset {
  name: string;
  baseUrl: string;
  models: string[];
}

const PRESETS: Preset[] = [
  {
    name: "OpenRouter",
    baseUrl: "https://openrouter.ai/api/v1",
    models: ["liquid/lfm-2.5-1.2b-instruct:free"],
  },
  {
    name: "DeepSeek",
    baseUrl: "https://api.deepseek.com",
    models: ["deepseek-v4-pro"],
  },
  {
    name: "自定义 (OpenAI 兼容)",
    baseUrl: "",
    models: [],
  },
];

interface Props {
  initial?: CustomModelConfig | null;
  onSave: (cfg: CustomModelConfig) => void;
  onClose: () => void;
}

const CustomModelModal: React.FC<Props> = ({ initial, onSave, onClose }) => {
  const [presetIdx, setPresetIdx] = useState(() => {
    if (!initial?.baseUrl) return 0;
    const idx = PRESETS.findIndex((p) => p.baseUrl === initial.baseUrl);
    return idx >= 0 ? idx : PRESETS.length - 1;
  });
  const [name, setName] = useState(initial?.name || "");
  const [apiKey, setApiKey] = useState(initial?.apiKey || "");
  const [baseUrl, setBaseUrl] = useState(initial?.baseUrl || PRESETS[0].baseUrl);
  const [modelId, setModelId] = useState(initial?.modelId || "");
  const [temperature, setTemperature] = useState(initial?.temperature ?? 0.7);
  const [maxTokens, setMaxTokens] = useState(initial?.maxTokens ?? 4096);
  const [showKey, setShowKey] = useState(false);

  const preset = PRESETS[presetIdx];
  const formatModelLabel = (model: string) =>
    model
      .replace(/:free$/i, "")
      .replace(/^liquid\/lfm-2\.5-1\.2b-instruct$/i, "LFM2.5 Instruct")
      .trim();

  const handlePreset = (idx: number) => {
    setPresetIdx(idx);
    const p = PRESETS[idx];
    setBaseUrl(p.baseUrl);
    if (p.models.length > 0) setModelId(p.models[0]);
    if (!name) setName(p.name);
  };

  const handleSave = () => {
    onSave({
      id: initial?.id || `custom_${Date.now().toString(36)}`,
      name: name || preset.name || "自定义",
      apiKey: apiKey.trim(),
      baseUrl: baseUrl.trim(),
      modelId: modelId.trim(),
      temperature,
      maxTokens,
    });
    onClose();
  };

  const isValid = apiKey.trim() && modelId.trim() && baseUrl.trim();

  const modal = (
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onMouseDown={onClose}
    >
      <div
        className="chat-custom-model-modal bg-white rounded-2xl shadow-2xl w-[560px] max-w-[95vw] max-h-[90vh] overflow-auto"
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="chat-custom-model-header sticky top-0 bg-white px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-800">自定义模型配置</h2>
          <button className="text-gray-400 hover:text-gray-600 text-xl leading-none" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="px-6 py-4 space-y-4">
          {/* 配置名称 */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">配置名称</label>
            <input
              type="text"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100"
              placeholder="我的自定义配置"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* 模型厂商预设 */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">模型厂商</label>
            <div className="flex flex-wrap gap-1.5">
              {PRESETS.map((p, i) => (
                <button
                  key={p.name}
                  className={`px-2.5 py-1 text-xs rounded-lg border transition-colors ${
                    i === presetIdx
                      ? "bg-blue-50 border-blue-300 text-blue-700 font-medium"
                      : "bg-white border-gray-200 text-gray-600 hover:border-gray-300"
                  }`}
                  onClick={() => handlePreset(i)}
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>

          {/* Base URL */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Base URL</label>
            <input
              type="text"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100"
              placeholder="https://api.openai.com/v1"
              value={baseUrl}
              onChange={(e) => {
                setBaseUrl(e.target.value);
                setPresetIdx(PRESETS.length - 1); // switch to custom
              }}
            />
          </div>

          {/* API Key */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">API Key</label>
            <div className="flex gap-1.5">
              <input
                type={showKey ? "text" : "password"}
                className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100"
                placeholder="sk-..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
              />
              <button
                className="px-2.5 text-xs text-gray-400 hover:text-gray-600 border border-gray-200 rounded-lg"
                onClick={() => setShowKey(!showKey)}
              >
                {showKey ? "隐藏" : "显示"}
              </button>
            </div>
            <p className="text-[10px] text-amber-500 mt-1">
              API Key 会随本次请求发送到后端网关，用于调用你选择的模型服务。请勿在公共设备上保存。
            </p>
          </div>

          {/* Model ID */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">模型 ID</label>
            {preset.models.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-1.5">
                {preset.models.map((m) => (
                  <button
                    key={m}
                    className={`px-2 py-0.5 text-[11px] rounded-md border transition-colors ${
                      modelId === m
                        ? "bg-green-50 border-green-300 text-green-700"
                        : "bg-gray-50 border-gray-200 text-gray-500 hover:border-gray-300"
                    }`}
                    onClick={() => setModelId(m)}
                  >
                    {formatModelLabel(m)}
                  </button>
                ))}
              </div>
            )}
            <input
              type="text"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100"
              placeholder={preset.models.length > 0 ? "或输入自定义模型 ID…" : "输入模型 ID，如 gpt-4o"}
              value={modelId}
              onChange={(e) => setModelId(e.target.value)}
            />
          </div>

          {/* Temperature & Max Tokens */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                温度 ({temperature})
              </label>
              <input
                type="range"
                min="0"
                max="2"
                step="0.1"
                className="w-full accent-blue-500"
                value={temperature}
                onChange={(e) => setTemperature(parseFloat(e.target.value))}
              />
              <div className="flex justify-between text-[10px] text-gray-400">
                <span>精确</span>
                <span>创造</span>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">最大 Token</label>
              <input
                type="number"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
                min={64}
                max={131072}
                step={256}
                value={maxTokens}
                onChange={(e) => setMaxTokens(parseInt(e.target.value) || 4096)}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="chat-custom-model-footer sticky bottom-0 bg-gray-50 px-6 py-3 border-t border-gray-100 flex justify-between items-center rounded-b-2xl">
          <span className="text-[11px] text-gray-400">配置仅保存到当前浏览器</span>
          <div className="flex gap-2">
            <button
              className="px-4 py-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors"
              onClick={onClose}
            >
              取消
            </button>
            <button
              className={`px-5 py-1.5 text-sm rounded-lg font-medium transition-colors ${
                isValid
                  ? "bg-blue-500 text-white hover:bg-blue-600"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
              onClick={handleSave}
              disabled={!isValid}
            >
              保存配置
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
};

export default CustomModelModal;
export { PRESETS };
