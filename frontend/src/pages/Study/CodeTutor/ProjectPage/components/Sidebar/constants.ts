export const SidebarView = {
  EXPLORER: "EXPLORER",
  SEARCH: "SEARCH",
  SCM: "SCM",
  REMOTE: "REMOTE",
  EXTENSIONS: "EXTENSIONS",
} as const;
export type SidebarView = (typeof SidebarView)[keyof typeof SidebarView];
