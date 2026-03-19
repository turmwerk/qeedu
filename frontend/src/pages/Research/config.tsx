import {
  createWorkspaceEvents,
  type WorkspaceBuildRecordContext,
  type WorkspaceConfig,
  type WorkspaceRecord,
} from "@/feature/RecordWorkspace";
import {
  EditOutlinedIcon,
  ReadOutlinedIcon,
  SearchOutlinedIcon,
} from "@/ui/Icon";

const text = (value: unknown, fallback = "待补充") => {
  if (typeof value === "string" && value.trim()) return value.trim();
  if (typeof value === "number" && !Number.isNaN(value)) return String(value);
  return fallback;
};

const buildMarkdown = (sections: Array<{ title: string; body: string }>) =>
  sections
    .map((section) => `## ${section.title}\n${section.body}`)
    .join("\n\n");

const buildRecord = (
  context: WorkspaceBuildRecordContext,
  meta: Omit<WorkspaceRecord, "id" | "createdAt" | "updatedAt">,
): WorkspaceRecord => ({
  id: context.id,
  createdAt: context.createdAt,
  updatedAt: context.createdAt,
  ...meta,
});

export const researchWorkspaceConfigs: WorkspaceConfig[] = [
  {
    key: "research-literature-search",
    title: "文献检索",
    headline: "文献检索",
    subtitle: "检索式管理 · 数据库对比 · 筛选节奏",
    description: "把检索问题、数据库与筛选标准放进统一工作台。",
    icon: <SearchOutlinedIcon />,
    routeBase: "/research/literature-search",
    listTitle: "检索方案",
    listEmptyText: "暂无文献检索方案。",
    createModalTitle: "新建文献检索方案",
    createModalDescription: "适合在开题、综述和实验复盘前先整理检索式与筛选范围。",
    createButtonLabel: "新建方案",
    searchPlaceholder: "搜索检索方案",
    createFields: [
      { name: "name", label: "方案名称", placeholder: "例如：多模态检索系统综述检索" },
      { name: "topic", label: "研究主题", placeholder: "例如：RAG 评测" },
      {
        name: "database",
        label: "主数据库",
        type: "select",
        options: [
          { label: "Google Scholar", value: "Google Scholar" },
          { label: "Web of Science", value: "Web of Science" },
          { label: "CNKI", value: "CNKI" },
          { label: "ACL Anthology", value: "ACL Anthology" },
        ],
        defaultValue: "Google Scholar",
      },
      {
        name: "status",
        label: "推进状态",
        type: "select",
        options: [
          { label: "关键词整理", value: "关键词整理" },
          { label: "初筛", value: "初筛" },
          { label: "精筛", value: "精筛" },
          { label: "待复盘", value: "待复盘" },
        ],
        defaultValue: "关键词整理",
      },
      { name: "targetCount", label: "目标样本量", type: "number", min: 10, defaultValue: 40 },
      { name: "searchQuestion", label: "核心检索问题", type: "textarea", rows: 4, placeholder: "例如：哪些工作解决了跨模态检索中的时序对齐问题？" },
    ],
    filters: [
      { key: "all", label: "全部", match: () => true },
      { key: "keyword", label: "关键词整理", match: (record) => record.status === "关键词整理" },
      { key: "first-pass", label: "初筛", match: (record) => record.status === "初筛" },
      { key: "deep-pass", label: "精筛", match: (record) => record.status === "精筛" },
    ],
    storageKey: "research_literature_search_records",
    currentKey: "research_literature_search_current_id",
    counterKey: "research_literature_search_counter",
    events: createWorkspaceEvents("research-literature-search"),
    botName: "检索助手",
    botIntro: "可以一起打磨检索式、筛选标准和数据库组合，尽量减少无效检索。",
    assistantPrompts: [
      "帮我扩展关键词同义词",
      "检查筛选标准是否过宽",
      "把这套检索式改写成数据库语法",
    ],
    capabilities: [
      "检索式设计",
      "数据库语法转换",
      "筛选标准收敛",
      "样本池复盘",
    ],
    deliverables: [
      "检索方案",
      "关键词同义词表",
      "筛选标准清单",
      "样本池复盘纪要",
    ],
    relatedLinks: [
      { label: "论文精读", to: "/research/paper-reader/ListPage" },
      { label: "论文写作", to: "/research/paper-writing/ListPage" },
    ],
    buildRecord: (context) => {
      const name = text(context.payload.name, "未命名检索方案");
      const topic = text(context.payload.topic, "待定主题");
      const database = text(context.payload.database, "Google Scholar");
      const status = text(context.payload.status, "关键词整理");
      const targetCount = text(context.payload.targetCount, "40");
      const question = text(context.payload.searchQuestion, "待补充核心检索问题");
      return buildRecord(context, {
        title: name,
        subtitle: `${topic} · ${database}`,
        summary: question,
        status,
        tags: [topic, database],
        metrics: [
          { label: "研究主题", value: topic },
          { label: "主数据库", value: database },
          { label: "推进状态", value: status },
          { label: "目标样本量", value: targetCount },
        ],
        highlights: [
          "先拆核心概念，再扩展同义词和限制词。",
          "数据库语法差异要单独记录，避免直接混用。",
          "初筛和精筛标准最好分开写，便于复盘。",
        ],
        nextSteps: [
          "补齐检索词和排除词列表。",
          "确定题名、摘要和全文的筛查范围。",
          "把筛选结果同步到精读工作台。",
        ],
        references: [
          { label: "主数据库", value: database },
          { label: "研究主题", value: topic },
          { label: "目标样本量", value: targetCount },
        ],
        content: buildMarkdown([
          { title: "核心检索问题", body: question },
          {
            title: "基本信息",
            body: `- 研究主题：${topic}\n- 主数据库：${database}\n- 推进状态：${status}\n- 目标样本量：${targetCount}`,
          },
          {
            title: "检索式草案",
            body: "- 主题词 A AND 主题词 B\n- (Synonym 1 OR Synonym 2) AND evaluation\n- 结合时间、领域或任务限制词",
          },
          {
            title: "筛选标准",
            body: "- 初筛：题名与摘要相关性\n- 精筛：方法、数据集和实验结论匹配度\n- 排除：与主题无关或缺少核心实验",
          },
        ]),
      });
    },
  },
  {
    key: "research-paper-reader",
    title: "论文精读",
    headline: "论文精读",
    subtitle: "结构化笔记 · 贡献提炼 · 复现实验",
    description: "对重点论文做摘要、方法和实验层面的结构化沉淀。",
    icon: <ReadOutlinedIcon />,
    routeBase: "/research/paper-reader",
    listTitle: "精读笔记",
    listEmptyText: "暂无精读笔记。",
    createModalTitle: "新建精读笔记",
    createModalDescription: "适合记录论文的核心问题、方法流程和你的复现判断。",
    createButtonLabel: "新建笔记",
    searchPlaceholder: "搜索论文笔记",
    createFields: [
      { name: "name", label: "论文标题", placeholder: "例如：Retrieval-Augmented Generation Survey" },
      { name: "venue", label: "会议/期刊", placeholder: "例如：ACL 2026" },
      { name: "year", label: "年份", type: "number", min: 2000, defaultValue: 2026 },
      {
        name: "status",
        label: "阅读状态",
        type: "select",
        options: [
          { label: "待读", value: "待读" },
          { label: "精读中", value: "精读中" },
          { label: "已提炼", value: "已提炼" },
          { label: "待复现", value: "待复现" },
        ],
        defaultValue: "待读",
      },
      { name: "coreQuestion", label: "核心问题", type: "textarea", rows: 4, placeholder: "论文主要解决什么问题，采用了什么路径？" },
    ],
    filters: [
      { key: "all", label: "全部", match: () => true },
      { key: "reading", label: "精读中", match: (record) => record.status === "精读中" },
      { key: "done", label: "已提炼", match: (record) => record.status === "已提炼" },
      { key: "reproduce", label: "待复现", match: (record) => record.status === "待复现" },
    ],
    storageKey: "research_paper_reader_records",
    currentKey: "research_paper_reader_current_id",
    counterKey: "research_paper_reader_counter",
    events: createWorkspaceEvents("research-paper-reader"),
    botName: "精读助手",
    botIntro: "我可以和你一起拆论文结构、提炼贡献、压缩实验结论，并形成复现清单。",
    assistantPrompts: [
      "帮我用三句话概括贡献",
      "把方法流程改成可讲的版本",
      "补一份复现实验清单",
    ],
    capabilities: [
      "论文结构化精读",
      "贡献与方法提炼",
      "实验结论压缩",
      "复现实验拆解",
    ],
    deliverables: [
      "精读笔记",
      "贡献摘要",
      "方法流程说明",
      "复现清单",
    ],
    relatedLinks: [
      { label: "文献检索", to: "/research/literature-search/ListPage" },
      { label: "论文写作", to: "/research/paper-writing/ListPage" },
    ],
    buildRecord: (context) => {
      const name = text(context.payload.name, "未命名论文");
      const venue = text(context.payload.venue, "待定 venue");
      const year = text(context.payload.year, "2026");
      const status = text(context.payload.status, "待读");
      const coreQuestion = text(context.payload.coreQuestion, "待补充核心问题");
      return buildRecord(context, {
        title: name,
        subtitle: `${venue} · ${year}`,
        summary: coreQuestion,
        status,
        tags: [venue],
        metrics: [
          { label: "会议/期刊", value: venue },
          { label: "年份", value: year },
          { label: "阅读状态", value: status },
          { label: "输出目标", value: "结构化笔记" },
        ],
        highlights: [
          "先回答论文想解决什么，再看方法如何实现。",
          "把实验设置、对比基线和失败案例单独标注。",
          "精读不是复述全文，而是筛出可复用的思路。",
        ],
        nextSteps: [
          "提炼问题定义、方法亮点和实验结论。",
          "补一页图示或流程说明方便复述。",
          "将可复现部分拆成代码与数据清单。",
        ],
        references: [
          { label: "会议/期刊", value: venue },
          { label: "年份", value: year },
          { label: "阅读状态", value: status },
        ],
        content: buildMarkdown([
          { title: "核心问题", body: coreQuestion },
          {
            title: "论文信息",
            body: `- 会议/期刊：${venue}\n- 年份：${year}\n- 阅读状态：${status}`,
          },
          {
            title: "贡献提炼",
            body: "- 贡献 1：待补充\n- 贡献 2：待补充\n- 贡献 3：待补充",
          },
          {
            title: "方法与实验",
            body: "- 方法核心：待补充\n- 数据集与指标：待补充\n- 对比结果与局限：待补充",
          },
        ]),
      });
    },
  },
  {
    key: "research-paper-writing",
    title: "论文写作",
    headline: "论文写作",
    subtitle: "提纲搭建 · 章节推进 · 投稿准备",
    description: "管理论文草稿、章节目标和投稿前检查。",
    icon: <EditOutlinedIcon />,
    routeBase: "/research/paper-writing",
    listTitle: "写作草稿",
    listEmptyText: "暂无写作草稿。",
    createModalTitle: "新建论文写作草稿",
    createModalDescription: "适合从摘要、提纲到投稿检查的全过程写作管理。",
    createButtonLabel: "新建草稿",
    searchPlaceholder: "搜索写作草稿",
    createFields: [
      { name: "name", label: "论文标题", placeholder: "例如：Towards Robust RAG Evaluation" },
      { name: "targetVenue", label: "目标投稿", placeholder: "例如：EMNLP 2027" },
      {
        name: "paperType",
        label: "论文类型",
        type: "select",
        options: [
          { label: "Survey", value: "Survey" },
          { label: "Empirical", value: "Empirical" },
          { label: "System", value: "System" },
          { label: "Theory", value: "Theory" },
        ],
        defaultValue: "Empirical",
      },
      {
        name: "status",
        label: "写作阶段",
        type: "select",
        options: [
          { label: "提纲搭建", value: "提纲搭建" },
          { label: "实验补全", value: "实验补全" },
          { label: "论文撰写", value: "论文撰写" },
          { label: "投稿准备", value: "投稿准备" },
        ],
        defaultValue: "提纲搭建",
      },
      { name: "deadline", label: "关键截止", placeholder: "例如：2027-03-01" },
      { name: "contribution", label: "核心贡献", type: "textarea", rows: 4, placeholder: "用 3~5 句写清楚论文真正的贡献。" },
    ],
    filters: [
      { key: "all", label: "全部", match: () => true },
      { key: "outline", label: "提纲搭建", match: (record) => record.status === "提纲搭建" },
      { key: "writing", label: "论文撰写", match: (record) => record.status === "论文撰写" },
      { key: "submission", label: "投稿准备", match: (record) => record.status === "投稿准备" },
    ],
    storageKey: "research_paper_writing_records",
    currentKey: "research_paper_writing_current_id",
    counterKey: "research_paper_writing_counter",
    events: createWorkspaceEvents("research-paper-writing"),
    botName: "写作助手",
    botIntro: "我可以帮你整理论文结构、润色段落、压缩摘要并做投稿前检查。",
    assistantPrompts: [
      "帮我检查摘要逻辑",
      "把贡献改写得更清晰",
      "做一份投稿前检查清单",
    ],
    capabilities: [
      "章节提纲推进",
      "贡献表述压缩",
      "摘要与段落润色",
      "投稿检查组织",
    ],
    deliverables: [
      "论文提纲",
      "摘要草稿",
      "章节推进计划",
      "投稿前检查单",
    ],
    relatedLinks: [
      { label: "文献检索", to: "/research/literature-search/ListPage" },
      { label: "论文精读", to: "/research/paper-reader/ListPage" },
    ],
    buildRecord: (context) => {
      const name = text(context.payload.name, "未命名写作草稿");
      const targetVenue = text(context.payload.targetVenue, "待定 venue");
      const paperType = text(context.payload.paperType, "Empirical");
      const status = text(context.payload.status, "提纲搭建");
      const deadline = text(context.payload.deadline, "待确认");
      const contribution = text(context.payload.contribution, "待补充核心贡献");
      return buildRecord(context, {
        title: name,
        subtitle: `${targetVenue} · ${paperType}`,
        summary: contribution,
        status,
        tags: [targetVenue, paperType],
        metrics: [
          { label: "目标投稿", value: targetVenue },
          { label: "论文类型", value: paperType },
          { label: "写作阶段", value: status },
          { label: "关键截止", value: deadline },
        ],
        highlights: [
          "先保证贡献和问题定义足够清晰，再推进段落润色。",
          "写作阶段要同步实验图表和 appendix 材料。",
          "投稿准备阶段提前做格式、匿名和附件检查。",
        ],
        nextSteps: [
          "把提纲细化到章节级别。",
          "同步实验结果与图表说明。",
          "在截止前一周完成通读和格式检查。",
        ],
        references: [
          { label: "目标投稿", value: targetVenue },
          { label: "论文类型", value: paperType },
          { label: "关键截止", value: deadline },
        ],
        content: buildMarkdown([
          { title: "核心贡献", body: contribution },
          {
            title: "写作元信息",
            body: `- 目标投稿：${targetVenue}\n- 论文类型：${paperType}\n- 写作阶段：${status}\n- 关键截止：${deadline}`,
          },
          {
            title: "章节提纲",
            body: "- 1 引言：问题动机与贡献\n- 2 相关工作：研究脉络与不足\n- 3 方法：核心设计与实现\n- 4 实验：设置、结果与分析\n- 5 结论：总结与未来工作",
          },
          {
            title: "投稿前检查",
            body: "- 匿名化是否完成\n- 图表、引用和附录是否齐全\n- 格式模板与页数是否符合要求",
          },
        ]),
      });
    },
  },
];
