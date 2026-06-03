import type { ChatMessage } from "@/api/ai";
import type { FileTreeNode, TabItem } from "../EditorArea/types";

export const CODE_EDIT_START = "<qe-code-edits>";
export const CODE_EDIT_END = "</qe-code-edits>";

export interface WorkspaceFileSnapshot {
  path: string;
  language?: string;
  content?: string;
}

export interface ParsedCodeEdit {
  path: string;
  content: string;
}

const MAX_CONTEXT_FILE_CHARS = 20000;
const MAX_CONTEXT_TREE_FILES = 120;
const MAX_VISIBLE_PATHS = 8;

export const flattenWorkspaceFiles = (node: FileTreeNode): WorkspaceFileSnapshot[] => {
  if (node.type === "file") {
    return [{ path: node.path, language: node.language, content: node.content ?? "" }];
  }
  return (node.children ?? []).flatMap(flattenWorkspaceFiles);
};

export const normalizeWorkspacePath = (path: string): string => {
  const trimmed = path.trim().replace(/\\/g, "/");
  if (!trimmed) return "";
  const withRoot = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  const normalized = withRoot.replace(/\/+/g, "/");
  const parts = normalized.split("/").filter(Boolean);
  if (parts.some((part) => part === "." || part === "..")) return "";
  return normalized;
};

export const getParentPath = (path: string): string => {
  const normalized = normalizeWorkspacePath(path);
  if (!normalized || normalized === "/") return "/";
  const parts = normalized.split("/").filter(Boolean);
  if (parts.length <= 1) return "/";
  return `/${parts.slice(0, -1).join("/")}`;
};

export const getFileName = (path: string): string => {
  const normalized = normalizeWorkspacePath(path);
  return normalized.split("/").filter(Boolean).pop() ?? "";
};

export const buildWorkspaceFileContext = (
  fileTree: FileTreeNode,
  activeTab: TabItem | null,
): string => {
  const files = flattenWorkspaceFiles(fileTree);
  const activeContent = activeTab?.content ?? "";
  const activeBlock = activeTab
    ? [
        "Current active editor file:",
        `Path: ${activeTab.id}`,
        `Language: ${activeTab.language ?? "plaintext"}`,
        "Content:",
        "```",
        activeContent.slice(0, MAX_CONTEXT_FILE_CHARS),
        "```",
      ].join("\n")
    : "No active editor file.";

  const treeBlock = files
    .slice(0, MAX_CONTEXT_TREE_FILES)
    .map((file) => `${file.path}${file.language ? ` (${file.language})` : ""}`)
    .join("\n");

  return [
    activeBlock,
    "",
    "Workspace file list:",
    treeBlock || "(empty)",
  ].join("\n");
};

export const buildCodeEditInstruction = (activeTab: TabItem | null): string => {
  const activePath = activeTab?.id ?? "";
  return [
    "You are connected to the QeEdu Code Tutor editor.",
    "When the user explicitly asks you to modify, fix, refactor, create, or implement code, you must return the complete replacement content for every changed file.",
    "After your normal concise explanation, append exactly one hidden edit payload using this format:",
    CODE_EDIT_START,
    "FILE: /path/to/file.ext",
    "```language-id",
    "full replacement file content",
    "```",
    "FILE: /another/file.ext",
    "```language-id",
    "full replacement file content",
    "```",
    CODE_EDIT_END,
    "Rules:",
    "- Use absolute workspace paths beginning with /.",
    activePath ? `- Prefer editing the active file path: ${activePath}.` : "- If no active path is available, infer the target file from the user request.",
    "- The content field must contain the full file content, not a patch.",
    "- Do not include the hidden edit payload unless code should actually be written into the editor.",
    "- Do not mention the hidden payload in the visible answer.",
  ].join("\n");
};

export const appendCodeEditInstruction = (
  messages: ChatMessage[],
  activeTab: TabItem | null,
): ChatMessage[] => {
  const lastUserIndex = [...messages].reverse().findIndex((message) => message.role === "user");
  if (lastUserIndex < 0) return messages;
  const targetIndex = messages.length - 1 - lastUserIndex;
  const instruction = buildCodeEditInstruction(activeTab);
  return messages.map((message, index) => {
    if (index !== targetIndex) return message;
    return {
      ...message,
      content: `${message.content}\n\n${instruction}`,
    };
  });
};

