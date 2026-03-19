import React from "react";
import ModuleHub from "@/feature/ModuleHub";
import { researchHomeSubLinks } from "@/pages/Research/moduleCatalog";
import { internationalHomeSubLinks } from "@/pages/International/moduleCatalog";
import {
  BookOutlinedIcon,
  BuildOutlinedIcon,
  CodeOutlinedIcon,
  ControlOutlinedIcon,
  ExperimentOutlinedIcon,
  FormOutlinedIcon,
  GlobalOutlinedIcon,
  NotificationOutlinedIcon,
  ReadOutlinedIcon,
  TeamOutlinedIcon,
} from "@/ui/Icon";

const modules = [
  {
    key: "study",
    title: "助学",
    desc: "自学导航、练习计划、随问随答。",
    to: "/study",
    icon: <ReadOutlinedIcon data-oid="r9i6-at" />,
    subLinks: [
      { label: "编程辅导", to: "/study/code-tutor", icon: <CodeOutlinedIcon /> },
    ],
  },
  {
    key: "teaching",
    title: "助教",
    desc: "试卷生成、大纲设计、作业批改与反馈。",
    to: "/teaching",
    icon: <ExperimentOutlinedIcon data-oid="4hschjv" />,
    subLinks: [
      { label: "大纲设计", to: "/teaching/syllabus/ListPage", icon: <BookOutlinedIcon /> },
      { label: "试卷设计", to: "/teaching/exam/ListPage", icon: <FormOutlinedIcon /> },
    ],
  },
  {
    key: "research",
    title: "助研",
    desc: "文献检索、论文精读、写作推进与投稿准备。",
    to: "/research",
    icon: <TeamOutlinedIcon data-oid="ga65l.j" />,
    subLinks: researchHomeSubLinks,
  },
  {
    key: "management",
    title: "助管",
    desc: "班级管理、通知发布、资料归档与跟进。",
    to: "/management",
    icon: <ControlOutlinedIcon data-oid="5f1:ofq" />,
    subLinks: [
      { label: "专业建设", to: "/management/major", icon: <BuildOutlinedIcon /> },
      { label: "政策响应", to: "/management/policy", icon: <NotificationOutlinedIcon /> },
    ],
  },
  {
    key: "international",
    title: "国际交流",
    desc: "项目申请、流程推进、派出支持、在外服务与归国沉淀。",
    to: "/international",
    icon: <GlobalOutlinedIcon data-oid="w1u7at2" />,
    subLinks: internationalHomeSubLinks,
  },
];

const FeatureHub: React.FC = () => {
  return (
    <ModuleHub
      headline="nju-edu-ai-system"
      subtitle="南京大学教育AI"
      features={modules}
      gridCols="grid-cols-2 xl:grid-cols-3"
    />
  );
};

export default FeatureHub;
