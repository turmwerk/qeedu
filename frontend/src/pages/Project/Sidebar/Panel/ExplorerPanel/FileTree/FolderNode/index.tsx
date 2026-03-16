import React, { useEffect, useState } from "react";
import { RightOutlined, DownOutlined } from "@ant-design/icons";
import { type FileTreeNode } from "../../../../../EditorArea/types";
import { getFileIcon, getFolderIcon } from "../../../../../utils/filePresentation";
import FileNode from "../FileNode";
import { useContextMenu, type ContextMenuItem } from "@/ui/ContextMenu";
import { useWorkspace } from "../../../../../context";
import InlineEditRow from "../InlineEditRow";
import { type InlineEditState } from "../editing";

interface FolderNodeProps {
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

const FolderNode: React.FC<FolderNodeProps> = ({
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
  const [expanded, setExpanded] = useState(depth === 0 ? true : false);
  const [dragOver, setDragOver] = useState(false);
  const { deleteNode, refreshFileTree, moveNode } = useWorkspace();
  const { openAtEvent } = useContextMenu();
  const isRoot = node.path === "/";
  const isRenaming =
    editState?.mode === "rename" && editState.targetPath === node.path;
  const showCreateRow =
    editState &&
    (editState.mode === "create-file" || editState.mode === "create-folder") &&
    editState.parentPath === node.path;
  const isSelected = selectedPath === node.path;

  useEffect(() => {
    if (showCreateRow) setExpanded(true);
  }, [showCreateRow]);

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
        onClick: () => setExpanded((prev) => !prev),
      },
      { type: "separator" },
      {
        label: "新建文件",
        onClick: () => {
          onStartCreateFile(node.path);
          setExpanded(true);
        },
      },
      {
        label: "新建文件夹",
        onClick: () => {
          onStartCreateFolder(node.path);
          setExpanded(true);
        },
      },
      { type: "separator" },
      {
        label: "重命名",
        disabled: isRoot,
        onClick: () => {
          onStartRename(node.path, node.name);
        },
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
    const text = event.dataTransfer.getData("text/plain");
    return text || null;
  };

  const guideWidth = depth * 12;

  if (isRenaming) {
    return (
      <div>
        <InlineEditRow
          depth={depth}
          variant="folder"
          initialValue={editState?.initialName ?? node.name}
          placeholder="新的文件夹名称"
          icon={getFolderIcon(node.name, { expanded, isRoot })}
          onSubmit={onCommitEdit}
          onCancel={onCancelEdit}
        />
        {expanded && node.children && (
          <div>
            {node.children.map((child) =>
              child.type === "directory" ? (
                <FolderNode
                  key={child.path}
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
              ) : (
                <FileNode
                  key={child.path}
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
              ),
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      {/* 鏂囦欢澶硅 */}
      <div
        className={`group relative flex cursor-pointer select-none items-center gap-1 py-0.5 pr-2 text-xs text-[#cccccc] transition-colors hover:bg-[#2a2d2e] ${
          isSelected ? "bg-[#2a2d2e]" : ""
        } ${dragOver ? "bg-[#233026]" : ""}`}
        style={{ paddingLeft: `${depth * 12 + 4}px` }}
        onClick={() => {
          onSelectNode({ path: node.path, type: "directory" });
          setExpanded((v) => !v);
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
        {/* chevron */}
        <span className="flex w-3 shrink-0 items-center justify-center text-[10px] text-[#858585] transition-transform">
          {expanded ? <DownOutlined /> : <RightOutlined />}
        </span>
        {/* 鏂囦欢澶瑰浘鏍?*/}
        <span className="shrink-0 text-sm">
          {getFolderIcon(node.name, { expanded, isRoot })}
        </span>
        <span className="truncate font-medium">{node.name}</span>
      </div>

      {/* 灞曞紑鐨勫瓙鑺傜偣 */}
      {expanded && (node.children || showCreateRow) && (
        <div>
          {showCreateRow && (
            <InlineEditRow
              depth={depth + 1}
              variant={editState?.mode === "create-folder" ? "folder" : "file"}
              initialValue={editState?.initialName ?? ""}
              placeholder={
                editState?.mode === "create-folder"
                  ? "新建文件夹名称"
                  : "新建文件名称"
              }
              icon={
                editState?.mode === "create-folder"
                  ? getFolderIcon(editState?.initialName ?? node.name, {
                      expanded: false,
                      isRoot: false,
                    })
                  : undefined
              }
              getIcon={
                editState?.mode === "create-folder"
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
          )}
          {node.children?.map((child) =>
            child.type === "directory" ? (
              <FolderNode
                key={child.path}
                node={child}
                depth={depth + 1}
                editState={editState}
                onStartCreateFile={onStartCreateFile}
                onStartCreateFolder={onStartCreateFolder}
                onStartRename={onStartRename}
                onCommitEdit={onCommitEdit}
                onCancelEdit={onCancelEdit}
                selectedPath={selectedPath}
                onSelectNode={onSelectNode}
              />
            ) : (
              <FileNode
                key={child.path}
                node={child}
                depth={depth + 1}
                editState={editState}
                onStartCreateFile={onStartCreateFile}
                onStartCreateFolder={onStartCreateFolder}
                onStartRename={onStartRename}
                onCommitEdit={onCommitEdit}
                onCancelEdit={onCancelEdit}
                selectedPath={selectedPath}
                onSelectNode={onSelectNode}
              />
            ),
          )}
        </div>
      )}
    </div>
  );
};

export default FolderNode;
