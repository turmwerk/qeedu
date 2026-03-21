import React from "react";
import { useWorkspace, type RunOutput } from "../../../context";
import { usePanelHistoryRecords } from "../../history";

const formatTime = (timestamp: number): string =>
  new Date(timestamp).toLocaleString("zh-CN", {
    hour12: false,
  });

const OutputBlock: React.FC<{
  output: RunOutput;
  title: string;
}> = ({ output, title }) => {
  const hasError = !!output.error || output.exitCode !== 0;

  return (
    <div className="border-b border-[#2d2d2d] px-3 py-2 last:border-b-0">
      <div className="mb-2 flex flex-wrap items-center gap-3 text-[11px] text-[#858585]">
        <span className="text-[#cccccc]">{title}</span>
        {output.fileName && <span>{output.fileName}</span>}
        <span>{formatTime(output.timestamp)}</span>
        <span>
          退出码：
          <span className={hasError ? "text-[#f48771]" : "text-[#89d185]"}>
            {output.exitCode}
          </span>
        </span>
        {output.executionMs > 0 && <span>{output.executionMs}毫秒</span>}
      </div>

      {output.error && (
        <div className="mb-2 whitespace-pre-wrap text-[#f48771]">
          {output.error}
        </div>
      )}

      {output.stdout && (
        <div className="mb-2 whitespace-pre-wrap text-[#cccccc]">
          {output.stdout}
        </div>
      )}

      {output.stderr && (
        <div className="whitespace-pre-wrap text-[#f48771]">
          {output.stderr}
        </div>
      )}

      {!output.error && !output.stdout && !output.stderr && (
        <div className="text-[#858585]">没有输出内容。</div>
      )}
    </div>
  );
};

const OutputView: React.FC = () => {
  const workspaceKey = useWorkspace((state) => state.workspaceKey);
  const runOutput = useWorkspace((state) => state.runOutput);
  const historyRecords = usePanelHistoryRecords<RunOutput>(workspaceKey, "output");
  const fallbackOutput =
    historyRecords.length === 0 && runOutput && runOutput.status !== "running"
      ? runOutput
      : null;

  return (
    <div className="h-full overflow-y-auto px-3 py-2 font-mono text-xs">


      {runOutput?.status === "running" && (
        <div className="mb-3 border border-[#2d4f2d] bg-[#1f2a1f] px-3 py-2 text-[#89d185]">
          正在运行...
          {runOutput.fileName ? ` 当前文件：${runOutput.fileName}` : ""}
        </div>
      )}

      {historyRecords.length === 0 && !fallbackOutput ? (
        <div className="text-[#858585]">当前项目还没有历史输出。</div>
      ) : (
        <div className="border border-[#2d2d2d] bg-[#1e1e1e]">
          {fallbackOutput && (
            <OutputBlock output={fallbackOutput} title="最近结果" />
          )}
          {historyRecords.map((record) => (
            <OutputBlock key={record.id} output={record.payload} title={record.title} />
          ))}
        </div>
      )}
    </div>
  );
};

export default OutputView;
