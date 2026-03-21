import React, { useEffect } from "react";
import { create } from "zustand";
import { type FileTreeNode, type TabItem } from "../EditorArea/types";
import { inferLanguage } from "../data/languageSupport";
import { buildMockFileTree } from "../data/mockFileTree";
import { inferViewType } from "../utils/workspace";
import { destroyWorkspaceLspSessions } from "@/feature/CodeEditor/CodeCompletion/LSPCompletion/client";

export interface RunOutput {
  stdout: string;
  stderr: string;
  exitCode: number;
  executionMs: number;
  error: string;
  timestamp: number;
  status: "running" | "completed";
  language?: string;
  filePath?: string;
  fileName?: string;
}

export type WorkspaceDiagnosticSeverity =
  | "error"
  | "warning"
  | "information"
  | "hint";

export interface WorkspaceDiagnostic {
  id: string;
  filePath: string;
  startLine: number;
  startColumn: number;
  endLine: number;
  endColumn: number;
  severity: WorkspaceDiagnosticSeverity;
  source?: string;
  message: string;
  code?: string;
}

export interface CreateNodeOptions {
  anchorPath?: string;
}

interface WorkspaceState {
  workspaceKey: string;
  projectName: string;
  fileTree: FileTreeNode;
  tabs: TabItem[];
  activeTabId: string | null;
  runOutput: RunOutput | null;
  diagnostics: WorkspaceDiagnostic[];
  diagnosticsByGroup: Record<string, WorkspaceDiagnostic[]>;
  quickOpenOpen: boolean;
  setQuickOpenOpen: (open: boolean) => void;
  setRunOutput: (output: RunOutput | null) => void;
  setDiagnosticsForGroup: (
    group: string,
    diagnostics: WorkspaceDiagnostic[],
  ) => void;
  clearDiagnostics: () => void;
  openFileTab: (node: FileTreeNode) => void;
  closeTab: (id: string) => void;
  closeOtherTabs: (id: string) => void;
  closeTabsToRight: (id: string) => void;
  closeSavedTabs: () => void;
  closeAllTabs: () => void;
  setActiveTabId: (id: string | null) => void;
  updateTabContent: (id: string, content: string) => void;
  saveActiveTab: () => void;
  addFile: (
    parentPath: string,
    name: string,
    open?: boolean,
    options?: CreateNodeOptions,
  ) => FileTreeNode | null;
  addFileWithContent: (
    parentPath: string,
    name: string,
    content: string,
    open?: boolean,
    options?: CreateNodeOptions,
  ) => FileTreeNode | null;
  addFolder: (
    parentPath: string,
    name: string,
    options?: CreateNodeOptions,
  ) => FileTreeNode | null;
  renameNode: (targetPath: string, newName: string) => void;
  deleteNode: (targetPath: string) => void;
  moveNode: (sourcePath: string, targetPath: string) => void;
  refreshFileTree: () => void;
  loadFileTree: (nextTree: FileTreeNode) => void;
  updateFileContents: (updates: { path: string; content: string }[]) => void;
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
  insertIndex?: number,
): FileTreeNode => {
  if (node.path === parentPath && node.type === "directory") {
    const children = node.children ? [...node.children] : [];
    const nextIndex =
      insertIndex === undefined ||
      insertIndex < 0 ||
      insertIndex > children.length
        ? children.length
        : insertIndex;
    children.splice(nextIndex, 0, newNode);
    return { ...node, children };
  }
  if (!node.children) return node;
  const nextChildren = node.children.map((child) =>
    insertNodeAtPath(child, parentPath, newNode, insertIndex),
  );
  const changed = nextChildren.some((child, idx) => child !== node.children?.[idx]);
  return changed ? { ...node, children: nextChildren } : node;
};

