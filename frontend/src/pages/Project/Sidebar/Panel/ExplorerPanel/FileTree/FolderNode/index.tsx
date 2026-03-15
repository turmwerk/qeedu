import React, { useState } from "react";
import {
  RightOutlined,
  DownOutlined,
  FolderOpenOutlined,
  FolderOutlined,
} from "@ant-design/icons";
import { type FileTreeNode } from "../../../../../EditorArea/types";
import FileNode from "../FileNode";
import { useContextMenu, type ContextMenuItem } from "@/ui/ContextMenu";
import { useWorkspace } from "../../../../../context";

interface FolderNodeProps {
  node: FileTreeNode;
  depth: number;
}

const FolderNode: React.FC<FolderNodeProps> = ({ node, depth }) => {
  const [expanded, setExpanded] = useState(depth === 0 ? true : false);
  const { addFile, addFolder, renameNode, deleteNode, refreshFileTree } =
    useWorkspace();
  const { openAtEvent } = useContextMenu();
  const isRoot = node.path === "/";

  const copyText = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // ignore clipboard errors
    }
  };

  const handleContextMenu = (event: React.MouseEvent) => {
    event.stopPropagation();
    const items: ContextMenuItem[] = [
      {
        label: expanded ? "Collapse" : "Expand",
        onClick: () => setExpanded((prev) => !prev),
      },
      { type: "separator" },
      {
        label: "New File",
        onClick: () => {
          const name = window.prompt("New file name", "untitled.txt");
          if (!name) return;
          addFile(node.path, name, true);
          setExpanded(true);
        },
      },
      {
        label: "New Folder",
        onClick: () => {
          const name = window.prompt("New folder name", "new-folder");
          if (!name) return;
          addFolder(node.path, name);
          setExpanded(true);
        },
      },
      { type: "separator" },
      {
        label: "Rename",
        disabled: isRoot,
        onClick: () => {
          const name = window.prompt("Rename to", node.name);
          if (!name) return;
          renameNode(node.path, name);
        },
      },
      {
        label: "Delete",
        danger: true,
        disabled: isRoot,
        onClick: () => deleteNode(node.path),
      },
      { type: "separator" },
      { label: "Copy Path", onClick: () => copyText(node.path) },
      {
        label: "Copy Relative Path",
        onClick: () => copyText(node.path.replace(/^\//, "")),
      },
      { type: "separator" },
      { label: "Refresh", onClick: refreshFileTree },
    ];
    openAtEvent(event, items);
  };

  return (
    <div>
      {/* 文件夹行 */}
      <div
        className="group flex cursor-pointer select-none items-center gap-1 py-0.5 pr-2 text-xs text-[#cccccc] transition-colors hover:bg-[#2a2d2e]"
        style={{ paddingLeft: `${depth * 12 + 4}px` }}
        onClick={() => setExpanded((v) => !v)}
        onContextMenu={handleContextMenu}
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
