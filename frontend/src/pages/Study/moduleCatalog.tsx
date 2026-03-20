import React from "react";
import type { Feature } from "@/feature/ModuleHub";
import {
  BookOutlinedIcon,
  ReadOutlinedIcon,
  SlidersOutlinedIcon,
  TeamOutlinedIcon,
} from "@/ui/Icon";

type StudyModuleCatalogEntry = {
  key: string;
  title: string;
  shortLabel: string;
  desc: string;
  to: string;
  icon: React.ReactNode;
};

const entry = (
  value: StudyModuleCatalogEntry,
): StudyModuleCatalogEntry => value;

export const studyModuleCatalog: StudyModuleCatalogEntry[] = [
  entry({
    key: "study-resource-pack",
    title: "学科资源包",
    shortLabel: "资源包",
    desc: "学院分类、学科大类和招生专业分类三套入口。",
    to: "/study/resource-pack",
    icon: <BookOutlinedIcon />,
  }),
  entry({
    key: "study-progress-radar",
    title: "学业进度雷达",
    shortLabel: "进度雷达",
    desc: "培养方案匹配、风险课程和毕业路径偏离分析。",
    to: "/study/progress-radar",
    icon: <SlidersOutlinedIcon />,
  }),
  entry({
    key: "study-career-planner",
    title: "智能生涯规划",
    shortLabel: "生涯规划",
    desc: "对话生成大学阶段成长路径并沉淀关键节点。",
    to: "/study/career-planner",
    icon: <TeamOutlinedIcon />,
  }),
];

export const studyHubFeatures: Feature[] = studyModuleCatalog.map((item) => ({
  key: item.key,
  title: item.title,
  desc: item.desc,
  to: item.to,
  icon: item.icon,
}));

export const studyHomeSubLinks = studyModuleCatalog.map((item) => ({
  label: item.shortLabel,
  to: item.to,
  icon: item.icon,
}));

export const studyIcon = <ReadOutlinedIcon />;
