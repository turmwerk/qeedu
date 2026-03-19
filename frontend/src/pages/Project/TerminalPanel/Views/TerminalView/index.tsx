import React, { useEffect, useMemo, useRef } from "react";
import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import { WebLinksAddon } from "xterm-addon-web-links";
import "xterm/css/xterm.css";
import { useContextMenu, type ContextMenuItem } from "@/ui/ContextMenu";
import { buildTerminalWsUrl } from "@/api/sandbox";
import { getFileIcon } from "../../../utils/filePresentation";
import {
  useTerminalSessionStore,
  terminalProfiles,
  type TerminalProfile,
  type TerminalSession,
} from "./sessionStore";

/* ---------- xterm + WebSocket session handle ---------- */
interface XtermHandle {
  term: Terminal;
  fit: FitAddon;
  ws: WebSocket | null;
  disposed: boolean;
}

const TerminalView: React.FC = () => {
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

  const handleMapRef = useRef(new Map<string, XtermHandle>());
  const containerMapRef = useRef(new Map<string, HTMLDivElement | null>());
  const wrapperRef = useRef<HTMLDivElement>(null);
  const profileMap = useMemo(
    () => new Map(terminalProfiles.map((profile) => [profile.id, profile])),
    [],
  );

  /* keep refs in sync */
  useEffect(() => {
    sessionsRef.current = sessions;
  }, [sessions]);
  useEffect(() => {
    activeIdRef.current = activeId;
  }, [activeId]);
  useEffect(() => {
    if (!activeId && sessions.length > 0) setActiveId(sessions[0].id);
  }, [activeId, sessions, setActiveId]);

  const activeSession =
    sessions.find((s) => s.id === activeId) ?? sessions[0];

  /* ---------- xterm + WebSocket lifecycle ---------- */

  const createXtermHandle = (
    sessionId: string,
    shell: string,
  ): XtermHandle => {
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

    const handle: XtermHandle = { term, fit, ws: null, disposed: false };

    const profile = profileMap.get(shell as TerminalProfile["id"]);
    if (profile?.initialLines?.length) {
      profile.initialLines.forEach((line) => term.writeln(line));
    }
    if (profile?.prompt) {
      term.write(`${profile.prompt} `);
    }

    /* --- WebSocket connection --- */
    const wsUrl = buildTerminalWsUrl(shell);
    const ws = new WebSocket(wsUrl);
    ws.binaryType = "arraybuffer";
    handle.ws = ws;

    ws.onopen = () => {
      const dims = fit.proposeDimensions();
      if (dims) {
        ws.send(
          JSON.stringify({ type: "resize", cols: dims.cols, rows: dims.rows }),
        );
      }
    };

    ws.onmessage = (ev) => {
      if (handle.disposed) return;
      if (ev.data instanceof ArrayBuffer) {
        term.write(new Uint8Array(ev.data));
      } else {
        term.write(ev.data as string);
      }
    };

    ws.onclose = () => {
      if (!handle.disposed) {
        term.write("\r\n\x1b[90m[会话已断开 — 按任意键重连]\x1b[0m\r\n");
        // one-shot reconnect on any keypress
        const disposable = term.onData(() => {
          disposable.dispose();
          reconnect(sessionId, shell);
        });
      }
    };

    ws.onerror = () => {
      if (!handle.disposed) {
        term.write("\r\n\x1b[31m[连接错误]\x1b[0m\r\n");
      }
    };

    /* xterm → WS (every keystroke goes straight to PTY) */
    term.onData((data) => {
      if (handle.ws?.readyState === WebSocket.OPEN) {
        handle.ws.send(new TextEncoder().encode(data));
      }
    });

    term.onBinary((data) => {
      if (handle.ws?.readyState === WebSocket.OPEN) {
        const bytes = new Uint8Array(data.length);
        for (let i = 0; i < data.length; i++) {
          bytes[i] = data.charCodeAt(i) & 0xff;
        }
        handle.ws.send(bytes);
      }
    });

    /* resize → WS */
    term.onResize(({ cols, rows }) => {
      if (handle.ws?.readyState === WebSocket.OPEN) {
        handle.ws.send(JSON.stringify({ type: "resize", cols, rows }));
      }
    });

    return handle;
  };

  const reconnect = (sessionId: string, shell: string) => {
    const old = handleMapRef.current.get(sessionId);
    if (!old) return;

    // close old WS only (keep terminal)
    if (old.ws && old.ws.readyState <= WebSocket.OPEN) {
      old.ws.onclose = null; // suppress onclose handler
      old.ws.close();
    }

    const wsUrl = buildTerminalWsUrl(shell);
    const ws = new WebSocket(wsUrl);
    ws.binaryType = "arraybuffer";
    old.ws = ws;

    ws.onopen = () => {
      old.term.write("\x1b[90m[已重连]\x1b[0m\r\n");
      const dims = old.fit.proposeDimensions();
      if (dims) {
        ws.send(
          JSON.stringify({ type: "resize", cols: dims.cols, rows: dims.rows }),
        );
      }
    };

    ws.onmessage = (ev) => {
      if (old.disposed) return;
      if (ev.data instanceof ArrayBuffer) {
        old.term.write(new Uint8Array(ev.data));
      } else {
        old.term.write(ev.data as string);
      }
    };

    ws.onclose = () => {
      if (!old.disposed) {
        old.term.write("\r\n\x1b[90m[会话已断开 — 按任意键重连]\x1b[0m\r\n");
        const disposable = old.term.onData(() => {
          disposable.dispose();
          reconnect(sessionId, shell);
        });
      }
    };

    ws.onerror = () => {
      if (!old.disposed) {
        old.term.write("\r\n\x1b[31m[连接错误]\x1b[0m\r\n");
      }
    };
  };

  const disposeHandle = (id: string) => {
    const h = handleMapRef.current.get(id);
    if (!h) return;
    h.disposed = true;
    if (h.ws && h.ws.readyState <= WebSocket.OPEN) h.ws.close();
    h.term.dispose();
    handleMapRef.current.delete(id);
    containerMapRef.current.delete(id);
  };

  /* ---------- mount terminal into DOM ---------- */

  const ensureTerminal = (session: TerminalSession, el: HTMLDivElement | null) => {
    if (!el) return;
    if (handleMapRef.current.has(session.id)) return;

    const handle = createXtermHandle(session.id, session.profileId);
    handleMapRef.current.set(session.id, handle);

    handle.term.open(el);
    requestAnimationFrame(() => {
      try {
        handle.fit.fit();
      } catch {
        /* not visible */
      }
    });
  };

  /* ---------- resize observer ---------- */

  useEffect(() => {
    if (!wrapperRef.current) return;
    const observer = new ResizeObserver(() => {
      const rect = wrapperRef.current?.getBoundingClientRect();
      if (!rect || rect.width <= 0 || rect.height <= 0) return;
      const currentId = activeIdRef.current;
      if (!currentId) return;
      const h = handleMapRef.current.get(currentId);
      if (h) requestAnimationFrame(() => h.fit.fit());
    });
    observer.observe(wrapperRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!activeId) return;
    const rect = wrapperRef.current?.getBoundingClientRect();
    if (!rect || rect.width <= 0 || rect.height <= 0) return;
    const h = handleMapRef.current.get(activeId);
    if (h) requestAnimationFrame(() => h.fit.fit());
  }, [activeId]);

  /* ---------- cleanup on unmount ---------- */

  useEffect(() => {
    return () => {
      handleMapRef.current.forEach((_, id) => disposeHandle(id));
    };
  }, []);

  /* ---------- session CRUD ---------- */

  const handleAddSession = (profileId?: TerminalProfile["id"]) => {
    addSession(profileId);
  };

  const handleCloseSession = (id: string) => {
    disposeHandle(id);
    removeSession(id);
  };

  /* ---------- context menus ---------- */

  const handleCopyAll = async () => {
    if (!activeSession) return;
    const h = handleMapRef.current.get(activeSession.id);
    if (!h) return;
    const buffer = h.term.buffer.active;
    const lines: string[] = [];
    for (let i = 0; i < buffer.length; i++) {
      const line = buffer.getLine(i);
      if (line) lines.push(line.translateToString(true));
    }
    try {
      await navigator.clipboard.writeText(lines.join("\n"));
    } catch {
      /* ignore */
    }
  };

  const handleClear = () => {
    if (!activeSession) return;
    const h = handleMapRef.current.get(activeSession.id);
    if (!h) return;
    h.term.clear();
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

  const handleTabContextMenu = (
    sessionId: string,
    event: React.MouseEvent,
  ) => {
    const items: ContextMenuItem[] = [
      { label: "关闭终端", onClick: () => handleCloseSession(sessionId) },
      { label: "新建终端", onClick: () => handleAddSession(selectedProfileId) },
    ];
    openAtEvent(event, items);
  };

  /* ---------- render ---------- */

  if (!activeSession) {
    return <div className="h-full" />;
  }

  return (
    <div className="flex h-full min-h-0">
      {/* terminal panels */}
      <div
        ref={wrapperRef}
        className="relative min-h-0 flex-1 bg-[#1e1e1e]"
        onContextMenu={handleTerminalContextMenu}
      >
        {sessions.map((session) => (
          <div
            key={session.id}
            ref={(el) => {
              containerMapRef.current.set(session.id, el);
              ensureTerminal(session, el);
            }}
            className={
              session.id === activeSession.id ? "absolute inset-0" : "hidden"
            }
          />
        ))}
      </div>

      {/* right tabs */}
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
