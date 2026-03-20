import type { FormField } from "@/ui/Form";

const now = Date.now();
const ago = (hours: number) => now - hours * 60 * 60 * 1000;

export const literatureSearchPageData = {
  headline: "文献检索实验室",
  subtitle: "检索式、筛选记录、保存论文、主题聚类、AI 检索助理",
  description: "围绕研究问题构建查询、筛选样本、保存候选论文，并把结论移交到精读和写作。",
  metrics: [
    { label: "活跃查询", value: "6", detail: "2 个查询待精筛复核" },
    { label: "候选论文", value: "34", detail: "11 篇已加入精读队列" },
    { label: "主题簇", value: "5", detail: "anchoring 与 flow disruption 最集中" },
  ],
  createFields: [
    { name: "title", label: "查询名称", placeholder: "例如：Generative AI timing in creative workflows" },
    { name: "database", label: "目标数据库", type: "select", options: [{ label: "Scopus", value: "Scopus" }, { label: "Web of Science", value: "Web of Science" }, { label: "ACM DL", value: "ACM DL" }], defaultValue: "Scopus" },
    { name: "summary", label: "研究问题", type: "textarea", rows: 4, placeholder: "描述你的研究问题、关键词边界和筛选标准。" },
  ] satisfies FormField[],
};

export const literatureSearchRecords = [
  {
    id: "literature-query-1",
    title: "Generative AI timing in creative workflows",
    subtitle: "Scopus · 34 篇候选样本",
    summary: "关注 AI 介入时机、创意流动性和锚定效应。",
    status: "精筛中",
    tags: ["HCI", "creative workflow", "timing"],
    updatedAt: ago(2),
    content:
      'TS=("generative AI" OR "AI assistant") AND (creative workflow OR sketch* OR ideation) AND (timing OR intervention)',
    filters: ["2020-2026", "English", "Peer-reviewed"],
    savedPapers: [
      { id: "paper-1", title: "Anchoring Effects in AI-Assisted Sketch Ideation", meta: "UIST 2024", status: "已保存" },
      { id: "paper-2", title: "Timing Matters: Intervention Schedules for Human-AI Co-Creation", meta: "CHI 2025", status: "已比较" },
      { id: "paper-3", title: "Flow and Friction in Prompt-Driven Design Workflows", meta: "DIS 2024", status: "待转精读" },
    ],
    resources: [
      { id: "lr1", title: "纳排标准 v2", kind: "筛选说明", summary: "当前初筛与精筛统一口径。" },
      { id: "lr2", title: "导出 BibTeX", kind: "导出", summary: "供后续写作直接引用。" },
    ],
  },
  {
    id: "literature-query-2",
    title: "RAG evaluation benchmark synthesis",
    subtitle: "Web of Science · 21 篇候选样本",
    summary: "整理 RAG 评测维度、基准数据集和可复现实验设置。",
    status: "初筛中",
    tags: ["RAG", "benchmark", "evaluation"],
    updatedAt: ago(14),
    content: 'TS=("retrieval augmented generation" OR RAG) AND (evaluation OR benchmark)',
    filters: ["2023-2026", "English"],
    savedPapers: [
      { id: "paper-4", title: "Benchmarking Retrieval-Augmented Generation Systems", meta: "EMNLP 2024", status: "待保存" },
    ],
    resources: [],
  },
];

export const literatureSearchQuickActions = [
  {
    id: "literature-action-1",
    title: "生成主题簇摘要",
    description: "根据当前候选论文总结 3 个主题簇。",
    prompt: "请根据当前候选论文生成 3 个主题簇，并说明每个主题簇的代表论文。",
    action: "copy_prompt" as const,
  },
  {
    id: "literature-action-2",
    title: "输出筛选理由",
    description: "把纳排标准写成可复核说明。",
    prompt: "请基于当前筛选结果生成可复核的纳排理由说明。",
    action: "append_prompt" as const,
  },
];

export const paperReaderPageData = {
  headline: "阅读桌面",
  subtitle: "论文队列、结构化阅读卡、证据摘录、批注与比较",
  description: "把精读、证据摘录和写作移交流程统一在一张桌面上。",
  metrics: [
    { label: "精读队列", value: "8", detail: "3 篇已抽出核心证据卡" },
    { label: "证据卡", value: "17", detail: "5 张已回写到写作草稿" },
    { label: "对比队列", value: "3", detail: "聚焦 intervention timing 相关论文" },
  ],
};

