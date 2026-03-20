import { createMockAdapter } from "@/utils/feature/createMockAdapter";
import {
  announcementGeneratorRecords,
  dashboardRecords,
  materialsCenterRecords,
  processAssistantRecords,
  studentQARecords,
  timelineRecords,
} from "./featureData";

const createSimpleRecord =
  (defaultTag: string) =>
  (payload: Record<string, unknown>) => ({
    id: "",
    title: String(payload.title ?? "未命名记录"),
    subtitle: String(payload.owner ?? payload.audience ?? "待补充信息"),
    summary: String(payload.summary ?? "待补充摘要"),
    status: String(payload.status ?? "进行中"),
    tags: [defaultTag],
    updatedAt: Date.now(),
    content: "## 工作区\n- 补充内容\n- 继续对话\n- 更新状态\n",
  });

export const processAssistantAdapter = createMockAdapter<any>({
  storageKey: "management_process_assistant_cases_v2",
  idPrefix: "case",
  botName: "事务处理助手",
  seedRecords: processAssistantRecords,
  createRecord: createSimpleRecord("事务案例"),
});

export const announcementGeneratorAdapter = createMockAdapter<any>({
  storageKey: "management_announcement_generator_records_v2",
  idPrefix: "announcement",
  botName: "公告助手",
  seedRecords: announcementGeneratorRecords,
  createRecord: createSimpleRecord("通知公告"),
});

export const materialsCenterAdapter = createMockAdapter<any>({
  storageKey: "management_materials_center_records_v2",
  idPrefix: "materials",
  botName: "材料助手",
  seedRecords: materialsCenterRecords,
  createRecord: createSimpleRecord("材料集合"),
});

export const studentQAAdapter = createMockAdapter<any>({
  storageKey: "management_student_qa_records_v2",
  idPrefix: "thread",
  botName: "问答助手",
  seedRecords: studentQARecords,
  createRecord: createSimpleRecord("问答线程"),
});

export const dashboardAdapter = createMockAdapter<any>({
  storageKey: "management_dashboard_records_v2",
  idPrefix: "insight",
  botName: "分析助手",
  seedRecords: dashboardRecords,
  createRecord: createSimpleRecord("洞察会话"),
});

export const timelineAdapter = createMockAdapter<any>({
  storageKey: "management_timeline_records_v2",
  idPrefix: "timeline",
  botName: "时间轴助手",
  seedRecords: timelineRecords,
  createRecord: createSimpleRecord("时间轴"),
});
