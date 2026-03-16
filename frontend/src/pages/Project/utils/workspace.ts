import { ViewType, type FileTreeNode } from "../EditorArea/types";

export const inferViewType = (node: FileTreeNode): ViewType => {
  const ext = node.name.split(".").pop()?.toLowerCase() ?? "";
  if (["md", "markdown"].includes(ext)) return ViewType.MARKDOWN;
  if (["png", "jpg", "jpeg", "gif", "svg", "webp"].includes(ext)) return ViewType.IMAGE;
  return ViewType.CODE;
};