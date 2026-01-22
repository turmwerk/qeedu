import React from "react";

export interface DialogMessage {
  from: "user" | "bot";
  text: string;
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
            className={
              m.from === "user"
                ? "self-end bg-[var(--brand-accent)] text-white px-3 py-2 rounded-xl max-w-[80%]"
                : "self-start bg-[#f1f0fb] text-[#2d1b4f] px-3 py-2 rounded-xl max-w-[80%]"
            }
            data-oid="jbj51yo"
          >
            {m.text}
          </div>
        ))}
        {pending && (
          <div
            className="dialog-pending self-start bg-[#f1f0fb] text-[#2d1b4f] px-3 py-2 rounded-xl flex gap-1.5"
            data-oid="iac808a"
          >
            <span
              className="dialog-dot w-1.5 h-1.5 rounded-full bg-[#6b4da6] inline-block"
              data-oid="zmetvfc"
            />
            <span
              className="dialog-dot delay-1 w-1.5 h-1.5 rounded-full bg-[#6b4da6] inline-block"
              data-oid="jiu771e"
            />
            <span
              className="dialog-dot delay-2 w-1.5 h-1.5 rounded-full bg-[#6b4da6] inline-block"
              data-oid="pzx_deb"
            />
          </div>
        )}
      </div>
    </>
  );
};

export default MessageList;
