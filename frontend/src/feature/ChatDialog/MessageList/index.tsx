import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import UserBubble from "./UserBubble";
import BotBubble from "./BotBubble";
import FileChips from "./FileChips";
import PendingBubble from "./PendingBubble";
import ScrollToBottomButton from "./ScrollToBottomButton";
import CustomScrollbar from "./CustomScrollbar";

export interface DialogMessage {
  from: "user" | "bot";
  text: string;
  files?: File[];
}

interface MessageListProps {
  messages: DialogMessage[];
  pending: boolean;
  bodyRef: React.RefObject<HTMLDivElement | null>;
  onAtBottomChange?: (isAtBottom: boolean) => void;
  onScrollToBottom?: () => void;
  onEditMessage?: (index: number, newText: string) => void;
}

const MessageList: React.FC<MessageListProps> = ({
  messages,
  pending,
  bodyRef,
  onAtBottomChange,
  onScrollToBottom,
  onEditMessage,
}) => {
  const userMessageRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const pinnedActionsRef = useRef<HTMLDivElement | null>(null);
  const [markerPositions, setMarkerPositions] = useState<
    { index: number; topPercent: number; text: string }[]
  >([]);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isAtBottom, setIsAtBottom] = useState(true);

  const userMessageIndexes = useMemo(
    () =>
      messages
        .map((m, i) => (m.from === "user" ? i : -1))
        .filter((i) => i >= 0),
    [messages]
  );

  useLayoutEffect(() => {
    const body = bodyRef.current;
    if (!body) return;
    const totalHeight = Math.max(body.scrollHeight, 1);
    const nextPositions = userMessageIndexes
      .map((index) => {
        const el = userMessageRefs.current[index];
        if (!el) return null;
        const topPercent = Math.min(
          1,
          Math.max(0, el.offsetTop / totalHeight)
        );
        return {
          index,
          topPercent,
          text: messages[index]?.text ?? "",
        };
      })
      .filter(Boolean) as { index: number; topPercent: number; text: string }[];
    setMarkerPositions(nextPositions);
  }, [messages, userMessageIndexes, bodyRef]);

  useEffect(() => {
    const body = bodyRef.current;
    if (!body) return;
    const handleScroll = () => {
      const isAtBottom =
        body.scrollTop + body.clientHeight >= body.scrollHeight - 8;
      setIsAtBottom(isAtBottom);
      onAtBottomChange?.(isAtBottom);
    };
    handleScroll();
    body.addEventListener("scroll", handleScroll, { passive: true });
    return () => body.removeEventListener("scroll", handleScroll);
  }, [bodyRef, onAtBottomChange]);

  const handleMarkerClick = (index: number) => {
    const el = userMessageRefs.current[index];
    if (el && bodyRef.current) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return (
    <>
      <style data-oid=":8h575.">{`
        @keyframes dialogDotPulse {
          0%, 70%, 100% { transform: translateY(1px) scale(0.7); opacity: 0.4; }
          35% { transform: translateY(-2px) scale(1); opacity: 1; }
        }
        @keyframes dialogPendingIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .dialog-pending { animation: dialogPendingIn 0.8s ease; }
        .dialog-dot { animation: dialogDotPulse 1.4s infinite cubic-bezier(0.4, 0, 0.2, 1); }
        .dialog-dot.delay-1 { animation-delay: 1.44s; }
        .dialog-dot.delay-2 { animation-delay: 0.72s; }
        .marker-tooltip {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .hide-scrollbar {
          scrollbar-width: none; /* Firefox */
          -ms-overflow-style: none; /* IE 鍜?Edge */
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none; /* Chrome, Safari, Opera */
        }
      `}</style>
      <div className="relative flex-1 min-h-0 overflow-hidden">
        <div
          ref={bodyRef}
          className="absolute inset-0 bg-[var(--brand-accent-soft)] rounded-lg p-3 pr-4 flex flex-col gap-2 overflow-y-auto hide-scrollbar"
          data-oid="3i9rwq-"
        >
          {messages.map((m, i) => (
            <div
              key={i}
              ref={(el) => {
                if (m.from === "user") {
                  userMessageRefs.current[i] = el;
                }
              }}
              className={`flex flex-col gap-1.5 ${
                m.from === "user" ? "self-end items-end max-w-[80%]" : "self-start items-start w-full"
              }`}
              data-oid="jbj51yo"
            >
              {m.from === "user" ? (
                <UserBubble text={m.text} messageIndex={i} onEditMessage={onEditMessage} />
              ) : (
                <BotBubble text={m.text} bodyRef={bodyRef} actionsPortalRef={pinnedActionsRef} messageIndex={i} onEditMessage={onEditMessage} />
              )}
              {m.files && m.files.length > 0 && (
                <FileChips
                  files={m.files}
                  align={m.from === "user" ? "end" : "start"}
                />
              )}
            </div>
          ))}
          {pending && <PendingBubble />}
        </div>
        <div ref={pinnedActionsRef} className="absolute right-3 top-2 z-30 pointer-events-none" />
        <CustomScrollbar
          bodyRef={bodyRef}
          markers={markerPositions}
          onMarkerClick={handleMarkerClick}
          hoveredIndex={hoveredIndex}
          setHoveredIndex={setHoveredIndex}
          messages={messages}
        />
        <ScrollToBottomButton
          isAtBottom={isAtBottom}
          onClick={() => onScrollToBottom?.()}
        />
      </div>
    </>
  );
};

export default MessageList;
