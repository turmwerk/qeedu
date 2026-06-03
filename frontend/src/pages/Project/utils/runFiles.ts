import type { FileTreeNode } from "../EditorArea/types";

export const collectRunFiles = (node: FileTreeNode, basePath = node.path) => {
  const files: { path: string; content: string; language?: string }[] = [];

  const walk = (current: FileTreeNode) => {
    if (current.type === "file") {
      files.push({
        path: current.path.slice(basePath.length).replace(/^\//, "") || current.name,
        content: current.content ?? "",
        language: current.language,
      });
      return;
    }
    current.children?.forEach(walk);
  };

  walk(node);
  return files;
};

export const resolveRunRootPath = (filePath: string, language?: string | null): string | null => {
  if (language === "go" && filePath.startsWith("/test/go-hello/")) return "/test/go-hello";
  if (language === "rust" && filePath.startsWith("/test/rust-hello/")) return "/test/rust-hello";
  if (language === "java" && filePath.startsWith("/test/java-hello/")) return "/test/java-hello";
  return null;
};
