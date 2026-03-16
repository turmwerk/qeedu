import React from "react";

const ProblemsView: React.FC = () => {
  return (
    <div className="h-full overflow-y-auto px-3 py-2 text-xs text-[#9d9d9d]">
      <div className="mb-1 text-[#cccccc]">问题</div>
      <div>未检测到问题。</div>
    </div>
  );
};

export default ProblemsView;
