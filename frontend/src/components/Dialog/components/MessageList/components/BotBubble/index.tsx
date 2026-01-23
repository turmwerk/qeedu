import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import BotMessageActions from "../BotMessageActions";

interface BotBubbleProps {
  text: string;
  bodyRef: React.RefObject<HTMLDivElement | null>;
  actionsPortalRef: React.RefObject<HTMLDivElement | null>;
  messageIndex?: number;
  onEditMessage?: (index: number, newText: string) => void;
}

const BotBubble: React.FC<BotBubbleProps> = ({ text, bodyRef, actionsPortalRef, messageIndex, onEditMessage }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const [portalElement, setPortalElement] = useState<HTMLElement | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(text);
  const [baseHeight, setBaseHeight] = useState<number | null>(null);
  const bubbleRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const handleEdit = () => {
    if (bubbleRef.current) {
      setBaseHeight(bubbleRef.current.offsetHeight);
    }
    setEditText(text);
    setIsEditing(true);
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

  useLayoutEffect(() => {
    if (isEditing && bubbleRef.current) {
      setBaseHeight(bubbleRef.current.offsetHeight);
    }
  }, [isEditing]);

  useEffect(() => {
    if (isEditing && textareaRef.current && baseHeight !== null) {
      const ta = textareaRef.current;
      ta.style.height = `${baseHeight}px`;
    }
  }, [isEditing, baseHeight]);

  useEffect(() => {
    const body = bodyRef.current;
    if (!body || !isHovered) {
      setIsPinned(false);
      return;
    }

    const updatePinned = () => {
      const bubble = bubbleRef.current;
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
      ref={bubbleRef}
      className="relative w-full pr-10"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        ref={bubbleRef}
        className="w-full bg-[#f1f0fb] text-[#2d1b4f] px-3 py-2 rounded-xl border border-transparent hover:border-[var(--brand-accent)] transition-[border-color]"
        style={{
          wordBreak: 'break-word',
          overflowWrap: 'anywhere',
          height: isEditing && baseHeight !== null ? `${baseHeight}px` : undefined,
        }}
      >
        {isEditing ? (
          <textarea
            ref={textareaRef}
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            className="w-full h-full bg-transparent text-[#2d1b4f] leading-relaxed outline-none resize-none"
            style={{ wordBreak: 'break-word', overflowWrap: 'anywhere', overflow: 'hidden' }}
          />
        ) : (
          text
        )}
      </div>

      {!isPinned && (
        <div 
          className={`absolute -top-6 right-0 z-10 transition-[opacity,transform] duration-200 ease-out ${isHovered || isEditing ? 'opacity-100 translate-x-0 pointer-events-auto' : 'opacity-0 translate-x-2 pointer-events-none'}`}
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
            portalElement
          )
        : null}
    </div>
  );
};

export default BotBubble;
