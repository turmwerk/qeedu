import React, { useEffect, useState } from "react";
import { DownOutlined, RightOutlined } from "@ant-design/icons";
import { useContextMenu, type ContextMenuItem } from "@/ui/ContextMenu";
import { type FileTreeNode } from "../../../../../EditorArea/types";
import { useWorkspace } from "../../../../../context";
import { getFileIcon, getFolderIcon } from "../../../../../utils/filePresentation";
import FileNode from "../FileNode";
import InlineEditRow from "../InlineEditRow";
import { type InlineEditState } from "../editing";

interface FolderNodeProps {
  node: FileTreeNode;
  depth: number;
  editState: InlineEditState | null;
  selectedPath: string | null;
  isExpanded: (path: string) => boolean;
  onSelectNode: (node: { path: string; type: "file" | "directory" }) => void;
  onToggleExpanded: (path: string) => void;
  onEnsureExpanded: (path: string) => void;
  onStartCreateFile: (placement?: {
    parentPath?: string;
    anchorPath?: string;
  }) => void;
  onStartCreateFolder: (placement?: {
    parentPath?: string;
    anchorPath?: string;
  }) => void;
  onStartRename: (targetPath: string, initialName: string) => void;
  onCommitEdit: (value: string) => void;
  onCancelEdit: () => void;
}

