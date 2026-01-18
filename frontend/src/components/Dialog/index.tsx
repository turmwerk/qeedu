import React, { useEffect, useMemo, useRef, useState } from "react";

interface DialogMessage {
  from: "user" | "bot";
  text: string;
}

interface DialogProps {
  dialogId: string; // 唯一标识（如大纲id）
  botName?: string; // 机器人名字
  initMessage?: string; // 初始消息
}

const getStorageKey = (dialogId: string) => `dialog_messages_${dialogId}`;

const Dialog: React.FC<DialogProps> & {
  clearDialog: (dialogId: string) => void;
} = ({
  dialogId,
  botName = "对话助手",
  initMessage = "欢迎使用对话助手，你可以开始提问。",
}) => {
  const storageKey = useMemo(() => getStorageKey(dialogId), [dialogId]);
  const [messages, setMessages] = useState<DialogMessage[]>(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) return JSON.parse(raw);
    } catch {}
    return [{ from: "bot", text: initMessage }];
  });
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const bodyRef = useRef<HTMLDivElement | null>(null);

  // 持久化消息
  React.useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(messages));
    } catch {}
  }, [messages, storageKey]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        setMessages(JSON.parse(raw));
        return;
      }
    } catch {}
    setMessages([{ from: "bot", text: initMessage }]);
    setInput("");
    setPending(false);
  }, [storageKey, initMessage]);

  useEffect(() => {
    const body = bodyRef.current;
    if (!body) return;
    body.scrollTop = body.scrollHeight;
  }, [messages, pending]);

  const send = () => {
    if (!input.trim() || pending) return;
    const text = input;
    setMessages((m) => [...m, { from: "user", text }]);
    setInput("");
    setPending(true);
    const reply = `已收到：${text}`;
    setTimeout(() => {
      setMessages((m) => [...m, { from: "bot", text: reply }]);
      setPending(false);
    }, 600);
  };

  return (
    <div className="flex flex-col gap-3 h-full min-h-0 overflow-hidden" data-oid="zx6bwsx">
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
      <div className="font-bold text-[var(--brand-text)]" data-oid="o.dphsl">
        {botName}
      </div>
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
      <div className="flex gap-2" data-oid="h-1jfvy">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={pending ? "对方输入中..." : "输入消息，回车发送"}
          onKeyDown={(e) => {
            if (e.key === "Enter") send();
          }}
          disabled={pending}
          className="flex-1 px-2.5 py-2 rounded-md border border-[var(--brand-border)] disabled:bg-[#f7f4fb] disabled:text-[#7b6d92]"
          data-oid="5cs_3sk"
        />

        <button
          onClick={send}
          disabled={pending}
          className="px-3 py-2 rounded-md bg-[var(--brand-accent)] text-white border-0 cursor-pointer transition-[background,box-shadow] hover:bg-[var(--brand-accent-strong)] hover:shadow-[var(--brand-shadow)] disabled:opacity-60 disabled:cursor-default"
          data-oid="gfo9oi2"
        >
          发送
        </button>
      </div>
    </div>
  );
};

Dialog.clearDialog = (dialogId: string) => {
  try {
    localStorage.removeItem(getStorageKey(dialogId));
  } catch {}
};

export default Dialog;
