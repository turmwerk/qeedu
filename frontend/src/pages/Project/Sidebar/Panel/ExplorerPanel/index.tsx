import React, { useEffect, useMemo, useState } from "react";
import { useWorkspace } from "../../../context";
import { useContextMenu, type ContextMenuItem } from "@/ui/ContextMenu";
import TreeActions from "./TreeActions";
import InlineEditRow from "./FileTree/InlineEditRow";
import FolderNode from "./FileTree/FolderNode";
import FileNode from "./FileTree/FileNode";
import { type InlineEditState } from "./FileTree/editing";
import { getFolderIcon } from "../../../utils/filePresentation";

const getParentPath = (path: string): string => {
  if (path === "/") return "/";
  const parts = path.split("/").filter(Boolean);
  if (parts.length <= 1) return "/";
  return `/${parts.slice(0, -1).join("/")}`;
};

const buildPath = (parentPath: string, name: string): string => {
  if (parentPath === "/") return `/${name}`;
  return `${parentPath}/${name}`;
};

type TreeSelection = {
  path: string;
  type: "file" | "directory";
};

type CreatePlacement = {
  parentPath?: string;
  anchorPath?: string;
};

const isCreateEditState = (
  editState: InlineEditState | null,
): editState is InlineEditState & {
  mode: "create-file" | "create-folder";
} => editState?.mode === "create-file" || editState?.mode === "create-folder";

