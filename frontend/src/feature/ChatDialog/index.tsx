import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import MessageList, { type DialogMessage } from "./MessageList";
import InputArea from "./InputArea";
import CustomModelModal, { type CustomModelConfig } from "./CustomModelModal";
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
  const [customConfigs, setCustomConfigs] = useState<CustomModelConfig[]>(() => {
    try {
      const raw = localStorage.getItem("custom_model_configs");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });
  const [editingConfig, setEditingConfig] = useState<CustomModelConfig | null>(null);
  const bodyRef = useRef<HTMLDivElement | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const isAtBottomRef = useRef(true);
  const pendingDeltaRef = useRef("");
  const rafRef = useRef(0);

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

  // Merge custom configs into models list
  const allModels = useMemo(() => {
    const customModels: ModelInfo[] = customConfigs.map((cfg) => ({
      id: `__cfg_${cfg.name}`,
      name: cfg.name,
      provider: new URL(cfg.baseUrl).hostname,
    }));
    // If selectedModel is a custom config, ensure it shows correctly
    return [...models, ...customModels];
  }, [models, customConfigs]);

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
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
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
        pendingDeltaRef.current += delta;
        if (!rafRef.current) {
          rafRef.current = requestAnimationFrame(() => {
            const batch = pendingDeltaRef.current;
            pendingDeltaRef.current = "";
            rafRef.current = 0;
            setMessages((m) => {
              const updated = [...m];
              const last = updated[updated.length - 1];
              if (last && last.from === "bot") {
                updated[updated.length - 1] = { ...last, text: last.text + batch };
              }
              return updated;
            });
          });
        }
      },
      onDone: () => {
        if (pendingDeltaRef.current) {
          const remaining = pendingDeltaRef.current;
          pendingDeltaRef.current = "";
          if (rafRef.current) { cancelAnimationFrame(rafRef.current); rafRef.current = 0; }
          setMessages((m) => {
            const updated = [...m];
            const last = updated[updated.length - 1];
            if (last && last.from === "bot") {
              updated[updated.length - 1] = { ...last, text: last.text + remaining };
            }
            return updated;
          });
        }
        setPending(false);
        abortRef.current = null;
      },
      onError: (err: string) => {
        if (rafRef.current) { cancelAnimationFrame(rafRef.current); rafRef.current = 0; }
        pendingDeltaRef.current = "";
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

    // Resolve custom config if selected
    const activeCustom = selectedModel.startsWith("__cfg_")
      ? customConfigs.find((c) => `__cfg_${c.name}` === selectedModel)
      : null;

    abortRef.current = transport
      ? transport({
          messages: chatHistory,
          input: text,
          files: sentFiles,
          ...handlers,
        })
      : chatStream({
          messages: chatHistory,
          model: activeCustom ? activeCustom.modelId : selectedModel || undefined,
          api_key: activeCustom?.apiKey || undefined,
          base_url: activeCustom?.baseUrl || undefined,
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
          models={allModels}
          selectedModel={selectedModel}
          onSelectModel={setSelectedModel}
          onAddCustom={() => {
            setEditingConfig(null);
            setShowCustomModal(true);
          }}
          onEditCustom={(id) => {
            const cfg = customConfigs.find((c) => `__cfg_${c.name}` === id);
            if (cfg) {
              setEditingConfig(cfg);
              setShowCustomModal(true);
            }
          }}
        />
      </div>

      {/* Custom model modal — portal to body, highest z-index */}
      {showCustomModal && (
        <CustomModelModal
          initial={editingConfig}
          onSave={(cfg) => {
            const updated = editingConfig
              ? customConfigs.map((c) => (c.name === editingConfig.name ? cfg : c))
              : [...customConfigs, cfg];
            setCustomConfigs(updated);
            localStorage.setItem("custom_model_configs", JSON.stringify(updated));
            setSelectedModel(`__cfg_${cfg.name}`);
          }}
          onClose={() => setShowCustomModal(false)}
        />
      )}
    </div>
  );
};

Dialog.clearDialog = (dialogId: string) => {
  try {
    localStorage.removeItem(getStorageKey(dialogId));
  } catch {}
};

export default Dialog;
