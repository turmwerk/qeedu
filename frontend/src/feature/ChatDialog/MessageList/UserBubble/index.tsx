import React, { useLayoutEffect, useRef, useState } from "react";
import UserMessageActions from "../UserMessageActions";

interface UserBubbleProps {
  text: string;
  messageIndex?: number;
  onEditMessage?: (index: number, newText: string) => void;
  onRetry?: () => void;
  onDelete?: () => void;
  versions?: string[];
  versionIndex?: number;
  onSwitchVersion?: (versionIndex: number) => void;
}

const UserBubble: React.FC<UserBubbleProps> = ({
  text,
  messageIndex,
  onEditMessage,
  onRetry,
  onDelete,
  versions,
  versionIndex,
  onSwitchVersion,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(text);
  const [baseWidth, setBaseWidth] = useState<number | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const bubbleRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const resizeTextarea = () => {
    if (!textareaRef.current) return;
    const ta = textareaRef.current;
    ta.style.height = "auto";
    ta.style.height = `${ta.scrollHeight}px`;
  };

  useLayoutEffect(() => {
    if (isEditing) resizeTextarea();
  }, [editText, isEditing]);

  const handleEdit = () => {
    if (bubbleRef.current) {
      setBaseWidth(bubbleRef.current.getBoundingClientRect().width);
    }
    setIsEditing(true);
    setEditText(text);
    requestAnimationFrame(resizeTextarea);
  };

  const handleSave = () => {
    if (messageIndex !== undefined && onEditMessage) {
      onEditMessage(messageIndex, editText);
    }
    setIsEditing(false);
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(text);
  };

  const handleCopyMarkdown = () => {
    navigator.clipboard.writeText(text);
  };

  const hasVersions = versions && versions.length > 1;
  const currentVi = versionIndex ?? 0;
  const totalVersions = versions?.length ?? 1;

  return (
    <div
      ref={wrapperRef}
      className="relative max-w-[80%]"
      style={{
        minWidth: isEditing && baseWidth ? `${baseWidth}px` : undefined,
        maxWidth: isEditing && baseWidth ? `${baseWidth}px` : undefined,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        ref={bubbleRef}
        className={`bg-[#e0f2f1] text-[#0f3f3b] px-3 py-2 rounded-xl border transition-[border-color] ${
          isEditing ? "border-[#14b8a6]" : "border-transparent hover:border-[#14b8a6]"
        }`}
        style={{ wordBreak: "break-word", overflowWrap: "anywhere", boxSizing: "border-box" }}
      >
        {isEditing ? (
          <textarea
            ref={textareaRef}
            value={editText}
            onChange={(e) => { setEditText(e.target.value); resizeTextarea(); }}
            onKeyDown={(e) => {
              if (e.key === "Escape") { setIsEditing(false); setEditText(text); }
            }}
            className="w-full bg-transparent text-[#0f3f3b] leading-relaxed outline-none resize-none"
            style={{ wordBreak: "break-word", overflowWrap: "anywhere", overflow: "hidden" }}
          />
        ) : (
          text
        )}
      </div>

      {/* Version navigation */}
      {hasVersions && (
        <div className="flex items-center justify-end gap-1 mt-1 text-[11px] text-gray-400">
          <button
            className="px-1 hover:text-gray-600 disabled:opacity-30"
            disabled={currentVi <= 0}
            onClick={() => onSwitchVersion?.(currentVi - 1)}
          >
            ◀
          </button>
          <span>{currentVi + 1}/{totalVersions}</span>
          <button
            className="px-1 hover:text-gray-600 disabled:opacity-30"
            disabled={currentVi >= totalVersions - 1}
            onClick={() => onSwitchVersion?.(currentVi + 1)}
          >
            ▶
          </button>
        </div>
      )}

      <div
        className={`absolute -top-6 right-0 z-10 transition-[opacity,transform] duration-200 ease-out ${
          isHovered || isEditing ? "opacity-100 translate-x-0 pointer-events-auto" : "opacity-0 translate-x-2 pointer-events-none"
        }`}
      >
        <UserMessageActions
          onEdit={handleEdit}
          onSave={handleSave}
          editMode={isEditing}
          onRetry={onRetry ?? (() => {})}
          onDelete={onDelete ?? (() => {})}
          onCopyText={handleCopyText}
          onCopyMarkdown={handleCopyMarkdown}
        />
      </div>
    </div>
  );
};

export default UserBubble;
