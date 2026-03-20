import React from "react";
import type { Feature } from "@/feature/ModuleHub";
import {
  EditOutlinedIcon,
  FileSearchOutlinedIcon,
  ReadOutlinedIcon,
  SearchOutlinedIcon,
  SlidersOutlinedIcon,
} from "@/ui/Icon";

type ModuleCatalogEntry = {
  key: string;
  title: string;
  shortLabel: string;
  desc: string;
  to: string;
  workspaceTo?: string;
  icon: React.ReactNode;
  badgeLabel: string;
  footerLabel: string;
  subLinks: Feature["subLinks"];
  landingHeadline: string;
  landingSubtitle: string;
  landingFeatures: Feature[];
};

export const researchModuleCatalog: ModuleCatalogEntry[] = [
  {
    key: "research-literature-search",
    title: "文献检索",
    shortLabel: "文献检索",
    desc: "检索式、筛选记录、主题聚类和论文移交。",
    to: "/research/literature-search",
    workspaceTo: "/research/literature-search/queries/new",
    icon: <SearchOutlinedIcon />,
    badgeLabel: "Search",
    footerLabel: "检索实验室",
    subLinks: [
      { label: "新建查询", to: "/research/literature-search/queries/new" },
      { label: "进入精读", to: "/research/paper-reader" },
      { label: "回填写作", to: "/research/paper-writing" },
    ],
    landingHeadline: "文献检索实验室",
    landingSubtitle: "围绕研究问题构造查询、筛选样本并把高价值论文移交给精读与写作。",
    landingFeatures: [
      {
        key: "query-builder",
        title: "查询构造器",
        desc: "管理数据库、关键词边界和纳排标准。",
        to: "/research/literature-search/queries/new",
        icon: <SearchOutlinedIcon />,
        badgeLabel: "Query",
        footerLabel: "开始检索",
      },
      {
        key: "screening",
        title: "筛选与主题簇",
        desc: "保存论文、记录筛选理由并总结主题簇。",
        to: "/research/literature-search",
        icon: <SlidersOutlinedIcon />,
        badgeLabel: "Screening",
        footerLabel: "筛选候选集",
      },
      {
        key: "handoff",
        title: "移交精读",
        desc: "把候选论文直接送到阅读桌面。",
        to: "/research/paper-reader",
        icon: <ReadOutlinedIcon />,
        badgeLabel: "Handoff",
        footerLabel: "进入精读",
      },
    ],
  },
  {
    key: "research-paper-reader",
    title: "论文精读",
    shortLabel: "论文精读",
    desc: "论文队列、结构化阅读卡、证据摘录和写作移交。",
    to: "/research/paper-reader",
    workspaceTo: "/research/paper-reader",
    icon: <ReadOutlinedIcon />,
    badgeLabel: "Reader",
    footerLabel: "阅读桌面",
    subLinks: [
      { label: "阅读桌面", to: "/research/paper-reader" },
      { label: "检索实验室", to: "/research/literature-search" },
      { label: "稿件工作室", to: "/research/paper-writing" },
    ],
    landingHeadline: "阅读桌面",
    landingSubtitle: "把精读、证据摘录、比较和写作移交放在一张桌面上完成。",
    landingFeatures: [
      {
        key: "structured-reading",
        title: "结构化阅读卡",
        desc: "整理问题、方法、实验与局限。",
        to: "/research/paper-reader",
        icon: <FileSearchOutlinedIcon />,
        badgeLabel: "Core",
        footerLabel: "结构化精读",
      },
      {
        key: "evidence-cards",
        title: "证据卡与比较",
        desc: "抽出关键证据并和比较队列联动。",
        to: "/research/paper-reader",
        icon: <SlidersOutlinedIcon />,
        badgeLabel: "Evidence",
        footerLabel: "沉淀论据",
      },
      {
        key: "handoff-writing",
        title: "回填写作",
        desc: "把精读结论直接带入论文草稿。",
        to: "/research/paper-writing",
        icon: <EditOutlinedIcon />,
        badgeLabel: "Writing",
        footerLabel: "进入写作",
      },
    ],
  },
  {
    key: "research-paper-writing",
    title: "论文写作",
    shortLabel: "论文写作",
    desc: "章节树、正文草稿、模板插入、引用与里程碑。",
    to: "/research/paper-writing",
    workspaceTo: "/research/paper-writing/drafts/new",
    icon: <EditOutlinedIcon />,
    badgeLabel: "Writing",
    footerLabel: "稿件工作室",
    subLinks: [
      { label: "新建草稿", to: "/research/paper-writing/drafts/new" },
      { label: "阅读桌面", to: "/research/paper-reader" },
      { label: "检索实验室", to: "/research/literature-search" },
    ],
    landingHeadline: "稿件工作室",
    landingSubtitle: "以章节、模板、引文和里程碑为骨架持续推进论文写作。",
    landingFeatures: [
      {
        key: "draft-editor",
        title: "草稿与章节树",
        desc: "直接管理摘要、章节与正文。",
        to: "/research/paper-writing/drafts/new",
        icon: <EditOutlinedIcon />,
        badgeLabel: "Draft",
        footerLabel: "开始写作",
      },
      {
        key: "templates",
        title: "模板与终检",
        desc: "插入模板并做投稿前检查。",
        to: "/research/paper-writing",
        icon: <SlidersOutlinedIcon />,
        badgeLabel: "Submit",
        footerLabel: "终检与导出",
      },
      {
        key: "citations",
        title: "引文与论据",
        desc: "把检索和精读结果挂接到草稿中。",
        to: "/research/paper-writing",
        icon: <FileSearchOutlinedIcon />,
        badgeLabel: "Argument",
        footerLabel: "组织论据",
      },
    ],
  },
];

export const researchHubFeatures: Feature[] = researchModuleCatalog.map((item) => ({
  key: item.key,
  title: item.title,
  desc: item.desc,
  to: item.to,
  icon: item.icon,
  badgeLabel: item.badgeLabel,
  footerLabel: item.footerLabel,
  subLinks: item.subLinks,
}));

export const researchHomeSubLinks = researchModuleCatalog.map((item) => ({
  label: item.shortLabel,
  to: item.to,
  icon: item.icon,
}));

export const getResearchModuleCatalogEntry = (key: string) => {
  const matched = researchModuleCatalog.find((item) => item.key === key);
  if (!matched) {
    throw new Error(`Unknown research module catalog key: ${key}`);
  }
  return matched;
};
