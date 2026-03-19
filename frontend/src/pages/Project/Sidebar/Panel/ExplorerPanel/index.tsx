import React, { useLayoutEffect, useMemo, useRef, useState } from "react";
import { DownOutlined, RightOutlined } from "@ant-design/icons";
import { Tree } from "react-arborist";
import { useWorkspace } from "../../../context";
import { useContextMenu, type ContextMenuItem } from "@/ui/ContextMenu";
import TreeActions from "./TreeActions";
import InlineEditRow from "./FileTree/InlineEditRow";
import { type InlineEditState } from "./FileTree/editing";
import { type FileTreeNode } from "../../../EditorArea/types";
import { getFileIcon, getFolderIcon } from "../../../utils/filePresentation";

type TreeNodeData = FileTreeNode & {
  __isCreate?: boolean;
  __createMode?: "file" | "folder";
  __parentPath?: string;
};

const insertCreateNode = (
  node: FileTreeNode,
  editState: InlineEditState | null,
): TreeNodeData => {
  if (!editState || (editState.mode !== "create-file" && editState.mode !== "create-folder")) {
    return node;
  }

  const children = node.children?.map((child) => insertCreateNode(child, editState));
  const match = node.type === "directory" && editState.parentPath === node.path;
  if (!match) {
    return children ? { ...node, children } : node;
  }

  const createMode = editState.mode === "create-folder" ? "folder" : "file";
  const placeholder: TreeNodeData = {
    id: `${node.path}/__create__${editState.mode}`,
    name: editState.initialName,
    path: `${node.path}/__create__${editState.mode}`,
    type: editState.mode === "create-folder" ? "directory" : "file",
    __isCreate: true,
    __createMode: createMode,
    __parentPath: node.path,
  };

  return {
    ...node,
    children: [...(children ?? []), placeholder],
  };
};