export const paperReaderRecords = [
  {
    id: "reader-paper-1",
    title: "Anchoring Effects in AI-Assisted Sketch Ideation",
    subtitle: "UIST 2024 · 当前精读",
    summary: "围绕 AI 介入时机与 sketch ideation 中的锚定效应。",
    status: "精读中",
    tags: ["anchoring", "ideation", "timing"],
    updatedAt: ago(3),
    content: "## 结构化阅读\n- 研究问题\n- 方法设计\n- 实验结论\n- 局限与可复用点",
    notes: [
      { title: "Research Question", text: "AI 介入时机如何影响创意发散和锚定？" },
      { title: "Method", text: "控制不同 intervention timing，对比 sketch 结果差异。" },
      { title: "Evaluation", text: "创意多样性、完成质量、autonomy 与 flow disruption。" },
    ],
    evidenceCards: [
      { title: "Section 1.2", summary: "定义 intervention timing 与 workflow disruption。" },
      { title: "Figure 3", summary: "展示不同时机对结果差异的影响。" },
      { title: "Section 5", summary: "limitations 与真实工作流边界。" },
    ],
    resources: [
      { id: "pr1", title: "PDF 原文", kind: "论文", summary: "用于定位原文摘录。" },
      { id: "pr2", title: "转写到写作草稿", kind: "联动", summary: "把证据卡移交给写作工作室。", to: "/research/paper-writing" },
    ],
  },
  {
    id: "reader-paper-2",
    title: "Timing Matters: Intervention Schedules for Human-AI Co-Creation",
    subtitle: "CHI 2025 · 比较队列",
    summary: "更关注协同创作中的干预节奏与用户体验。",
    status: "待比较",
    tags: ["co-creation", "schedule"],
    updatedAt: ago(9),
    content: "## 待读清单\n- 补实验设置\n- 补用户研究边界",
    notes: [],
    evidenceCards: [],
    resources: [],
  },
];

export const paperReaderQuickActions = [
  {
    id: "reader-action-1",
    title: "生成 comparative narrative",
    description: "把当前论文和比较队列的差异写出来。",
    prompt: "请比较当前论文与比较队列论文在 intervention timing、evaluation 和局限性上的差异。",
    action: "copy_prompt" as const,
  },
  {
    id: "reader-action-2",
    title: "输出复现清单",
    description: "把实验复现条件拆成待办。",
    prompt: "请把当前论文的复现条件拆成设备、数据、依赖和评测四类清单。",
    action: "append_prompt" as const,
  },
];

export const paperWritingPageData = {
  headline: "稿件工作室",
  subtitle: "章节树、正文草稿、模板插入、引用管理、里程碑与写作 AI",
  description: "把摘要、章节推进、引用组织和投稿前检查串成连续写作工作流。",
  metrics: [
    { label: "当前草稿", value: "3", detail: "1 篇处于投稿前检查" },
    { label: "待补引文", value: "12", detail: "多集中在 related work" },
    { label: "本周里程碑", value: "4", detail: "摘要、outline、figure list、终检" },
  ],
  createFields: [
    { name: "title", label: "草稿名称", placeholder: "例如：CHI 2026 AI timing paper" },
    { name: "venue", label: "目标会议", placeholder: "例如：CHI 2026" },
    { name: "summary", label: "当前目标", type: "textarea", rows: 4, placeholder: "描述当前需要推进的章节或写作目标。" },
  ] satisfies FormField[],
};

export const paperWritingRecords = [
  {
    id: "writing-draft-1",
    title: "CHI 2026 - AI timing paper",
    subtitle: "摘要与 related work 推进中",
    summary: "准备收敛 contribution framing，并把精读证据挂到 related work。",
    status: "写作中",
    tags: ["CHI", "abstract", "related work"],
    updatedAt: ago(1),
    content:
      "## Abstract\nWe investigate how the timing of generative AI intervention shapes creative workflow experiences...\n\n## Related Work\n### Intervention timing\n### Anchoring\n### Flow disruption\n",
    templates: [
      { id: "pw1", title: "Abstract 模板", summary: "问题、方法、发现、贡献四段式。", content: "## Abstract\n### Problem\n### Method\n### Findings\n### Contribution\n" },
      { id: "pw2", title: "Related Work 模板", summary: "按主题簇组织论据。", content: "## Related Work\n### Intervention timing\n### Anchoring\n### Flow disruption\n" },
    ],
    milestones: [
      { id: "pwm1", title: "锁定摘要结构", summary: "控制 180-220 词。", date: "03/21", status: "doing" as const },
      { id: "pwm2", title: "整理 related work", summary: "补齐 6 条引用。", date: "03/23", status: "todo" as const },
      { id: "pwm3", title: "投稿前终检", summary: "匿名化、格式与补充材料。", date: "03/28", status: "risk" as const },
    ],
    resources: [
      { id: "pw-resource-1", title: "精读证据卡", kind: "联动", summary: "来自阅读桌面的可复用论据。", to: "/research/paper-reader" },
    ],
  },
  {
    id: "writing-draft-2",
    title: "RAG benchmark survey",
    subtitle: "综述结构搭建中",
    summary: "准备形成 benchmark taxonomy 与 evaluation gap。",
    status: "待续写",
    tags: ["survey", "benchmark"],
    updatedAt: ago(20),
    content: "## Outline\n- Background\n- Benchmark datasets\n- Metrics\n- Open challenges\n",
    templates: [],
    milestones: [],
    resources: [],
  },
];

export const paperWritingQuickActions = [
  {
    id: "writing-action-1",
    title: "生成摘要压缩版",
    description: "检查摘要是否过长或贡献不清。",
    prompt: "请检查当前摘要是否过长，并给出一个 180 词以内的压缩版。",
    action: "copy_prompt" as const,
  },
  {
    id: "writing-action-2",
    title: "做投稿前终检",
    description: "把格式、匿名化和补充材料拆成清单。",
    prompt: "请根据当前草稿输出投稿前终检清单，覆盖格式、匿名化、引文和补充材料。",
    action: "append_prompt" as const,
  },
];
