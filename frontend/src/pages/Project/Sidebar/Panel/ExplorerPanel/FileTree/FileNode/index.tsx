import React from "react";
import { getFileIcon } from "../../../../../utils/filePresentation";
import { type FileTreeNode } from "../../../../../EditorArea/types";
import { useWorkspace } from "../../../../../context";

interface FileNodeProps {
  node: FileTreeNode;
  depth: number;
}

const FileNode: React.FC<FileNodeProps> = ({ node, depth }) => {
  const { openFileTab, activeTabId } = useWorkspace();
  const isActive = activeTabId === node.path;

  return (
    <div
      className={`group flex cursor-pointer select-none items-center gap-1.5 rounded-sm py-0.5 pr-2 text-xs transition-colors ${
        isActive
          ? "bg-[#094771] text-white"
          : "text-[#cccccc] hover:bg-[#2a2d2e]"
      }`}
      style={{ paddingLeft: `${(depth + 1) * 12 + 4}px` }}
      onClick={() => openFileTab(node)}
    >
      <span className="shrink-0 text-sm">{getFileIcon(node.name)}</span>
      <span className="truncate">{node.name}</span>
    </div>
  );
};

export default FileNode;
