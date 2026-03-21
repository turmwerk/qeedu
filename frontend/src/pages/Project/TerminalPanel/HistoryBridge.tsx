import { useEffect, useMemo, useRef } from "react";
import { useWorkspace } from "../context";
import { createPanelHistoryRecord } from "./history";
import { parseProblems } from "./problemParser";
import { mapDiagnosticsToProblems, mergeProblems } from "./problemState";

const HistoryBridge: React.FC = () => {
  const workspaceKey = useWorkspace((state) => state.workspaceKey);
  const runOutput = useWorkspace((state) => state.runOutput);
  const diagnostics = useWorkspace((state) => state.diagnostics);
  const runtimeProblems = useMemo(() => parseProblems(runOutput), [runOutput]);
  const currentProblems = useMemo(
    () => mergeProblems(mapDiagnosticsToProblems(diagnostics), runtimeProblems),
    [diagnostics, runtimeProblems],
  );
  const lastOutputRecordIdRef = useRef<string>("");
  const lastProblemSignatureRef = useRef<string>("");

  useEffect(() => {
    if (!workspaceKey || !runOutput || runOutput.status !== "completed") return;

    const recordId = [
      "output",
      workspaceKey,
      runOutput.timestamp,
      runOutput.filePath ?? runOutput.fileName ?? "unknown",
    ].join(":");

    if (lastOutputRecordIdRef.current === recordId) {
      return;
    }
    lastOutputRecordIdRef.current = recordId;

    void createPanelHistoryRecord({
      id: recordId,
      workspaceKey,
      viewId: "output",
      createdAt: runOutput.timestamp,
      updatedAt: runOutput.timestamp,
      title: runOutput.fileName ? `运行 ${runOutput.fileName}` : "运行结果",
      payload: runOutput,
      meta: {
        language: runOutput.language,
        filePath: runOutput.filePath,
      },
    });
  }, [runOutput, workspaceKey]);

  useEffect(() => {
    if (!workspaceKey) return;
    if (currentProblems.length === 0) return;

    const signature = JSON.stringify(
      currentProblems.map((problem) => [
        problem.filePath,
        problem.line,
        problem.column,
        problem.severity,
        problem.message,
      ]),
    );

    if (signature === lastProblemSignatureRef.current) {
      return;
    }
    lastProblemSignatureRef.current = signature;

    const timestamp = Date.now();
    void createPanelHistoryRecord({
      workspaceKey,
      viewId: "problems",
      createdAt: timestamp,
      updatedAt: timestamp,
      title: `发现 ${currentProblems.length} 个问题`,
      payload: {
        problems: currentProblems,
      },
      meta: {
        diagnosticCount: diagnostics.length,
        runtimeProblemCount: runtimeProblems.length,
      },
    });
  }, [currentProblems, diagnostics.length, runtimeProblems.length, workspaceKey]);

  return null;
};

export default HistoryBridge;
