/** 视图类型 */
export const ViewType = {
  CODE: "CODE",
  MARKDOWN: "MARKDOWN",
  SETTINGS: "SETTINGS",
  IMAGE: "IMAGE",
  WELCOME: "WELCOME",
} as const;
export type ViewType = (typeof ViewType)[keyof typeof ViewType];

/** 标签页类型 */
export interface TabItem {
  /** 文件路径，用作唯一 id */
  id: string;
  /** 显示的文件名 */
  title: string;
  /** 视图类型 */
  type: ViewType;
  /** 是否有未保存修改 */
  isDirty?: boolean;
  /** 文件内容（编辑用） */
  content?: string;
  /** 语言（代码类型用） */
  language?: string;
}

/** 文件树节点 */
export interface FileTreeNode {
  name: string;
  path: string;
  type: "file" | "directory";
  children?: FileTreeNode[];
  content?: string;
  language?: string;
}
