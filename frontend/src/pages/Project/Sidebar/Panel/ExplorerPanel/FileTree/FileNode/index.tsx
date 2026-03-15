import React from "react";
import { getFileIcon } from "../../../../../utils/filePresentation";
import { type FileTreeNode } from "../../../../../EditorArea/types";
import { useWorkspace } from "../../../../../context";
import { useContextMenu, type ContextMenuItem } from "@/ui/ContextMenu";

interface FileNodeProps {
  node: FileTreeNode;
  depth: number;
}

const FileNode: React.FC<FileNodeProps> = ({ node, depth }) => {
  const { openFileTab, activeTabId, deleteNode, renameNode, addFile, addFolder } =
    useWorkspace();
  const { openAtEvent } = useContextMenu();
  const isActive = activeTabId === node.path;

  const copyText = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // ignore clipboard errors
    }
  };

  const handleContextMenu = (event: React.MouseEvent) => {
    event.stopPropagation();
    const parentPath = node.path.split("/").slice(0, -1).join("/") || "/";
    const items: ContextMenuItem[] = [
      { label: "Open", onClick: () => openFileTab(node) },
      { type: "separator" },
      {
        label: "New File",
        onClick: () => {
          const name = window.prompt("New file name", "untitled.txt");
          if (!name) return;
          addFile(parentPath, name, true);
        },
      },
      {
        label: "New Folder",
        onClick: () => {
          const name = window.prompt("New folder name", "new-folder");
          if (!name) return;
          addFolder(parentPath, name);
        },
      },
      { type: "separator" },
      {
        label: "Rename",
        onClick: () => {
          const name = window.prompt("Rename to", node.name);
          if (!name) return;
          renameNode(node.path, name);
        },
      },
      {
        label: "Delete",
        danger: true,
        onClick: () => deleteNode(node.path),
      },
      { type: "separator" },
      { label: "Copy Path", onClick: () => copyText(node.path) },
      {
        label: "Copy Relative Path",
        onClick: () => copyText(node.path.replace(/^\//, "")),
      },
    ];
    openAtEvent(event, items);
  };

  return (
    <div
      className={`group flex cursor-pointer select-none items-center gap-1.5 rounded-sm py-0.5 pr-2 text-xs transition-colors ${
        isActive
          ? "bg-[#094771] text-white"
          : "text-[#cccccc] hover:bg-[#2a2d2e]"
      }`}
      style={{ paddingLeft: `${(depth + 1) * 12 + 4}px` }}
      onClick={() => openFileTab(node)}
      onContextMenu={handleContextMenu}
    >
      <span className="shrink-0 text-sm">{getFileIcon(node.name)}</span>
      <span className="truncate">{node.name}</span>
    </div>
  );
};

export default FileNode;
