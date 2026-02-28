import React from "react";
import { BranchesOutlined } from "@ant-design/icons";

const SourceControlPanel: React.FC = () => (
  <div className="flex h-full flex-col">
    <div className="border-b border-[#3c3c3c] px-4 py-2 text-[11px] font-semibold uppercase tracking-wider text-[#cccccc]">
      源代码管理
    </div>
    <div className="flex flex-1 flex-col items-center justify-center gap-2 text-[#6b6b6b]">
      <BranchesOutlined className="text-3xl" />
      <p className="text-xs">无未提交更改</p>
    </div>
  </div>
);

export default SourceControlPanel;
