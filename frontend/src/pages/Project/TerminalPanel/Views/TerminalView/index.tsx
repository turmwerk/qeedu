import React, { useEffect, useMemo, useRef, useState } from "react";
import { CloseOutlined, PlusOutlined } from "@ant-design/icons";
import { useContextMenu, type ContextMenuItem } from "@/ui/ContextMenu";
import cmdProfile from "./Cmd";
import powershellProfile from "./Powershell";
import bashProfile from "./Bash";

type TerminalProfile = typeof cmdProfile;

type TerminalLine = {
  type: "input" | "output" | "system";
  text: string;
};

type TerminalSession = {
  id: string;
  title: string;
  profileId: TerminalProfile["id"];
  lines: TerminalLine[];
  draft: string;
};

const profiles: TerminalProfile[] = [powershellProfile, cmdProfile, bashProfile];

const createSession = (
  profile: TerminalProfile,
  index: number,
): TerminalSession => {
  const seed = Math.random().toString(36).slice(2, 8);
  return {
    id: `${profile.id}-${Date.now()}-${seed}`,
    title: `${profile.title} ${index}`,
    profileId: profile.id,
    lines: profile.initialLines.map((text) => ({ type: "system", text })),
    draft: "",
  };
};

const getOutputForCommand = (
  profileId: string,
  command: string,
): TerminalLine[] => {
  const trimmed = command.trim();
  if (!trimmed) return [];
  const lower = trimmed.toLowerCase();

  if (lower === "help") {
    return [
      { type: "output", text: "Available commands:" },
      { type: "output", text: "help, clear/cls, ls/dir, pwd" },
    ];
  }

  if (lower === "pwd") {
    return [{ type: "output", text: "/workspace" }];
  }

  if (profileId === "bash" && lower === "ls") {
    return [
      { type: "output", text: "src  tests  README.md  requirements.txt" },
    ];
  }

  if (profileId !== "bash" && lower === "dir") {
    return [
      { type: "output", text: "src    tests    README.md    requirements.txt" },
    ];
  }

  return [{ type: "output", text: `Executed: ${trimmed}` }];
};

interface TerminalViewProps {
  createSignal?: number;
}

