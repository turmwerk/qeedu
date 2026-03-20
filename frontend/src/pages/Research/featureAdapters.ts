import { createMockAdapter } from "@/utils/feature/createMockAdapter";
import {
  literatureSearchRecords,
  paperReaderRecords,
  paperWritingRecords,
} from "./featureData";

const createSimpleRecord =
  (tag: string) =>
  (payload: Record<string, unknown>) => ({
    id: "",
    title: String(payload.title ?? "未命名记录"),
    subtitle: String(payload.database ?? payload.venue ?? "待补充信息"),
    summary: String(payload.summary ?? "待补充摘要"),
    status: "进行中",
    tags: [tag],
    updatedAt: Date.now(),
    content: "## 当前工作区\n- 更新记录\n- 继续对话\n- 产出结果\n",
    resources: [],
    templates: [],
    milestones: [],
  });

export const literatureSearchAdapter = createMockAdapter<any>({
  storageKey: "research_literature_search_records_v2",
  idPrefix: "query",
  botName: "检索助理",
  seedRecords: literatureSearchRecords,
  createRecord: createSimpleRecord("文献检索"),
});

export const paperReaderAdapter = createMockAdapter<any>({
  storageKey: "research_paper_reader_records_v2",
  idPrefix: "paper",
  botName: "精读助理",
  seedRecords: paperReaderRecords,
  createRecord: createSimpleRecord("论文精读"),
});

export const paperWritingAdapter = createMockAdapter<any>({
  storageKey: "research_paper_writing_records_v2",
  idPrefix: "draft",
  botName: "写作助理",
  seedRecords: paperWritingRecords,
  createRecord: createSimpleRecord("论文写作"),
});
