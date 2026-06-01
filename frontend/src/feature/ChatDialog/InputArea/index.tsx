import React, { useState, useMemo } from "react";
import { type DropdownItem } from "@/ui/Dropdown";
import { type ModelInfo } from "@/api/ai";
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
  models: ModelInfo[];
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
  models,
  selectedModel,
  onSelectModel,
  onAddCustom,
  onEditCustom,
}) => {
  const [selectedMode, setSelectedMode] = useState<string>("Agent");

  // 模式选项
  const modeItems: DropdownItem[] = [
    { label: "Agent", active: selectedMode === "Agent", onClick: () => setSelectedMode("Agent") },
    { label: "Ask",   active: selectedMode === "Ask",   onClick: () => setSelectedMode("Ask") },
    { label: "Edit",  active: selectedMode === "Edit",  onClick: () => setSelectedMode("Edit") },
    { label: "Plan",  active: selectedMode === "Plan",  onClick: () => setSelectedMode("Plan") },
  ];

  // AI模型选项 — 从后端真实模型列表生成
  const aiItems: DropdownItem[] = useMemo(() => {
    const items: DropdownItem[] = models.map((m) => {
      const isCustom = m.id.startsWith("__cfg_");
      return {
        label: (
          <span className="flex items-center gap-1">
            <span>
              <span className="font-medium">{m.name}</span>
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
        <span className="text-gray-500">
          ⚙ 添加自定义模型…
        </span>
      ),
      active: false,
      onClick: onAddCustom,
    });
    return items;
  }, [models, selectedModel, onSelectModel, onAddCustom, onEditCustom]);

  return (
    <div className="flex flex-col border border-[var(--brand-border)] rounded-xl bg-white overflow-visible transition-[border-color,box-shadow] hover:border-[var(--brand-accent)] hover:shadow-[0_4px_12px_rgba(59,130,246,0.15)]">
      <style>{`
        .auto-resize-textarea {
          min-height: 40px;
          max-height: 200px;
        }
      `}</style>
      <FileRow files={files} onFilesChange={onFilesChange} />
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
        disabled={!input.trim()}
      />
    </div>
  );
};

export default InputArea;
