import React from "react";

const ConsoleView: React.FC = () => {
  return (
    <div className="h-full overflow-y-auto px-3 py-2 text-xs text-[#9d9d9d]">
      <div className="mb-1 text-[#cccccc]">调试控制台</div>
      <div>调试器空闲。启动调试会话后将在此显示日志。</div>
    </div>
  );
};

export default ConsoleView;
