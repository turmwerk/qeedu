import React from "react";
import { getFileIcon } from "../../../../../utils/filePresentation";
import { type FileTreeNode } from "../../../../../EditorArea/types";
import { useWorkspace } from "../../../../../context";
import { useContextMenu, type ContextMenuItem } from "@/ui/ContextMenu";
import InlineEditRow from "../InlineEditRow";
import { type InlineEditState } from "../editing";

interface FileNodeProps {
  node: FileTreeNode;
  depth: number;
  editState: InlineEditState | null;
  selectedPath: string | null;
  onSelectNode: (node: { path: string; type: "file" | "directory" }) => void;
  onStartCreateFile: (parentPath: string) => void;
  onStartCreateFolder: (parentPath: string) => void;
  onStartRename: (targetPath: string, initialName: string) => void;
  onCommitEdit: (value: string) => void;
  onCancelEdit: () => void;
}

const FileNode: React.FC<FileNodeProps> = ({
  node,
  depth,
  editState,
  selectedPath,
  onSelectNode,
  onStartCreateFile,
  onStartCreateFolder,
  onStartRename,
  onCommitEdit,
  onCancelEdit,
}) => {
  const { openFileTab, activeTabId, deleteNode, moveNode } = useWorkspace();
  const { openAtEvent } = useContextMenu();
  const isActive = activeTabId === node.path;
  const isRenaming =
    editState?.mode === "rename" && editState.targetPath === node.path;
  const isSelected = selectedPath === node.path;
  const [dragOver, setDragOver] = React.useState(false);

  const copyText = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // ignore clipboard errors
    }
  };

  const handleContextMenu = (event: React.MouseEvent) => {
    event.stopPropagation();
    onSelectNode({ path: node.path, type: "file" });
    const parentPath = node.path.split("/").slice(0, -1).join("/") || "/";
    const items: ContextMenuItem[] = [
      { label: "打开", onClick: () => openFileTab(node) },
      { type: "separator" },
      {
        label: "新建文件",
        onClick: () => {
          onStartCreateFile(parentPath);
        },
      },
      {
        label: "新建文件夹",
        onClick: () => {
          onStartCreateFolder(parentPath);
        },
      },
      { type: "separator" },
      {
        label: "重命名",
        onClick: () => {
          onStartRename(node.path, node.name);
        },
      },
      {
        label: "删除",
        danger: true,
        onClick: () => deleteNode(node.path),
      },
      { type: "separator" },
      { label: "复制路径", onClick: () => copyText(node.path) },
      {
        label: "复制相对路径",
        onClick: () => copyText(node.path.replace(/^\//, "")),
      },
    ];
    openAtEvent(event, items);
  };

  const handleDragStart = (event: React.DragEvent) => {
    onSelectNode({ path: node.path, type: "file" });
    event.dataTransfer.setData(
      "application/x-workspace-node",
      JSON.stringify({ path: node.path, type: node.type }),
    );
    event.dataTransfer.setData("text/plain", node.path);
    event.dataTransfer.effectAllowed = "move";
  };

  const getDragPath = (event: React.DragEvent) => {
    const payload = event.dataTransfer.getData("application/x-workspace-node");
    if (payload) {
      try {
        const parsed = JSON.parse(payload) as { path?: string };
        if (parsed?.path) return parsed.path;
      } catch {
        // ignore invalid payloads
      }
    }
    const text = event.dataTransfer.getData("text/plain");
    return text || null;
  };

  const guideWidth = depth * 12;

  if (isRenaming) {
    return (
      <InlineEditRow
        depth={depth}
        variant="file"
        initialValue={editState?.initialName ?? node.name}
        placeholder="新的文件名称"
        getIcon={(value) => getFileIcon(value || node.name)}
        onSubmit={onCommitEdit}
        onCancel={onCancelEdit}
      />
    );
  }

  return (
    <div
      className={`group relative flex cursor-pointer select-none items-center gap-1.5 rounded-sm py-0.5 pr-2 text-xs transition-colors ${
        isActive
          ? "bg-[#094771] text-white"
          : "text-[#cccccc] hover:bg-[#2a2d2e]"
      } ${isSelected && !isActive ? "bg-[#2a2d2e]" : ""} ${
        dragOver ? "bg-[#233026]" : ""
      }`}
      style={{ paddingLeft: `${(depth + 1) * 12 + 4}px` }}
      onClick={() => {
        onSelectNode({ path: node.path, type: "file" });
        openFileTab(node);
      }}
      onContextMenu={handleContextMenu}
      draggable
      onDragStart={handleDragStart}
      onDragOver={(event) => {
        event.preventDefault();
        event.stopPropagation();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(event) => {
        event.preventDefault();
        event.stopPropagation();
        setDragOver(false);
        const sourcePath = getDragPath(event);
        if (!sourcePath) return;
        const parentPath = node.path.split("/").slice(0, -1).join("/") || "/";
        moveNode(sourcePath, parentPath);
      }}
    >
      {guideWidth > 0 && (
        <span
          className="pointer-events-none absolute left-0 top-0 h-full"
          style={{
            width: `${guideWidth}px`,
            backgroundImage:
              "linear-gradient(to right, rgba(255,255,255,0.12) 1px, transparent 1px)",
            backgroundSize: "12px 100%",
            backgroundPosition: "4px 0",
          }}
        />
      )}
      <span className="shrink-0 text-sm">{getFileIcon(node.name)}</span>
      <span className="truncate">{node.name}</span>
    </div>
  );
};

export default FileNode;
