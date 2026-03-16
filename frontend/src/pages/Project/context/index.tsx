import React, { useEffect } from "react";
import { create } from "zustand";
import { type FileTreeNode, type TabItem } from "../EditorArea/types";
import { buildMockFileTree } from "../data/mockFileTree";
import { inferViewType } from "../utils/workspace";

interface RunOutput {
  stdout: string;
  stderr: string;
  exitCode: number;
  executionMs: number;
  error: string;
  timestamp: number;
}

interface WorkspaceState {
  projectName: string;
  fileTree: FileTreeNode;
  tabs: TabItem[];
  activeTabId: string | null;
  runOutput: RunOutput | null;
  quickOpenOpen: boolean;
  setQuickOpenOpen: (open: boolean) => void;
  setRunOutput: (output: RunOutput | null) => void;
  openFileTab: (node: FileTreeNode) => void;
  closeTab: (id: string) => void;
  closeOtherTabs: (id: string) => void;
  closeTabsToRight: (id: string) => void;
  closeSavedTabs: () => void;
  closeAllTabs: () => void;
  setActiveTabId: (id: string | null) => void;
  updateTabContent: (id: string, content: string) => void;
  saveActiveTab: () => void;
  addFile: (parentPath: string, name: string, open?: boolean) => FileTreeNode | null;
  addFolder: (parentPath: string, name: string) => FileTreeNode | null;
  renameNode: (targetPath: string, newName: string) => void;
  deleteNode: (targetPath: string) => void;
  moveNode: (sourcePath: string, targetPath: string) => void;
  refreshFileTree: () => void;
  loadFileTree: (nextTree: FileTreeNode) => void;
}

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

const findNodeByPath = (node: FileTreeNode, path: string): FileTreeNode | null => {
  if (node.path === path) return node;
  if (!node.children) return null;
  for (const child of node.children) {
    const found = findNodeByPath(child, path);
    if (found) return found;
  }
  return null;
};

const inferLanguage = (name: string): string => {
  const ext = name.split(".").pop()?.toLowerCase() ?? "";
  if (["ts", "tsx"].includes(ext)) return "typescript";
  if (["js", "jsx"].includes(ext)) return "javascript";
  if (["py"].includes(ext)) return "python";
  if (["md", "markdown"].includes(ext)) return "markdown";
  if (["json"].includes(ext)) return "json";
  if (["yml", "yaml"].includes(ext)) return "yaml";
  if (["html", "htm"].includes(ext)) return "html";
  if (["css"].includes(ext)) return "css";
  return "plaintext";
};

const ensureUniqueName = (name: string, existingNames: string[]): string => {
  if (!existingNames.includes(name)) return name;
  const dotIndex = name.lastIndexOf(".");
  const base = dotIndex > 0 ? name.slice(0, dotIndex) : name;
  const ext = dotIndex > 0 ? name.slice(dotIndex) : "";
  let i = 1;
  let candidate = `${base}-${i}${ext}`;
  while (existingNames.includes(candidate)) {
    i += 1;
    candidate = `${base}-${i}${ext}`;
  }
  return candidate;
};

const insertNodeAtPath = (
  node: FileTreeNode,
  parentPath: string,
  newNode: FileTreeNode,
): FileTreeNode => {
  if (node.path === parentPath && node.type === "directory") {
    const children = node.children ? [...node.children, newNode] : [newNode];
    return { ...node, children };
  }
  if (!node.children) return node;
  const nextChildren = node.children.map((child) =>
    insertNodeAtPath(child, parentPath, newNode),
  );
  const changed = nextChildren.some((child, idx) => child !== node.children?.[idx]);
  return changed ? { ...node, children: nextChildren } : node;
};

const removeNodeAtPath = (node: FileTreeNode, targetPath: string): FileTreeNode => {
  if (!node.children) return node;
  const nextChildren = node.children
    .filter((child) => child.path !== targetPath)
    .map((child) => removeNodeAtPath(child, targetPath));
  const changed =
    nextChildren.length !== node.children.length ||
    nextChildren.some((child, idx) => child !== node.children?.[idx]);
  return changed ? { ...node, children: nextChildren } : node;
};

const updatePaths = (
  node: FileTreeNode,
  parentPath: string,
  overrideName?: string,
): FileTreeNode => {
  const nextName = overrideName ?? node.name;
  const nextPath = buildPath(parentPath, nextName);
  const children = node.children?.map((child) => updatePaths(child, nextPath));
  return {
    ...node,
    id: nextPath,
    name: nextName,
    path: nextPath,
    children,
    language: node.type === "file" ? inferLanguage(nextName) : node.language,
  };
};