const resolveInsertIndex = (
  parent: FileTreeNode,
  anchorPath?: string,
): number | undefined => {
  if (!anchorPath) return undefined;
  if (anchorPath === parent.path) return 0;
  const children = parent.children ?? [];
  const anchorIndex = children.findIndex((child) => child.path === anchorPath);
  return anchorIndex === -1 ? undefined : anchorIndex + 1;
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

const updateFileTreeContent = (
  node: FileTreeNode,
  updates: Map<string, string>,
): FileTreeNode => {
  if (node.type === "file") {
    if (!updates.has(node.path)) return node;
    const nextContent = updates.get(node.path) ?? "";
    if (node.content === nextContent) return node;
    return { ...node, content: nextContent };
  }
  if (!node.children) return node;
  const nextChildren = node.children.map((child) => updateFileTreeContent(child, updates));
  const changed = nextChildren.some((child, idx) => child !== node.children?.[idx]);
  return changed ? { ...node, children: nextChildren } : node;
};

export const useWorkspace = create<WorkspaceState>((set, get) => ({
  workspaceKey: "",
  projectName: "",
  fileTree: buildMockFileTree(""),
  tabs: [],
  activeTabId: null,
  runOutput: null,
  diagnostics: [],
  diagnosticsByGroup: {},
  quickOpenOpen: false,
  setQuickOpenOpen: (open) => set({ quickOpenOpen: open }),
  setRunOutput: (output) => set({ runOutput: output }),
  setDiagnosticsForGroup: (group, diagnostics) =>
    set((state) => {
      const diagnosticsByGroup = {
        ...state.diagnosticsByGroup,
        [group]: diagnostics,
      };
      return {
        diagnosticsByGroup,
        diagnostics: Object.values(diagnosticsByGroup).flat(),
      };
    }),
  clearDiagnostics: () => set({ diagnostics: [], diagnosticsByGroup: {} }),
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
  addFile: (parentPath, name, open = false, options) => {
    if (!name.trim()) return null;
    const { fileTree, openFileTab } = get();
    const parent = findNodeByPath(fileTree, parentPath);
    if (!parent || parent.type !== "directory") return null;
    const insertIndex = resolveInsertIndex(parent, options?.anchorPath);
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
    set((state) => ({
      fileTree: insertNodeAtPath(state.fileTree, parentPath, node, insertIndex),
    }));
    if (open) openFileTab(node);
    return node;
  },
  addFileWithContent: (parentPath, name, content, open = false, options) => {
    if (!name.trim()) return null;
    const { fileTree, openFileTab } = get();
    const parent = findNodeByPath(fileTree, parentPath);
    if (!parent || parent.type !== "directory") return null;
    const insertIndex = resolveInsertIndex(parent, options?.anchorPath);
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
      content,
    };
    set((state) => ({
      fileTree: insertNodeAtPath(state.fileTree, parentPath, node, insertIndex),
    }));
    if (open) openFileTab(node);
    return node;
  },
  addFolder: (parentPath, name, options) => {
    if (!name.trim()) return null;
    const { fileTree } = get();
    const parent = findNodeByPath(fileTree, parentPath);
    if (!parent || parent.type !== "directory") return null;
    const insertIndex = resolveInsertIndex(parent, options?.anchorPath);
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
    set((state) => ({
      fileTree: insertNodeAtPath(state.fileTree, parentPath, node, insertIndex),
    }));
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
    set({
      fileTree: nextTree,
      tabs: [],
      activeTabId: null,
      runOutput: null,
      diagnostics: [],
      diagnosticsByGroup: {},
    });
  },
  updateFileContents: (updates) => {
    if (updates.length === 0) return;
    const updateMap = new Map<string, string>();
    updates.forEach((item) => {
      updateMap.set(item.path, item.content);
    });
    set((state) => ({
      fileTree: updateFileTreeContent(state.fileTree, updateMap),
      tabs: state.tabs.map((tab) => {
        if (!updateMap.has(tab.id)) return tab;
        return {
          ...tab,
          content: updateMap.get(tab.id) ?? "",
          isDirty: true,
        };
      }),
    }));
  },
}));

export const WorkspaceProvider: React.FC<{
  workspaceKey: string;
  projectName: string;
  children: React.ReactNode;
}> = ({ workspaceKey, projectName, children }) => {
  useEffect(() => {
    useWorkspace.setState({
      workspaceKey,
      projectName,
      fileTree: buildMockFileTree(projectName),
      tabs: [],
      activeTabId: null,
      runOutput: null,
      diagnostics: [],
      diagnosticsByGroup: {},
      quickOpenOpen: false,
    });
    return () => {
      void destroyWorkspaceLspSessions(workspaceKey);
    };
  }, [projectName, workspaceKey]);

  return <>{children}</>;
};
