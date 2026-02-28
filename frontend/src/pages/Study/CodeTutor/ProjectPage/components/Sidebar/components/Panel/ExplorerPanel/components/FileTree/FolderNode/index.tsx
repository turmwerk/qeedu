import React, { useState } from "react";
import {
  RightOutlined,
  DownOutlined,
  FolderOpenOutlined,
  FolderOutlined,
} from "@ant-design/icons";
import { type FileTreeNode } from "../../../../../../../EditorArea/types";
import FileNode from "../FileNode";

interface FolderNodeProps {
  node: FileTreeNode;
  depth: number;
}

const FolderNode: React.FC<FolderNodeProps> = ({ node, depth }) => {
  const [expanded, setExpanded] = useState(depth === 0 ? true : false);

  return (
    <div>
      {/* 文件夹行 */}
      <div
        className="group flex cursor-pointer select-none items-center gap-1 py-0.5 pr-2 text-xs text-[#cccccc] transition-colors hover:bg-[#2a2d2e]"
        style={{ paddingLeft: `${depth * 12 + 4}px` }}
        onClick={() => setExpanded((v) => !v)}
      >
        {/* chevron */}
        <span className="flex w-3 shrink-0 items-center justify-center text-[10px] text-[#858585] transition-transform">
          {expanded ? <DownOutlined /> : <RightOutlined />}
        </span>
        {/* 文件夹图标 */}
        <span className="shrink-0 text-sm">
          {expanded ? (
            <FolderOpenOutlined className="text-[#e8ab53]" />
          ) : (
            <FolderOutlined className="text-[#e8ab53]" />
          )}
        </span>
        <span className="truncate font-medium">{node.name}</span>
      </div>

      {/* 展开的子节点 */}
      {expanded && node.children && (
        <div>
          {node.children.map((child) =>
            child.type === "directory" ? (
              <FolderNode key={child.path} node={child} depth={depth + 1} />
            ) : (
              <FileNode key={child.path} node={child} depth={depth + 1} />
            ),
          )}
        </div>
      )}
    </div>
  );
};

export default FolderNode;