export const useWorkspace = create<WorkspaceState>((set, get) => ({
  projectName: "",
  fileTree: buildMockFileTree(""),
  tabs: [],
  activeTabId: null,
  runOutput: null,
  quickOpenOpen: false,
  setQuickOpenOpen: (open) => set({ quickOpenOpen: open }),
  setRunOutput: (output) => set({ runOutput: output }),
  openFileTab: (node) => {
    if (node.type === "directory") return;
    set((state) => {
      if (state.tabs.find((t) => t.id === node.path)) {
        return { activeTabId: node.path };
      }
      return {
        tabs: [
          ...state.tabs,
          {
            id: node.path,
            title: node.name,
            type: inferViewType(node),
            isDirty: false,
            content: node.content ?? "",
            language: node.language ?? "plaintext",
          },
        ],
        activeTabId: node.path,
      };
    });
  },
  closeTab: (id) => {
    set((state) => {
      const idx = state.tabs.findIndex((t) => t.id === id);
      const nextTabs = state.tabs.filter((t) => t.id !== id);
      let nextActive = state.activeTabId;
      if (state.activeTabId === id) {
        nextActive = nextTabs[Math.min(idx, nextTabs.length - 1)]?.id ?? null;
      }
      return { tabs: nextTabs, activeTabId: nextActive };
    });
  },
  closeOtherTabs: (id) => set({ tabs: get().tabs.filter((t) => t.id === id), activeTabId: id }),
  closeTabsToRight: (id) => {
    set((state) => {
      const idx = state.tabs.findIndex((t) => t.id === id);
      if (idx === -1) return {};
      const nextTabs = state.tabs.slice(0, idx + 1);
      let nextActive = state.activeTabId;
      if (!nextTabs.find((t) => t.id === state.activeTabId)) {
        nextActive = nextTabs[nextTabs.length - 1]?.id ?? null;
      }
      return { tabs: nextTabs, activeTabId: nextActive };
    });
  },
  closeSavedTabs: () => {
    set((state) => {
      const nextTabs = state.tabs.filter((t) => t.isDirty);
      let nextActive = state.activeTabId;
      if (!nextTabs.find((t) => t.id === state.activeTabId)) {
        nextActive = nextTabs[nextTabs.length - 1]?.id ?? null;
      }
      return { tabs: nextTabs, activeTabId: nextActive };
    });
  },
  closeAllTabs: () => set({ tabs: [], activeTabId: null }),
  setActiveTabId: (id) => set({ activeTabId: id }),
  updateTabContent: (id, content) => {
    set((state) => ({
      tabs: state.tabs.map((t) => (t.id === id ? { ...t, content, isDirty: true } : t)),
    }));
  },
  saveActiveTab: () => {
    const { activeTabId } = get();
    if (!activeTabId) return;
    set((state) => ({
      tabs: state.tabs.map((t) => (t.id === activeTabId ? { ...t, isDirty: false } : t)),
    }));
  },
  addFile: (parentPath, name, open = false) => {
    if (!name.trim()) return null;
    const { fileTree, openFileTab } = get();
    const parent = findNodeByPath(fileTree, parentPath);
    if (!parent || parent.type !== "directory") return null;
    const uniqueName = ensureUniqueName(
      name.trim(),
      parent.children?.map((child) => child.name) ?? [],
    );
    const node: FileTreeNode = {
      id: buildPath(parentPath, uniqueName),
      name: uniqueName,
      path: buildPath(parentPath, uniqueName),
      type: "file",
      language: inferLanguage(uniqueName),
      content: "",
    };
    set((state) => ({ fileTree: insertNodeAtPath(state.fileTree, parentPath, node) }));
    if (open) openFileTab(node);
    return node;
  },
  addFolder: (parentPath, name) => {
    if (!name.trim()) return null;
    const { fileTree } = get();
    const parent = findNodeByPath(fileTree, parentPath);
    if (!parent || parent.type !== "directory") return null;
    const uniqueName = ensureUniqueName(
      name.trim(),
      parent.children?.map((child) => child.name) ?? [],
    );
    const node: FileTreeNode = {
      id: buildPath(parentPath, uniqueName),
      name: uniqueName,
      path: buildPath(parentPath, uniqueName),
      type: "directory",
      children: [],
    };
    set((state) => ({ fileTree: insertNodeAtPath(state.fileTree, parentPath, node) }));
    return node;
  },
  renameNode: (targetPath, newName) => {
    if (!newName.trim() || targetPath === "/") return;
    const parentPath = getParentPath(targetPath);
    const nextPath = buildPath(parentPath, newName.trim());

    set((state) => {
      const renameRec = (node: FileTreeNode, parent: string): FileTreeNode => {
        if (node.path === targetPath) {
          return updatePaths(node, parent, newName.trim());
        }
        if (!node.children) return node;
        const nextChildren = node.children.map((child) => renameRec(child, node.path));
        const changed = nextChildren.some((child, idx) => child !== node.children?.[idx]);
        return changed ? { ...node, children: nextChildren } : node;
      };
      return { fileTree: renameRec(state.fileTree, "/") };
    });

    set((state) => ({
      tabs: state.tabs.map((tab) => {
        if (tab.id === targetPath) {
          return { ...tab, id: nextPath, title: newName.trim() };
        }
        if (tab.id.startsWith(`${targetPath}/`)) {
          return { ...tab, id: `${nextPath}${tab.id.slice(targetPath.length)}` };
        }
        return tab;
      }),
      activeTabId: (() => {
        const prev = state.activeTabId;
        if (!prev) return prev;
        if (prev === targetPath) return nextPath;
        if (prev.startsWith(`${targetPath}/`)) {
          return `${nextPath}${prev.slice(targetPath.length)}`;
        }
        return prev;
      })(),
    }));
  },
  deleteNode: (targetPath) => {
    if (targetPath === "/") return;
    set((state) => {
      const nextTabs = state.tabs.filter(
        (tab) => tab.id !== targetPath && !tab.id.startsWith(`${targetPath}/`),
      );
      let nextActive = state.activeTabId;
      if (!nextTabs.find((tab) => tab.id === state.activeTabId)) {
        nextActive = nextTabs[nextTabs.length - 1]?.id ?? null;
      }
      return {
        fileTree: removeNodeAtPath(state.fileTree, targetPath),
        tabs: nextTabs,
        activeTabId: nextActive,
      };
    });
  },
  moveNode: (sourcePath, targetPath) => {
    if (!sourcePath || sourcePath === "/" || sourcePath === targetPath) return;
    const { fileTree } = get();
    const source = findNodeByPath(fileTree, sourcePath);
    const target = findNodeByPath(fileTree, targetPath);
    if (!source || !target || target.type !== "directory") return;
    if (source.type === "directory" && targetPath.startsWith(`${sourcePath}/`)) return;
    const sourceParentPath = getParentPath(sourcePath);
    if (sourceParentPath === targetPath) return;

    const targetChildren = target.children ?? [];
    const nextName = ensureUniqueName(
      source.name,
      targetChildren.map((child) => child.name),
    );
    const nextPath = buildPath(targetPath, nextName);
    const movedNode = updatePaths(source, targetPath, nextName);

    set((state) => {
      const withoutSource = removeNodeAtPath(state.fileTree, sourcePath);
      return { fileTree: insertNodeAtPath(withoutSource, targetPath, movedNode) };
    });

    set((state) => ({
      tabs: state.tabs.map((tab) => {
        if (tab.id === sourcePath) {
          return {
            ...tab,
            id: nextPath,
            title: source.type === "file" ? nextName : tab.title,
          };
        }
        if (tab.id.startsWith(`${sourcePath}/`)) {
          return { ...tab, id: `${nextPath}${tab.id.slice(sourcePath.length)}` };
        }
        return tab;
      }),
      activeTabId: (() => {
        const prev = state.activeTabId;
        if (!prev) return prev;
        if (prev === sourcePath) return nextPath;
        if (prev.startsWith(`${sourcePath}/`)) {
          return `${nextPath}${prev.slice(sourcePath.length)}`;
        }
        return prev;
      })(),
    }));
  },
  refreshFileTree: () => {
    const { projectName } = get();
    set({ fileTree: buildMockFileTree(projectName) });
  },
  loadFileTree: (nextTree) => {
    set({ fileTree: nextTree, tabs: [], activeTabId: null, runOutput: null });
  },
}));

export const WorkspaceProvider: React.FC<{
  projectName: string;
  children: React.ReactNode;
}> = ({ projectName, children }) => {
  useEffect(() => {
    useWorkspace.setState({
      projectName,
      fileTree: buildMockFileTree(projectName),
      tabs: [],
      activeTabId: null,
      runOutput: null,
      quickOpenOpen: false,
    });
  }, [projectName]);

  return <>{children}</>;
};