const TerminalView: React.FC<TerminalViewProps> = ({ createSignal = 0 }) => {
  const [sessions, setSessions] = useState<TerminalSession[]>(() => [
    createSession(powershellProfile, 1),
  ]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { openAtEvent } = useContextMenu();
  const createSignalRef = useRef(createSignal);

  useEffect(() => {
    if (!activeId && sessions.length > 0) {
      setActiveId(sessions[0].id);
    }
  }, [activeId, sessions]);

  const profileMap = useMemo(
    () => new Map(profiles.map((profile) => [profile.id, profile])),
    [],
  );

  const activeSession = sessions.find((s) => s.id === activeId) ?? sessions[0];
  const activeProfile = activeSession
    ? profileMap.get(activeSession.profileId)
    : undefined;

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [activeSession?.lines.length, activeId]);

  useEffect(() => {
    if (createSignalRef.current === createSignal) return;
    createSignalRef.current = createSignal;
    handleAddSession();
  }, [createSignal]);

  const handleAddSession = () => {
    setSessions((prev) => {
      const nextProfile = profiles[prev.length % profiles.length];
      const count = prev.filter((s) => s.profileId === nextProfile.id).length + 1;
      const nextSession = createSession(nextProfile, count);
      setActiveId(nextSession.id);
      return [...prev, nextSession];
    });
  };

  const handleCloseSession = (id: string) => {
    setSessions((prev) => {
      const next = prev.filter((s) => s.id !== id);
      if (next.length === 0) {
        const fallback = createSession(powershellProfile, 1);
        setActiveId(fallback.id);
        return [fallback];
      }
      if (activeId === id) {
        setActiveId(next[next.length - 1]?.id ?? null);
      }
      return next;
    });
  };

  const updateSession = (id: string, updater: (s: TerminalSession) => TerminalSession) => {
    setSessions((prev) => prev.map((s) => (s.id === id ? updater(s) : s)));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!activeSession || !activeProfile) return;
    const command = activeSession.draft;
    const trimmed = command.trim();
    if (!trimmed) return;
    const lower = trimmed.toLowerCase();

    if (lower === "clear" || lower === "cls") {
      updateSession(activeSession.id, (s) => ({
        ...s,
        lines: [],
        draft: "",
      }));
      return;
    }

    const outputs = getOutputForCommand(activeProfile.id, command);
    updateSession(activeSession.id, (s) => ({
      ...s,
      lines: [...s.lines, { type: "input", text: command }, ...outputs],
      draft: "",
    }));
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (!activeSession) return;
      updateSession(activeSession.id, (s) => ({ ...s, draft: s.draft + text }));
      inputRef.current?.focus();
    } catch {
      // ignore clipboard errors
    }
  };

  const handleCopyAll = async () => {
    if (!activeSession || !activeProfile) return;
    const lines = activeSession.lines
      .map((line) => {
        if (line.type === "input") return `${activeProfile.prompt} ${line.text}`;
        return line.text;
      })
      .join("\n");
    try {
      await navigator.clipboard.writeText(lines);
    } catch {
      // ignore clipboard errors
    }
  };

  const handleClear = () => {
    if (!activeSession) return;
    updateSession(activeSession.id, (s) => ({ ...s, lines: [] }));
  };

  const handleTerminalContextMenu = (event: React.MouseEvent) => {
    const items: ContextMenuItem[] = [
      { label: "Paste", onClick: handlePaste },
      { label: "Copy All", onClick: handleCopyAll },
      { label: "Clear", onClick: handleClear },
      { type: "separator" },
      { label: "New Terminal", onClick: handleAddSession },
    ];
    openAtEvent(event, items);
  };

  const handleTabContextMenu = (sessionId: string, event: React.MouseEvent) => {
    const items: ContextMenuItem[] = [
      { label: "Close Terminal", onClick: () => handleCloseSession(sessionId) },
      { label: "New Terminal", onClick: handleAddSession },
    ];
    openAtEvent(event, items);
  };

  if (!activeSession || !activeProfile) {
    return <div className="h-full" />;
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-1 border-b border-[#2d2d2d] bg-[#1f1f1f] px-2 py-1 text-[11px]">
        <div className="flex min-w-0 flex-1 items-center gap-1 overflow-x-auto">
          {sessions.map((session) => (
            <button
              key={session.id}
              className={`group flex items-center gap-1 rounded px-2 py-0.5 text-[11px] transition-colors ${
                session.id === activeSession.id
                  ? "bg-[#094771] text-white"
                  : "text-[#9d9d9d] hover:bg-white/10 hover:text-[#dddddd]"
              }`}
              onClick={() => setActiveId(session.id)}
              onContextMenu={(event) => handleTabContextMenu(session.id, event)}
            >
              <span className="truncate">{session.title}</span>
              <CloseOutlined
                className="text-[10px] opacity-0 group-hover:opacity-60"
                onClick={(event) => {
                  event.stopPropagation();
                  handleCloseSession(session.id);
                }}
              />
            </button>
          ))}
        </div>
        <button
          className="flex h-6 w-6 items-center justify-center rounded text-[#9d9d9d] hover:bg-white/10 hover:text-[#dddddd]"
          title="New Terminal"
          onClick={handleAddSession}
        >
          <PlusOutlined className="text-[10px]" />
        </button>
      </div>

      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-3 py-2 font-mono text-xs text-[#cccccc]"
        onContextMenu={handleTerminalContextMenu}
        onClick={() => inputRef.current?.focus()}
      >
        {activeSession.lines.map((line, index) => (
          <div key={index} className="leading-5">
            {line.type === "input" ? (
              <span>
                <span className={`${activeProfile.accent} mr-2`}>{activeProfile.prompt}</span>
                <span>{line.text}</span>
              </span>
            ) : line.type === "system" ? (
              <span className="text-[#9d9d9d]">{line.text}</span>
            ) : (
              <span className="text-[#9cdcfe]">{line.text}</span>
            )}
          </div>
        ))}
        <form onSubmit={handleSubmit} className="mt-1 flex items-center gap-2">
          <span className={`${activeProfile.accent} shrink-0`}>{activeProfile.prompt}</span>
          <input
            ref={inputRef}
            className="w-full bg-transparent text-[#cccccc] outline-none"
            value={activeSession.draft}
            onChange={(event) =>
              updateSession(activeSession.id, (s) => ({
                ...s,
                draft: event.target.value,
              }))
            }
          />
        </form>
      </div>
    </div>
  );
};

export default TerminalView;
