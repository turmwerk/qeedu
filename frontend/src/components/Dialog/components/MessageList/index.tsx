import React from "react";
import UserBubble from "./components/UserBubble";
import BotBubble from "./components/BotBubble";
import FileChips from "./components/FileChips";
import PendingBubble from "./components/PendingBubble";

export interface DialogMessage {
  from: "user" | "bot";
  text: string;
  files?: File[];
}

interface MessageListProps {
  messages: DialogMessage[];
  pending: boolean;
  bodyRef: React.RefObject<HTMLDivElement | null>;
}

const MessageList: React.FC<MessageListProps> = ({
  messages,
  pending,
  bodyRef,
}) => {
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
      `}</style>
      <div
        ref={bodyRef}
        className="flex-1 min-h-0 bg-[var(--brand-accent-soft)] rounded-lg p-3 flex flex-col gap-2 overflow-y-scroll"
        data-oid="3i9rwq-"
      >
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex flex-col gap-1.5 ${
              m.from === "user" ? "self-end items-end" : "self-start items-start"
            }`}
            data-oid="jbj51yo"
          >
            {m.from === "user" ? (
              <UserBubble text={m.text} />
            ) : (
              <BotBubble text={m.text} />
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
    </>
  );
};

export default MessageList;
