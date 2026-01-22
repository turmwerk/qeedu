import React, { useEffect, useMemo, useRef, useState } from "react";
import MessageList, {
  type DialogMessage,
} from "./components/MessageList";
import InputArea from "./components/InputArea";

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
  const [files, setFiles] = useState<File[]>([]);
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
    const sentFiles = [...files];
    setMessages((m) => [...m, { from: "user", text, files: sentFiles }]);
    setInput("");
    setFiles([]);
    setPending(true);
    const reply = `已收到：${text}${sentFiles.length > 0 ? ` 和 ${sentFiles.length} 个文件` : ''}`;
    setTimeout(() => {
      setMessages((m) => [...m, { from: "bot", text: reply }]);
      setPending(false);
    }, 600);
  };

  return (
    <div className="flex flex-col gap-3 h-full min-h-0 overflow-visible" data-oid="zx6bwsx">
      <div className="font-bold text-[var(--brand-text)]" data-oid="o.dphsl">
        {botName}
      </div>
      <MessageList messages={messages} pending={pending} bodyRef={bodyRef} />
      <InputArea
        input={input}
        onInputChange={setInput}
        onSend={send}
        pending={pending}
        files={files}
        onFilesChange={setFiles}
      />
    </div>
  );
};

Dialog.clearDialog = (dialogId: string) => {
  try {
    localStorage.removeItem(getStorageKey(dialogId));
  } catch {}
};

export default Dialog;
