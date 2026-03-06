import React from "react";
import {
  FileTextOutlined,
  FileMarkdownOutlined,
  CodeOutlined,
  FileImageOutlined,
  FileOutlined,
} from "@ant-design/icons";

export const getFileColorClass = (name: string): string => {
  const ext = name.split(".").pop()?.toLowerCase() ?? "";
  if (["py"].includes(ext)) return "text-[#4ec9b0]";
  if (["ts", "tsx"].includes(ext)) return "text-[#519aba]";
  if (["js", "jsx"].includes(ext)) return "text-[#f1c40f]";
  if (["md", "markdown"].includes(ext)) return "text-[#519aba]";
  return "text-[#cccccc]";
};

export const getFileIcon = (name: string): React.ReactNode => {
  const ext = name.split(".").pop()?.toLowerCase() ?? "";
  if (["py", "ts", "tsx", "js", "jsx", "cpp", "c", "java", "go", "rs"].includes(ext)) {
    return <CodeOutlined className="text-[#4ec9b0]" />;
  }
  if (["md", "markdown"].includes(ext)) {
    return <FileMarkdownOutlined className="text-[#519aba]" />;
  }
  if (["txt", "log"].includes(ext)) {
    return <FileTextOutlined className="text-[#cccccc]" />;
  }
  if (["png", "jpg", "jpeg", "gif", "svg", "webp"].includes(ext)) {
    return <FileImageOutlined className="text-[#f1c40f]" />;
  }
  return <FileOutlined className="text-[#cccccc]" />;
};