import React from "react";
import { useWorkspace } from "../../../context";

const OutputView: React.FC = () => {
  const { runOutput } = useWorkspace();

  if (!runOutput) {
    return (
      <div className="h-full overflow-y-auto px-3 py-2 text-xs text-[#9d9d9d]">
        <div className="mb-1 text-[#cccccc]">输出</div>
        <div>暂无输出。运行任务或程序后会在此显示结果。</div>
      </div>
    );
  }

  const hasError = runOutput.error || runOutput.exitCode !== 0;

  return (
    <div className="h-full overflow-y-auto px-3 py-2 font-mono text-xs">
      <div className="mb-2 flex items-center gap-3 text-[11px] text-[#858585]">
        <span>
          退出码：
          <span className={hasError ? "text-[#f48771]" : "text-[#89d185]"}>
            {runOutput.exitCode}
          </span>
        </span>
        {runOutput.executionMs > 0 && <span>{runOutput.executionMs}毫秒</span>}
      </div>

      {runOutput.error && (
        <div className="mb-2 whitespace-pre-wrap text-[#f48771]">
          {runOutput.error}
        </div>
      )}

      {runOutput.stdout && (
        <div className="mb-2 whitespace-pre-wrap text-[#cccccc]">
          {runOutput.stdout}
        </div>
      )}

      {runOutput.stderr && (
        <div className="whitespace-pre-wrap text-[#f48771]">
          {runOutput.stderr}
        </div>
      )}
    </div>
  );
};

export default OutputView;
