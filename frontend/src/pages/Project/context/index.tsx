import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { type FileTreeNode, type TabItem } from "../EditorArea/types";
import { buildMockFileTree } from "../data/mockFileTree";
import { inferViewType } from "../utils/workspace";

interface WorkspaceContextValue {
  projectName: string;
  fileTree: FileTreeNode;
  tabs: TabItem[];
  activeTabId: string | null;
  openFileTab: (node: FileTreeNode) => void;
  closeTab: (id: string) => void;
  closeOtherTabs: (id: string) => void;
  closeTabsToRight: (id: string) => void;
  closeSavedTabs: () => void;
  closeAllTabs: () => void;
  setActiveTabId: (id: string | null) => void;
  updateTabContent: (id: string, content: string) => void;
  addFile: (parentPath: string, name: string, open?: boolean) => FileTreeNode | null;
  addFolder: (parentPath: string, name: string) => FileTreeNode | null;
  renameNode: (targetPath: string, newName: string) => void;
  deleteNode: (targetPath: string) => void;
  refreshFileTree: () => void;
}

const WorkspaceContext = createContext<WorkspaceContextValue | null>(null);

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
    name: nextName,
    path: nextPath,
    children,
    language: node.type === "file" ? inferLanguage(nextName) : node.language,
  };
};

