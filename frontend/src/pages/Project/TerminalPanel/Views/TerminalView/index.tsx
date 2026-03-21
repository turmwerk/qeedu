import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import { WebLinksAddon } from "xterm-addon-web-links";
import "xterm/css/xterm.css";
import { useContextMenu, type ContextMenuItem } from "@/ui/ContextMenu";
import { buildTerminalWsUrl } from "@/api/sandbox";
import { getFileIcon } from "../../../utils/filePresentation";
import { useWorkspace } from "../../../context";
import {
  appendTerminalHistory,
  listPanelHistory,
  subscribeHistoryChanges,
  type PanelHistoryRecord,
  type TerminalHistoryPayload,
} from "../../history";
import {
  useTerminalSessionStore,
  type TerminalProfile,
  type TerminalSession,
} from "./sessionStore";

const CONNECT_TIMEOUT_MS = 8000;

interface XtermHandle {
  term: Terminal;
  fit: FitAddon;
  ws: WebSocket | null;
  disposed: boolean;
  historyHydrated: boolean;
  connectTimeoutId: number | null;
  timeoutTriggered: boolean;
}

const formatMetaTimestamp = (timestamp: number): string =>
  new Date(timestamp).toLocaleString("zh-CN", {
    hour12: false,
  });

const TerminalView: React.FC = () => {
  const workspaceKey = useWorkspace((state) => state.workspaceKey);
  const sessions = useTerminalSessionStore((state) => state.sessions);
  const activeId = useTerminalSessionStore((state) => state.activeId);
  const selectedProfileId = useTerminalSessionStore(
    (state) => state.selectedProfileId,
  );
  const setActiveId = useTerminalSessionStore((state) => state.setActiveId);
  const addSession = useTerminalSessionStore((state) => state.addSession);
  const removeSession = useTerminalSessionStore((state) => state.removeSession);
  const { openAtEvent } = useContextMenu();
  const sessionsRef = useRef<TerminalSession[]>(sessions);
  const activeIdRef = useRef<string | null>(activeId);
  const textDecoderRef = useRef(new TextDecoder());

  const handleMapRef = useRef(new Map<string, XtermHandle>());
  const containerMapRef = useRef(new Map<string, HTMLDivElement | null>());
  const wrapperRef = useRef<HTMLDivElement>(null);
  const pendingFocusRef = useRef<string | null>(null);
  const [historyRecords, setHistoryRecords] = useState<
    Array<PanelHistoryRecord<TerminalHistoryPayload>>
  >([]);
  const [historyLoaded, setHistoryLoaded] = useState(false);

  const activeSession =
    sessions.find((session) => session.id === activeId) ?? sessions[0];

  const historyTranscript = useMemo(() => {
    const orderedRecords = [...historyRecords].sort(
      (left, right) => left.createdAt - right.createdAt,
    );
    return orderedRecords
      .map((record) =>
        [...(record.payload?.chunks ?? [])]
          .sort((left, right) => left.timestamp - right.timestamp)
          .map((chunk) => chunk.text)
          .join(""),
      )
      .join("");
  }, [historyRecords]);

  useEffect(() => {
    sessionsRef.current = sessions;
  }, [sessions]);

  useEffect(() => {
    activeIdRef.current = activeId;
  }, [activeId]);

  useEffect(() => {
    if (!activeId && sessions.length > 0) {
      setActiveId(sessions[0].id);
    }
  }, [activeId, sessions, setActiveId]);

  useEffect(() => {
    let cancelled = false;

    const loadHistory = async () => {
      if (!workspaceKey) {
        if (!cancelled) {
          setHistoryRecords([]);
          setHistoryLoaded(true);
        }
        return;
      }
      try {
        const next = await listPanelHistory<TerminalHistoryPayload>(
          workspaceKey,
          "terminal",
        );
        if (!cancelled) {
          setHistoryRecords(next);
          setHistoryLoaded(true);
        }
      } catch {
        if (!cancelled) {
          setHistoryRecords([]);
          setHistoryLoaded(true);
        }
      }
    };

    setHistoryLoaded(false);
    void loadHistory();
    const unsubscribe = subscribeHistoryChanges((changedWorkspace, changedView) => {
      if (changedWorkspace && changedWorkspace !== workspaceKey) {
        return;
      }
      if (changedView && changedView !== "terminal") {
        return;
      }
      void loadHistory();
    });

    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, [workspaceKey]);

  const persistTerminalChunk = useCallback(
    (sessionId: string, text: string, kind: "meta" | "output" | "error" = "output") => {
      if (!workspaceKey || !text) return;
      const session = sessionsRef.current.find((item) => item.id === sessionId);
      if (!session) return;
      void appendTerminalHistory({
        workspaceKey,
        sessionId,
        title: session.title,
        text,
        kind,
        meta: {
          profileId: session.profileId,
        },
      });
    },
    [workspaceKey],
  );

  const clearConnectTimeout = (handle: XtermHandle) => {
    if (handle.connectTimeoutId) {
      window.clearTimeout(handle.connectTimeoutId);
      handle.connectTimeoutId = null;
    }
  };

  const writeTerminalText = useCallback(
    (
      handle: XtermHandle,
      sessionId: string,
      text: string,
      kind: "meta" | "output" | "error" = "output",
    ) => {
      handle.term.write(text);
      persistTerminalChunk(sessionId, text, kind);
    },
    [persistTerminalChunk],
  );

  const hydrateHistory = useCallback(
    (sessionId: string, handle: XtermHandle) => {
      if (handle.historyHydrated || !historyLoaded) return;
      handle.historyHydrated = true;
      const historySessionId =
        sessionsRef.current[sessionsRef.current.length - 1]?.id;
      if (sessionId === historySessionId && historyTranscript) {
        handle.term.write(historyTranscript);
      }
    },
    [historyLoaded, historyTranscript],
  );

  const createXtermHandle = (): XtermHandle => {
    const term = new Terminal({
      cursorBlink: true,
      fontFamily:
        "'JetBrains Mono', 'Cascadia Code', 'Fira Code', ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
      fontSize: 13,
      lineHeight: 1.25,
      scrollback: 5000,
      convertEol: true,
      theme: {
        background: "#1e1e1e",
        foreground: "#cccccc",
        cursor: "#aeafad",
        selectionBackground: "#264f78",
        black: "#000000",
        red: "#f48771",
        green: "#89d185",
        yellow: "#dcdcaa",
        blue: "#569cd6",
        magenta: "#c586c0",
        cyan: "#4fc1ff",
        white: "#d4d4d4",
        brightBlack: "#808080",
        brightRed: "#f48771",
        brightGreen: "#89d185",
        brightYellow: "#dcdcaa",
        brightBlue: "#569cd6",
        brightMagenta: "#c586c0",
        brightCyan: "#4fc1ff",
        brightWhite: "#ffffff",
      },
    });

    const fit = new FitAddon();
    term.loadAddon(fit);
    term.loadAddon(new WebLinksAddon());

    const handle: XtermHandle = {
      term,
      fit,
      ws: null,
      disposed: false,
      historyHydrated: false,
      connectTimeoutId: null,
      timeoutTriggered: false,
    };

    term.onData((data) => {
      if (handle.ws?.readyState === WebSocket.OPEN) {
        handle.ws.send(data);
      }
    });

    term.onBinary((data) => {
      if (handle.ws?.readyState === WebSocket.OPEN) {
        const bytes = new Uint8Array(data.length);
        for (let i = 0; i < data.length; i += 1) {
          bytes[i] = data.charCodeAt(i) & 0xff;
        }
        handle.ws.send(bytes);
      }
    });

    term.onResize(({ cols, rows }) => {
      if (handle.ws?.readyState === WebSocket.OPEN) {
        handle.ws.send(JSON.stringify({ type: "resize", cols, rows }));
      }
    });

    return handle;
  };

  const connectHandle = useCallback(
    (
      handle: XtermHandle,
      sessionId: string,
      shell: string,
      reconnecting = false,
    ) => {
      if (handle.disposed) return;

      const wsUrl = buildTerminalWsUrl(shell);
      const ws = new WebSocket(wsUrl);
      ws.binaryType = "arraybuffer";
      handle.ws = ws;
      handle.timeoutTriggered = false;
      clearConnectTimeout(handle);
      handle.connectTimeoutId = window.setTimeout(() => {
        if (handle.disposed || handle.timeoutTriggered) return;
        handle.timeoutTriggered = true;
        writeTerminalText(
          handle,
          sessionId,
          "\r\n\x1b[31m[连接超时]\x1b[0m\r\n",
          "error",
        );
        ws.close();
      }, CONNECT_TIMEOUT_MS);

      ws.onopen = () => {
        clearConnectTimeout(handle);
        const metaText = reconnecting
          ? `\x1b[90m[${formatMetaTimestamp(Date.now())}] 已重连\x1b[0m\r\n`
          : `\x1b[90m[${formatMetaTimestamp(Date.now())}] 终端已连接\x1b[0m\r\n`;
        writeTerminalText(handle, sessionId, metaText, "meta");
        const dims = handle.fit.proposeDimensions();
        if (dims) {
          ws.send(
            JSON.stringify({ type: "resize", cols: dims.cols, rows: dims.rows }),
          );
        }
      };

      ws.onmessage = (event) => {
        if (handle.disposed) return;
        if (event.data instanceof ArrayBuffer) {
          handle.term.write(new Uint8Array(event.data));
          persistTerminalChunk(
            sessionId,
            textDecoderRef.current.decode(event.data, { stream: true }),
            "output",
          );
          return;
        }

        const text = String(event.data);
        handle.term.write(text);
        persistTerminalChunk(sessionId, text, "output");
      };

      ws.onerror = () => {
        if (handle.disposed || handle.timeoutTriggered) return;
        writeTerminalText(handle, sessionId, "\r\n\x1b[31m[连接错误]\x1b[0m\r\n", "error");
      };

      ws.onclose = () => {
        clearConnectTimeout(handle);
        if (handle.disposed || handle.timeoutTriggered) return;
        writeTerminalText(
          handle,
          sessionId,
          "\r\n\x1b[90m[会话已断开，按任意键重连]\x1b[0m\r\n",
          "meta",
        );
        const disposable = handle.term.onData(() => {
          disposable.dispose();
          reconnect(sessionId, shell);
        });
      };
    },
    [persistTerminalChunk, writeTerminalText],
  );

  const reconnect = useCallback(
    (sessionId: string, shell: string) => {
      const handle = handleMapRef.current.get(sessionId);
      if (!handle) return;

      if (handle.ws && handle.ws.readyState <= WebSocket.OPEN) {
        handle.ws.onclose = null;
        handle.ws.close();
      }

      connectHandle(handle, sessionId, shell, true);
    },
    [connectHandle],
  );

  const disposeHandle = (id: string) => {
    const handle = handleMapRef.current.get(id);
    if (!handle) return;
    handle.disposed = true;
    clearConnectTimeout(handle);
    if (handle.ws && handle.ws.readyState <= WebSocket.OPEN) {
      handle.ws.close();
    }
    handle.term.dispose();
    handleMapRef.current.delete(id);
    containerMapRef.current.delete(id);
  };

  const ensureTerminal = useCallback(
    (session: TerminalSession, element: HTMLDivElement | null) => {
      if (!element) return;
      const existing = handleMapRef.current.get(session.id);
      if (existing) {
        if (element.childElementCount === 0) {
          existing.term.open(element);
          requestAnimationFrame(() => {
            try {
              existing.fit.fit();
            } catch {
              /* ignore hidden containers */
            }
          });
        }
        hydrateHistory(session.id, existing);
        return;
      }

      const handle = createXtermHandle();
      handleMapRef.current.set(session.id, handle);
      handle.term.open(element);
      hydrateHistory(session.id, handle);

      requestAnimationFrame(() => {
        try {
          handle.fit.fit();
          handle.term.focus();
          pendingFocusRef.current = session.id;
          writeTerminalText(
            handle,
            session.id,
            "\x1b[90m[正在连接终端...]\x1b[0m\r\n",
            "meta",
          );
          connectHandle(handle, session.id, session.profileId);
        } catch {
          /* ignore hidden containers */
        }
      });
    },
    [connectHandle, hydrateHistory, writeTerminalText],
  );

  useEffect(() => {
    sessions.forEach((session) => {
      const handle = handleMapRef.current.get(session.id);
      if (handle) {
        hydrateHistory(session.id, handle);
      }
    });
  }, [hydrateHistory, sessions]);

  useEffect(() => {
    if (!wrapperRef.current) return undefined;
    const observer = new ResizeObserver(() => {
      const rect = wrapperRef.current?.getBoundingClientRect();
      if (!rect || rect.width <= 0 || rect.height <= 0) return;
      const currentId = activeIdRef.current;
      if (!currentId) return;
      const handle = handleMapRef.current.get(currentId);
      if (handle) {
        requestAnimationFrame(() => handle.fit.fit());
      }
    });
    observer.observe(wrapperRef.current);
    return () => observer.disconnect();
  }, []);

  useLayoutEffect(() => {
    if (!activeId) return;
    const rect = wrapperRef.current?.getBoundingClientRect();
    if (!rect || rect.width <= 0 || rect.height <= 0) return;
    const handle = handleMapRef.current.get(activeId);
    if (handle) {
      requestAnimationFrame(() => {
        handle.fit.fit();
        handle.term.focus();
        pendingFocusRef.current = activeId;
      });
    }
  }, [activeId]);

  useEffect(() => {
    const currentId = pendingFocusRef.current;
    if (!currentId) return;
    const handle = handleMapRef.current.get(currentId);
    if (!handle) return;
    const timer = window.setTimeout(() => {
      handle.term.focus();
      pendingFocusRef.current = null;
    }, 0);
    return () => window.clearTimeout(timer);
  }, [activeId, sessions]);

  useEffect(() => {
    return () => {
      handleMapRef.current.forEach((_, id) => disposeHandle(id));
    };
  }, []);

  const handleAddSession = (profileId?: TerminalProfile["id"]) => {
    addSession(profileId);
  };

  const handleCloseSession = (id: string) => {
    disposeHandle(id);
    removeSession(id);
  };

  const handleCopyAll = async () => {
    if (!activeSession) return;
    const handle = handleMapRef.current.get(activeSession.id);
    if (!handle) return;
    const buffer = handle.term.buffer.active;
    const lines: string[] = [];
    for (let i = 0; i < buffer.length; i += 1) {
      const line = buffer.getLine(i);
      if (line) {
        lines.push(line.translateToString(true));
      }
    }
    try {
      await navigator.clipboard.writeText(lines.join("\n"));
    } catch {
      /* ignore */
    }
  };

  const handleClear = () => {
    if (!activeSession) return;
    const handle = handleMapRef.current.get(activeSession.id);
    if (!handle) return;
    handle.term.clear();
  };

  const handleTerminalContextMenu = (event: React.MouseEvent) => {
    const items: ContextMenuItem[] = [
      { label: "复制全部", onClick: handleCopyAll },
      { label: "清空", onClick: handleClear },
      { type: "separator" },
      { label: "新建终端", onClick: () => handleAddSession(selectedProfileId) },
    ];
    openAtEvent(event, items);
  };

  const handleTabContextMenu = (sessionId: string, event: React.MouseEvent) => {
    const items: ContextMenuItem[] = [
      { label: "关闭终端", onClick: () => handleCloseSession(sessionId) },
      { label: "新建终端", onClick: () => handleAddSession(selectedProfileId) },
    ];
    openAtEvent(event, items);
  };

  if (!activeSession) {
    return <div className="h-full" />;
  }

  return (
    <div className="flex h-full min-h-0">
      <div
        ref={wrapperRef}
        className="terminal-view relative h-full min-h-0 flex-1 overflow-hidden bg-[#1e1e1e]"
        onContextMenu={handleTerminalContextMenu}
        onClick={() => {
          if (!activeSession) return;
          handleMapRef.current.get(activeSession.id)?.term.focus();
        }}
      >
        {sessions.map((session) => (
          <div
            key={session.id}
            ref={(element) => {
              containerMapRef.current.set(session.id, element);
              ensureTerminal(session, element);
            }}
            className={
              session.id === activeSession.id
                ? "absolute inset-0 h-full w-full"
                : "absolute inset-0 hidden h-full w-full"
            }
          />
        ))}
      </div>

      <div className="flex w-12 shrink-0 flex-col gap-1 border-l border-[#2d2d2d] bg-[#1f1f1f] py-2">
        {sessions.map((session) => {
          const icon = getFileIcon(
            session.profileId === "powershell"
              ? "terminal.ps1"
              : session.profileId === "cmd"
                ? "terminal.bat"
                : "terminal.sh",
            "h-5 w-5",
          );
          return (
            <button
              key={session.id}
              title={session.title}
              className={`mx-auto flex h-9 w-9 items-center justify-center rounded transition-colors ${
                session.id === activeSession.id
                  ? "bg-[#094771] text-white"
                  : "text-[#9d9d9d] hover:bg-white/10 hover:text-[#dddddd]"
              }`}
              onClick={() => setActiveId(session.id)}
              onContextMenu={(event) => handleTabContextMenu(session.id, event)}
            >
              <span className="text-[14px]">{icon}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default TerminalView;