const FolderNode: React.FC<FolderNodeProps> = ({
  node,
  depth,
  editState,
  selectedPath,
  isExpanded,
  onSelectNode,
  onToggleExpanded,
  onEnsureExpanded,
  onStartCreateFile,
  onStartCreateFolder,
  onStartRename,
  onCommitEdit,
  onCancelEdit,
}) => {
  const deleteNode = useWorkspace((state) => state.deleteNode);
  const refreshFileTree = useWorkspace((state) => state.refreshFileTree);
  const moveNode = useWorkspace((state) => state.moveNode);
  const { openAtEvent } = useContextMenu();
  const [dragOver, setDragOver] = useState(false);

  const expanded = isExpanded(node.path);
  const isRoot = node.path === "/";
  const isRenaming =
    editState?.mode === "rename" && editState.targetPath === node.path;
  const isCreateRowTarget =
    !!editState &&
    (editState.mode === "create-file" || editState.mode === "create-folder") &&
    editState.parentPath === node.path;
  const showCreateRowAfterNode =
    isCreateRowTarget &&
    (!editState?.anchorPath || editState.anchorPath === node.path);
  const isSelected = selectedPath === node.path;

  useEffect(() => {
    if (isCreateRowTarget) {
      onEnsureExpanded(node.path);
    }
  }, [isCreateRowTarget, node.path, onEnsureExpanded]);

  const copyText = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // ignore clipboard errors
    }
  };

  const handleContextMenu = (event: React.MouseEvent) => {
    event.stopPropagation();
    onSelectNode({ path: node.path, type: "directory" });
    const items: ContextMenuItem[] = [
      {
        label: expanded ? "收起" : "展开",
        onClick: () => onToggleExpanded(node.path),
      },
      { type: "separator" },
      {
        label: "新建文件",
        onClick: () => {
          onStartCreateFile({ parentPath: node.path, anchorPath: node.path });
          onEnsureExpanded(node.path);
        },
      },
      {
        label: "新建文件夹",
        onClick: () => {
          onStartCreateFolder({ parentPath: node.path, anchorPath: node.path });
          onEnsureExpanded(node.path);
        },
      },
      { type: "separator" },
      {
        label: "重命名",
        disabled: isRoot,
        onClick: () => onStartRename(node.path, node.name),
      },
      {
        label: "删除",
        danger: true,
        disabled: isRoot,
        onClick: () => deleteNode(node.path),
      },
      { type: "separator" },
      { label: "复制路径", onClick: () => copyText(node.path) },
      {
        label: "复制相对路径",
        onClick: () => copyText(node.path.replace(/^\//, "")),
      },
      { type: "separator" },
      { label: "刷新", onClick: refreshFileTree },
    ];
    openAtEvent(event, items);
  };

  const handleDragStart = (event: React.DragEvent) => {
    if (isRoot) return;
    onSelectNode({ path: node.path, type: "directory" });
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
    return event.dataTransfer.getData("text/plain") || null;
  };

  const guideWidth = depth * 12;
  const renderCreateRow = () => {
    if (
      !editState ||
      (editState.mode !== "create-file" && editState.mode !== "create-folder")
    ) {
      return null;
    }
    return (
      <InlineEditRow
        depth={depth + 1}
        variant={editState.mode === "create-folder" ? "folder" : "file"}
        initialValue={editState.initialName}
        placeholder={
          editState.mode === "create-folder" ? "新建文件夹名称" : "新建文件名称"
        }
        icon={
          editState.mode === "create-folder"
            ? getFolderIcon(editState.initialName || "新建文件夹", {
                expanded: false,
                isRoot: false,
              })
            : undefined
        }
        getIcon={
          editState.mode === "create-folder"
            ? (value) =>
                getFolderIcon(value || "新建文件夹", {
                  expanded: false,
                  isRoot: false,
                })
            : (value) => getFileIcon(value || "未命名.txt")
        }
        onSubmit={onCommitEdit}
        onCancel={onCancelEdit}
      />
    );
  };

  return (
    <div>
      {isRenaming ? (
        <InlineEditRow
          depth={depth}
          variant="folder"
          initialValue={editState?.initialName ?? node.name}
          placeholder="新的文件夹名称"
          icon={getFolderIcon(node.name, { expanded, isRoot })}
          onSubmit={onCommitEdit}
          onCancel={onCancelEdit}
        />
      ) : (
        <div
          className={`group relative flex cursor-pointer select-none items-center gap-1 py-0.5 pr-2 text-xs text-[#cccccc] transition-colors hover:bg-[#2a2d2e] ${
            isSelected ? "bg-[#2a2d2e]" : ""
          } ${dragOver ? "bg-[#233026]" : ""}`}
          style={{ paddingLeft: `${depth * 12 + 4}px` }}
          onClick={() => {
            onSelectNode({ path: node.path, type: "directory" });
            onToggleExpanded(node.path);
          }}
          onContextMenu={handleContextMenu}
          draggable={!isRoot}
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
            moveNode(sourcePath, node.path);
            onEnsureExpanded(node.path);
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
          <span className="flex w-3 shrink-0 items-center justify-center text-[10px] text-[#858585] transition-transform">
            {expanded ? <DownOutlined /> : <RightOutlined />}
          </span>
          <span className="shrink-0 text-sm">
            {getFolderIcon(node.name, { expanded, isRoot })}
          </span>
          <span className="truncate font-medium">{node.name}</span>
        </div>
      )}

      {expanded && (node.children || showCreateRowAfterNode) && (
        <div>
          {showCreateRowAfterNode && renderCreateRow()}
          {node.children?.map((child) => (
            <React.Fragment key={child.path}>
              {child.type === "directory" ? (
                <FolderNode
                  node={child}
                  depth={depth + 1}
                  editState={editState}
                  selectedPath={selectedPath}
                  isExpanded={isExpanded}
                  onSelectNode={onSelectNode}
                  onToggleExpanded={onToggleExpanded}
                  onEnsureExpanded={onEnsureExpanded}
                  onStartCreateFile={onStartCreateFile}
                  onStartCreateFolder={onStartCreateFolder}
                  onStartRename={onStartRename}
                  onCommitEdit={onCommitEdit}
                  onCancelEdit={onCancelEdit}
                />
              ) : (
                <FileNode
                  node={child}
                  depth={depth + 1}
                  editState={editState}
                  selectedPath={selectedPath}
                  onSelectNode={onSelectNode}
                  onStartCreateFile={onStartCreateFile}
                  onStartCreateFolder={onStartCreateFolder}
                  onStartRename={onStartRename}
                  onCommitEdit={onCommitEdit}
                  onCancelEdit={onCancelEdit}
                />
              )}
              {isCreateRowTarget && editState?.anchorPath === child.path
                ? renderCreateRow()
                : null}
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  );
};

export default FolderNode;
