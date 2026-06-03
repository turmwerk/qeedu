import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import MessageList, { type DialogMessage } from "./MessageList";
import InputArea from "./InputArea";
import CustomModelModal, { type CustomModelConfig } from "./CustomModelModal";
import { chatStream, getModels, type ChatMessage, type ChatMode, type ModelInfo } from "@/api/ai";
import { useModelSelectionStore } from "./modelSelectionStore";
import {
  CHAT_DIALOG_SEND_EVENT,
  isChatDialogSendEvent,
  takePendingChatDialogPrompts,
} from "./events";

interface DialogProps {
  dialogId: string;
  botName?: string;
  initMessage?: string;
  seedMessages?: DialogMessage[];
  suggestedFiles?: File[];
  transport?: (args: {
    messages: ChatMessage[];
    input: string;
    files: File[];
    fileContext?: string;
    mode: ChatMode;
    model?: string;
    apiKey?: string;
    baseUrl?: string;
    temperature?: number;
    maxTokens?: number;
    onDelta: (text: string) => void;
    onDone: () => void;
    onError: (err: string) => void;
  }) => AbortController;
}

const getStorageKey = (dialogId: string) => `dialog_messages_${dialogId}`;
const DEPRECATED_MODEL_IDS = new Set([
  "google/gemini-2.5-flash-lite:nitro",
]);

