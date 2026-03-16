import React, { useState } from "react";
import { type DropdownItem } from "@/ui/Dropdown";
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
