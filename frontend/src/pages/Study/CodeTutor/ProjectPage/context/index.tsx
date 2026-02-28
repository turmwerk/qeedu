import React, { createContext, useCallback, useContext, useState } from "react";
import { type FileTreeNode, type TabItem, ViewType } from "../components/EditorArea/types";

// ── Mock 文件树 ──────────────────────────────────────────────────────────────
export const buildMockFileTree = (projectName: string): FileTreeNode => ({
  name: projectName,
  path: "/",
  type: "directory",
  children: [
    {
      name: "src",
      path: "/src",
      type: "directory",
      children: [
        {
          name: "main.py",
          path: "/src/main.py",
          type: "file",
          language: "python",
          content:
            '# Entry point\nif __name__ == "__main__":\n    print("Hello, Code Tutor!")\n',
        },
        {
          name: "solution.py",
          path: "/src/solution.py",
          type: "file",
          language: "python",
          content: "# Write your solution here\n\n\ndef solve():\n    pass\n",
        },
        {
          name: "utils.py",
          path: "/src/utils.py",
          type: "file",
          language: "python",
          content: "# Utility functions\n\n\ndef helper():\n    pass\n",
        },
      ],
    },
    {
      name: "tests",
      path: "/tests",
      type: "directory",
      children: [
        {
          name: "test_main.py",
          path: "/tests/test_main.py",
          type: "file",
          language: "python",
          content: "import unittest\n\n\nclass TestSolution(unittest.TestCase):\n    def test_example(self):\n        self.assertEqual(1 + 1, 2)\n",
        },
      ],
    },
    {
      name: "README.md",
      path: "/README.md",
      type: "file",
      language: "markdown",
      content: `# ${projectName}\n\n> 由 Code Tutor AI 助手辅助编程学习。\n\n## 任务目标\n\n请在 \`src/solution.py\` 中完成题目要求。\n\n## 测试方法\n\n\`\`\`bash\npython -m pytest tests/\n\`\`\`\n`,
    },
    {
      name: "requirements.txt",
      path: "/requirements.txt",
      type: "file",
      language: "plaintext",
      content: "# Python dependencies\n",
    },
  ],
});

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
  const fileTree = buildMockFileTree(projectName);
  const [tabs, setTabs] = useState<TabItem[]>([]);
  const [activeTabId, setActiveTabId] = useState<string | null>(null);

  const inferViewType = (node: FileTreeNode): ViewType => {
    const ext = node.name.split(".").pop()?.toLowerCase() ?? "";
    if (["md", "markdown"].includes(ext)) return ViewType.MARKDOWN;
    if (["png", "jpg", "jpeg", "gif", "svg", "webp"].includes(ext))
      return ViewType.IMAGE;
    return ViewType.CODE;
  };

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
