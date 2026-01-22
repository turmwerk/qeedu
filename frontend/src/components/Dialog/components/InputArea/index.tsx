import React, { useState } from "react";
import Dropdown, { type DropdownItem } from "@/components/Dropdown";
import Button from "@/components/Button";
import FileUpload from "../FileUpload";

interface InputAreaProps {
  input: string;
  onInputChange: (value: string) => void;
  onSend: () => void;
  pending: boolean;
  placeholder?: string;
  files: File[];
  onFilesChange: (files: File[]) => void;
}

const InputArea: React.FC<InputAreaProps> = ({
  input,
  onInputChange,
  onSend,
  pending,
  placeholder = "输入消息，回车发送",
  files,
  onFilesChange,
}) => {
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
    <div className="flex flex-col border border-[var(--brand-border)] rounded-xl bg-white overflow-visible transition-[border-color,box-shadow] hover:border-[var(--brand-accent)] hover:shadow-[0_4px_12px_rgba(59,130,246,0.15)]">
      <style>{`
        .auto-resize-textarea {
          min-height: 40px;
          max-height: 200px;
        }
      `}</style>
      {/* 第一行：文件上传 */}
      <div className="px-2.5 pt-1.5 pb-1">
        <FileUpload files={files} onFilesChange={onFilesChange} />
      </div>

      {/* 第二行：输入框 */}
      <textarea
        value={input}
        onChange={(e) => onInputChange(e.target.value)}
        placeholder={pending ? "对方输入中..." : placeholder}
        onKeyDown={handleKeyDown}
        disabled={pending}
        rows={1}
        className="w-full px-2.5 py-1.5 disabled:bg-[#f7f4fb] disabled:text-[#7b6d92] focus:outline-none resize-none auto-resize-textarea"
        onInput={(e) => {
          const target = e.target as HTMLTextAreaElement;
          target.style.height = 'auto';
          target.style.height = Math.min(target.scrollHeight, 200) + 'px';
        }}
      />

      {/* 第三行：模式选择、AI选择和发送按钮 */}
      <div className="flex items-center justify-between px-2.5 py-1.5">
        <div className="flex items-center gap-2 relative z-[250]">
          <Dropdown
            items={modeItems}
            direction="up"
            showSelected={true}
            showCheck={true}
            buttonClassName="bg-white border border-[var(--brand-border)] text-[var(--brand-text)] px-2.5 py-1 rounded-xl text-sm font-medium transition-[background,border-color,box-shadow] hover:bg-[var(--brand-accent-soft)] hover:border-[var(--brand-accent)] hover:shadow-[0_4px_12px_rgba(59,130,246,0.15)]"
          />
          <Dropdown
            items={aiItems}
            direction="up"
            showSelected={true}
            showCheck={true}
            buttonClassName="bg-white border border-[var(--brand-border)] text-[var(--brand-text)] px-2.5 py-1 rounded-xl text-sm font-medium transition-[background,border-color,box-shadow] hover:bg-[var(--brand-accent-soft)] hover:border-[var(--brand-accent)] hover:shadow-[0_4px_12px_rgba(59,130,246,0.15)]"
          />
        </div>

        {/* 发送按钮 */}
        <Button
          variant="primary"
          size="sm"
          onClick={onSend}
          disabled={pending || !input.trim()}
          className="!w-9 !h-9 !p-0 flex items-center justify-center"
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
        </Button>
      </div>
    </div>
  );
};

export default InputArea;
