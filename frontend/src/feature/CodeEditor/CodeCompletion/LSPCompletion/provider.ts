import type {
  editor,
  languages,
  Position,
  IDisposable,
} from "monaco-editor";
import { useWorkspace } from "@/pages/Project/context";
import {
  collectWorkspaceFilesForGroup,
  getLspLanguageGroup,
  requestWorkspaceCompletions,
  syncWorkspaceLspFile,
} from "./client";

const toCompletionKind = (
  monaco: typeof import("monaco-editor"),
  kind: string,
) => {
  switch (kind) {
    case "2":
      return monaco.languages.CompletionItemKind.Method;
    case "3":
      return monaco.languages.CompletionItemKind.Function;
    case "4":
      return monaco.languages.CompletionItemKind.Constructor;
    case "5":
      return monaco.languages.CompletionItemKind.Field;
    case "6":
      return monaco.languages.CompletionItemKind.Variable;
    case "7":
      return monaco.languages.CompletionItemKind.Class;
    case "8":
      return monaco.languages.CompletionItemKind.Interface;
    case "9":
      return monaco.languages.CompletionItemKind.Module;
    case "10":
      return monaco.languages.CompletionItemKind.Property;
    case "11":
      return monaco.languages.CompletionItemKind.Unit;
    case "12":
      return monaco.languages.CompletionItemKind.Value;
    case "13":
      return monaco.languages.CompletionItemKind.Enum;
    case "14":
      return monaco.languages.CompletionItemKind.Keyword;
    case "15":
      return monaco.languages.CompletionItemKind.Snippet;
    case "16":
      return monaco.languages.CompletionItemKind.Color;
    case "17":
      return monaco.languages.CompletionItemKind.File;
    case "18":
      return monaco.languages.CompletionItemKind.Reference;
    case "19":
      return monaco.languages.CompletionItemKind.Folder;
    case "20":
      return monaco.languages.CompletionItemKind.EnumMember;
    case "21":
      return monaco.languages.CompletionItemKind.Constant;
    case "22":
      return monaco.languages.CompletionItemKind.Struct;
    case "23":
      return monaco.languages.CompletionItemKind.Event;
    case "24":
      return monaco.languages.CompletionItemKind.Operator;
    case "25":
      return monaco.languages.CompletionItemKind.TypeParameter;
    case "1":
    default:
      return monaco.languages.CompletionItemKind.Text;
  }
};

export const createLspCompletionDisposable = (
  monaco: typeof import("monaco-editor"),
  editorInstance: editor.IStandaloneCodeEditor,
  language: string,
  path?: string,
): IDisposable | null => {
  const languageGroup = getLspLanguageGroup(language, path);
  if (!path || !languageGroup) {
    return null;
  }

  const provider: languages.CompletionItemProvider = {
    triggerCharacters: [".", ":", ">", "\"", "'", "/", "@"],
    provideCompletionItems: async (
      model: editor.ITextModel,
      position: Position,
    ) => {
      if (model.uri.path !== path || editorInstance.getModel()?.uri.path !== path) {
        return { suggestions: [] };
      }

      const state = useWorkspace.getState();
      const files = collectWorkspaceFilesForGroup(
        state.fileTree,
        state.tabs,
        languageGroup,
      );

      try {
        await syncWorkspaceLspFile({
          workspaceKey: state.workspaceKey,
          language,
          filePath: path,
          content: model.getValue(),
          version: model.getVersionId(),
          files,
        });

        const items = await requestWorkspaceCompletions({
          workspaceKey: state.workspaceKey,
          language,
          filePath: path,
          line: position.lineNumber,
          column: position.column,
          version: model.getVersionId(),
          files,
        });

        return {
          suggestions: items.map((item) => ({
            label: item.label,
            insertText: item.insert_text || item.label,
            detail: item.detail,
            documentation: item.documentation,
            kind: toCompletionKind(monaco, item.kind),
            range: {
              startLineNumber: position.lineNumber,
              startColumn: model.getWordUntilPosition(position).startColumn,
              endLineNumber: position.lineNumber,
              endColumn: model.getWordUntilPosition(position).endColumn,
            },
          })),
        };
      } catch {
        return { suggestions: [] };
      }
    },
  };

  return monaco.languages.registerCompletionItemProvider(language, provider);
};