const ExplorerPanel: React.FC = () => {
  const {
    fileTree,
    addFile,
    addFolder,
    renameNode,
    refreshFileTree,
    moveNode,
    deleteNode,
    openFileTab,
  } = useWorkspace();
  const { openAtEvent } = useContextMenu();
  const [editState, setEditState] = useState<InlineEditState | null>(null);
  const [selectedNode, setSelectedNode] = useState<{
    path: string;
    type: "file" | "directory";
  } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [treeSize, setTreeSize] = useState({ width: 1, height: 1 });
  const lastSizeRef = useRef({ width: 1, height: 1 });
  const resizeTimeoutRef = useRef<number | null>(null);

  useLayoutEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      const { width, height } = entry.contentRect;
      if (width <= 0 || height <= 0) return;
      const nextWidth = Math.max(1, Math.floor(width));
      const nextHeight = Math.max(1, Math.floor(height));
      const prev = lastSizeRef.current;
      if (nextWidth === prev.width && nextHeight === prev.height) return;
      lastSizeRef.current = { width: nextWidth, height: nextHeight };
      if (resizeTimeoutRef.current) {
        window.clearTimeout(resizeTimeoutRef.current);
      }
      resizeTimeoutRef.current = window.setTimeout(() => {
        setTreeSize(lastSizeRef.current);
      }, 80);
    });
    observer.observe(containerRef.current);
    return () => {
      observer.disconnect();
      if (resizeTimeoutRef.current) {
        window.clearTimeout(resizeTimeoutRef.current);
      }
    };
  }, []);

  const resolveCreateParentPath = (parentPath?: string) => {
    if (parentPath) return parentPath;
    if (!selectedNode) return fileTree.path;
    if (selectedNode.type === "directory") return selectedNode.path;
    const parts = selectedNode.path.split("/").filter(Boolean);
    if (parts.length <= 1) return "/";
    return `/${parts.slice(0, -1).join("/")}`;
  };

  const startCreateFile = (parentPath?: string) => {
    const resolvedParent = resolveCreateParentPath(parentPath);
    setEditState({
      mode: "create-file",
      parentPath: resolvedParent,
      initialName: "未命名.txt",
    });
  };

  const startCreateFolder = (parentPath?: string) => {
    const resolvedParent = resolveCreateParentPath(parentPath);
    setEditState({
      mode: "create-folder",
      parentPath: resolvedParent,
      initialName: "新建文件夹",
    });
  };

  const startRename = (targetPath: string, initialName: string) => {
    setEditState({
      mode: "rename",
      targetPath,
      initialName,
    });
  };

  const commitEdit = (value: string) => {
    if (!editState) return;
    const name = value.trim();
    if (!name) {
      setEditState(null);
      return;
    }
    if (editState.mode === "create-file") {
      addFile(editState.parentPath ?? fileTree.path, name, true);
    } else if (editState.mode === "create-folder") {
      addFolder(editState.parentPath ?? fileTree.path, name);
    } else if (editState.mode === "rename" && editState.targetPath) {
      renameNode(editState.targetPath, name);
    }
    setEditState(null);
  };

  const cancelEdit = () => setEditState(null);

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

  const handlePanelContextMenu = (event: React.MouseEvent) => {
    const items: ContextMenuItem[] = [
      { label: "新建文件", onClick: () => startCreateFile(fileTree.path) },
      { label: "新建文件夹", onClick: () => startCreateFolder(fileTree.path) },
      { type: "separator" },
      { label: "刷新", onClick: refreshFileTree },
    ];
    openAtEvent(event, items);
  };

  const treeData = useMemo<TreeNodeData[]>(
    () => [insertCreateNode(fileTree, editState)],
    [fileTree, editState],
  );

  const NodeRow: React.FC<any> = ({ node, style, dragHandle, innerRef }) => {
    const data = node.data as TreeNodeData;
    const depth = node.level ?? 0;
    const isFolder = data.type === "directory";
    const isRoot = data.path === "/";
    const isRenaming = editState?.mode === "rename" && editState.targetPath === data.path;
    const isCreate = data.__isCreate;
    const isSelected = selectedNode?.path === data.path;
    const isOpen = node.isOpen ?? false;
    const guideWidth = depth * 12;

    const paddingLeft = isFolder ? depth * 12 + 4 : (depth + 1) * 12 + 4;

    const toggleNode = () => {
      if (node.toggle) {
        node.toggle();
        return;
      }
      if (node.isOpen && node.close) node.close();
      if (!node.isOpen && node.open) node.open();
    };

    if (isCreate) {
      const variant = data.__createMode === "folder" ? "folder" : "file";
      return (
        <div style={style} className="relative">
          <InlineEditRow
            depth={depth}
            variant={variant}
            initialValue={data.name}
            placeholder={variant === "folder" ? "新建文件夹名称" : "新建文件名称"}
            icon={
              variant === "folder"
                ? getFolderIcon("新建文件夹", { expanded: false, isRoot: false })
                : undefined
            }
            getIcon={
              variant === "folder"
                ? (value) =>
                    getFolderIcon(value || "新建文件夹", { expanded: false, isRoot: false })
                : (value) => getFileIcon(value || "未命名.txt")
            }
            onSubmit={commitEdit}
            onCancel={cancelEdit}
          />
        </div>
      );
    }

    if (isRenaming) {
      return (
        <div style={style} className="relative">
          <InlineEditRow
            depth={depth}
            variant={isFolder ? "folder" : "file"}
            initialValue={editState?.initialName ?? data.name}
            placeholder={isFolder ? "新的文件夹名称" : "新的文件名称"}
            icon={
              isFolder
                ? getFolderIcon(data.name, { expanded: isOpen, isRoot })
                : undefined
            }
            getIcon={!isFolder ? (value) => getFileIcon(value || data.name) : undefined}
            onSubmit={commitEdit}
            onCancel={cancelEdit}
          />
        </div>
      );
    }

    return (
      <div
        style={{ ...style, paddingLeft }}
        ref={dragHandle ?? innerRef}
        className={`group relative flex cursor-pointer select-none items-center gap-1.5 rounded-sm py-0.5 pr-2 text-xs transition-colors ${
          isSelected ? "bg-[#2a2d2e]" : "text-[#cccccc] hover:bg-[#2a2d2e]"
        }`}
        onClick={() => {
          setSelectedNode({ path: data.path, type: data.type });
          if (isFolder) {
            toggleNode();
          } else {
            openFileTab(data);
          }
        }}
        onContextMenu={(event) => {
          event.stopPropagation();
          setSelectedNode({ path: data.path, type: data.type });
          const items: ContextMenuItem[] = isFolder
            ? [
                {
                  label: isOpen ? "收起" : "展开",
                  onClick: () => toggleNode(),
                },
                { type: "separator" },
                {
                  label: "新建文件",
                  onClick: () => startCreateFile(data.path),
                },
                {
                  label: "新建文件夹",
                  onClick: () => startCreateFolder(data.path),
                },
                { type: "separator" },
                {
                  label: "重命名",
                  disabled: isRoot,
                  onClick: () => startRename(data.path, data.name),
                },
                {
                  label: "删除",
                  danger: true,
                  disabled: isRoot,
                  onClick: () => deleteNode(data.path),
                },
                { type: "separator" },
                {
                  label: "复制路径",
                  onClick: async () => {
                    try {
                      await navigator.clipboard.writeText(data.path);
                    } catch {
                      // ignore
                    }
                  },
                },
                {
                  label: "复制相对路径",
                  onClick: async () => {
                    try {
                      await navigator.clipboard.writeText(data.path.replace(/^\//, ""));
                    } catch {
                      // ignore
                    }
                  },
                },
              ]
            : [
                { label: "打开", onClick: () => openFileTab(data) },
                { type: "separator" },
                { label: "新建文件", onClick: () => startCreateFile(getParentPath(data.path)) },
                { label: "新建文件夹", onClick: () => startCreateFolder(getParentPath(data.path)) },
                { type: "separator" },
                { label: "重命名", onClick: () => startRename(data.path, data.name) },
                {
                  label: "删除",
                  danger: true,
                  onClick: () => deleteNode(data.path),
                },
                { type: "separator" },
                {
                  label: "复制路径",
                  onClick: async () => {
                    try {
                      await navigator.clipboard.writeText(data.path);
                    } catch {
                      // ignore
                    }
                  },
                },
                {
                  label: "复制相对路径",
                  onClick: async () => {
                    try {
                      await navigator.clipboard.writeText(data.path.replace(/^\//, ""));
                    } catch {
                      // ignore
                    }
                  },
                },
              ];
          openAtEvent(event, items);
        }}
        draggable={!isRoot}
        onDragStart={(event) => {
          event.dataTransfer.setData(
            "application/x-workspace-node",
            JSON.stringify({ path: data.path, type: data.type }),
          );
          event.dataTransfer.setData("text/plain", data.path);
          event.dataTransfer.effectAllowed = "move";
        }}
        onDragOver={(event) => {
          event.preventDefault();
          event.stopPropagation();
        }}
        onDrop={(event) => {
          event.preventDefault();
          event.stopPropagation();
          const sourcePath = getDragPath(event);
          if (!sourcePath) return;
          if (isFolder) {
            moveNode(sourcePath, data.path);
          } else {
            moveNode(sourcePath, getParentPath(data.path));
          }
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
        {isFolder ? (
          <span
            className="flex w-3 shrink-0 items-center justify-center text-[10px] text-[#858585]"
            onClick={(event) => {
              event.stopPropagation();
              toggleNode();
            }}
          >
            {isOpen ? <DownOutlined /> : <RightOutlined />}
          </span>
        ) : (
          <span className="flex w-3 shrink-0 items-center justify-center text-[10px] text-[#858585]" />
        )}
        <span className="shrink-0 text-sm">
          {isFolder
            ? getFolderIcon(data.name, { expanded: isOpen, isRoot })
            : getFileIcon(data.name)}
        </span>
        <span className="truncate font-medium">{data.name}</span>
      </div>
    );
  };

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="flex shrink-0 items-center justify-between border-b border-[#3c3c3c] px-3 py-2">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-[#bbbbbb]">
          {fileTree.name}
        </span>
        <TreeActions
          onAddFile={() => startCreateFile()}
          onAddFolder={() => startCreateFolder()}
          onRefresh={refreshFileTree}
        />
      </div>

      <div
        ref={containerRef}
        className="min-h-0 flex-1 overflow-hidden"
        onContextMenu={handlePanelContextMenu}
        onDragOver={(event) => {
          event.preventDefault();
        }}
        onDrop={(event) => {
          event.preventDefault();
          const sourcePath = getDragPath(event);
          if (!sourcePath) return;
          moveNode(sourcePath, fileTree.path);
        }}
      >
        <Tree
          data={treeData}
          width={treeSize.width}
          height={treeSize.height}
          rowHeight={22}
          indent={12}
          openByDefault
        >
          {NodeRow}
        </Tree>
      </div>
    </div>
  );
};

const getParentPath = (path: string) => {
  if (path === "/") return "/";
  const parts = path.split("/").filter(Boolean);
  if (parts.length <= 1) return "/";
  return `/${parts.slice(0, -1).join("/")}`;
};

export default ExplorerPanel;
