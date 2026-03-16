import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import MessageList, {
  type DialogMessage,
} from "./MessageList";
import InputArea from "./InputArea";

interface DialogProps {
  dialogId: string;
  botName?: string;
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
  const replyTimeoutRef = useRef<number | null>(null);
  const isAtBottomRef = useRef(true);

  // 持久化消息
  React.useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(messages));
    } catch {}
  }, [messages, storageKey]);

  useEffect(() => {
    return () => {
      if (replyTimeoutRef.current !== null) {
        window.clearTimeout(replyTimeoutRef.current);
        replyTimeoutRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        setMessages(JSON.parse(raw));
        if (replyTimeoutRef.current !== null) {
          window.clearTimeout(replyTimeoutRef.current);
          replyTimeoutRef.current = null;
        }
        return;
      }
    } catch {}
    setMessages([{ from: "bot", text: initMessage }]);
    setInput("");
    setPending(false);
    if (replyTimeoutRef.current !== null) {
      window.clearTimeout(replyTimeoutRef.current);
      replyTimeoutRef.current = null;
    }
  }, [storageKey, initMessage]);

  const scrollToBottom = useCallback((behavior: ScrollBehavior = "auto") => {
    const body = bodyRef.current;
    if (!body) return;
    body.scrollTo({ top: body.scrollHeight, behavior });
  }, []);

  useEffect(() => {
    if (isAtBottomRef.current) {
      scrollToBottom();
    }
  }, [messages, pending, scrollToBottom]);

  const send = () => {
    if (!input.trim() || pending) return;
    const text = input;
    const sentFiles = [...files];
    setMessages((m) => [...m, { from: "user", text, files: sentFiles }]);
    setInput("");
    setFiles([]);
    setPending(true);
    const reply = `已收到：${text}${sentFiles.length > 0 ? ` 和 ${sentFiles.length} 个文件` : ""}`;
    scrollToBottom("smooth");
    replyTimeoutRef.current = window.setTimeout(() => {
      setMessages((m) => [...m, { from: "bot", text: reply }]);
      setPending(false);
      replyTimeoutRef.current = null;
    }, 600);
  };

  const stop = () => {
    if (!pending) return;
    if (replyTimeoutRef.current !== null) {
      window.clearTimeout(replyTimeoutRef.current);
      replyTimeoutRef.current = null;
    }
    setPending(false);
  };

  const handleAtBottomChange = (nextIsAtBottom: boolean) => {
    isAtBottomRef.current = nextIsAtBottom;
  };

  const handleEditMessage = useCallback((index: number, newText: string) => {
    setMessages((prevMessages) => {
      const updated = [...prevMessages];
      if (updated[index]) {
        updated[index] = { ...updated[index], text: newText };
      }
      return updated;
    });
  }, []);

  return (
    <div className="flex flex-col gap-3 h-full min-h-0 overflow-visible" data-oid="zx6bwsx">
      <div className="font-bold text-[var(--brand-text)]" data-oid="o.dphsl">
        {botName}
      </div>
      <MessageList
        messages={messages}
        pending={pending}
        bodyRef={bodyRef}
        onAtBottomChange={handleAtBottomChange}
        onScrollToBottom={() => scrollToBottom("smooth")}
        onEditMessage={handleEditMessage}
      />
      <InputArea
        input={input}
        onInputChange={setInput}
        onSend={send}
        onStop={stop}
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
