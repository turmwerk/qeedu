import React from "react";
import ModuleHub from "@/feature/ModuleHub";
import { internationalHomeSubLinks } from "@/pages/International/moduleCatalog";
import { managementHomeSubLinks, managementIcon } from "@/pages/Management/moduleCatalog";
import { researchHomeSubLinks } from "@/pages/Research/moduleCatalog";
import { studyHomeSubLinks, studyIcon } from "@/pages/Study/moduleCatalog";
import { teachingHomeSubLinks, teachingIcon } from "@/pages/Teaching/moduleCatalog";
import {
  getSearchEntriesByRoutePrefix,
} from "@/utils/search/global";
import {
  GlobalOutlinedIcon,
  TeamOutlinedIcon,
} from "@/ui/Icon";

const modules = [
  {
    key: "study",
    title: "助学",
    desc: "学科资源包、学业进度诊断与智能成长规划。",
    to: "/study",
    icon: studyIcon,
    subLinks: studyHomeSubLinks,
  },
  {
    key: "teaching",
    title: "助教",
    desc: "大纲生成、试卷设计与作业批改反馈。",
    to: "/teaching",
    icon: teachingIcon,
    subLinks: teachingHomeSubLinks,
  },
  {
    key: "research",
    title: "助研",
    desc: "文献检索、论文精读、写作推进与 deadline 管理。",
    to: "/research",
    icon: <TeamOutlinedIcon data-oid="ga65l.j" />,
    subLinks: researchHomeSubLinks,
  },
  {
    key: "management",
    title: "助管",
    desc: "事务处理、通知公告、材料管理、问答、看板与时间节点。",
    to: "/management",
    icon: managementIcon,
    subLinks: managementHomeSubLinks,
  },
  {
    key: "international",
    title: "国际交流",
    desc: "项目中心、智能匹配、流程推进、沟通、行前与来华支持。",
    to: "/international",
    icon: <GlobalOutlinedIcon data-oid="w1u7at2" />,
    subLinks: internationalHomeSubLinks,
  },
];

const FeatureHub: React.FC = () => {
  const features = React.useMemo(
    () => [
      { ...modules[0], searchIndex: getSearchEntriesByRoutePrefix("/study") },
      { ...modules[1], searchIndex: getSearchEntriesByRoutePrefix("/teaching") },
      { ...modules[2], searchIndex: getSearchEntriesByRoutePrefix("/research") },
      { ...modules[3], searchIndex: getSearchEntriesByRoutePrefix("/management") },
      { ...modules[4], searchIndex: getSearchEntriesByRoutePrefix("/international") },
    ],
    [],
  );

  return (
    <ModuleHub
      headline="启育·QeEdu"
      subtitle="面向高校全角色、全场景的 AI 原生智能体平台"
      features={features}
      gridCols="grid-cols-1 md:grid-cols-2 xl:grid-cols-3"
    />
  );
};

export default FeatureHub;
