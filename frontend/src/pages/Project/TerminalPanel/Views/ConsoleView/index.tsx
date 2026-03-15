import React from "react";

const ConsoleView: React.FC = () => {
  return (
    <div className="h-full overflow-y-auto px-3 py-2 text-xs text-[#9d9d9d]">
      <div className="mb-1 text-[#cccccc]">Debug Console</div>
      <div>Debugger is idle. Start a debug session to see logs.</div>
    </div>
  );
};

export default ConsoleView;
