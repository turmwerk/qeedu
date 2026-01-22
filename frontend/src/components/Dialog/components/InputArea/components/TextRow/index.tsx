import React from "react";

interface TextRowProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  pending: boolean;
  placeholder: string;
}

const TextRow: React.FC<TextRowProps> = ({
  value,
  onChange,
  onSend,
  pending,
  placeholder,
}) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={pending ? "对方输入中..." : placeholder}
      onKeyDown={handleKeyDown}
      disabled={pending}
      rows={1}
      className="w-full px-2.5 py-1.5 disabled:bg-[#f7f4fb] disabled:text-[#7b6d92] focus:outline-none resize-none auto-resize-textarea"
      onInput={(e) => {
        const target = e.target as HTMLTextAreaElement;
        target.style.height = "auto";
        target.style.height = Math.min(target.scrollHeight, 200) + "px";
      }}
    />
  );
};

export default TextRow;