const Dialog: React.FC<DialogProps> & {
  clearDialog: (dialogId: string) => void;
} = ({
  dialogId,
  botName = "对话助手",
  initMessage = "欢迎使用对话助手，你可以开始提问。",
  seedMessages,
  suggestedFiles,
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
  const [chatMode, setChatMode] = useState<ChatMode>("agent");
  const [pending, setPending] = useState(false);
  const [models, setModels] = useState<ModelInfo[]>([]);
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [editingConfig, setEditingConfig] = useState<CustomModelConfig | null>(null);
  const messagesRef = useRef<DialogMessage[]>([]);
  const bodyRef = useRef<HTMLDivElement | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const isAtBottomRef = useRef(true);
  const pendingDeltaRef = useRef("");
  const rafRef = useRef(0);

  const selectedModel = useModelSelectionStore((state) => state.selectedModel);
  const customConfigs = useModelSelectionStore((state) => state.customConfigs);
  const setSelectedModel = useModelSelectionStore((state) => state.setSelectedModel);
  const setCustomConfigs = useModelSelectionStore((state) => state.setCustomConfigs);

  const handleSelectModel = useCallback((id: string) => {
    setSelectedModel(id);
  }, [setSelectedModel]);

  // Fetch available models on mount
  useEffect(() => {
    let cancelled = false;
    getModels()
      .then((res) => {
        if (!cancelled) {
          setModels(res.models);
          const knownModelIds = new Set(res.models.map((model) => model.id));
          const isCustomSelection = selectedModel.startsWith("__cfg_");
          const isDeprecated = DEPRECATED_MODEL_IDS.has(selectedModel);
          const isUnknownBuiltin = selectedModel && !isCustomSelection && !knownModelIds.has(selectedModel);

          if (!selectedModel || isDeprecated || isUnknownBuiltin) {
            handleSelectModel(res.current.chat);
          }
        }
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [handleSelectModel, selectedModel]);

  // Keep the visible list focused: only show the two backend models by default,
  // and append the currently selected custom model when one is active.
  const allModels = useMemo(() => {
    if (!selectedModel.startsWith("__cfg_")) {
      return models;
    }

    const activeConfig = customConfigs.find((cfg) => `__cfg_${cfg.id}` === selectedModel);
    if (!activeConfig) {
      return models;
    }

    const provider = (() => {
      try {
        return new URL(activeConfig.baseUrl).hostname || "Custom";
      } catch {
        return "Custom";
      }
    })();

    return [
      ...models,
      {
        id: `__cfg_${activeConfig.id}`,
        name: activeConfig.name,
        provider,
      },
    ];
  }, [models, customConfigs, selectedModel]);

  const activeCustom = useMemo(
    () => customConfigs.find((cfg) => `__cfg_${cfg.id}` === selectedModel) ?? null,
    [customConfigs, selectedModel],
  );

  // 持久化消息
  React.useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(messages));
    } catch {}
    messagesRef.current = messages;
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

  const sendMessage = useCallback((rawText: string, sourceFiles: File[] = []) => {
    const text = rawText.trim();
    if (!text || pending) return;
    const sentFiles = [...sourceFiles];
    const userMsg: DialogMessage = { from: "user", text, files: sentFiles };
    setMessages((m) => [...m, userMsg]);
    setPending(true);
    scrollToBottom("smooth");

    // Build chat history for the API
    const chatHistory: ChatMessage[] = messagesRef.current
      .filter((m) => m.text)
      .map((m) => ({
        role: m.from === "user" ? "user" as const : "assistant" as const,
        content: m.text,
      }));
    chatHistory.push({ role: "user", content: text });

    // Add empty bot message that will be filled by streaming
    setMessages((m) => [...m, { from: "bot", text: "" }]);

    // Read file contents for context
    const readFiles = async (): Promise<string> => {
      if (sentFiles.length === 0) return "";
      const chunks = await Promise.all(
        sentFiles.map(async (file) => {
          const content = await file.text();
          return `File: ${file.name}\n\`\`\`\n${content.slice(0, 8000)}\n\`\`\``;
        }),
      );
      return chunks.join("\n\n").slice(0, 24000);
    };

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
    const outerController = new AbortController();
    abortRef.current = outerController;

    readFiles().then((fileContext) => {
      if (outerController.signal.aborted) return;
      const streamCtrl = transport
        ? transport({
            messages: chatHistory,
            input: text,
            files: sentFiles,
            fileContext,
            mode: chatMode,
            model: activeCustom?.modelId || selectedModel || undefined,
            apiKey: activeCustom?.apiKey || undefined,
            baseUrl: activeCustom?.baseUrl || undefined,
            temperature: activeCustom?.temperature,
            maxTokens: activeCustom?.maxTokens,
            ...handlers,
          })
        : chatStream({
            messages: chatHistory,
            file_context: fileContext || undefined,
            mode: chatMode,
            model: activeCustom?.modelId || selectedModel || undefined,
            api_key: activeCustom?.apiKey || undefined,
            base_url: activeCustom?.baseUrl || undefined,
            temperature: activeCustom?.temperature,
            max_tokens: activeCustom?.maxTokens,
            ...handlers,
          });
      outerController.signal.addEventListener("abort", () => streamCtrl.abort(), { once: true });
    });
  }, [activeCustom, chatMode, pending, scrollToBottom, selectedModel, transport]);

  useEffect(() => {
    const handleExternalSend = (event: Event) => {
      if (!isChatDialogSendEvent(event) || event.detail.dialogId !== dialogId) return;
      event.detail.handled = true;
      sendMessage(event.detail.prompt, event.detail.files ?? []);
    };
    window.addEventListener(CHAT_DIALOG_SEND_EVENT, handleExternalSend);
    return () => window.removeEventListener(CHAT_DIALOG_SEND_EVENT, handleExternalSend);
  }, [dialogId, sendMessage]);

  useEffect(() => {
    for (const item of takePendingChatDialogPrompts(dialogId)) {
      sendMessage(item.prompt, item.files ?? []);
    }
  }, [dialogId, sendMessage]);

  const send = () => {
    if (!input.trim() || pending) return;
    sendMessage(input, files);
    setInput("");
    setFiles([]);
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
    setMessages((prev) => {
      const updated = [...prev];
      const msg = updated[index];
      if (!msg) return prev;
      const versions = msg.versions ? [...msg.versions] : [msg.text];
      if (newText !== msg.text) {
        versions.push(newText);
      }
      updated[index] = { ...msg, text: newText, versions, versionIndex: versions.length - 1 };
      return updated;
    });
  }, []);

  const handleRetry = useCallback((index: number) => {
    if (pending) return;
    setMessages((prev) => {
      const msg = prev[index];
      if (!msg) return prev;

      if (msg.from === "bot") {
        const history = prev.slice(0, index);
        const oldVersions = msg.versions ? [...msg.versions] : (msg.text ? [msg.text] : []);
        const newBot: DialogMessage = { from: "bot", text: "", versions: oldVersions, versionIndex: oldVersions.length };
        return [...history, newBot];
      }
      // User retry: keep user msg versions, truncate after it, add new bot
      const history = prev.slice(0, index + 1);
      const nextBot = prev[index + 1];
      const botVersions = nextBot?.from === "bot" && nextBot.versions ? [...nextBot.versions] : (nextBot?.from === "bot" && nextBot.text ? [nextBot.text] : []);
      const newBot: DialogMessage = { from: "bot", text: "", versions: botVersions.length > 0 ? botVersions : undefined, versionIndex: botVersions.length > 0 ? botVersions.length : undefined };
      return [...history, newBot];
    });

    // Trigger streaming for the new bot response
    setPending(true);
    scrollToBottom("smooth");

    setTimeout(() => {
      setMessages((current) => {
        const chatHistory: ChatMessage[] = current
          .slice(0, -1)
          .filter((m) => m.text)
          .map((m) => ({
            role: m.from === "user" ? "user" as const : "assistant" as const,
            content: m.text,
          }));

        const outerController = new AbortController();
        abortRef.current = outerController;

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
                  const finalText = last.text + remaining;
                  const versions = last.versions ? [...last.versions, finalText] : undefined;
                  const versionIndex = versions ? versions.length - 1 : undefined;
                  updated[updated.length - 1] = { ...last, text: finalText, versions, versionIndex };
                }
                return updated;
              });
            } else {
              setMessages((m) => {
                const updated = [...m];
                const last = updated[updated.length - 1];
                if (last && last.from === "bot" && last.versions) {
                  const versions = [...last.versions, last.text];
                  updated[updated.length - 1] = { ...last, versions, versionIndex: versions.length - 1 };
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

        const streamCtrl = transport
          ? transport({
            messages: chatHistory,
            input: "",
            files: [],
            fileContext: undefined,
            mode: chatMode,
            model: activeCustom?.modelId || selectedModel || undefined,
            apiKey: activeCustom?.apiKey || undefined,
            baseUrl: activeCustom?.baseUrl || undefined,
            temperature: activeCustom?.temperature,
            maxTokens: activeCustom?.maxTokens,
            ...handlers
          })
          : chatStream({
            messages: chatHistory,
            mode: chatMode,
            model: activeCustom?.modelId || selectedModel || undefined,
            api_key: activeCustom?.apiKey || undefined,
            base_url: activeCustom?.baseUrl || undefined,
            temperature: activeCustom?.temperature,
            max_tokens: activeCustom?.maxTokens,
            ...handlers,
          });
        outerController.signal.addEventListener("abort", () => streamCtrl.abort(), { once: true });

        return current;
      });
    }, 0);
  }, [activeCustom, chatMode, pending, scrollToBottom, selectedModel, transport]);

  const handleSwitchVersion = useCallback((index: number, vi: number) => {
    setMessages((prev) => {
      const updated = [...prev];
      const msg = updated[index];
      if (!msg?.versions || vi < 0 || vi >= msg.versions.length) return prev;
      updated[index] = { ...msg, text: msg.versions[vi], versionIndex: vi };
      return updated;
    });
  }, []);

  const handleDeleteMessage = useCallback((index: number) => {
    setMessages((prev) => prev.filter((_, i) => i !== index));
  }, []);

  return (
    <div className="chat-dialog-root flex h-full min-h-0 min-w-0 flex-col gap-3 overflow-hidden" data-oid="zx6bwsx">
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
        onRetry={handleRetry}
        onSwitchVersion={handleSwitchVersion}
        onDeleteMessage={handleDeleteMessage}
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
          suggestedFiles={suggestedFiles}
          models={allModels}
          selectedMode={chatMode}
          onModeChange={setChatMode}
          selectedModel={selectedModel}
          onSelectModel={handleSelectModel}
          onAddCustom={() => {
            setEditingConfig(null);
            setShowCustomModal(true);
          }}
          onEditCustom={(id) => {
            const cfg = customConfigs.find((c) => `__cfg_${c.id}` === id);
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
              ? customConfigs.map((c) => (c.id === editingConfig.id ? cfg : c))
              : [...customConfigs, cfg];
            setCustomConfigs(updated);
            handleSelectModel(`__cfg_${cfg.id}`);
            setEditingConfig(null);
            setShowCustomModal(false);
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