const stripJsonFence = (value: string): string => {
  const trimmed = value.trim();
  const match = trimmed.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i);
  return match ? match[1].trim() : trimmed;
};

const extractHiddenEditBody = (assistantText: string): string => {
  const pattern = new RegExp(
    `${CODE_EDIT_START.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}([\\s\\S]*?)${CODE_EDIT_END.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`,
    "i",
  );
  const match = assistantText.match(pattern);
  return match?.[1] ?? "";
};

const normalizeParsedEdits = (rawFiles: unknown[]): ParsedCodeEdit[] =>
  rawFiles.flatMap((item) => {
    if (!item || typeof item !== "object") return [];
    const record = item as Record<string, unknown>;
    if (typeof record.path !== "string" || typeof record.content !== "string") {
      return [];
    }
    const path = normalizeWorkspacePath(record.path);
    if (!path || path === "/") return [];
    return [{ path, content: record.content }];
  });

const parseJsonCodeEdits = (body: string): ParsedCodeEdit[] => {
  let parsed: unknown;
  try {
    parsed = JSON.parse(stripJsonFence(body));
  } catch {
    return [];
  }

  const rawFiles = Array.isArray(parsed)
    ? parsed
    : Array.isArray((parsed as { files?: unknown }).files)
      ? (parsed as { files: unknown[] }).files
      : Array.isArray((parsed as { updates?: unknown }).updates)
        ? (parsed as { updates: unknown[] }).updates
        : [];

  return normalizeParsedEdits(rawFiles);
};

const parseFileBlockCodeEdits = (body: string): ParsedCodeEdit[] => {
  const edits: ParsedCodeEdit[] = [];
  const blockPattern =
    /(?:^|\n)FILE:\s*(\/?[^\n]+)\n```[^\n]*\n([\s\S]*?)\n```/g;
  let match = blockPattern.exec(body);
  while (match) {
    const path = normalizeWorkspacePath(match[1] ?? "");
    const content = match[2] ?? "";
    if (path && path !== "/") {
      edits.push({ path, content });
    }
    match = blockPattern.exec(body);
  }
  return edits;
};

export const parseCodeEdits = (assistantText: string): ParsedCodeEdit[] => {
  const body = extractHiddenEditBody(assistantText);
  if (!body.trim()) return [];

  const jsonEdits = parseJsonCodeEdits(body);
  if (jsonEdits.length > 0) return jsonEdits;
  return parseFileBlockCodeEdits(body);
};

export const formatAppliedEditSummary = (paths: string[]): string => {
  if (paths.length === 0) return "";
  const visible = paths.slice(0, MAX_VISIBLE_PATHS);
  const suffix = paths.length > visible.length ? `, +${paths.length - visible.length} more` : "";
  return `\n\nApplied editor changes: ${visible.join(", ")}${suffix}`;
};

export const createHiddenEditBlockFilter = (onVisibleDelta: (text: string) => void) => {
  let buffer = "";
  let hidden = false;
  const startMarker = CODE_EDIT_START.toLowerCase();
  const keep = CODE_EDIT_START.length - 1;

  const push = (delta: string) => {
    if (!delta) return;
    if (hidden) return;
    buffer += delta;
    const startIndex = buffer.toLowerCase().indexOf(startMarker);
    if (startIndex >= 0) {
      const visible = buffer.slice(0, startIndex);
      if (visible) onVisibleDelta(visible);
      buffer = "";
      hidden = true;
      return;
    }
    if (buffer.length <= keep) return;
    const visibleLength = buffer.length - keep;
    onVisibleDelta(buffer.slice(0, visibleLength));
    buffer = buffer.slice(visibleLength);
  };

  const flush = () => {
    if (!hidden && buffer) {
      onVisibleDelta(buffer);
    }
    buffer = "";
  };

  return { push, flush };
};
