import React, { useMemo } from "react";
import { type DropdownItem } from "@/ui/Dropdown";
import { type ChatMode, type ModelInfo } from "@/api/ai";
import FileRow from "./FileRow";
import TextRow from "./TextRow";
import ControlRow from "./ControlRow";

interface InputAreaProps {
  input: string;
  onInputChange: (value: string) => void;
  onSend: () => void;
  onStop: () => void;
  pending: boolean;
  placeholder?: string;
  files: File[];
  onFilesChange: (files: File[]) => void;
  suggestedFiles?: File[];
  models: ModelInfo[];
  selectedMode: ChatMode;
  onModeChange: (mode: ChatMode) => void;
  selectedModel: string;
  onSelectModel: (id: string) => void;
  onAddCustom: () => void;
  onEditCustom?: (id: string) => void;
}

const InputArea: React.FC<InputAreaProps> = ({
  input,
  onInputChange,
  onSend,
  onStop,
  pending,
  placeholder = "输入消息，回车发送",
  files,
  onFilesChange,
  suggestedFiles,
  models,
  selectedMode,
  onModeChange,
  selectedModel,
  onSelectModel,
  onAddCustom,
  onEditCustom,
}) => {
  const formatModelName = (name: string) =>
    name
      .replace(/\s*\(free\)\s*/gi, "")
      .replace(/^LFM2\.5-1\.2B Instruct$/i, "LFM2.5 Instruct")
      .trim();

  // 模式选项
  const modeItems: DropdownItem[] = [
    { label: "Agent", active: selectedMode === "agent", onClick: () => onModeChange("agent") },
    { label: "Ask", active: selectedMode === "ask", onClick: () => onModeChange("ask") },
    { label: "Plan", active: selectedMode === "plan", onClick: () => onModeChange("plan") },
  ];

  // AI模型选项 — 从后端真实模型列表生成
  const aiItems: DropdownItem[] = useMemo(() => {
    const items: DropdownItem[] = models.map((m) => {
      const isCustom = m.id.startsWith("__cfg_");
      return {
        label: (
          <span className="flex min-w-0 max-w-[150px] items-center gap-1 sm:max-w-[190px]">
            <span className="min-w-0">
              <span className="block truncate font-medium">{formatModelName(m.name)}</span>
            </span>
            {isCustom && onEditCustom && (
              <span
                className="ml-auto pl-2 text-gray-400 hover:text-blue-500 cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  onEditCustom(m.id);
                }}
              >
                ✎
              </span>
            )}
          </span>
        ),
        active: selectedModel === m.id,
        onClick: () => onSelectModel(m.id),
      };
    });
    // 自定义模型
    items.push({
      label: (
        <span className="block max-w-[150px] truncate text-gray-500 sm:max-w-[190px]">
          ⚙ 添加自定义模型…
        </span>
      ),
      active: false,
      onClick: onAddCustom,
    });
    return items;
  }, [models, selectedModel, onSelectModel, onAddCustom, onEditCustom]);

  return (
    <div className="chat-input-area flex flex-col border border-[var(--brand-border)] rounded-xl bg-white overflow-visible transition-[border-color,box-shadow] hover:border-[var(--brand-accent)] hover:shadow-[0_4px_12px_rgba(59,130,246,0.15)]">
      <style>{`
        .auto-resize-textarea {
          min-height: 40px;
          max-height: 200px;
        }
      `}</style>
      <FileRow files={files} onFilesChange={onFilesChange} suggestedFiles={suggestedFiles} />
      <TextRow
        value={input}
        onChange={onInputChange}
        onSend={onSend}
        pending={pending}
        placeholder={placeholder}
      />
      <ControlRow
        modeItems={modeItems}
        aiItems={aiItems}
        onSend={onSend}
        onStop={onStop}
        pending={pending}
        disabled={!input.trim() && files.length === 0}
      />
    </div>
  );
};

export default InputArea;
