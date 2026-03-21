import type { editor } from "monaco-editor";
import type { LspDiagnostic } from "@/api/sandbox";
import {
  collectWorkspaceFilesForGroup,
  getLspLanguageGroup,
  normalizeWorkspacePath,
  requestWorkspaceDiagnostics,
  syncWorkspaceLspFile,
} from "./client";
import {
  type WorkspaceDiagnostic,
  useWorkspace,
} from "@/pages/Project/context";

const LSP_MARKER_OWNER = "workspace-lsp";
const SYNC_DEBOUNCE_MS = 1000;
const DIAGNOSTIC_POLL_MS = 5000;

const mapSeverity = (
  severity: number,
): WorkspaceDiagnostic["severity"] => {
  switch (severity) {
    case 2:
      return "warning";
    case 3:
      return "information";
    case 4:
      return "hint";
    case 1:
    default:
      return "error";
  }
};

const toMarkerSeverity = (
  monaco: typeof import("monaco-editor"),
  severity: WorkspaceDiagnostic["severity"],
) => {
  switch (severity) {
    case "warning":
      return monaco.MarkerSeverity.Warning;
    case "information":
      return monaco.MarkerSeverity.Info;
    case "hint":
      return monaco.MarkerSeverity.Hint;
    case "error":
    default:
      return monaco.MarkerSeverity.Error;
  }
};

export const mapLspDiagnosticsToWorkspaceDiagnostics = (
  diagnostics: LspDiagnostic[],
): WorkspaceDiagnostic[] =>
  diagnostics.map((diagnostic) => {
    const filePath = normalizeWorkspacePath(diagnostic.file_path);
    return {
      id: [
        filePath,
        diagnostic.start_line,
        diagnostic.start_column,
        diagnostic.message,
        diagnostic.code,
      ].join(":"),
      filePath,
      startLine: diagnostic.start_line,
      startColumn: diagnostic.start_column,
      endLine: diagnostic.end_line,
      endColumn: diagnostic.end_column,
      severity: mapSeverity(diagnostic.severity),
      source: diagnostic.source,
      message: diagnostic.message,
      code: diagnostic.code,
    };
  });

const setMarkersForModel = (
  monaco: typeof import("monaco-editor"),
  model: editor.ITextModel,
) => {
  const normalizedPath = normalizeWorkspacePath(model.uri.path);
  const diagnostics = useWorkspace
    .getState()
    .diagnostics.filter((diagnostic) => diagnostic.filePath === normalizedPath);

  monaco.editor.setModelMarkers(
    model,
    LSP_MARKER_OWNER,
    diagnostics.map((diagnostic) => ({
      startLineNumber: Math.max(diagnostic.startLine, 1),
      startColumn: Math.max(diagnostic.startColumn, 1),
      endLineNumber: Math.max(diagnostic.endLine || diagnostic.startLine, 1),
      endColumn: Math.max(
        diagnostic.endColumn ||
          diagnostic.startColumn ||
          diagnostic.startColumn + 1,
        diagnostic.startColumn + 1,
      ),
      severity: toMarkerSeverity(monaco, diagnostic.severity),
      message: diagnostic.message,
      source: diagnostic.source,
      code: diagnostic.code,
    })),
  );
};

export const setupLspDiagnostics = (input: {
  editorInstance: editor.IStandaloneCodeEditor;
  monaco: typeof import("monaco-editor");
  language: string;
  path?: string;
  readOnly?: boolean;
  workspaceKey: string;
}): (() => void) => {
  const model = input.editorInstance.getModel();
  if (!model) return () => undefined;

  if (input.readOnly || !input.path) {
    input.monaco.editor.setModelMarkers(model, LSP_MARKER_OWNER, []);
    return () => undefined;
  }

  const languageGroup = getLspLanguageGroup(input.language, input.path);
  if (!languageGroup) {
    input.monaco.editor.setModelMarkers(model, LSP_MARKER_OWNER, []);
    return () => undefined;
  }
  const filePath = input.path;

  let disposed = false;
  let debounceTimer: number | null = null;
  let pollingTimer: number | null = null;

  const applyMarkers = () => {
    if (disposed) return;
    setMarkersForModel(input.monaco, model);
  };

  const refreshDiagnostics = async (shouldSync: boolean) => {
    if (disposed) return;

    const state = useWorkspace.getState();
    const files = collectWorkspaceFilesForGroup(
      state.fileTree,
      state.tabs,
      languageGroup,
    );

    try {
      if (shouldSync) {
        await syncWorkspaceLspFile({
          workspaceKey: input.workspaceKey,
          language: input.language,
          filePath,
          content: model.getValue(),
          version: model.getVersionId(),
          files,
        });
      }

      const response = await requestWorkspaceDiagnostics({
        workspaceKey: input.workspaceKey,
        language: input.language,
        filePath,
        files,
      });

      if (!response || disposed) return;
      useWorkspace
        .getState()
        .setDiagnosticsForGroup(
          response.languageGroup,
          mapLspDiagnosticsToWorkspaceDiagnostics(response.diagnostics),
        );
      applyMarkers();
    } catch {
      /* keep last known diagnostics */
    }
  };

  void refreshDiagnostics(true);

  const contentDisposable = model.onDidChangeContent(() => {
    if (debounceTimer) {
      window.clearTimeout(debounceTimer);
    }
    debounceTimer = window.setTimeout(() => {
      void refreshDiagnostics(true);
    }, SYNC_DEBOUNCE_MS);
  });

  const unsubscribe = useWorkspace.subscribe((state, previousState) => {
    if (state.diagnostics !== previousState.diagnostics) {
      applyMarkers();
    }
  });

  pollingTimer = window.setInterval(() => {
    void refreshDiagnostics(false);
  }, DIAGNOSTIC_POLL_MS);

  applyMarkers();

  return () => {
    disposed = true;
    if (debounceTimer) {
      window.clearTimeout(debounceTimer);
    }
    if (pollingTimer) {
      window.clearInterval(pollingTimer);
    }
    unsubscribe();
    contentDisposable.dispose();
    input.monaco.editor.setModelMarkers(model, LSP_MARKER_OWNER, []);
  };
};
