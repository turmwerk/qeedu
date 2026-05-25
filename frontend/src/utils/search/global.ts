import { internationalModuleCatalog } from "@/pages/International/moduleCatalog";
import { managementModuleCatalog } from "@/pages/Management/moduleCatalog";
import { researchModuleCatalog } from "@/pages/Research/moduleCatalog";
import {
  admissionsCategoryCatalog,
  disciplineCatalog,
  njuSchoolCatalog,
} from "@/pages/Study/resourceCatalog";
import { studyModuleCatalog } from "@/pages/Study/moduleCatalog";
import { teachingModuleCatalog } from "@/pages/Teaching/moduleCatalog";

export type GlobalSearchEntry = {
  key: string;
  title: string;
  desc: string;
  to: string;
  kind: "module" | "page";
  scope: string;
  keywords?: string[];
};

const unique = (values: Array<string | undefined>) =>
  Array.from(new Set(values.filter((value): value is string => Boolean(value))));

const flattenEntryKeywords = (entries: GlobalSearchEntry[]) =>
  unique(
    entries.flatMap((entry) => [
      entry.title,
      entry.desc,
      entry.scope,
      ...(entry.keywords ?? []),
    ]),
  );

const buildModulePageEntry = (
  key: string,
  title: string,
  desc: string,
  to: string,
  scope: string,
  keywords: Array<string | undefined> = [],
): GlobalSearchEntry => ({
  key,
  title,
  desc,
  to,
  kind: "page",
  scope,
  keywords: unique(keywords),
});

export const studyResourcePackSearchEntries: GlobalSearchEntry[] = [
  {
    key: "study-resource-pack-home",
    title: "学科资源包",
    desc: "从学院、学科门类、招生专业类三个入口切入，再继续下钻到专业详情与相关资源。",
    to: "/study/resource-pack",
    kind: "module",
    scope: "助学 / 学科资源包",
    keywords: ["资源包", "学院入口", "学科地图", "招生分类", "专业详情"],
  },
  {
    key: "study-resource-pack-nju-schools",
    title: "按南京大学学院分类",
    desc: "从培养单位视角快速进入资源包，先确认学院定位，再继续查看本科专业、培养特色和后续可接入的学习资源。",
    to: "/study/resource-pack/nju-schools",
    kind: "page",
    scope: "助学 / 学科资源包",
    keywords: ["学院分类", "学院入口", "本科专业", "培养特色", "资源入口"],
  },
  {
    key: "study-resource-pack-disciplines",
    title: "按学科大类专业分类",
    desc: "先按学科门类建立知识地图，再下钻到具体专业。",
    to: "/study/resource-pack/disciplines",
    kind: "page",
    scope: "助学 / 学科资源包",
    keywords: ["学科地图", "专业下钻", "能力标签", "课程主线"],
  },
  {
    key: "study-resource-pack-admissions",
    title: "按招生专业分类",
    desc: "先看培养年限、分流方向和对应院系，再回到专业与学院页面继续对比。",
    to: "/study/resource-pack/admissions-categories",
    kind: "page",
    scope: "助学 / 学科资源包",
    keywords: ["招生分类", "培养年限", "分流方向", "对应院系", "横向对比"],
  },
  ...njuSchoolCatalog.map((school) => ({
    key: school.key,
    title: school.title,
    desc: school.desc,
    to: `/study/resource-pack/nju-schools/${school.slug}`,
    kind: "page" as const,
    scope: "助学 / 学科资源包 / 学院",
    keywords: unique([
      ...school.details,
      ...(school.aliases ?? []),
      ...(school.relatedLinks?.map((item) => item.label) ?? []),
    ]),
  })),
  ...disciplineCatalog.flatMap((discipline) => [
    {
      key: discipline.key,
      title: discipline.title,
      desc: discipline.desc,
      to: `/study/resource-pack/disciplines/${discipline.slug}`,
      kind: "page" as const,
      scope: "助学 / 学科资源包 / 学科",
      keywords: unique(discipline.majors.map((major) => major.title)),
    },
    ...discipline.majors.map((major) => ({
      key: major.key,
      title: major.title,
      desc: major.desc,
      to: `/study/resource-pack/disciplines/${discipline.slug}/${major.slug}`,
      kind: "page" as const,
      scope: `助学 / 学科资源包 / ${discipline.title}`,
      keywords: unique([
        discipline.title,
        ...(major.tags ?? []),
        ...(major.relatedLinks?.map((item) => item.label) ?? []),
      ]),
    })),
  ]),
  ...admissionsCategoryCatalog.map((category) => ({
    key: category.key,
    title: category.title,
    desc: `${category.duration} 年制，共 ${category.tracks.length} 条分流专业或培养方向。`,
    to: `/study/resource-pack/admissions-categories/${category.slug}`,
    kind: "page" as const,
    scope: "助学 / 学科资源包 / 招生专业类",
    keywords: unique([
      category.duration,
      ...category.tracks.flatMap((track) => [track.title, ...track.schools]),
    ]),
  })),
];

