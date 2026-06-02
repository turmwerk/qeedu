import React, { useDeferredValue, useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import BotMessageActions from "../BotMessageActions";
import MarkdownMessage from "./MarkdownMessage";

interface BotBubbleProps {
  text: string;
  bodyRef: React.RefObject<HTMLDivElement | null>;
  actionsPortalRef: React.RefObject<HTMLDivElement | null>;
  messageIndex?: number;
  onEditMessage?: (index: number, newText: string) => void;
  onRetry?: () => void;
  onDelete?: () => void;
  versions?: string[];
  versionIndex?: number;
  onSwitchVersion?: (versionIndex: number) => void;
}

const BotBubble: React.FC<BotBubbleProps> = ({
  text,
  bodyRef,
  actionsPortalRef,
  messageIndex,
  onEditMessage,
  onRetry,
  onDelete,
  versions,
  versionIndex,
  onSwitchVersion,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const [portalElement, setPortalElement] = useState<HTMLElement | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(text);
  const [renderText, setRenderText] = useState(text);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const deferredText = useDeferredValue(renderText);

  const resizeTextarea = () => {
    if (!textareaRef.current) return;
    const ta = textareaRef.current;
    ta.style.height = "auto";
    ta.style.height = `${ta.scrollHeight}px`;
  };

  const handleEdit = () => {
    setEditText(text);
    setIsEditing(true);
    requestAnimationFrame(resizeTextarea);
  };

  const handleSaveEdit = () => {
    if (messageIndex !== undefined && onEditMessage) {
      onEditMessage(messageIndex, editText);
    }
    setIsEditing(false);
  };

  const handleCopyText = () => {
    const plain = text
      .replace(/```[\s\S]*?```/g, (m) => m.replace(/```\w*\n?/g, "").replace(/```$/g, ""))
      .replace(/\*\*(.*?)\*\*/g, "$1")
      .replace(/\*(.*?)\*/g, "$1")
      .replace(/`(.*?)`/g, "$1")
      .replace(/^#{1,6}\s+/gm, "")
      .replace(/^\s*[-*+]\s+/gm, "- ")
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");
    navigator.clipboard.writeText(plain);
  };

  const handleCopyMarkdown = () => {
    navigator.clipboard.writeText(text);
  };

  useEffect(() => {
    setPortalElement(actionsPortalRef.current);
  }, [actionsPortalRef]);

  useEffect(() => {
    if (text === renderText) return;
    const timer = window.setTimeout(() => setRenderText(text), 80);
    return () => window.clearTimeout(timer);
  }, [renderText, text]);

  useLayoutEffect(() => {
    if (isEditing) resizeTextarea();
  }, [editText, isEditing]);

  useEffect(() => {
    const body = bodyRef.current;
    if (!body || !isHovered) {
      setIsPinned(false);
      return;
    }
    const updatePinned = () => {
      const bubble = containerRef.current;
      const container = bodyRef.current;
      if (!bubble || !container) return;
      const bubbleRect = bubble.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      setIsPinned(bubbleRect.top < containerRect.top);
    };
    updatePinned();
    body.addEventListener("scroll", updatePinned, { passive: true });
    window.addEventListener("resize", updatePinned);
    return () => {
      body.removeEventListener("scroll", updatePinned);
      window.removeEventListener("resize", updatePinned);
    };
  }, [bodyRef, isHovered]);

  const hasVersions = versions && versions.length > 1;
  const currentVi = versionIndex ?? 0;
  const totalVersions = versions?.length ?? 1;

  const actionsContent = (
    <BotMessageActions
      onEdit={handleEdit}
      onSave={handleSaveEdit}
      editMode={isEditing}
      onRetry={onRetry ?? (() => {})}
      onDelete={onDelete ?? (() => {})}
      onCopyText={handleCopyText}
      onCopyMarkdown={handleCopyMarkdown}
    />
  );

  return (
    <div
      ref={containerRef}
      className="relative w-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className="chat-bot-bubble w-full rounded-md bg-[#f7f7f8] px-4 py-3 text-[#111827] shadow-sm"
        style={{ wordBreak: "break-word", overflowWrap: "anywhere" }}
      >
        {isEditing ? (
          <textarea
            ref={textareaRef}
            value={editText}
            onChange={(e) => { setEditText(e.target.value); resizeTextarea(); }}
            className="chat-bot-edit w-full resize-none bg-transparent text-[#111827] leading-relaxed outline-none"
            style={{ wordBreak: "break-word", overflowWrap: "anywhere", overflow: "hidden" }}
          />
        ) : (
          <MarkdownMessage text={deferredText} />
        )}
      </div>

      {/* Version navigation */}
      {hasVersions && (
        <div className="chat-version-nav flex items-center gap-1 mt-1 text-[11px] text-gray-400">
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

      {!isPinned && (
        <div
          className={`absolute -top-6 right-0 z-10 transition-[opacity,transform] duration-200 ease-out ${
            isHovered || isEditing
              ? "opacity-100 translate-x-0 pointer-events-auto"
              : "opacity-0 translate-x-2 pointer-events-none"
          }`}
        >
          {actionsContent}
        </div>
      )}
      {isPinned && portalElement
        ? createPortal(
            <div
              className="transition-[opacity,transform] duration-200 ease-out pointer-events-auto"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              {actionsContent}
            </div>,
            portalElement,
          )
        : null}
    </div>
  );
};

export default BotBubble;