const ExplorerPanel: React.FC = () => {
  const fileTree = useWorkspace((state) => state.fileTree);
  const activeTabId = useWorkspace((state) => state.activeTabId);
  const addFile = useWorkspace((state) => state.addFile);
  const addFolder = useWorkspace((state) => state.addFolder);
  const renameNode = useWorkspace((state) => state.renameNode);
  const refreshFileTree = useWorkspace((state) => state.refreshFileTree);
  const moveNode = useWorkspace((state) => state.moveNode);
  const { openAtEvent } = useContextMenu();
  const [editState, setEditState] = useState<InlineEditState | null>(null);
  const [selectedNode, setSelectedNode] = useState<TreeSelection | null>(null);
  const [expandedPaths, setExpandedPaths] = useState<Set<string>>(new Set());
  const selectedPath = selectedNode?.path ?? activeTabId;

  const rootDirectoryPaths = useMemo(
    () =>
      new Set(
        (fileTree.children ?? [])
          .filter((child) => child.type === "directory")
          .map((child) => child.path),
      ),
    [fileTree.children],
  );

  useEffect(() => {
    setExpandedPaths((prev) => {
      const next = new Set<string>();
      const existingDirectories = new Set<string>();

      const visit = (node: typeof fileTree) => {
        if (node.type !== "directory") return;
        existingDirectories.add(node.path);
        node.children?.forEach(visit);
      };

      visit(fileTree);

      prev.forEach((path) => {
        if (existingDirectories.has(path)) {
          next.add(path);
        }
      });

      rootDirectoryPaths.forEach((path) => next.add(path));
      return next;
    });
  }, [fileTree, rootDirectoryPaths]);

  const toggleExpanded = (path: string) => {
    setExpandedPaths((prev) => {
      const next = new Set(prev);
      if (next.has(path)) {
        next.delete(path);
      } else {
        next.add(path);
      }
      return next;
    });
  };

  const ensureExpanded = (path: string) => {
    setExpandedPaths((prev) => {
      if (prev.has(path)) return prev;
      const next = new Set(prev);
      next.add(path);
      return next;
    });
  };

  const resolveCreatePlacement = (
    placement?: CreatePlacement,
  ): {
    parentPath: string;
    anchorPath?: string;
  } => {
    if (placement?.parentPath) {
      return {
        parentPath: placement.parentPath,
        anchorPath: placement.anchorPath,
      };
    }
    if (!selectedNode) {
      return {
        parentPath: fileTree.path,
      };
    }
    if (selectedNode.type === "directory") {
      return {
        parentPath: selectedNode.path,
        anchorPath: selectedNode.path,
      };
    }
    return {
      parentPath: getParentPath(selectedNode.path),
      anchorPath: selectedNode.path,
    };
  };

  const startCreateFile = (placement?: CreatePlacement) => {
    const target = resolveCreatePlacement(placement);
    setEditState({
      mode: "create-file",
      parentPath: target.parentPath,
      anchorPath: target.anchorPath,
      initialName: "未命名.txt",
    });
  };

  const startCreateFolder = (placement?: CreatePlacement) => {
    const target = resolveCreatePlacement(placement);
    setEditState({
      mode: "create-folder",
      parentPath: target.parentPath,
      anchorPath: target.anchorPath,
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
      const parentPath = editState.parentPath ?? fileTree.path;
      ensureExpanded(parentPath);
      const created = addFile(parentPath, name, true, {
        anchorPath: editState.anchorPath,
      });
      if (created) {
        setSelectedNode({ path: created.path, type: created.type });
      }
    } else if (editState.mode === "create-folder") {
      const parentPath = editState.parentPath ?? fileTree.path;
      ensureExpanded(parentPath);
      const created = addFolder(parentPath, name, {
        anchorPath: editState.anchorPath,
      });
      if (created) {
        setSelectedNode({ path: created.path, type: created.type });
      }
    } else if (editState.mode === "rename" && editState.targetPath) {
      renameNode(editState.targetPath, name);
      setSelectedNode((current) => {
        if (!current || current.path !== editState.targetPath) return current;
        return {
          ...current,
          path: buildPath(getParentPath(editState.targetPath), name),
        };
      });
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
    return event.dataTransfer.getData("text/plain") || null;
  };

  const handlePanelContextMenu = (event: React.MouseEvent) => {
    const items: ContextMenuItem[] = [
      {
        label: "新建文件",
        onClick: () => startCreateFile({ parentPath: fileTree.path }),
      },
      {
        label: "新建文件夹",
        onClick: () => startCreateFolder({ parentPath: fileTree.path }),
      },
      { type: "separator" },
      { label: "刷新", onClick: refreshFileTree },
    ];
    openAtEvent(event, items);
  };

  const renderCreateRow = (depth: number) => {
    if (!isCreateEditState(editState)) return null;
    return (
      <InlineEditRow
        depth={depth}
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
            : undefined
        }
        onSubmit={commitEdit}
        onCancel={cancelEdit}
      />
    );
  };

  const showRootCreateRow =
    isCreateEditState(editState) &&
    editState.parentPath === fileTree.path &&
    !editState.anchorPath;

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
        className="min-h-0 flex-1 overflow-auto"
        onContextMenu={handlePanelContextMenu}
        onDragOver={(event) => event.preventDefault()}
        onDrop={(event) => {
          event.preventDefault();
          const sourcePath = getDragPath(event);
          if (!sourcePath) return;
          moveNode(sourcePath, fileTree.path);
        }}
      >
        {fileTree.children?.map((child) => (
          <React.Fragment key={child.path}>
            {child.type === "directory" ? (
              <FolderNode
                node={child}
                depth={0}
                editState={editState}
                selectedPath={selectedPath}
                isExpanded={(path) => expandedPaths.has(path)}
                onSelectNode={setSelectedNode}
                onToggleExpanded={toggleExpanded}
                onEnsureExpanded={ensureExpanded}
                onStartCreateFile={startCreateFile}
                onStartCreateFolder={startCreateFolder}
                onStartRename={startRename}
                onCommitEdit={commitEdit}
                onCancelEdit={cancelEdit}
              />
            ) : (
              <FileNode
                node={child}
                depth={0}
                editState={editState}
                selectedPath={selectedPath}
                onSelectNode={setSelectedNode}
                onStartCreateFile={startCreateFile}
                onStartCreateFolder={startCreateFolder}
                onStartRename={startRename}
                onCommitEdit={commitEdit}
                onCancelEdit={cancelEdit}
              />
            )}
            {isCreateEditState(editState) &&
            editState.parentPath === fileTree.path &&
            editState.anchorPath === child.path
              ? renderCreateRow(0)
              : null}
          </React.Fragment>
        ))}
        {showRootCreateRow && renderCreateRow(0)}
      </div>
    </div>
  );
};

export default ExplorerPanel;
