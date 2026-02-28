import React from "react";
import {
  FileTextOutlined,
  FileMarkdownOutlined,
  CodeOutlined,
  FileImageOutlined,
  FileOutlined,
} from "@ant-design/icons";
import { type FileTreeNode } from "../../../../../../../EditorArea/types";
import { useWorkspace } from "../../../../../../../../context";

function getFileIcon(name: string): React.ReactNode {
  const ext = name.split(".").pop()?.toLowerCase() ?? "";
  if (["py", "ts", "tsx", "js", "jsx", "cpp", "c", "java", "go", "rs"].includes(ext))
    return <CodeOutlined className="text-[#4ec9b0]" />;
  if (["md", "markdown"].includes(ext))
    return <FileMarkdownOutlined className="text-[#519aba]" />;
  if (["txt", "log"].includes(ext))
    return <FileTextOutlined className="text-[#cccccc]" />;
  if (["png", "jpg", "jpeg", "gif", "svg", "webp"].includes(ext))
    return <FileImageOutlined className="text-[#f1c40f]" />;
  return <FileOutlined className="text-[#cccccc]" />;
}

interface FileNodeProps {
  node: FileTreeNode;
  depth: number;
}

const FileNode: React.FC<FileNodeProps> = ({ node, depth }) => {
  const { openFileTab, activeTabId } = useWorkspace();
  const isActive = activeTabId === node.path;

  return (
    <div
      className={`group flex cursor-pointer select-none items-center gap-1.5 rounded-sm py-0.5 pr-2 text-xs transition-colors ${
        isActive
          ? "bg-[#094771] text-white"
          : "text-[#cccccc] hover:bg-[#2a2d2e]"
      }`}
      style={{ paddingLeft: `${(depth + 1) * 12 + 4}px` }}
      onClick={() => openFileTab(node)}
    >
      <span className="shrink-0 text-sm">{getFileIcon(node.name)}</span>
      <span className="truncate">{node.name}</span>
    </div>
  );
};

export default FileNode;
