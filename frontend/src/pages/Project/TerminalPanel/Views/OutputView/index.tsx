import React from "react";

const OutputView: React.FC = () => {
  return (
    <div className="h-full overflow-y-auto px-3 py-2 text-xs text-[#9d9d9d]">
      <div className="mb-1 text-[#cccccc]">Output</div>
      <div>No output yet. Run a task or program to see results here.</div>
    </div>
  );
};

export default OutputView;
