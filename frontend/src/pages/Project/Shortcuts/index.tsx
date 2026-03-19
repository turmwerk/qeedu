import React, { useEffect, useMemo, useRef } from "react";
import { type ProjectCommand, type ProjectCommandId } from "./commands";

interface ProjectShortcutsProps {
  commands: Record<ProjectCommandId, ProjectCommand>;
}

type ChordMap = Map<string, Map<string, ProjectCommand>>;

const EDITABLE_TAGS = new Set(["INPUT", "TEXTAREA", "SELECT"]);

const isEditableTarget = (target: EventTarget | null): boolean => {
  if (!(target instanceof HTMLElement)) return false;
  if (EDITABLE_TAGS.has(target.tagName)) return true;
  if (target.isContentEditable) return true;
  return !!target.closest(".monaco-editor");
};

const normalizeComboString = (combo: string): string => {
  return combo
    .trim()
    .toLowerCase()
    .split(" ")
    .map((segment) => segment.replace(/\bmeta\b/g, "ctrl"))
    .join(" ");
};

const normalizeEventCombo = (event: KeyboardEvent): string | null => {
  const key = event.key;
  if (!key) return null;
  const lowered = key.toLowerCase();
  if (["shift", "control", "meta", "alt"].includes(lowered)) return null;

  let normalizedKey = lowered;
  if (event.code) {
    if (event.code === "Backquote") normalizedKey = "`";
    else if (event.code === "Backslash") normalizedKey = "\\";
    else if (event.code.startsWith("Digit")) {
      normalizedKey = event.code.replace("Digit", "");
    } else if (event.code.startsWith("Key")) {
      normalizedKey = event.code.replace("Key", "").toLowerCase();
    }
  }

  const parts: string[] = [];
  if (event.ctrlKey || event.metaKey) parts.push("ctrl");
  if (event.shiftKey) parts.push("shift");
  if (event.altKey) parts.push("alt");
  parts.push(normalizedKey);
  return parts.join("+");
};

const buildShortcutMaps = (commands: Record<ProjectCommandId, ProjectCommand>) => {
  const directMap = new Map<string, ProjectCommand>();
  const chordMap: ChordMap = new Map();

  Object.values(commands).forEach((command) => {
    if (!command.keys || command.keys.length === 0) return;
    command.keys.forEach((rawKey) => {
      const normalized = normalizeComboString(rawKey);
      if (!normalized) return;
      if (normalized.includes(" ")) {
        const [start, end] = normalized.split(" ");
        if (!start || !end) return;
        if (!chordMap.has(start)) {
          chordMap.set(start, new Map());
        }
        const chordTargets = chordMap.get(start)!;
        if (!chordTargets.has(end)) {
          chordTargets.set(end, command);
        }
      } else if (!directMap.has(normalized)) {
        directMap.set(normalized, command);
      }
    });
  });

  return { directMap, chordMap };
};

const ProjectShortcuts: React.FC<ProjectShortcutsProps> = ({ commands }) => {
  const { directMap, chordMap } = useMemo(
    () => buildShortcutMaps(commands),
    [commands],
  );
  const pendingChordRef = useRef<string | null>(null);
  const chordTimerRef = useRef<number | null>(null);

  useEffect(() => {
    const clearChord = () => {
      pendingChordRef.current = null;
      if (chordTimerRef.current) {
        window.clearTimeout(chordTimerRef.current);
        chordTimerRef.current = null;
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.repeat) return;
      const combo = normalizeEventCombo(event);
      if (!combo) return;

      const targetIsEditable = isEditableTarget(event.target);

      if (pendingChordRef.current) {
        const chordStart = pendingChordRef.current;
        const chordTargets = chordMap.get(chordStart);
        const command = chordTargets?.get(combo);
        clearChord();
        if (!command) return;
        if (targetIsEditable && !command.allowInEditor) return;
        event.preventDefault();
        command.handler();
        return;
      }

      const chordTargets = chordMap.get(combo);
      if (chordTargets) {
        const allowInEditor = Array.from(chordTargets.values()).some(
          (cmd) => cmd.allowInEditor,
        );
        if (targetIsEditable && !allowInEditor) return;
        event.preventDefault();
        pendingChordRef.current = combo;
        chordTimerRef.current = window.setTimeout(clearChord, 1500);
        return;
      }

      const command = directMap.get(combo);
      if (!command) return;
      if (targetIsEditable && !command.allowInEditor) return;
      event.preventDefault();
      command.handler();
    };

    window.addEventListener("keydown", handleKeyDown, true);
    return () => {
      window.removeEventListener("keydown", handleKeyDown, true);
      clearChord();
    };
  }, [chordMap, directMap]);

  return null;
};

export default ProjectShortcuts;
