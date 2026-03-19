export type TopBarMenuId =
  | "file"
  | "edit"
  | "selection"
  | "view"
  | "go"
  | "run"
  | "terminal"
  | "help";

export interface TopBarMenuItem {
  id: TopBarMenuId;
  label: string;
  display: string;
}

export const TOP_BAR_MENU_ITEMS: TopBarMenuItem[] = [
  { id: "file", label: "文件", display: "文件(F)" },
  { id: "edit", label: "编辑", display: "编辑(E)" },
  { id: "selection", label: "选择", display: "选择(S)" },
  { id: "view", label: "查看", display: "查看(V)" },
  { id: "go", label: "转到", display: "转到(G)" },
  { id: "run", label: "运行", display: "运行(R)" },
  { id: "terminal", label: "终端", display: "终端(T)" },
  { id: "help", label: "帮助", display: "帮助(H)" },
];
