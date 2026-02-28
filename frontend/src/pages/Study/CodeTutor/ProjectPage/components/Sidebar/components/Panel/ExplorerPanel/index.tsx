import React from "react";
import {
  ReloadOutlined,
  ShrinkOutlined,
  EllipsisOutlined,
} from "@ant-design/icons";
import { useWorkspace } from "../../../../../context";
import FolderNode from "./components/FileTree/FolderNode";

const ExplorerPanel: React.FC = () => {
  const { fileTree, projectName } = useWorkspace();

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* 标题栏 */}
      <div className="flex shrink-0 items-center justify-between border-b border-[#3c3c3c] px-3 py-2">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-[#bbbbbb]">
          {projectName}
        </span>
        <div className="flex items-center gap-0.5">
          {[
            { icon: <ReloadOutlined />, title: "刷新" },
            { icon: <ShrinkOutlined />, title: "全部折叠" },
            { icon: <EllipsisOutlined />, title: "更多操作" },
          ].map(({ icon, title }) => (
            <button
              key={title}
              title={title}
              className="flex h-6 w-6 items-center justify-center rounded text-[#858585] transition-colors hover:bg-white/10 hover:text-[#cccccc]"
            >
              <span className="text-xs">{icon}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 文件树 */}
      <div className="min-h-0 flex-1 overflow-y-auto py-1">
        <FolderNode node={fileTree} depth={0} />
      </div>
    </div>
  );
};

export default ExplorerPanel;
