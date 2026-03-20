export const EXAM_STORAGE_KEY = "exam_design_exams_v1";
export const EXAM_CURRENT_KEY = "exam_design_current_id";
export const EXAM_COUNTER_KEY = "exam_design_exams_counter";
export const EXAM_TITLE = "试卷列表";

export const EXAM_EVENTS = {
  updated: "exam-exams-updated",
  currentId: "exam-current-id",
  create: "exam-exam-create",
  select: "exam-exam-select",
  delete: "exam-exam-delete",
  siderState: "exam-sider-state",
  toggleSider: "toggle-exam-sider",
  getSiderState: "get-exam-sider-state",
  siderWidth: "exam-sider-width",
  getSiderWidth: "get-exam-sider-width",
} as const;
