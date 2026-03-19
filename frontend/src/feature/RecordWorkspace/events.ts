import type { WorkspaceEventSet } from "./types";

export const createWorkspaceEvents = (namespace: string): WorkspaceEventSet => ({
  updated: `${namespace}-updated`,
  currentId: `${namespace}-current-id`,
  create: `${namespace}-create`,
  select: `${namespace}-select`,
  delete: `${namespace}-delete`,
  siderState: `${namespace}-sider-state`,
  toggleSider: `${namespace}-toggle-sider`,
  getSiderState: `${namespace}-get-sider-state`,
  siderWidth: `${namespace}-sider-width`,
  getSiderWidth: `${namespace}-get-sider-width`,
});

