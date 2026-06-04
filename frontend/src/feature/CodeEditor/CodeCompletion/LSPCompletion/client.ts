import {
  destroyLspSession,
  ensureLspSession,
  getLspCompletions,
  getLspDiagnostics,
  syncLspFile,
  type LspCompletionItem,
  type LspDiagnostic,
  type WorkspaceFilePayload,
} from "@/api/sandbox";
import axios from "axios";
import type { FileTreeNode, TabItem } from "@/pages/Project/EditorArea/types";

export type LspLanguageGroup =
  | "go"
  | "python"
  | "typescript"
  | "java"
  | "cpp"
  | "rust"
  | "csharp";

type CachedSession = {
  sessionId: string;
  pending?: Promise<string>;
};

const sessionCache = new Map<string, CachedSession>();

const buildSessionKey = (workspaceKey: string, languageGroup: LspLanguageGroup) =>
  `${workspaceKey}:${languageGroup}`;

const isRecoverableLspSessionError = (error: unknown): boolean => {
  if (!axios.isAxiosError(error)) return false;
  const status = error.response?.status;
  return status === 400 || status === 404 || status === 500;
};

const resetLspSession = (workspaceKey: string, languageGroup: LspLanguageGroup) => {
  sessionCache.delete(buildSessionKey(workspaceKey, languageGroup));
};

