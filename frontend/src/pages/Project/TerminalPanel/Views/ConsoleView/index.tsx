import React from "react";
import { useWorkspace } from "../../../context";
import { usePanelHistoryRecords } from "../../history";

const ConsoleView: React.FC = () => {
  const workspaceKey = useWorkspace((state) => state.workspaceKey);
  const historyRecords = usePanelHistoryRecords(workspaceKey, "console");

  return (
    <div className="h-full overflow-y-auto px-3 py-2 text-xs text-[#9d9d9d]">
      <div className="mb-1 text-[#cccccc]">调试控制台</div>
      {historyRecords.length === 0 ? (
        <div>调试器空闲。启动调试会话后将在此显示日志。</div>
      ) : (
        <div className="border border-[#2d2d2d] bg-[#1e1e1e]">
          {historyRecords.map((record) => (
            <div
              key={record.id}
              className="border-b border-[#2d2d2d] px-3 py-2 last:border-b-0"
            >
              <div className="mb-1 text-[11px] text-[#858585]">
                {record.title} ·{" "}
                {new Date(record.updatedAt).toLocaleString("zh-CN", {
                  hour12: false,
                })}
              </div>
              <pre className="whitespace-pre-wrap text-[#cccccc]">
                {JSON.stringify(record.payload, null, 2)}
              </pre>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ConsoleView;
