import { createMockAdapter } from "@/utils/feature/createMockAdapter";
import {
  abroadLifeRecords,
  culturalTrainingRecords,
  exchangeHubRecords,
  matchingLabRecords,
  preDepartureRecords,
  processFlowRecords,
  returnServiceRecords,
  welcomePortalRecords,
  writingDeskRecords,
} from "./featureData";

const createSimpleRecord =
  (tag: string) =>
  (payload: Record<string, unknown>) => ({
    id: "",
    title: String(payload.title ?? "未命名记录"),
    subtitle: "待补充信息",
    summary: String(payload.summary ?? "待补充摘要"),
    status: "进行中",
    tags: [tag],
    updatedAt: Date.now(),
    content: "## 当前工作区\n- 继续推进\n- 继续对话\n",
    resources: [],
    tasks: [],
    milestones: [],
    templates: [],
  });

export const exchangeHubAdapter = createMockAdapter<any>({
  storageKey: "international_exchange_hub_records_v2",
  idPrefix: "program",
  botName: "项目助手",
  seedRecords: exchangeHubRecords,
  createRecord: createSimpleRecord("项目"),
});

export const matchingLabAdapter = createMockAdapter<any>({
  storageKey: "international_matching_lab_records_v2",
  idPrefix: "analysis",
  botName: "匹配助手",
  seedRecords: matchingLabRecords,
  createRecord: createSimpleRecord("分析"),
});

export const processFlowAdapter = createMockAdapter<any>({
  storageKey: "international_process_flow_records_v2",
  idPrefix: "plan",
  botName: "流程助手",
  seedRecords: processFlowRecords,
  createRecord: createSimpleRecord("计划"),
});

export const writingDeskAdapter = createMockAdapter<any>({
  storageKey: "international_writing_desk_records_v2",
  idPrefix: "draft",
  botName: "邮件助手",
  seedRecords: writingDeskRecords,
  createRecord: createSimpleRecord("写作"),
});

export const preDepartureAdapter = createMockAdapter<any>({
  storageKey: "international_pre_departure_records_v2",
  idPrefix: "prep",
  botName: "行前助手",
  seedRecords: preDepartureRecords,
  createRecord: createSimpleRecord("行前"),
});

export const welcomePortalAdapter = createMockAdapter<any>({
  storageKey: "international_welcome_portal_records_v2",
  idPrefix: "welcome",
  botName: "来华助手",
  seedRecords: welcomePortalRecords,
  createRecord: createSimpleRecord("来华支持"),
});

export const culturalTrainingAdapter = createMockAdapter<any>({
  storageKey: "international_cultural_training_records_v2",
  idPrefix: "culture",
  botName: "跨文化助手",
  seedRecords: culturalTrainingRecords,
  createRecord: createSimpleRecord("跨文化训练"),
});

export const abroadLifeAdapter = createMockAdapter<any>({
  storageKey: "international_abroad_life_records_v2",
  idPrefix: "ticket",
  botName: "在外支持助手",
  seedRecords: abroadLifeRecords,
  createRecord: createSimpleRecord("在外支持"),
});

export const returnServiceAdapter = createMockAdapter<any>({
  storageKey: "international_return_service_records_v2",
  idPrefix: "return",
  botName: "返校助手",
  seedRecords: returnServiceRecords,
  createRecord: createSimpleRecord("返校案例"),
});
