export const SYLLABUS_STORAGE_KEY = "syllabus_outlines";
export const SYLLABUS_CURRENT_KEY = "syllabus_current_id";
export const SYLLABUS_COUNTER_KEY = "syllabus_outlines_counter";
export const SYLLABUS_TITLE = "大纲列表";

export const SYLLABUS_EVENTS = {
  updated: "syllabus-outlines-updated",
  currentId: "syllabus-current-id",
  create: "syllabus-outline-create",
  select: "syllabus-outline-select",
  delete: "syllabus-outline-delete",
  siderState: "syllabus-sider-state",
  toggleSider: "toggle-syllabus-sider",
  getSiderState: "get-syllabus-sider-state",
  siderWidth: "syllabus-sider-width",
  getSiderWidth: "get-syllabus-sider-width",
} as const;
