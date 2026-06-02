import React, { useEffect, useRef } from "react";

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
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  const adjustHeight = () => {
    const target = textareaRef.current;
    if (target) {
      target.style.height = "auto";
      target.style.height = Math.min(target.scrollHeight, 200) + "px";
    }
  };

  useEffect(() => {
    adjustHeight();
  }, [value]);

  return (
    <textarea
      ref={textareaRef}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={pending ? "对方输入中（仍可输入）" : placeholder}
      onKeyDown={handleKeyDown}
      rows={1}
      className="chat-input-textarea w-full px-2.5 py-1.5 focus:outline-none resize-none auto-resize-textarea"
      onInput={adjustHeight}
    />
  );
};

export default TextRow;
