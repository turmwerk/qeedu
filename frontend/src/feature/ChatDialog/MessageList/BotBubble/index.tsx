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
}

const BotBubble: React.FC<BotBubbleProps> = ({
  text,
  bodyRef,
  actionsPortalRef,
  messageIndex,
  onEditMessage,
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

  const handleRetry = () => {
    console.log("Retry:", text);
  };

  const handleDelete = () => {
    console.log("Delete:", text);
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(text);
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
    if (isEditing) {
      resizeTextarea();
    }
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

  const actionsContent = (
    <BotMessageActions
      onEdit={handleEdit}
      onSave={handleSaveEdit}
      editMode={isEditing}
      onRetry={handleRetry}
      onDelete={handleDelete}
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
        className="w-full rounded-md bg-[#f7f7f8] px-4 py-3 text-[#111827] shadow-sm"
        style={{
          wordBreak: "break-word",
          overflowWrap: "anywhere",
        }}
      >
        {isEditing ? (
          <textarea
            ref={textareaRef}
            value={editText}
            onChange={(e) => {
              setEditText(e.target.value);
              resizeTextarea();
            }}
            className="w-full resize-none bg-transparent text-[#111827] leading-relaxed outline-none"
            style={{ wordBreak: "break-word", overflowWrap: "anywhere", overflow: "hidden" }}
          />
        ) : (
          <MarkdownMessage text={deferredText} />
        )}
      </div>

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
