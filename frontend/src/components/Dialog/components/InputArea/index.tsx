import React, { useState } from "react";
import Dropdown, { type DropdownItem } from "@/components/Dropdown";
import FileUpload from "../FileUpload";

interface InputAreaProps {
  input: string;
  onInputChange: (value: string) => void;
  onSend: () => void;
  pending: boolean;
  placeholder?: string;
}

const InputArea: React.FC<InputAreaProps> = ({
  input,
  onInputChange,
  onSend,
  pending,
  placeholder = "输入消息，回车发送",
}) => {
  const [files, setFiles] = useState<File[]>([]);
  const [selectedMode, setSelectedMode] = useState<string>("Agent");
  const [selectedAI, setSelectedAI] = useState<string>("Claude Sonnet 4.5");

  // 模式选项
  const modeItems: DropdownItem[] = [
    {
      label: "Agent",
      active: selectedMode === "Agent",
      onClick: () => setSelectedMode("Agent"),
    },
    {
      label: "Ask",
      active: selectedMode === "Ask",
      onClick: () => setSelectedMode("Ask"),
    },
    {
      label: "Edit",
      active: selectedMode === "Edit",
      onClick: () => setSelectedMode("Edit"),
    },
    {
      label: "Plan",
      active: selectedMode === "Plan",
      onClick: () => setSelectedMode("Plan"),
    },
  ];

  // AI模型选项
  const aiItems: DropdownItem[] = [
    {
      label: "Claude Sonnet 4.5",
      active: selectedAI === "Claude Sonnet 4.5",
      onClick: () => setSelectedAI("Claude Sonnet 4.5"),
    },
    {
      label: "GPT-4",
      active: selectedAI === "GPT-4",
      onClick: () => setSelectedAI("GPT-4"),
    },
    {
      label: "Gemini Pro",
      active: selectedAI === "Gemini Pro",
      onClick: () => setSelectedAI("Gemini Pro"),
    },
  ];

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className="flex flex-col gap-2 border border-[var(--brand-border)] rounded-lg p-3 bg-white">
      {/* 第一行：文件上传 */}
      <FileUpload files={files} onFilesChange={setFiles} />

      {/* 第二行：输入框 */}
      <input
        value={input}
        onChange={(e) => onInputChange(e.target.value)}
        placeholder={pending ? "对方输入中..." : placeholder}
        onKeyDown={handleKeyDown}
        disabled={pending}
        className="w-full px-2.5 py-2 rounded-md border border-[var(--brand-border)] disabled:bg-[#f7f4fb] disabled:text-[#7b6d92] focus:outline-none focus:border-[var(--brand-accent)]"
      />

      {/* 第三行：模式选择、AI选择和发送按钮 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Dropdown
            items={modeItems}
            direction="up"
            showSelected={true}
            showCheck={true}
            buttonClassName="bg-white border border-[var(--brand-border)] text-[var(--brand-text)] px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-[var(--brand-accent-soft)] transition-colors"
          />
          <Dropdown
            items={aiItems}
            direction="up"
            showSelected={true}
            showCheck={true}
            buttonClassName="bg-white border border-[var(--brand-border)] text-[var(--brand-text)] px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-[var(--brand-accent-soft)] transition-colors"
          />
        </div>

        {/* 发送按钮 */}
        <button
          onClick={onSend}
          disabled={pending || !input.trim()}
          className="w-9 h-9 rounded-lg bg-[var(--brand-accent)] text-white flex items-center justify-center transition-all hover:bg-[var(--brand-accent-strong)] hover:shadow-[var(--brand-shadow)] disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {pending ? (
            <svg
              className="w-5 h-5 animate-spin"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          ) : (
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
};

export default InputArea;
