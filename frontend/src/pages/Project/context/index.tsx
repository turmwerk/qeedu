import React, { createContext, useCallback, useContext, useMemo, useState } from "react";
import { type FileTreeNode, type TabItem } from "../EditorArea/types";
import { buildMockFileTree } from "../data/mockFileTree";
import { inferViewType } from "../utils/workspace";

// ── Context 接口 ─────────────────────────────────────────────────────────────
interface WorkspaceContextValue {
  projectName: string;
  fileTree: FileTreeNode;
  tabs: TabItem[];
  activeTabId: string | null;
  openFileTab: (node: FileTreeNode) => void;
  closeTab: (id: string) => void;
  setActiveTabId: (id: string) => void;
  updateTabContent: (id: string, content: string) => void;
}

const WorkspaceContext = createContext<WorkspaceContextValue | null>(null);

// ── Provider ─────────────────────────────────────────────────────────────────
export const WorkspaceProvider: React.FC<{
  projectName: string;
  children: React.ReactNode;
}> = ({ projectName, children }) => {
  const fileTree = useMemo(() => buildMockFileTree(projectName), [projectName]);
  const [tabs, setTabs] = useState<TabItem[]>([]);
  const [activeTabId, setActiveTabId] = useState<string | null>(null);

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
          const newActive =
            next[Math.min(idx, next.length - 1)]?.id ?? null;
          setActiveTabId(newActive);
        }
        return next;
      });
    },
    [activeTabId],
  );

  const updateTabContent = useCallback((id: string, content: string) => {
    setTabs((prev) =>
      prev.map((t) => (t.id === id ? { ...t, content, isDirty: true } : t)),
    );
  }, []);

  return (
    <WorkspaceContext.Provider
      value={{
        projectName,
        fileTree,
        tabs,
        activeTabId,
        openFileTab,
        closeTab,
        setActiveTabId,
        updateTabContent,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
};

// ── Hook ──────────────────────────────────────────────────────────────────────
export const useWorkspace = (): WorkspaceContextValue => {
  const ctx = useContext(WorkspaceContext);
  if (!ctx)
    throw new Error("useWorkspace must be used within WorkspaceProvider");
  return ctx;
};

export default WorkspaceContext;
