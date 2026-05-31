import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import MessageList, { type DialogMessage } from "./MessageList";
import InputArea from "./InputArea";
import { chatStream, getModels, type ChatMessage, type ModelInfo } from "@/api/ai";

interface DialogProps {
  dialogId: string;
  botName?: string;
  initMessage?: string;
  seedMessages?: DialogMessage[];
  transport?: (args: {
    messages: ChatMessage[];
    input: string;
    files: File[];
    onDelta: (text: string) => void;
    onDone: () => void;
    onError: (err: string) => void;
  }) => AbortController;
}

const getStorageKey = (dialogId: string) => `dialog_messages_${dialogId}`;

const Dialog: React.FC<DialogProps> & {
  clearDialog: (dialogId: string) => void;
} = ({
  dialogId,
  botName = "对话助手",
  initMessage = "欢迎使用对话助手，你可以开始提问。",
  seedMessages,
  transport,
}) => {
  const storageKey = useMemo(() => getStorageKey(dialogId), [dialogId]);
  const [messages, setMessages] = useState<DialogMessage[]>(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) return JSON.parse(raw);
    } catch {}
    if (seedMessages?.length) return seedMessages;
    return [{ from: "bot", text: initMessage }];
  });
  const [input, setInput] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [pending, setPending] = useState(false);
  const [selectedModel, setSelectedModel] = useState("");
  const [models, setModels] = useState<ModelInfo[]>([]);
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [customModelId, setCustomModelId] = useState("");
  const [customApiKey, setCustomApiKey] = useState("");
  const bodyRef = useRef<HTMLDivElement | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const isAtBottomRef = useRef(true);

  // Fetch available models on mount
  useEffect(() => {
    let cancelled = false;
    getModels()
      .then((res) => {
        if (!cancelled) {
          setModels(res.models);
          setSelectedModel(res.current.chat);
        }
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  // 持久化消息
  React.useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(messages));
    } catch {}
  }, [messages, storageKey]);

  useEffect(() => {
    return () => {
      abortRef.current?.abort();
      abortRef.current = null;
    };
  }, []);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        setMessages(JSON.parse(raw));
        abortRef.current?.abort();
        abortRef.current = null;
        return;
      }
    } catch {}
    if (seedMessages?.length) {
      setMessages(seedMessages);
      setInput("");
      setPending(false);
      abortRef.current?.abort();
      abortRef.current = null;
      return;
    }
    setMessages([{ from: "bot", text: initMessage }]);
    setInput("");
    setPending(false);
    abortRef.current?.abort();
    abortRef.current = null;
  }, [storageKey, initMessage, seedMessages]);

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
    const userMsg: DialogMessage = { from: "user", text, files: sentFiles };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setFiles([]);
    setPending(true);
    scrollToBottom("smooth");

    // Build chat history for the API
    const chatHistory: ChatMessage[] = messages
      .filter((m) => m.text)
      .map((m) => ({
        role: m.from === "user" ? "user" as const : "assistant" as const,
        content: m.text,
      }));
    chatHistory.push({ role: "user", content: text });

    // Add empty bot message that will be filled by streaming
    setMessages((m) => [...m, { from: "bot", text: "" }]);

    const handlers = {
      onDelta: (delta: string) => {
        setMessages((m) => {
          const updated = [...m];
          const last = updated[updated.length - 1];
          if (last && last.from === "bot") {
            updated[updated.length - 1] = { ...last, text: last.text + delta };
          }
          return updated;
        });
      },
      onDone: () => {
        setPending(false);
        abortRef.current = null;
      },
      onError: (err: string) => {
        setMessages((m) => {
          const updated = [...m];
          const last = updated[updated.length - 1];
          if (last && last.from === "bot") {
            updated[updated.length - 1] = { ...last, text: last.text || `Error: ${err}` };
          }
          return updated;
        });
        setPending(false);
        abortRef.current = null;
      },
    };

    abortRef.current = transport
      ? transport({
          messages: chatHistory,
          input: text,
          files: sentFiles,
          ...handlers,
        })
      : chatStream({
          messages: chatHistory,
          model: selectedModel === "__custom__" ? customModelId || undefined : selectedModel || undefined,
          api_key: selectedModel === "__custom__" ? customApiKey || undefined : undefined,
          ...handlers,
        });
  };

  const stop = () => {
    if (!pending) return;
    abortRef.current?.abort();
    abortRef.current = null;
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
    <div className="flex h-full min-h-0 min-w-0 flex-col gap-3 overflow-hidden" data-oid="zx6bwsx">
      <div className="shrink-0 flex items-center gap-2" data-oid="o.dphsl">
        <span className="font-bold text-[var(--brand-text)]">{botName}</span>
      </div>
      {/* Custom model modal */}
      {showCustomModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/30" onMouseDown={() => setShowCustomModal(false)}>
          <div className="bg-white rounded-xl shadow-2xl p-6 w-[400px] max-w-[90vw]" onMouseDown={(e) => e.stopPropagation()}>
            <h3 className="text-base font-bold text-gray-800 mb-4">自定义模型</h3>
            <label className="block text-xs text-gray-500 mb-1">API Key</label>
            <input
              type="password"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mb-3 focus:outline-none focus:border-blue-400"
              placeholder="sk-or-v1-..."
              value={customApiKey}
              onChange={(e) => setCustomApiKey(e.target.value)}
            />
            <label className="block text-xs text-gray-500 mb-1">模型 ID</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mb-4 focus:outline-none focus:border-blue-400"
              placeholder="openai/gpt-4o 或 deepseek/deepseek-chat"
              value={customModelId}
              onChange={(e) => setCustomModelId(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <button className="px-4 py-1.5 text-xs text-gray-500 hover:text-gray-700 transition-colors" onMouseDown={() => setShowCustomModal(false)}>
                取消
              </button>
              <button className="px-4 py-1.5 text-xs bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors" onMouseDown={() => setShowCustomModal(false)}>
                确定
              </button>
            </div>
          </div>
        </div>
      )}
      <MessageList
        messages={messages}
        pending={pending}
        bodyRef={bodyRef}
        onAtBottomChange={handleAtBottomChange}
        onScrollToBottom={() => scrollToBottom("smooth")}
        onEditMessage={handleEditMessage}
      />
      <div className="shrink-0">
        <InputArea
          input={input}
          onInputChange={setInput}
          onSend={send}
          onStop={stop}
          pending={pending}
          files={files}
          onFilesChange={setFiles}
          models={models}
          selectedModel={selectedModel}
          onSelectModel={setSelectedModel}
          onAddCustom={() => {
            setSelectedModel("__custom__");
            setShowCustomModal(true);
          }}
        />
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
