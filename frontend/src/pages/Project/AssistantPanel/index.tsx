import React, { useCallback, useMemo, useState } from "react";
import { RobotOutlined, CloseOutlined, DoubleRightOutlined } from "@ant-design/icons";
import Dialog from "@/feature/ChatDialog";
import { chatStream } from "@/api/ai";
import { showToast } from "@/ui/Toast";
import { buildAssistantDialogId, buildAssistantIntro } from "../data/assistant";
import { useWorkspace } from "../context";
import {
  appendCodeEditInstruction,
  buildWorkspaceFileContext,
  createHiddenEditBlockFilter,
  flattenWorkspaceFiles,
  formatAppliedEditSummary,
  getFileName,
  getParentPath,
  normalizeWorkspacePath,
  parseCodeEdits,
  type ParsedCodeEdit,
} from "./codeEdits";

const AssistantPanel: React.FC = () => {
  const {
    projectName,
    fileTree,
    activeTabId,
    tabs,
    updateFileContents,
    addFileWithContent,
  } = useWorkspace();
  const [collapsed, setCollapsed] = useState(false);

  const dialogId = buildAssistantDialogId(projectName);
  const initMsg = buildAssistantIntro(projectName);
  const activeTab = tabs.find((tab) => tab.id === activeTabId);
  const suggestedFiles = useMemo(() => {
    if (!activeTab || activeTab.content === undefined) return [];
    const blob = new Blob([activeTab.content], { type: "text/plain;charset=utf-8" });
    return [
      new File([blob], activeTab.title, {
        type: "text/plain",
        lastModified: Date.now(),
      }),
    ];
  }, [activeTab?.content, activeTab?.title]);

  const applyCodeEdits = useCallback((edits: ParsedCodeEdit[]) => {
    if (edits.length === 0) return [];

    const workspaceFiles = flattenWorkspaceFiles(useWorkspace.getState().fileTree);
    const resolveTargetPath = (rawPath: string) => {
      const normalized = normalizeWorkspacePath(rawPath);
      if (!normalized) return "";
      const directNode = useWorkspace.getState().getNodeByPath(normalized);
      if (directNode?.type === "file") return normalized;

      const requestedName = getFileName(normalized);
      if (activeTab && requestedName && requestedName === activeTab.title) {
        return activeTab.id;
      }

      const sameNameMatches = workspaceFiles.filter(
        (file) => getFileName(file.path) === requestedName,
      );
      if (sameNameMatches.length === 1) {
        return sameNameMatches[0].path;
      }
      return normalized;
    };

    const updates: { path: string; content: string }[] = [];
    const createdPaths: string[] = [];

    edits.forEach((edit) => {
      const path = resolveTargetPath(edit.path);
      if (!path) return;

      const existing = useWorkspace.getState().getNodeByPath(path);
      if (existing?.type === "file") {
        updates.push({ path, content: edit.content });
        return;
      }

      const parentPath = getParentPath(path);
      const fileName = getFileName(path);
      const parent = useWorkspace.getState().getNodeByPath(parentPath);
      if (!fileName || parent?.type !== "directory") return;

      const created = addFileWithContent(parentPath, fileName, edit.content, false);
      if (created) {
        createdPaths.push(created.path);
      }
    });

    if (updates.length > 0) {
      updateFileContents(updates);
    }

    const appliedPaths = [...updates.map((update) => update.path), ...createdPaths];
    if (appliedPaths.length === 0) return [];

    if (!activeTab || !appliedPaths.includes(activeTab.id)) {
      const firstPath = appliedPaths[0];
      window.setTimeout(() => {
        const node = useWorkspace.getState().getNodeByPath(firstPath);
        if (node?.type === "file") {
          useWorkspace.getState().openFileTab(node);
        }
      }, 0);
    }

    showToast(
      `AI updated ${appliedPaths.length} file${appliedPaths.length > 1 ? "s" : ""}`,
    );
    return appliedPaths;
  }, [activeTab, addFileWithContent, updateFileContents]);

  const transport = useCallback<NonNullable<React.ComponentProps<typeof Dialog>["transport"]>>((args) => {
    const controller = new AbortController();
    const fullResponse: string[] = [];
    const filter = createHiddenEditBlockFilter(args.onDelta);
    const workspaceContext = buildWorkspaceFileContext(fileTree, activeTab ?? null);
    const fileContext = [workspaceContext, args.fileContext]
      .filter(Boolean)
      .join("\n\nAttached file context:\n");
    const stream = chatStream({
      messages: appendCodeEditInstruction(args.messages, activeTab ?? null),
      file_context: fileContext || undefined,
      mode: args.mode,
      model: args.model,
      api_key: args.apiKey,
      base_url: args.baseUrl,
      temperature: args.temperature,
      max_tokens: args.maxTokens,
      onDelta: (delta) => {
        fullResponse.push(delta);
        filter.push(delta);
      },
      onDone: () => {
        filter.flush();
        const edits = parseCodeEdits(fullResponse.join(""));
        const appliedPaths = applyCodeEdits(edits);
        if (appliedPaths.length > 0) {
          args.onDelta(formatAppliedEditSummary(appliedPaths));
        }
        args.onDone();
      },
      onError: (err) => {
        filter.flush();
        args.onError(err);
      },
    });

    controller.signal.addEventListener("abort", () => stream.abort(), { once: true });
    return controller;
  }, [activeTab, applyCodeEdits, fileTree]);

  if (collapsed) {
    return (
      <div className="flex h-full w-full flex-col items-center border-l border-[#3c3c3c] bg-[#252526] py-2">
        <button
          className="flex h-8 w-8 items-center justify-center rounded text-[#858585] transition hover:bg-white/10 hover:text-[#cccccc]"
          title="展开 AI 助手"
          onClick={() => setCollapsed(false)}
        >
          <DoubleRightOutlined className="rotate-180 text-xs" />
        </button>
      </div>
    );
  }

  return (
    <div className="flex h-full w-full min-w-0 flex-col overflow-hidden border-l border-[#3c3c3c] bg-[#252526]">
      {/* 标题栏 */}
      <div className="flex h-9 shrink-0 select-none items-center justify-between border-b border-[#3c3c3c] px-3">
        <div className="flex items-center gap-2 text-xs text-[#cccccc]">
          <RobotOutlined className="text-[#007acc]" />
          <span className="font-medium">AI 编程助手</span>
        </div>
        <div className="flex items-center gap-1">
          {activeTabId && (
            <span className="max-w-[100px] truncate rounded bg-[#007acc]/15 px-1.5 py-0.5 text-[10px] text-[#007acc]">
              {activeTabId.split("/").pop()}
            </span>
          )}
          <button
            className="flex h-6 w-6 items-center justify-center rounded text-[#858585] transition hover:bg-white/10 hover:text-[#cccccc]"
            title="折叠助手面板"
            onClick={() => setCollapsed(true)}
          >
            <CloseOutlined className="text-[10px]" />
          </button>
        </div>
      </div>

      {/* 对话区 */}
      <div className="min-h-0 flex-1 overflow-hidden">
        <Dialog
          dialogId={dialogId}
          botName="Code Tutor AI"
          initMessage={initMsg}
          suggestedFiles={suggestedFiles}
          transport={transport}
        />
      </div>
    </div>
  );
};

export default AssistantPanel;