export const studyModuleSearchEntries: GlobalSearchEntry[] = [
  {
    key: "study-home",
    title: "助学",
    desc: "学科资源包、学业进度诊断与智能成长规划。",
    to: "/study",
    kind: "module",
    scope: "首页模块",
    keywords: unique([
      ...studyModuleCatalog.map((item) => item.title),
      ...flattenEntryKeywords(studyResourcePackSearchEntries),
      "编程辅导",
      "Code Tutor",
    ]),
  },
  ...studyModuleCatalog.map((item) => ({
    key: item.key,
    title: item.title,
    desc: item.desc,
    to: item.to,
    kind: "module" as const,
    scope: "助学",
    keywords: unique([
      item.shortLabel,
      ...item.details,
      ...(item.key === "study-resource-pack"
        ? flattenEntryKeywords(studyResourcePackSearchEntries)
        : []),
    ]),
  })),
  {
    key: "study-code-tutor",
    title: "编程辅导",
    desc: "编程项目列表、练习入口和代码学习工作台。",
    to: "/study/code-tutor/ListPage",
    kind: "page",
    scope: "助学",
    keywords: ["代码辅导", "Code Tutor", "项目列表", "编程练习", "程序设计"],
  },
  ...studyResourcePackSearchEntries,
];

export const teachingSearchEntries: GlobalSearchEntry[] = [
  {
    key: "teaching-home",
    title: "助教",
    desc: "大纲生成、试卷设计与作业批改反馈。",
    to: "/teaching",
    kind: "module",
    scope: "首页模块",
    keywords: teachingModuleCatalog.map((item) => item.title),
  },
  ...teachingModuleCatalog.map((item) => ({
    key: item.key,
    title: item.title,
    desc: item.desc,
    to: item.to,
    kind: "module" as const,
    scope: "助教",
    keywords: [item.shortLabel],
  })),
  buildModulePageEntry(
    "teaching-syllabus-page",
    "大纲生成页面",
    "课程目标、学时结构与考核方式的编排页。",
    "/teaching/syllabus/ListPage",
    "助教 / 大纲生成",
    ["教学大纲", "课程大纲", "课程设计", "学时结构", "考核方式"],
  ),
  buildModulePageEntry(
    "teaching-exam-page",
    "试卷设计页面",
    "题型结构、题目池与预览导出的设计页。",
    "/teaching/exam/ListPage",
    "助教 / 试卷设计",
    ["出题", "组卷", "题目池", "预览导出", "考试设计"],
  ),
  buildModulePageEntry(
    "teaching-assignment-review-page",
    "作业批改页面",
    "批改任务、Rubric 和反馈草稿的工作页。",
    "/teaching/assignment-review",
    "助教 / 作业批改与反馈",
    ["批改任务", "rubric", "反馈草稿", "学生订正", "作业反馈"],
  ),
];

export const researchSearchEntries: GlobalSearchEntry[] = [
  {
    key: "research-home",
    title: "助研",
    desc: "文献检索、论文精读、写作推进与 deadline 管理。",
    to: "/research",
    kind: "module",
    scope: "首页模块",
    keywords: researchModuleCatalog.map((item) => item.title),
  },
  {
    key: "research-conference-list",
    title: "会议列表",
    desc: "会议信息、deadline 和时间节点总览。",
    to: "/research/conference-list",
    kind: "page",
    scope: "助研",
    keywords: ["conference", "deadline", "会议截止", "时间节点"],
  },
  ...researchModuleCatalog.flatMap((item) => [
    {
      key: item.key,
      title: item.title,
      desc: item.desc,
      to: item.to,
      kind: "module" as const,
      scope: "助研",
      keywords: unique([
        item.shortLabel,
        item.badgeLabel,
        item.footerLabel,
        item.landingHeadline,
        ...item.landingFeatures.map((feature) => feature.title),
      ]),
    },
    ...item.landingFeatures.map((feature) => ({
      key: `${item.key}-${feature.key}`,
      title: feature.title,
      desc: feature.desc,
      to: feature.to ?? item.to,
      kind: "page" as const,
      scope: `助研 / ${item.title}`,
      keywords: unique([
        feature.badgeLabel,
        feature.footerLabel,
        feature.ctaLabel,
        ...(feature.subLinks?.map((link) => link.label) ?? []),
      ]),
    })),
  ]),
];