export const WorkspaceProvider: React.FC<{
  projectName: string;
  children: React.ReactNode;
}> = ({ projectName, children }) => {
  const [fileTree, setFileTree] = useState<FileTreeNode>(() =>
    buildMockFileTree(projectName),
  );
  const [tabs, setTabs] = useState<TabItem[]>([]);
  const [activeTabId, setActiveTabId] = useState<string | null>(null);

  useEffect(() => {
    setFileTree(buildMockFileTree(projectName));
  }, [projectName]);

  const openFileTab = useCallback((node: FileTreeNode) => {
    if (node.type === "directory") return;
    setTabs((prev) => {
      if (prev.find((t) => t.id === node.path)) return prev;
      return [
        ...prev,
        {
          id: node.path,
          title: node.name,
          type: inferViewType(node),
          isDirty: false,
          content: node.content ?? "",
          language: node.language ?? "plaintext",
        },
      ];
    });
    setActiveTabId(node.path);
  }, []);

  const closeTab = useCallback(
    (id: string) => {
      setTabs((prev) => {
        const idx = prev.findIndex((t) => t.id === id);
        const next = prev.filter((t) => t.id !== id);
        if (activeTabId === id) {
          const newActive = next[Math.min(idx, next.length - 1)]?.id ?? null;
          setActiveTabId(newActive);
        }
        return next;
      });
    },
    [activeTabId],
  );

  const closeOtherTabs = useCallback((id: string) => {
    setTabs((prev) => prev.filter((t) => t.id === id));
    setActiveTabId(id);
  }, []);

  const closeTabsToRight = useCallback(
    (id: string) => {
      setTabs((prev) => {
        const idx = prev.findIndex((t) => t.id === id);
        if (idx === -1) return prev;
        const next = prev.slice(0, idx + 1);
        if (!next.find((t) => t.id === activeTabId)) {
          setActiveTabId(next[next.length - 1]?.id ?? null);
        }
        return next;
      });
    },
    [activeTabId],
  );

  const closeSavedTabs = useCallback(() => {
    setTabs((prev) => {
      const next = prev.filter((t) => t.isDirty);
      if (!next.find((t) => t.id === activeTabId)) {
        setActiveTabId(next[next.length - 1]?.id ?? null);
      }
      return next;
    });
  }, [activeTabId]);

  const closeAllTabs = useCallback(() => {
    setTabs([]);
    setActiveTabId(null);
  }, []);

  const updateTabContent = useCallback((id: string, content: string) => {
    setTabs((prev) =>
      prev.map((t) => (t.id === id ? { ...t, content, isDirty: true } : t)),
    );
  }, []);

  const addFile = useCallback(
    (parentPath: string, name: string, open = false): FileTreeNode | null => {
      if (!name.trim()) return null;
      const parent = findNodeByPath(fileTree, parentPath);
      if (!parent || parent.type !== "directory") return null;
      const uniqueName = ensureUniqueName(
        name.trim(),
        parent.children?.map((child) => child.name) ?? [],
      );
      const node: FileTreeNode = {
        name: uniqueName,
        path: buildPath(parentPath, uniqueName),
        type: "file",
        language: inferLanguage(uniqueName),
        content: "",
      };
      setFileTree((prev) => insertNodeAtPath(prev, parentPath, node));
      if (open) openFileTab(node);
      return node;
    },
    [fileTree, openFileTab],
  );

  const addFolder = useCallback(
    (parentPath: string, name: string): FileTreeNode | null => {
      if (!name.trim()) return null;
      const parent = findNodeByPath(fileTree, parentPath);
      if (!parent || parent.type !== "directory") return null;
      const uniqueName = ensureUniqueName(
        name.trim(),
        parent.children?.map((child) => child.name) ?? [],
      );
      const node: FileTreeNode = {
        name: uniqueName,
        path: buildPath(parentPath, uniqueName),
        type: "directory",
        children: [],
      };
      setFileTree((prev) => insertNodeAtPath(prev, parentPath, node));
      return node;
    },
    [fileTree],
  );

  const renameNode = useCallback(
    (targetPath: string, newName: string) => {
      if (!newName.trim() || targetPath === "/") return;
      const parentPath = getParentPath(targetPath);
      const nextPath = buildPath(parentPath, newName.trim());

      setFileTree((prev) => {
        const renameRec = (node: FileTreeNode, parent: string): FileTreeNode => {
          if (node.path === targetPath) {
            return updatePaths(node, parent, newName.trim());
          }
          if (!node.children) return node;
          const nextChildren = node.children.map((child) =>
            renameRec(child, node.path),
          );
          const changed = nextChildren.some(
            (child, idx) => child !== node.children?.[idx],
          );
          return changed ? { ...node, children: nextChildren } : node;
        };
        return renameRec(prev, "/");
      });

      setTabs((prev) =>
        prev.map((tab) => {
          if (tab.id === targetPath) {
            return { ...tab, id: nextPath, title: newName.trim() };
          }
          if (tab.id.startsWith(`${targetPath}/`)) {
            return { ...tab, id: `${nextPath}${tab.id.slice(targetPath.length)}` };
          }
          return tab;
        }),
      );

      setActiveTabId((prev) => {
        if (!prev) return prev;
        if (prev === targetPath) return nextPath;
        if (prev.startsWith(`${targetPath}/`)) {
          return `${nextPath}${prev.slice(targetPath.length)}`;
        }
        return prev;
      });
    },
    [],
  );

  const deleteNode = useCallback(
    (targetPath: string) => {
      if (targetPath === "/") return;
      setFileTree((prev) => removeNodeAtPath(prev, targetPath));
      setTabs((prev) => {
        const next = prev.filter(
          (tab) =>
            tab.id !== targetPath && !tab.id.startsWith(`${targetPath}/`),
        );
        if (!next.find((tab) => tab.id === activeTabId)) {
          setActiveTabId(next[next.length - 1]?.id ?? null);
        }
        return next;
      });
    },
    [activeTabId],
  );

  const refreshFileTree = useCallback(() => {
    setFileTree(buildMockFileTree(projectName));
  }, [projectName]);

  const value = useMemo(
    () => ({
      projectName,
      fileTree,
      tabs,
      activeTabId,
      openFileTab,
      closeTab,
      closeOtherTabs,
      closeTabsToRight,
      closeSavedTabs,
      closeAllTabs,
      setActiveTabId,
      updateTabContent,
      addFile,
      addFolder,
      renameNode,
      deleteNode,
      refreshFileTree,
    }),
    [
      projectName,
      fileTree,
      tabs,
      activeTabId,
      openFileTab,
      closeTab,
      closeOtherTabs,
      closeTabsToRight,
      closeSavedTabs,
      closeAllTabs,
      updateTabContent,
      addFile,
      addFolder,
      renameNode,
      deleteNode,
      refreshFileTree,
    ],
  );

  return (
    <WorkspaceContext.Provider value={value}>
      {children}
    </WorkspaceContext.Provider>
  );
};

export const useWorkspace = (): WorkspaceContextValue => {
  const ctx = useContext(WorkspaceContext);
  if (!ctx) throw new Error("useWorkspace must be used within WorkspaceProvider");
  return ctx;
};

export default WorkspaceContext;
