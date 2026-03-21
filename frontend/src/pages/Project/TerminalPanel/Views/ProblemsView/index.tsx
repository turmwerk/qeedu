import React, { useMemo } from "react";
import { useWorkspace } from "../../../context";
import { parseProblems, type ParsedProblem } from "../../problemParser";
import { mapDiagnosticsToProblems, mergeProblems, type ProblemHistoryPayload } from "../../problemState";
import { usePanelHistoryRecords } from "../../history";
import type { FileTreeNode } from "../../../EditorArea/types";

const findNodeByPath = (node: FileTreeNode, path: string): FileTreeNode | null => {
  if (node.path === path) return node;
  if (!node.children) return null;
  for (const child of node.children) {
    const match = findNodeByPath(child, path);
    if (match) return match;
  }
  return null;
};

const severityClassMap: Record<ParsedProblem["severity"], string> = {
  error: "text-[#f48771]",
  warning: "text-[#dcdcaa]",
  information: "text-[#4fc1ff]",
  hint: "text-[#9cdcfe]",
};

const severityLabelMap: Record<ParsedProblem["severity"], string> = {
  error: "错误",
  warning: "警告",
  information: "信息",
  hint: "提示",
};

const ProblemList: React.FC<{
  problems: ParsedProblem[];
  onOpen: (path: string) => void;
}> = ({ problems, onOpen }) => (
  <div>
    {problems.map((problem) => {
      const hasLocation = typeof problem.line === "number";
      return (
        <button
          key={problem.id}
          type="button"
          className="flex w-full items-start gap-3 border-b border-[#2d2d2d] px-3 py-2 text-left transition last:border-b-0 hover:bg-[#2a2d2e]"
          onClick={() => onOpen(problem.filePath)}
        >
          <span
            className={`mt-[1px] shrink-0 ${severityClassMap[problem.severity]}`}
          >
            {severityLabelMap[problem.severity]}
          </span>
          <div className="min-w-0 flex-1">
            <div className="mb-1 text-[#cccccc]">{problem.message}</div>
            <div className="text-[11px] text-[#858585]">
              {problem.filePath}
              {hasLocation
                ? `:${problem.line}${problem.column ? `:${problem.column}` : ""}`
                : ""}
              {problem.source ? ` · ${problem.source}` : ""}
            </div>
          </div>
        </button>
      );
    })}
  </div>
);

const ProblemsView: React.FC = () => {
  const workspaceKey = useWorkspace((state) => state.workspaceKey);
  const fileTree = useWorkspace((state) => state.fileTree);
  const openFileTab = useWorkspace((state) => state.openFileTab);
  const runOutput = useWorkspace((state) => state.runOutput);
  const diagnostics = useWorkspace((state) => state.diagnostics);
  const historyRecords = usePanelHistoryRecords<ProblemHistoryPayload>(
    workspaceKey,
    "problems",
  );
  const currentProblems = useMemo(
    () =>
      mergeProblems(
        mapDiagnosticsToProblems(diagnostics),
        parseProblems(runOutput),
      ),
    [diagnostics, runOutput],
  );

  const openProblemFile = (path: string) => {
    const file = findNodeByPath(fileTree, path);
    if (file && file.type === "file") {
      openFileTab(file);
    }
  };

  return (
    <div className="h-full overflow-y-auto px-3 py-2 text-xs text-[#9d9d9d]">
      <div className="mb-1 text-[#cccccc]">历史问题</div>
      {historyRecords.length === 0 ? (
        <div className="mb-4">当前项目还没有历史问题记录。</div>
      ) : (
        <div className="mb-4 border border-[#2d2d2d] bg-[#1e1e1e]">
          {historyRecords.map((record, index) => (
            <div
              key={record.id}
              className={index === 0 ? "" : "border-t border-[#2d2d2d]"}
            >
              <div className="flex flex-wrap items-center gap-3 border-b border-[#2d2d2d] bg-[#202020] px-3 py-2 text-[11px] text-[#858585]">
                <span className="text-[#cccccc]">{record.title}</span>
                <span>
                  {new Date(record.updatedAt).toLocaleString("zh-CN", {
                    hour12: false,
                  })}
                </span>
              </div>
              <ProblemList
                problems={record.payload.problems}
                onOpen={openProblemFile}
              />
            </div>
          ))}
        </div>
      )}

      <div className="mb-1 text-[#cccccc]">当前问题</div>
      {runOutput?.status === "running" && (
        <div className="mb-2 text-[#858585]">程序正在运行，实时诊断仍会继续刷新。</div>
      )}
      {currentProblems.length === 0 ? (
        <div>未检测到问题。</div>
      ) : (
        <div className="border border-[#2d2d2d] bg-[#1e1e1e]">
          <ProblemList problems={currentProblems} onOpen={openProblemFile} />
        </div>
      )}
    </div>
  );
};

export default ProblemsView;