export const normalizeWorkspacePath = (filePath: string): string => {
  const clean = (filePath || "/")
    .replace(/^file:\/\//, "")
    .replace(/\\/g, "/")
    .trim();
  const withLeadingSlash = clean.startsWith("/") ? clean : `/${clean}`;
  return withLeadingSlash.replace(/\/+/g, "/");
};

export const getLspLanguageGroup = (
  language?: string | null,
  filePath?: string | null,
): LspLanguageGroup | null => {
  const normalizedLanguage = (language ?? "").toLowerCase();
  if (normalizedLanguage === "go") return "go";
  if (normalizedLanguage === "python") return "python";
  if (normalizedLanguage === "java") return "java";
  if (normalizedLanguage === "c" || normalizedLanguage === "cpp") return "cpp";
  if (normalizedLanguage === "rust") return "rust";
  if (normalizedLanguage === "csharp") return "csharp";
  if (normalizedLanguage === "typescript" || normalizedLanguage === "javascript") {
    return "typescript";
  }

  const ext = (filePath ?? "").split(".").pop()?.toLowerCase();
  if (ext === "go") return "go";
  if (ext === "py") return "python";
  if (ext === "java") return "java";
  if (ext && ["c", "h", "cc", "cp", "cpp", "cxx", "hh", "hpp", "hxx"].includes(ext)) {
    return "cpp";
  }
  if (ext === "rs") return "rust";
  if (ext === "cs") return "csharp";
  if (ext && ["ts", "tsx", "mts", "cts", "js", "jsx", "mjs", "cjs"].includes(ext)) {
    return "typescript";
  }
  return null;
};

const matchesGroup = (languageGroup: LspLanguageGroup, node: FileTreeNode): boolean => {
  const normalizedPath = normalizeWorkspacePath(node.path);
  return getLspLanguageGroup(node.language, normalizedPath) === languageGroup;
};

const collectFiles = (node: FileTreeNode): FileTreeNode[] => {
  if (node.type === "file") return [node];
  if (!node.children) return [];
  return node.children.flatMap((child) => collectFiles(child));
};

export const collectWorkspaceFilesForGroup = (
  fileTree: FileTreeNode,
  tabs: TabItem[],
  languageGroup: LspLanguageGroup,
): WorkspaceFilePayload[] => {
  const tabContentMap = new Map(tabs.map((tab) => [tab.id, tab.content ?? ""]));
  return collectFiles(fileTree)
    .filter((file) => matchesGroup(languageGroup, file))
    .map((file) => ({
      path: normalizeWorkspacePath(file.path),
      content: tabContentMap.get(file.path) ?? file.content ?? "",
      language: file.language,
    }));
};

export const getOrCreateLspSession = async (input: {
  workspaceKey: string;
  languageGroup: LspLanguageGroup;
  files: WorkspaceFilePayload[];
}): Promise<string> => {
  const key = buildSessionKey(input.workspaceKey, input.languageGroup);
  const existing = sessionCache.get(key);
  if (existing?.sessionId) {
    return existing.sessionId;
  }
  if (existing?.pending) {
    return existing.pending;
  }

  const pending = ensureLspSession({
    workspace_key: input.workspaceKey,
    language_group: input.languageGroup,
    files: input.files,
  })
    .then((response) => {
      sessionCache.set(key, { sessionId: response.session_id });
      return response.session_id;
    })
    .catch((error) => {
      sessionCache.delete(key);
      throw error;
    });

  sessionCache.set(key, { sessionId: "", pending });
  return pending;
};

export const syncWorkspaceLspFile = async (input: {
  workspaceKey: string;
  language: string;
  filePath: string;
  content: string;
  version: number;
  files: WorkspaceFilePayload[];
}): Promise<string | null> => {
  const languageGroup = getLspLanguageGroup(input.language, input.filePath);
  if (!languageGroup) return null;

  const sessionId = await getOrCreateLspSession({
    workspaceKey: input.workspaceKey,
    languageGroup,
    files: input.files,
  });

  try {
    await syncLspFile(sessionId, {
      file_path: normalizeWorkspacePath(input.filePath),
      content: input.content,
      version: input.version,
    });
  } catch (error) {
    if (!isRecoverableLspSessionError(error)) throw error;
    resetLspSession(input.workspaceKey, languageGroup);
    const refreshedSessionId = await getOrCreateLspSession({
      workspaceKey: input.workspaceKey,
      languageGroup,
      files: input.files,
    });
    await syncLspFile(refreshedSessionId, {
      file_path: normalizeWorkspacePath(input.filePath),
      content: input.content,
      version: input.version,
    });
    return refreshedSessionId;
  }

  return sessionId;
};

export const requestWorkspaceDiagnostics = async (input: {
  workspaceKey: string;
  language: string;
  filePath: string;
  files: WorkspaceFilePayload[];
}): Promise<{ languageGroup: LspLanguageGroup; diagnostics: LspDiagnostic[] } | null> => {
  const languageGroup = getLspLanguageGroup(input.language, input.filePath);
  if (!languageGroup) return null;

  const sessionId = await getOrCreateLspSession({
    workspaceKey: input.workspaceKey,
    languageGroup,
    files: input.files,
  });
  let response: Awaited<ReturnType<typeof getLspDiagnostics>>;
  try {
    response = await getLspDiagnostics(sessionId);
  } catch (error) {
    if (!isRecoverableLspSessionError(error)) throw error;
    resetLspSession(input.workspaceKey, languageGroup);
    const refreshedSessionId = await getOrCreateLspSession({
      workspaceKey: input.workspaceKey,
      languageGroup,
      files: input.files,
    });
    response = await getLspDiagnostics(refreshedSessionId);
  }
  return { languageGroup, diagnostics: response.diagnostics };
};

export const requestWorkspaceCompletions = async (input: {
  workspaceKey: string;
  language: string;
  filePath: string;
  line: number;
  column: number;
  version: number;
  files: WorkspaceFilePayload[];
}): Promise<LspCompletionItem[]> => {
  const languageGroup = getLspLanguageGroup(input.language, input.filePath);
  if (!languageGroup) return [];

  const sessionId = await getOrCreateLspSession({
    workspaceKey: input.workspaceKey,
    languageGroup,
    files: input.files,
  });
  let response: Awaited<ReturnType<typeof getLspCompletions>>;
  try {
    response = await getLspCompletions(sessionId, {
      file_path: normalizeWorkspacePath(input.filePath),
      line: input.line,
      column: input.column,
      version: input.version,
    });
  } catch (error) {
    if (!isRecoverableLspSessionError(error)) throw error;
    resetLspSession(input.workspaceKey, languageGroup);
    const refreshedSessionId = await getOrCreateLspSession({
      workspaceKey: input.workspaceKey,
      languageGroup,
      files: input.files,
    });
    response = await getLspCompletions(refreshedSessionId, {
      file_path: normalizeWorkspacePath(input.filePath),
      line: input.line,
      column: input.column,
      version: input.version,
    });
  }
  return response.items;
};

export const destroyWorkspaceLspSessions = async (
  workspaceKey: string,
): Promise<void> => {
  const targets = [...sessionCache.entries()].filter(([key]) =>
    key.startsWith(`${workspaceKey}:`),
  );

  await Promise.allSettled(
    targets.map(async ([key, value]) => {
      const sessionId = value.sessionId || (value.pending ? await value.pending : "");
      if (sessionId) {
        await destroyLspSession(sessionId);
      }
      sessionCache.delete(key);
    }),
  );
};
