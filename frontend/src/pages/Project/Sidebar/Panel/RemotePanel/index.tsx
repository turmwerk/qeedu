import React from "react";
import { CloudServerOutlined } from "@ant-design/icons";

const RemotePanel: React.FC = () => (
  <div className="flex h-full flex-col">
    <div className="border-b border-[#3c3c3c] px-4 py-2 text-[11px] font-semibold uppercase tracking-wider text-[#cccccc]">
      远程资源管理器
    </div>
    <div className="flex flex-1 flex-col items-center justify-center gap-2 text-[#6b6b6b]">
      <CloudServerOutlined className="text-3xl" />
      <p className="text-xs">暂无远程连接</p>
    </div>
  </div>
);

export default RemotePanel;