export const managementSearchEntries: GlobalSearchEntry[] = [
  {
    key: "management-home",
    title: "助管",
    desc: "事务处理、通知公告、材料管理、问答、看板与时间节点。",
    to: "/management",
    kind: "module",
    scope: "首页模块",
    keywords: managementModuleCatalog.map((item) => item.title),
  },
  ...managementModuleCatalog.map((item) => ({
    key: item.key,
    title: item.title,
    desc: item.desc,
    to: item.to,
    kind: "module" as const,
    scope: "助管",
    keywords: [item.shortLabel],
  })),
  buildModulePageEntry(
    "management-process-assistant-page",
    "事务处理页面",
    "审批流程、办理步骤与材料清单的事务页。",
    "/management/process-assistant",
    "助管 / 事务处理助手",
    ["审批流程", "办理步骤", "材料清单", "流程办理"],
  ),
  buildModulePageEntry(
    "management-announcement-generator-page",
    "通知公告页面",
    "通知与公告生成、润色和多渠道改写页面。",
    "/management/announcement-generator",
    "助管 / 通知与公告生成",
    ["通知公告", "公告生成", "文案润色", "多渠道通知"],
  ),
  buildModulePageEntry(
    "management-materials-center-page",
    "材料管理页面",
    "材料提交、模板归档与状态追踪页面。",
    "/management/materials-center",
    "助管 / 材料与表单管理",
    ["材料表单", "模板归档", "状态追踪", "提交材料"],
  ),
  buildModulePageEntry(
    "management-student-qa-page",
    "学生问答页面",
    "高频答疑、知识沉淀与回复入口页面。",
    "/management/student-qa",
    "助管 / 学生问答助手",
    ["学生问答", "答疑", "高频问题", "知识库"],
  ),
  buildModulePageEntry(
    "management-dashboard-page",
    "数据看板页面",
    "人数、完成率与进度分布的统计页面。",
    "/management/dashboard",
    "助管 / 数据统计与看板",
    ["数据看板", "统计分析", "完成率", "进度分布"],
  ),
  buildModulePageEntry(
    "management-timeline-page",
    "时间节点页面",
    "DDL、面试与补件提醒的节点编排页面。",
    "/management/timeline",
    "助管 / 时间节点管理",
    ["时间节点", "DDL", "补件提醒", "节点编排"],
  ),
];

export const internationalSearchEntries: GlobalSearchEntry[] = [
  {
    key: "international-home",
    title: "国际交流",
    desc: "项目中心、智能匹配、流程推进、沟通、行前与来华支持。",
    to: "/international",
    kind: "module",
    scope: "首页模块",
    keywords: internationalModuleCatalog.map((item) => item.title),
  },
  ...internationalModuleCatalog.flatMap((item) => [
    {
      key: item.key,
      title: item.title,
      desc: item.desc,
      to: item.to,
      kind: "module" as const,
      scope: "国际交流",
      keywords: unique([
        item.shortLabel,
        item.badgeLabel,
        item.footerLabel,
        item.landingHeadline,
        ...item.landingFeatures.map((feature) => feature.title),
      ]),
    },
    ...item.landingFeatures.map((feature) => ({
      key: `${item.key}-${feature.key}`,
      title: feature.title,
      desc: feature.desc,
      to: feature.to ?? item.to,
      kind: "page" as const,
      scope: `国际交流 / ${item.title}`,
      keywords: unique([
        feature.badgeLabel,
        feature.footerLabel,
        feature.ctaLabel,
        ...(feature.subLinks?.map((link) => link.label) ?? []),
      ]),
    })),
  ]),
];

export const homeSearchEntries: GlobalSearchEntry[] = [
  {
    key: "home-page",
    title: "首页",
    desc: "面向高校全角色、全场景的 AI 原生智能体平台首页功能总览。",
    to: "/",
    kind: "page",
    scope: "全局",
    keywords: ["功能总览", "模块入口", "Qeedu", "启育"],
  },
];

export const globalSearchEntries: GlobalSearchEntry[] = [
  ...homeSearchEntries,
  ...studyModuleSearchEntries,
  ...teachingSearchEntries,
  ...researchSearchEntries,
  ...managementSearchEntries,
  ...internationalSearchEntries,
];

export const getSearchEntriesByRoutePrefix = (prefix: string) =>
  globalSearchEntries.filter((entry) => entry.to.startsWith(prefix));
