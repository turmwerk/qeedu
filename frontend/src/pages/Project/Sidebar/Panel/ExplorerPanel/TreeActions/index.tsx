import React from "react";
import {
  FileAddOutlined,
  FolderAddOutlined,
  ReloadOutlined,
} from "@ant-design/icons";

interface TreeActionsProps {
  onAddFile: () => void;
  onAddFolder: () => void;
  onRefresh: () => void;
}

const TreeActions: React.FC<TreeActionsProps> = ({
  onAddFile,
  onAddFolder,
  onRefresh,
}) => {
  const actions = [
    { icon: <FileAddOutlined />, title: "New File", onClick: onAddFile },
    { icon: <FolderAddOutlined />, title: "New Folder", onClick: onAddFolder },
    { icon: <ReloadOutlined />, title: "Refresh", onClick: onRefresh },
  ];

  return (
    <div className="flex items-center gap-0.5">
      {actions.map(({ icon, title, onClick }) => (
        <button
          key={title}
          title={title}
          className="flex h-6 w-6 items-center justify-center rounded text-[#858585] transition-colors hover:bg-white/10 hover:text-[#cccccc]"
          onClick={onClick}
        >
          <span className="text-xs">{icon}</span>
        </button>
      ))}
    </div>
  );
};

export default TreeActions;
