import {
  createWorkspaceEvents,
  type WorkspaceBuildRecordContext,
  type WorkspaceConfig,
  type WorkspaceRecord,
} from "@/feature/RecordWorkspace";
import {
  BankOutlinedIcon,
  DeploymentUnitOutlinedIcon,
  EnvironmentOutlinedIcon,
  ExperimentOutlinedIcon,
  GlobalOutlinedIcon,
  MailOutlinedIcon,
  RocketOutlinedIcon,
  RollbackOutlinedIcon,
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

export const internationalWorkspaceConfigs: WorkspaceConfig[] = [
  {
    key: "international-welcome-portal",
    title: "来华支援助手",
    headline: "来华学习支援助手",
    subtitle: "签证材料 · 报到注册 · 住宿校园 · 语言适应",
    description: "为个人来华学习提供签证、报到、住宿、校园办事、语言支持与适应建议的个人助手。",
    icon: <GlobalOutlinedIcon />,
    routeBase: "/international/welcome-portal",
    listTitle: "来华支援方案",
    listEmptyText: "暂无来华学习支援方案。",
    createModalTitle: "新建来华支援方案",
    createModalDescription: "为个人来华学习建立一份连续支援方案，跟踪签证、报到、住宿和到校适应全过程。",
    createButtonLabel: "新建方案",
    searchPlaceholder: "搜索支援方案、项目或国别",
    createFields: [
      { name: "name", label: "方案名称", placeholder: "例如：我的来华学习支援计划" },
      { name: "country", label: "来源国别/地区", placeholder: "例如：新加坡" },
      { name: "program", label: "目标项目/院系", placeholder: "例如：交换生项目 / 汉语进修" },
      {
        name: "arrivalTerm",
        label: "来校学期",
        type: "select",
        options: [
          { label: "2026 秋季", value: "2026 秋季" },
          { label: "2027 春季", value: "2027 春季" },
          { label: "2027 秋季", value: "2027 秋季" },
        ],
        defaultValue: "2027 春季",
      },
      {
        name: "status",
        label: "当前阶段",
        type: "select",
        options: [
          { label: "签证准备", value: "签证准备" },
          { label: "来校途中", value: "来校途中" },
          { label: "报到注册", value: "报到注册" },
          { label: "在校适应", value: "在校适应" },
        ],
        defaultValue: "签证准备",
      },
      { name: "owner", label: "支持联系人", placeholder: "例如：国际处联系人 / buddy / 宿舍前台" },
      { name: "supportNeeds", label: "支援需求", type: "textarea", rows: 4, placeholder: "例如：签证流程不熟、宿舍入住沟通困难、需要中英双语通知。" },
    ],
    filters: [
      { key: "all", label: "全部", match: () => true },
      { key: "visa", label: "签证准备", match: (record) => record.status === "签证准备" },
      { key: "arrival", label: "报到注册", match: (record) => record.status === "报到注册" },
      { key: "settling", label: "在校适应", match: (record) => record.status === "在校适应" },
    ],
    storageKey: "international_welcome_portal_records",
    currentKey: "international_welcome_portal_current_id",
    counterKey: "international_welcome_portal_counter",
    events: createWorkspaceEvents("international-welcome-portal"),
    botName: "来华支援助手",
    botIntro: "我可以帮你规划来华学习的签证、arrival、住宿、注册和语言适应全流程方案。",
    assistantPrompts: [
      "帮我生成一份来校前准备清单",
      "把报到事项整理成个人 checklist",
      "制定我的首周适应计划",
    ],
    capabilities: [
      "个人来华支援方案",
      "来华前材料准备指导",
      "报到注册流程规划",
      "首周适应计划制定",
    ],
    deliverables: [
      "来华支援方案",
      "报到与住宿清单",
      "个人准备模板",
      "首周适应计划",
    ],
    relatedLinks: [
      { label: "多语言沟通与邮件助手", to: "/international/writing-desk/ListPage" },
      { label: "跨文化培训与风险提示", to: "/international/cultural-training" },
    ],
    buildRecord: (context) => {
      const name = text(context.payload.name, "未命名来华方案");
      const country = text(context.payload.country, "待定国别");
      const program = text(context.payload.program, "待定项目");
      const arrivalTerm = text(context.payload.arrivalTerm, "待定学期");
      const status = text(context.payload.status, "签证准备");
      const owner = text(context.payload.owner, "待设定");
      const supportNeeds = text(context.payload.supportNeeds, "待补充支援需求");
      return buildRecord(context, {
        title: name,
        subtitle: `${program} · ${arrivalTerm}`,
        summary: supportNeeds,
        status,
        tags: [country, program, owner],
        metrics: [
          { label: "来源国别/地区", value: country },
          { label: "目标项目/院系", value: program },
          { label: "来校学期", value: arrivalTerm },
          { label: "支持联系人", value: owner },
        ],
        highlights: [
          "来华前材料、签证与抵达安排要并行推进，而不是线性串行。",
          "报到、宿舍、校园卡和选课最好在首周计划里一起统筹。",
          "尽量准备双语说明和联系人信息作为应急备案。",
        ],
        nextSteps: [
          "核对签证和入境前必备材料。",
          "确认报到注册时间、地点和宿舍入住方式。",
          "准备中英双语的校园办事与首周适应说明。",
        ],
        references: [
          { label: "方案名称", value: name },
          { label: "目标项目/院系", value: program },
          { label: "项目联系人", value: owner },
        ],
        tasks: [
          { id: "incoming-1", title: "核验签证、保险和来华前文件", detail: "确认录取材料、签证、保险和航班信息。", done: status !== "签证准备", priority: "high" },
          { id: "incoming-2", title: "确认报到注册与宿舍入住安排", detail: "明确 arrival 流程、报到地点和宿舍办理方式。", done: status === "在校适应", priority: "high" },
          { id: "incoming-3", title: "准备双语通知与 FAQ", detail: "沉淀校园卡、选课、就医和生活服务说明。", done: false, priority: "medium" },
          { id: "incoming-4", title: "安排首周语言与生活支持", detail: "对接 buddy、地图、联系方式和适应建议。", done: false, priority: "medium" },
        ],
        milestones: [
          { id: "incoming-m1", title: "来华前材料确认", summary: "签证、保险、录取与抵达信息齐备。", date: arrivalTerm, status: status === "签证准备" ? "doing" : "done" },
          { id: "incoming-m2", title: "报到与住宿落地", summary: "完成注册、宿舍与校园基础事项。", date: arrivalTerm, status: status === "报到注册" ? "doing" : status === "在校适应" ? "done" : "todo" },
          { id: "incoming-m3", title: "在校适应支持", summary: "进入语言、课堂和生活适应阶段。", date: arrivalTerm, status: status === "在校适应" ? "doing" : "todo" },
        ],
        resources: [
          { id: "incoming-r1", title: "来华前材料清单", kind: "签证材料", summary: "包含签证、保险、录取与 arrival 前核对要点。" },
          { id: "incoming-r2", title: "报到注册说明", kind: "报到流程", summary: "用于组织 arrival 当天和首周的注册事项。" },
          { id: "incoming-r3", title: "校园办事 FAQ", kind: "FAQ", summary: "覆盖校园卡、选课、住宿与就医等高频问题。", to: "/international/writing-desk/ListPage" },
        ],
        templates: [
          {
            id: "incoming-template-briefing",
            title: "来华前双语通知模板",
            summary: "适合整理个人来华前的双语通知与自查说明。",
            content: "## Arrival Notice\n- Arrival date:\n- Check-in location:\n- Required documents:\n- Emergency contact:\n\n## 到校前提醒\n- 报到时间：\n- 住宿办理：\n- 校园办事：\n",
          },
          {
            id: "incoming-template-week1",
            title: "首周适应支持模板",
            summary: "适合梳理到校一周内的支持动作。",
            content: "## 首周支持安排\n- [ ] 报到与注册\n- [ ] 校园卡与账号开通\n- [ ] 宿舍入住确认\n- [ ] 课程与选课说明\n- [ ] 生活服务与就医说明\n",
          },
        ],
        quickActions: [
          { id: "incoming-action-1", title: "生成双语通知", description: "输出一份个人来华前通知与自查说明。", prompt: "请基于当前档案生成一份中英双语的 arrival notice，覆盖签证、报到、住宿和紧急联系。", action: "append_template", templateId: "incoming-template-briefing" },
          { id: "incoming-action-2", title: "压缩首周安排", description: "把当前信息整理成首周支持清单。", prompt: "把当前记录压缩成首周适应支持 checklist，按 arrival 当天、前 3 天和第一周拆分。", action: "append_prompt" },
          { id: "incoming-action-3", title: "检查支持缺口", description: "识别当前还没覆盖的支持事项。", prompt: "检查当前来华支援档案，指出还缺少哪些签证、住宿、校园办事或语言支持信息。", action: "copy_prompt" },
        ],
        content: buildMarkdown([
          { title: "支援需求", body: supportNeeds },
          {
            title: "关键信息",
            body: `- 方案名称：${name}\n- 来源国别/地区：${country}\n- 目标项目/院系：${program}\n- 来校学期：${arrivalTerm}\n- 当前阶段：${status}\n- 项目联系人：${owner}`,
          },
          {
            title: "支援路径",
            body: "- 来华前：签证、保险、arrival 准备\n- 报到阶段：注册、宿舍、校园卡与账号\n- 首周适应：课程、语言、生活服务与联系人对接",
          },
          {
            title: "风险提醒",
            body: "- 避免只准备中文材料，重要事项保留双语版本\n- 宿舍、报到和校园卡开通要明确线下地点与联系人\n- 提前确认医疗、保险和紧急联系机制",
          },
        ]),
      });
    },
  },
  {
    key: "international-exchange-hub",
    title: "交换项目中心",
    headline: "交换项目中心",
    subtitle: "合作院校 · 区域分布 · 要求比对",
    description: "为个人申请决策沉淀可筛选的交换、暑校、访学与联合培养项目库。",
    icon: <BankOutlinedIcon />,
    routeBase: "/international/exchange-hub",
    listTitle: "项目清单",
    listEmptyText: "暂无交换项目记录。",
    createModalTitle: "新建交换项目记录",
    createModalDescription: "适合先沉淀候选项目，再把项目同步到匹配与申请流程里。",
    createButtonLabel: "新建项目",
    searchPlaceholder: "搜索交换项目",
    createFields: [
      { name: "name", label: "项目名称", placeholder: "例如：AI Research Exchange" },
      { name: "partnerSchool", label: "合作院校", placeholder: "例如：苏黎世联邦理工学院" },
      {
        name: "region",
        label: "区域",
        type: "select",
        options: [
          { label: "亚洲", value: "亚洲" },
          { label: "欧洲", value: "欧洲" },
          { label: "北美", value: "北美" },
          { label: "大洋洲", value: "大洋洲" },
        ],
        defaultValue: "欧洲",
      },
      {
        name: "status",
        label: "项目阶段",
        type: "select",
        options: [
          { label: "调研中", value: "调研中" },
          { label: "对比中", value: "对比中" },
          { label: "待申报", value: "待申报" },
        ],
        defaultValue: "调研中",
      },
      { name: "deadline", label: "关键截止", placeholder: "例如：2026-10-15" },
      { name: "highlights", label: "项目亮点", type: "textarea", rows: 4, placeholder: "写清楚研究方向、课程资源或奖学金优势。" },
    ],
    filters: [
      { key: "all", label: "全部", match: () => true },
      { key: "asia", label: "亚洲", match: (record) => record.tags?.includes("亚洲") ?? false },
      { key: "europe", label: "欧洲", match: (record) => record.tags?.includes("欧洲") ?? false },
      { key: "north-america", label: "北美", match: (record) => record.tags?.includes("北美") ?? false },
    ],
    storageKey: "international_exchange_hub_records",
    currentKey: "international_exchange_hub_current_id",
    counterKey: "international_exchange_hub_counter",
    events: createWorkspaceEvents("international-exchange-hub"),
    botName: "项目库助手",
    botIntro: "我可以帮你从项目比较、门槛筛查和课程匹配角度整理交换项目。",
    assistantPrompts: [
      "帮我对比两个院校项目差异",
      "提炼这个项目的申请门槛",
      "根据研究方向筛一批候选项目",
    ],
    capabilities: [
      "合作院校项目库",
      "区域和门槛筛选",
      "候选项目优先级比较",
      "院校项目要点抽取",
    ],
    deliverables: [
      "候选项目清单",
      "门槛对比表",
      "优先级排序建议",
      "项目比较摘要",
    ],
    relatedLinks: [
      { label: "申请总览", to: "/international/welcome-portal/ListPage" },
      { label: "导师匹配", to: "/international/matching-lab/ListPage" },
    ],
    buildRecord: (context) => {
      const name = text(context.payload.name, "未命名交换项目");
      const partnerSchool = text(context.payload.partnerSchool, "待定院校");
      const region = text(context.payload.region, "待定区域");
      const status = text(context.payload.status, "调研中");
      const deadline = text(context.payload.deadline, "待确认");
      const highlights = text(context.payload.highlights, "待补充项目亮点");
      return buildRecord(context, {
        title: name,
        subtitle: `${partnerSchool} · ${region}`,
        summary: highlights,
        status,
        tags: [partnerSchool, region],
        metrics: [
          { label: "合作院校", value: partnerSchool },
          { label: "所在区域", value: region },
          { label: "项目阶段", value: status },
          { label: "关键截止", value: deadline },
        ],
        highlights: [
          "整理官网入口、课程资源与申请资格要求。",
          "标记语言成绩、推荐信和 GPA 下限。",
          "同步项目名额、签证周期与住宿支持情况。",
        ],
        nextSteps: [
          "补齐院校官网原始链接。",
          "对照自身背景评估项目匹配度。",
          "把候选项目同步到申请总览页。",
        ],
        references: [
          { label: "合作院校", value: partnerSchool },
          { label: "区域", value: region },
          { label: "关键截止", value: deadline },
        ],
        content: buildMarkdown([
          { title: "项目定位", body: highlights },
          {
            title: "基本信息",
            body: `- 合作院校：${partnerSchool}\n- 区域：${region}\n- 项目阶段：${status}\n- 关键截止：${deadline}`,
          },
          {
            title: "申请要求",
            body: "- GPA / 排名要求：待确认\n- 语言成绩：待确认\n- 推荐信与材料模板：待确认",
          },
          {
            title: "比较结论",
            body: "- 优势：课程资源和导师匹配度高\n- 风险：截止时间紧、名额有限\n- 建议：优先列为 A 类候选项目",
          },
        ]),
      });
    },
  },
  {
    key: "international-process-flow",
    title: "流程助手",
    headline: "流程助手",
    subtitle: "审批节点 · 时间线 · 堵点清理",
    description: "围绕校内外流程节点做可追踪的推进清单。",
    icon: <DeploymentUnitOutlinedIcon />,
    routeBase: "/international/process-flow",
    listTitle: "流程清单",
    listEmptyText: "暂无流程清单。",
    createModalTitle: "新建流程清单",
    createModalDescription: "适合拆解签字、审批、上传和签证等串联步骤。",
    createButtonLabel: "新建流程",
    searchPlaceholder: "搜索流程节点",
    createFields: [
      { name: "name", label: "流程名称", placeholder: "例如：出国学习审批全流程" },
      {
        name: "stage",
        label: "当前节点",
        type: "select",
        options: [
          { label: "校内审批", value: "校内审批" },
          { label: "院系签字", value: "院系签字" },
          { label: "材料上传", value: "材料上传" },
          { label: "签证办理", value: "签证办理" },
        ],
        defaultValue: "校内审批",
      },
      { name: "deadline", label: "最晚完成时间", placeholder: "例如：2026-11-01" },
      { name: "owner", label: "当前责任人", placeholder: "例如：我自己 / 院系秘书 / 国际处联系人" },
      { name: "blockers", label: "当前卡点", type: "textarea", rows: 4, placeholder: "例如：尚未拿到学院公章，系统附件格式不通过。" },
    ],
    filters: [
      { key: "all", label: "全部", match: () => true },
      { key: "approval", label: "校内审批", match: (record) => record.status === "校内审批" },
      { key: "upload", label: "材料上传", match: (record) => record.status === "材料上传" },
      { key: "visa", label: "签证办理", match: (record) => record.status === "签证办理" },
    ],
    storageKey: "international_process_flow_records",
    currentKey: "international_process_flow_current_id",
    counterKey: "international_process_flow_counter",
    events: createWorkspaceEvents("international-process-flow"),
    botName: "流程助手",
    botIntro: "可以把你的审批链、签字路径和时间节点重新整理成更清晰的执行方案。",
    assistantPrompts: [
      "帮我按时间排序所有审批节点",
      "把堵点改写成可执行动作",
      "补一份签证办理注意事项",
    ],
    capabilities: [
      "审批链拆解",
      "节点时间线可视化",
      "堵点转行动项",
      "签证与上传事项同步",
    ],
    deliverables: [
      "流程节点图",
      "责任人清单",
      "堵点解决方案",
      "签证准备提醒",
    ],
    relatedLinks: [
      { label: "行前准备", to: "/international/pre-departure/ListPage" },
      { label: "申请总览", to: "/international/welcome-portal/ListPage" },
    ],
    buildRecord: (context) => {
      const name = text(context.payload.name, "未命名流程");
      const stage = text(context.payload.stage, "校内审批");
      const deadline = text(context.payload.deadline, "待确认");
      const owner = text(context.payload.owner, "待分配");
      const blockers = text(context.payload.blockers, "暂无卡点记录");
      return buildRecord(context, {
        title: name,
        subtitle: `${stage} · 责任人 ${owner}`,
        summary: blockers,
        status: stage,
        tags: [stage, owner],
        metrics: [
          { label: "当前节点", value: stage },
          { label: "最晚完成", value: deadline },
          { label: "责任人", value: owner },
          { label: "流程状态", value: "持续推进" },
        ],
        highlights: [
          "把所有签字件、上传件和证明材料拆成明确交付物。",
          "对高风险节点设置前置提醒和缓冲时间。",
          "记录系统限制、附件格式和联系人信息。",
        ],
        nextSteps: [
          "确认当前节点的输出件和审批顺序。",
          "为高风险步骤预留至少两天机动时间。",
          "同步学院与国际处的最新说明。",
        ],
        references: [
          { label: "责任人", value: owner },
          { label: "当前节点", value: stage },
          { label: "最晚完成时间", value: deadline },
        ],
        content: buildMarkdown([
          { title: "当前堵点", body: blockers },
          {
            title: "流程总览",
            body: `- 当前节点：${stage}\n- 最晚完成时间：${deadline}\n- 流程责任人：${owner}`,
          },
          {
            title: "节点拆解",
            body: "- 准备材料原件与扫描件\n- 完成院系签字与盖章\n- 上传系统并复核版本\n- 跟进签证与出境要求",
          },
          {
            title: "风险控制",
            body: "- 附件格式与大小限制提前校验\n- 签字链较长时提前预约\n- 重要节点前一天进行终检",
          },
        ]),
      });
    },
  },
  {
    key: "international-pre-departure",
    title: "行前准备",
    headline: "行前准备",
    subtitle: "证件清单 · 住宿保险 · 打包提醒",
    description: "把出发前任务拆成带状态的行前清单。",
    icon: <RocketOutlinedIcon />,
    routeBase: "/international/pre-departure",
    listTitle: "行前事项",
    listEmptyText: "暂无行前事项。",
    createModalTitle: "新建行前事项",
    createModalDescription: "建议按证件、住宿、保险、行李等模块拆分事项。",
    createButtonLabel: "新建事项",
    searchPlaceholder: "搜索行前事项",
    createFields: [
      { name: "name", label: "事项名称", placeholder: "例如：日本交换行前打包" },
      { name: "country", label: "目标国家/地区", placeholder: "例如：日本" },
      { name: "departureDate", label: "出发日期", placeholder: "例如：2027-02-15" },
      {
        name: "status",
        label: "事项分类",
        type: "select",
        options: [
          { label: "证件", value: "证件" },
          { label: "住宿", value: "住宿" },
          { label: "保险", value: "保险" },
          { label: "行李", value: "行李" },
        ],
        defaultValue: "证件",
      },
      { name: "concerns", label: "关注点", type: "textarea", rows: 4, placeholder: "写清楚最担心的问题或待确认项。" },
    ],
    filters: [
      { key: "all", label: "全部", match: () => true },
      { key: "docs", label: "证件", match: (record) => record.status === "证件" },
      { key: "housing", label: "住宿", match: (record) => record.status === "住宿" },
      { key: "luggage", label: "行李", match: (record) => record.status === "行李" },
    ],
    storageKey: "international_pre_departure_records",
    currentKey: "international_pre_departure_current_id",
    counterKey: "international_pre_departure_counter",
    events: createWorkspaceEvents("international-pre-departure"),
    botName: "行前准备助手",
    botIntro: "可以和我一起把出发前清单拆细，避免在签证、住宿和打包上漏项。",
    assistantPrompts: [
      "帮我生成一份行前打包清单",
      "检查签证材料是否完整",
      "把住宿确认事项改成时间线",
    ],
    capabilities: [
      "倒计时待办管理",
      "证件与保险核对",
      "住宿交通准备",
      "行李与应急包规划",
    ],
    deliverables: [
      "行前清单",
      "证件核验表",
      "首周落地安排",
      "应急联系卡",
    ],
    relatedLinks: [
      { label: "流程助手", to: "/international/process-flow/ListPage" },
      { label: "海外生活", to: "/international/abroad-life/ListPage" },
    ],
    buildRecord: (context) => {
      const name = text(context.payload.name, "未命名行前事项");
      const country = text(context.payload.country, "待定目的地");
      const departureDate = text(context.payload.departureDate, "待确认");
      const status = text(context.payload.status, "证件");
      const concerns = text(context.payload.concerns, "待补充关注点");
      return buildRecord(context, {
        title: name,
        subtitle: `${country} · 出发 ${departureDate}`,
        summary: concerns,
        status,
        tags: [country, status],
        metrics: [
          { label: "目的地", value: country },
          { label: "出发日期", value: departureDate },
          { label: "事项分类", value: status },
          { label: "准备状态", value: "待确认" },
        ],
        highlights: [
          "提前检查护照、签证、录取材料和保险文件。",
          "把住宿入住、接机和当地通信作为单独节点。",
          "准备应急联系人、学校地址和重要纸质复印件。",
        ],
        nextSteps: [
          "确认出发前两周完成所有证件核验。",
          "预订到达后的首晚住宿与交通。",
          "将高频使用文件同步到云端和纸质夹。",
        ],
        references: [
          { label: "目的地", value: country },
          { label: "出发日期", value: departureDate },
          { label: "事项分类", value: status },
        ],
        content: buildMarkdown([
          { title: "重点关注", body: concerns },
          {
            title: "基础信息",
            body: `- 目的地：${country}\n- 出发日期：${departureDate}\n- 事项分类：${status}`,
          },
          {
            title: "行前检查",
            body: "- 护照、签证、录取材料与保险单\n- 住宿确认函和交通方案\n- 银行卡、电话卡与校园账号准备",
          },
          {
            title: "应急预案",
            body: "- 保存学校国际处与当地紧急联系方式\n- 重要材料保留电子版与纸质版\n- 到达首周安排熟悉校园与周边环境",
          },
        ]),
      });
    },
  },
  {
    key: "international-matching-lab",
    title: "交换项目配对推荐",
    headline: "智能交换项目配对推荐",
    subtitle: "个人画像 · 项目匹配 · 配对评分",
    description: "基于个人背景和偏好智能推荐最适合的交换项目，提供精准配对和匹配度分析。",
    icon: <ExperimentOutlinedIcon />,
    routeBase: "/international/matching-lab",
    listTitle: "项目推荐方案",
    listEmptyText: "暂无交换项目配对方案。",
    createModalTitle: "新建推荐方案",
    createModalDescription: "基于个人背景和偏好智能匹配最适合的交换项目，生成推荐与比较报告。",
    createButtonLabel: "新建方案",
    searchPlaceholder: "搜索配对方案或个人画像",
    createFields: [
      { name: "name", label: "配对方案名称", placeholder: "例如：2027 春季交换配对推荐" },
      { name: "gpa", label: "学术成绩", placeholder: "例如：3.78 / 前 15%" },
      { name: "language", label: "语言能力", placeholder: "例如：IELTS 7.0 / 日语 N2" },
      { name: "interests", label: "专业兴趣", placeholder: "例如：国际商务、文化研究" },
      {
        name: "region",
        label: "偏好地区",
        type: "select",
        options: [
          { label: "亚洲", value: "亚洲" },
          { label: "欧洲", value: "欧洲" },
          { label: "北美", value: "北美" },
          { label: "大洋洲", value: "大洋洲" },
        ],
        defaultValue: "亚洲",
      },
      {
        name: "status",
        label: "配对阶段",
        type: "select",
        options: [
          { label: "画像整理", value: "画像整理" },
          { label: "候选比较", value: "候选比较" },
          { label: "方案收敛", value: "方案收敛" },
          { label: "待决策", value: "待决策" },
        ],
        defaultValue: "画像整理",
      },
      { name: "preferences", label: "其他偏好", type: "textarea", rows: 3, placeholder: "例如：希望体验不同的教育体系，偏向小班教学，预算控制在10万以内。" },
      { name: "goals", label: "匹配目标", type: "textarea", rows: 4, placeholder: "写清楚希望优先满足的学术、预算、语言或城市偏好。" },
    ],
    filters: [
      { key: "all", label: "全部", match: () => true },
      { key: "analysis", label: "画像整理", match: (record) => record.status === "画像整理" },
      { key: "matching", label: "候选比较", match: (record) => record.status === "候选比较" },
      { key: "recommend", label: "方案收敛", match: (record) => record.status === "方案收敛" },
      { key: "confirm", label: "待决策", match: (record) => record.status === "待决策" },
    ],
    storageKey: "international_matching_lab_records",
    currentKey: "international_matching_lab_current_id",
    counterKey: "international_matching_lab_counter",
    events: createWorkspaceEvents("international-matching-lab"),
    botName: "项目配对助手",
    botIntro: "我可以基于你的背景、偏好和目标，智能推荐最匹配的交换项目并提供配对分析。",
    assistantPrompts: [
      "为我推荐三个最匹配的交换项目",
      "分析我与某个项目的匹配度",
      "生成项目配对推荐报告",
    ],
    capabilities: [
      "个人背景分析",
      "智能项目配对",
      "匹配度评估",
      "个性化推荐生成",
    ],
    deliverables: [
      "推荐项目清单",
      "配对匹配度分析",
      "个性化推荐报告",
      "项目对比总结",
    ],
    relatedLinks: [
      { label: "交换与访学项目中心", to: "/international/exchange-hub/ListPage" },
      { label: "多语言沟通与邮件助手", to: "/international/writing-desk/ListPage" },
    ],
    buildRecord: (context) => {
      const name = text(context.payload.name, "未命名匹配方案");
      const gpa = text(context.payload.gpa, "待补充 GPA / 排名");
      const language = text(context.payload.language, "待补充语言成绩");
      const budget = text(context.payload.budget, "待补充预算");
      const region = text(context.payload.region, "待定区域");
      const status = text(context.payload.status, "画像整理");
      const timeline = text(context.payload.timeline, "待补充时间约束");
      const goals = text(context.payload.goals, "待补充匹配目标");
      return buildRecord(context, {
        title: name,
        subtitle: `${region} · ${timeline}`,
        summary: goals,
        status,
        tags: [region, budget],
        metrics: [
          { label: "GPA / 排名", value: gpa },
          { label: "语言成绩", value: language },
          { label: "预算约束", value: budget },
          { label: "目标区域", value: region },
        ],
        highlights: [
          "先明确硬门槛，再比较课程、预算和时间上的真实可行性。",
          "不要只看学校名气，项目节奏、名额和校内审批窗口同样重要。",
          "为候选池保留冲刺、稳妥、保底三层结构更稳妥。",
        ],
        nextSteps: [
          "补齐个人画像中的硬约束和偏好条件。",
          "将候选项目分层并写出选择理由。",
          "把最终结论同步到流程和邮件工作台。",
        ],
        references: [
          { label: "时间约束", value: timeline },
          { label: "目标区域", value: region },
          { label: "预算约束", value: budget },
        ],
        tasks: [
          { id: "matching-1", title: "整理个人画像与硬约束", detail: "明确 GPA、语言、预算、国家和时间窗口。", done: status !== "画像整理", priority: "high" },
          { id: "matching-2", title: "建立候选项目池", detail: "从项目库筛出符合约束的候选项目。", done: status === "候选比较" || status === "方案收敛" || status === "待决策", priority: "high" },
          { id: "matching-3", title: "完成多项目比较与分层", detail: "输出冲刺、稳妥和保底清单。", done: status === "待决策", priority: "medium" },
          { id: "matching-4", title: "形成最终申报说明", detail: "沉淀决策逻辑，供邮件和校内说明复用。", done: false, priority: "medium" },
        ],
        milestones: [
          { id: "matching-m1", title: "申请画像建模", summary: "明确硬约束和偏好。", date: timeline, status: status === "画像整理" ? "doing" : "done" },
          { id: "matching-m2", title: "候选比较与收敛", summary: "完成门槛和收益比较。", date: timeline, status: status === "候选比较" || status === "方案收敛" ? "doing" : "todo" },
          { id: "matching-m3", title: "最终方案决策", summary: "输出申报优先级与备选。", date: timeline, status: status === "待决策" ? "doing" : "todo" },
        ],
        resources: [
          { id: "matching-r1", title: "候选项目池", kind: "候选清单", summary: "沉淀满足硬门槛的候选项目集合。", to: "/international/exchange-hub/ListPage" },
          { id: "matching-r2", title: "比较维度模板", kind: "比较框架", summary: "用于比较课程、预算、语言、名额和节奏。 " },
          { id: "matching-r3", title: "决策说明稿", kind: "输出材料", summary: "可直接复用于和导师、家人或项目联系人沟通。", to: "/international/writing-desk/ListPage" },
        ],
        templates: [
          {
            id: "matching-template-tier",
            title: "三档申报策略模板",
            summary: "把候选项目按冲刺、稳妥、保底三层整理。",
            content: "## 申报分层\n### 冲刺\n- 项目：\n- 理由：\n### 稳妥\n- 项目：\n- 理由：\n### 保底\n- 项目：\n- 理由：\n",
          },
          {
            id: "matching-template-compare",
            title: "项目比较说明模板",
            summary: "适合输出给导师或学院的比较结论。",
            content: "## 比较结论\n- 个人画像：\n- 候选项目：\n- 硬门槛差异：\n- 风险与收益：\n- 建议排序：\n",
          },
        ],
        quickActions: [
          { id: "matching-action-1", title: "生成候选清单", description: "根据当前画像输出三档候选项目。", prompt: "基于当前画像和约束，生成冲刺、稳妥、保底三档候选项目，并说明理由。", action: "append_template", templateId: "matching-template-tier" },
          { id: "matching-action-2", title: "输出比较纪要", description: "将候选项目比较压缩成可讨论的说明稿。", prompt: "把当前方案整理成一份项目比较说明，突出门槛、收益、风险和建议排序。", action: "append_template", templateId: "matching-template-compare" },
          { id: "matching-action-3", title: "检查决策缺口", description: "识别还缺失的决策信息。", prompt: "检查这份匹配方案还缺哪些关键信息，尤其是语言、预算、审批节奏和名额风险。", action: "copy_prompt" },
        ],
        content: buildMarkdown([
          { title: "匹配目标", body: goals },
          {
            title: "申请画像",
            body: `- GPA / 排名：${gpa}\n- 语言成绩：${language}\n- 预算约束：${budget}\n- 目标区域：${region}\n- 时间约束：${timeline}\n- 当前阶段：${status}`,
          },
          {
            title: "决策框架",
            body: "- 第一层：是否满足硬门槛\n- 第二层：课程和研究匹配度\n- 第三层：预算、节奏和签证可行性",
          },
          {
            title: "后续动作",
            body: "- 形成候选项目池并做打分比较\n- 输出最终建议排序\n- 将结论同步到流程助手和邮件助手",
          },
        ]),
      });
    },
  },
  {
    key: "international-abroad-life",
    title: "海外生活",
    headline: "海外生活",
    subtitle: "生活指南 · 城市信息 · 应急支持",
    description: "把住宿、交通、医疗和校园生活经验沉淀成生活工作台。",
    icon: <EnvironmentOutlinedIcon />,
    routeBase: "/international/abroad-life",
    listTitle: "生活指南",
    listEmptyText: "暂无海外生活指南。",
    createModalTitle: "新建生活指南",
    createModalDescription: "建议按城市和主题分别维护，便于后续快速检索。",
    createButtonLabel: "新建指南",
    searchPlaceholder: "搜索城市或生活主题",
    createFields: [
      { name: "name", label: "指南名称", placeholder: "例如：东京交换生活须知" },
      { name: "city", label: "城市/地区", placeholder: "例如：东京" },
      {
        name: "status",
        label: "主题类别",
        type: "select",
        options: [
          { label: "住宿", value: "住宿" },
          { label: "交通", value: "交通" },
          { label: "医疗", value: "医疗" },
          { label: "校园", value: "校园" },
        ],
        defaultValue: "住宿",
      },
      { name: "emergencyContact", label: "应急联系人", placeholder: "例如：国际处值班电话" },
      { name: "tips", label: "经验提醒", type: "textarea", rows: 4, placeholder: "写清楚注意事项、建议路线和高频坑点。" },
    ],
    filters: [
      { key: "all", label: "全部", match: () => true },
      { key: "housing", label: "住宿", match: (record) => record.status === "住宿" },
      { key: "transport", label: "交通", match: (record) => record.status === "交通" },
      { key: "medical", label: "医疗", match: (record) => record.status === "医疗" },
    ],
    storageKey: "international_abroad_life_records",
    currentKey: "international_abroad_life_current_id",
    counterKey: "international_abroad_life_counter",
    events: createWorkspaceEvents("international-abroad-life"),
    botName: "海外生活助手",
    botIntro: "你可以把生活问题交给我，我会帮你梳理住宿、交通、医疗和校园适应建议。",
    assistantPrompts: [
      "帮我整理一周生活启动清单",
      "把这份经验提醒改写成 FAQ",
      "补一份紧急情况应对流程",
    ],
    capabilities: [
      "城市生活指南",
      "FAQ 快速沉淀",
      "应急资源整理",
      "首周生活启动方案",
    ],
    deliverables: [
      "生活 FAQ",
      "应急联络单",
      "首周行动清单",
      "城市资源图谱",
    ],
    relatedLinks: [
      { label: "行前准备", to: "/international/pre-departure/ListPage" },
      { label: "文化培训", to: "/international/cultural-training" },
    ],
    buildRecord: (context) => {
      const name = text(context.payload.name, "未命名生活指南");
      const city = text(context.payload.city, "待定城市");
      const status = text(context.payload.status, "住宿");
      const emergencyContact = text(context.payload.emergencyContact, "待补充联系人");
      const tips = text(context.payload.tips, "待补充经验提醒");
      return buildRecord(context, {
        title: name,
        subtitle: `${city} · ${status}`,
        summary: tips,
        status,
        tags: [city, status],
        metrics: [
          { label: "城市/地区", value: city },
          { label: "主题类别", value: status },
          { label: "应急联系人", value: emergencyContact },
          { label: "资料状态", value: "可持续补充" },
        ],
        highlights: [
          "优先沉淀首月最容易踩坑的场景。",
          "把地址、营业时间、就医流程等信息留成模板。",
          "生活经验尽量按问题场景而不是按时间记录。",
        ],
        nextSteps: [
          "补充常用地点与交通方案。",
          "核对医疗保险和预约方式。",
          "把高频问题整理成一页速查。",
        ],
        references: [
          { label: "城市", value: city },
          { label: "主题", value: status },
          { label: "应急联系人", value: emergencyContact },
        ],
        content: buildMarkdown([
          { title: "经验提醒", body: tips },
          {
            title: "基础信息",
            body: `- 城市/地区：${city}\n- 主题类别：${status}\n- 应急联系人：${emergencyContact}`,
          },
          {
            title: "常用建议",
            body: "- 优先确认居住地周边超市、药店和地铁站\n- 提前熟悉学校国际处与宿舍管理入口\n- 把医院、报警和保险客服电话写成随身卡片",
          },
          {
            title: "高频问题",
            body: "- 如何办理当地交通卡\n- 如何预约医疗服务\n- 如何处理夜间到达与临时住宿",
          },
        ]),
      });
    },
  },
  {
    key: "international-return-service",
    title: "返校归档与经验沉淀",
    headline: "返校归档与经验沉淀",
    subtitle: "学分认定 · 报销归档 · 经验回流",
    description: "支持返校后的认定、归档和经验沉淀。",
    icon: <RollbackOutlinedIcon />,
    routeBase: "/international/return-service",
    listTitle: "归国事项",
    listEmptyText: "暂无归国事项。",
    createModalTitle: "新建归国事项",
    createModalDescription: "适合把返校后的学分认定、费用报销和分享活动分开维护。",
    createButtonLabel: "新建事项",
    searchPlaceholder: "搜索归国事项",
    createFields: [
      { name: "name", label: "事项名称", placeholder: "例如：交换学分认定办理" },
      { name: "term", label: "对应学期", placeholder: "例如：2027 春季" },
      {
        name: "status",
        label: "事项类别",
        type: "select",
        options: [
          { label: "学分认定", value: "学分认定" },
          { label: "报销办理", value: "报销办理" },
          { label: "归国分享", value: "归国分享" },
          { label: "材料归档", value: "材料归档" },
        ],
        defaultValue: "学分认定",
      },
      { name: "evidence", label: "所需凭证", placeholder: "例如：成绩单、交流证明、发票" },
      { name: "notes", label: "补充说明", type: "textarea", rows: 4, placeholder: "记录要交的材料、窗口和时限。" },
    ],
    filters: [
      { key: "all", label: "全部", match: () => true },
      { key: "credit", label: "学分认定", match: (record) => record.status === "学分认定" },
      { key: "reimburse", label: "报销办理", match: (record) => record.status === "报销办理" },
      { key: "archive", label: "材料归档", match: (record) => record.status === "材料归档" },
    ],
    storageKey: "international_return_service_records",
    currentKey: "international_return_service_current_id",
    counterKey: "international_return_service_counter",
    events: createWorkspaceEvents("international-return-service"),
    botName: "归国服务助手",
    botIntro: "我可以帮你整理返校后的材料、手续和经验回流安排，避免漏交漏办。",
    assistantPrompts: [
      "帮我梳理学分认定材料",
      "把报销流程改成待办清单",
      "生成一份归国分享提纲",
    ],
    capabilities: [
      "学分认定办理",
      "报销归档推进",
      "材料归档提醒",
      "经验分享沉淀",
    ],
    deliverables: [
      "返校事项清单",
      "学分认定材料表",
      "报销流程待办",
      "归国分享提纲",
    ],
    relatedLinks: [
      { label: "文化培训", to: "/international/cultural-training" },
      { label: "申请总览", to: "/international/welcome-portal/ListPage" },
    ],
    buildRecord: (context) => {
      const name = text(context.payload.name, "未命名归国事项");
      const term = text(context.payload.term, "待定学期");
      const status = text(context.payload.status, "学分认定");
      const evidence = text(context.payload.evidence, "待补充凭证");
      const notes = text(context.payload.notes, "待补充说明");
      return buildRecord(context, {
        title: name,
        subtitle: `${term} · ${status}`,
        summary: notes,
        status,
        tags: [term, status],
        metrics: [
          { label: "对应学期", value: term },
          { label: "事项类别", value: status },
          { label: "所需凭证", value: evidence },
          { label: "办理状态", value: "待推进" },
        ],
        highlights: [
          "返校后优先处理学分认定和材料归档。",
          "报销和认定通常需要原件、签字和窗口确认。",
          "经验回流适合沉淀成分享稿和 FAQ。",
        ],
        nextSteps: [
          "确认返校后一周内的关键事项。",
          "核对是否需要原件与翻译件。",
          "整理交流经验用于后续培训或分享。",
        ],
        references: [
          { label: "对应学期", value: term },
          { label: "事项类别", value: status },
          { label: "所需凭证", value: evidence },
        ],
        content: buildMarkdown([
          { title: "事项说明", body: notes },
          {
            title: "办理信息",
            body: `- 对应学期：${term}\n- 事项类别：${status}\n- 所需凭证：${evidence}`,
          },
          {
            title: "执行清单",
            body: "- 准备交流证明、成绩单或发票\n- 确认经手窗口和时间要求\n- 归档所有材料的电子版与纸质版",
          },
          {
            title: "经验回流",
            body: "- 将交流经验整理成 10 分钟分享稿\n- 补充常见问题和建议\n- 沉淀为自己后续申请和分享可复用的资料",
          },
        ]),
      });
    },
  },
  {
    key: "international-writing-desk",
    title: "沟通与邮件助手",
    headline: "多语言沟通与邮件助手",
    subtitle: "双语邮件 · FAQ 通知 · 签证与住宿沟通",
    description: "支持中英双语邮件、通知、FAQ、导师联系、签证说明与住宿沟通写作。",
    icon: <MailOutlinedIcon />,
    routeBase: "/international/writing-desk",
    listTitle: "沟通草稿",
    listEmptyText: "暂无沟通草稿。",
    createModalTitle: "新建沟通草稿",
    createModalDescription: "适合统一维护中英双语邮件、通知 FAQ、住宿沟通和签证说明。",
    createButtonLabel: "新建草稿",
    searchPlaceholder: "搜索邮件、通知或 FAQ 草稿",
    createFields: [
      { name: "name", label: "草稿名称", placeholder: "例如：联系导师首封邮件" },
      { name: "recipient", label: "收件对象", placeholder: "例如：Prof. Lee / 国际处" },
      {
        name: "scenario",
        label: "沟通场景",
        type: "select",
        options: [
          { label: "项目问询", value: "项目问询" },
          { label: "导师联系", value: "导师联系" },
          { label: "签证说明", value: "签证说明" },
          { label: "住宿沟通", value: "住宿沟通" },
          { label: "FAQ / 通知", value: "FAQ / 通知" },
        ],
        defaultValue: "项目问询",
      },
      {
        name: "language",
        label: "输出语言",
        type: "select",
        options: [
          { label: "中文", value: "中文" },
          { label: "英文", value: "英文" },
          { label: "中英双语", value: "中英双语" },
        ],
        defaultValue: "英文",
      },
      {
        name: "status",
        label: "草稿状态",
        type: "select",
        options: [
          { label: "草拟中", value: "草拟中" },
          { label: "待润色", value: "待润色" },
          { label: "待发送", value: "待发送" },
          { label: "已发送", value: "已发送" },
        ],
        defaultValue: "草拟中",
      },
      { name: "deadline", label: "发送/提交截止", placeholder: "例如：2026-10-05" },
      { name: "keyPoints", label: "核心信息", type: "textarea", rows: 4, placeholder: "列出背景、要表达的重点、明确请求和附件信息。" },
    ],
    filters: [
      { key: "all", label: "全部", match: () => true },
      { key: "drafting", label: "草拟中", match: (record) => record.status === "草拟中" },
      { key: "revise", label: "待润色", match: (record) => record.status === "待润色" },
      { key: "send", label: "待发送", match: (record) => record.status === "待发送" },
    ],
    storageKey: "international_writing_desk_records",
    currentKey: "international_writing_desk_current_id",
    counterKey: "international_writing_desk_counter",
    events: createWorkspaceEvents("international-writing-desk"),
    botName: "沟通助手",
    botIntro: "我可以帮你生成中英双语邮件、FAQ、签证说明和住宿沟通草稿，并做发送前检查。",
    assistantPrompts: [
      "帮我生成一封双语邮件",
      "把这份 FAQ 改写成通知口吻",
      "检查发送前是否遗漏附件和请求",
    ],
    capabilities: [
      "中英双语邮件草拟",
      "FAQ 与通知改写",
      "事务沟通模板生成",
      "发送前终检",
    ],
    deliverables: [
      "导师联系邮件",
      "项目问询与签证说明",
      "住宿与校务沟通草稿",
      "发送前检查表",
    ],
    relatedLinks: [
      { label: "智能项目匹配与申请决策", to: "/international/matching-lab/ListPage" },
      { label: "来华支援助手", to: "/international/welcome-portal/ListPage" },
    ],
    buildRecord: (context) => {
      const name = text(context.payload.name, "未命名文书草稿");
      const recipient = text(context.payload.recipient, "待定对象");
      const scenario = text(context.payload.scenario, "项目问询");
      const language = text(context.payload.language, "英文");
      const deadline = text(context.payload.deadline, "待确认");
      const status = text(context.payload.status, "草拟中");
      const keyPoints = text(context.payload.keyPoints, "待补充核心信息");
      return buildRecord(context, {
        title: name,
        subtitle: `${scenario} · ${language}`,
        summary: keyPoints,
        status,
        tags: [recipient, scenario, language],
        metrics: [
          { label: "收件对象", value: recipient },
          { label: "沟通场景", value: scenario },
          { label: "输出语言", value: language },
          { label: "草稿状态", value: status },
          { label: "截止时间", value: deadline },
        ],
        highlights: [
          "邮件和通知不要只是翻译，要按对象和场景重新组织信息。",
          "明确请求、附件说明和 deadline，比堆砌背景更重要。",
          "FAQ / 通知类内容最好天然支持中英双语切换和复制复用。",
        ],
        nextSteps: [
          "先整理关键信息，再生成对应语种版本。",
          "检查附件、落款、联系人和时间表达。",
          "把常见场景沉淀成后续可复用模板。",
        ],
        references: [
          { label: "收件对象", value: recipient },
          { label: "沟通场景", value: scenario },
          { label: "截止时间", value: deadline },
          { label: "输出语言", value: language },
        ],
        tasks: [
          { id: "writing-1", title: "梳理必须表达的信息", detail: "明确背景、目标、请求、附件和 deadline。", done: status !== "草拟中", priority: "high" },
          { id: "writing-2", title: "生成对应语言版本", detail: "按中文、英文或双语输出一致内容。", done: status === "待发送" || status === "已发送", priority: "high" },
          { id: "writing-3", title: "完成发送前核对", detail: "检查称呼、附件、署名、链接和时间。", done: status === "已发送", priority: "medium" },
          { id: "writing-4", title: "沉淀可复用模板", detail: "把高频沟通场景纳入模板库。", done: false, priority: "medium" },
        ],
        milestones: [
          { id: "writing-m1", title: "关键信息收敛", summary: "明确要表达的背景、请求和附件。", date: deadline, status: status === "草拟中" ? "doing" : "done" },
          { id: "writing-m2", title: "语言与语气定稿", summary: "完成单语或双语版本润色。", date: deadline, status: status === "待润色" ? "doing" : status === "待发送" || status === "已发送" ? "done" : "todo" },
          { id: "writing-m3", title: "发送与回执跟踪", summary: "完成发送前检查和后续回执记录。", date: deadline, status: status === "待发送" ? "doing" : status === "已发送" ? "done" : "todo" },
        ],
        resources: [
          { id: "writing-r1", title: "沟通场景模板库", kind: "模板", summary: "包含导师联系、项目问询、签证说明和住宿沟通常用结构。" },
          { id: "writing-r2", title: "双语 FAQ 草稿", kind: "FAQ", summary: "适合沉淀个人或合作院校的高频问答。" },
          { id: "writing-r3", title: "发送前检查表", kind: "Checklist", summary: "用于核对附件、落款、日期、链接和请求表达。" },
        ],
        templates: [
          {
            id: "writing-template-email",
            title: "双语沟通邮件模板",
            summary: "适合项目问询、住宿沟通和签证说明。",
            content: "## 中文版\n- 称呼：\n- 背景：\n- 请求：\n- 附件：\n- 致谢：\n\n## English Version\n- Greeting:\n- Background:\n- Request:\n- Attachments:\n- Closing:\n",
          },
          {
            id: "writing-template-faq",
            title: "FAQ / 通知模板",
            summary: "适合高频事务说明与批量通知。",
            content: "## FAQ / Notice\n- 场景：\n- 适用对象：\n- 需要准备：\n- 时间安排：\n- 联系方式：\n",
          },
        ],
        quickActions: [
          { id: "writing-action-1", title: "生成双语邮件", description: "把当前草稿组织成中英双语邮件。", prompt: "请基于当前记录生成一封中英双语邮件，突出请求、deadline 和附件说明。", action: "append_template", templateId: "writing-template-email" },
          { id: "writing-action-2", title: "改写成 FAQ / 通知", description: "把当前信息改成通用友好的通知格式。", prompt: "把当前草稿改写成 FAQ / 通知格式，要求信息更直接、结构更清晰。", action: "append_template", templateId: "writing-template-faq" },
          { id: "writing-action-3", title: "执行发送前终检", description: "识别是否有遗漏项。", prompt: "检查当前草稿是否遗漏称呼、附件说明、deadline、联系人或 closing 信息。", action: "copy_prompt" },
        ],
        content: buildMarkdown([
          { title: "核心信息", body: keyPoints },
          {
            title: "草稿元信息",
            body: `- 收件对象：${recipient}\n- 沟通场景：${scenario}\n- 输出语言：${language}\n- 草稿状态：${status}\n- 截止时间：${deadline}`,
          },
          {
            title: "建议结构",
            body: "- 开头：身份 + 沟通目的\n- 中段：核心背景 + 明确请求\n- 结尾：附件说明 + deadline + 致谢",
          },
          {
            title: "发送前检查",
            body: "- 称呼与落款是否准确\n- 附件是否齐全\n- 时间、项目名和链接是否无误",
          },
        ]),
      });
    },
  },
];
