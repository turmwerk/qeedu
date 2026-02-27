import React from "react";
import ModuleHub from "@/pages/shared/ModuleHub";
import {
  ReadOutlined,
  ExperimentOutlined,
  ControlOutlined,
  TeamOutlined,
  CodeOutlined,
  BookOutlined,
  FormOutlined,
  BuildOutlined,
  NotificationOutlined,
} from "@ant-design/icons";

const modules = [
  {
    key: "study",
    title: "助学",
    desc: "自学导航、练习计划、随问随答。",
    to: "/study",
    icon: <ReadOutlined data-oid="r9i6-at" />,
    subLinks: [
      { label: "编程辅导", to: "/study/code-tutor", icon: <CodeOutlined /> },
    ],
  },
  {
    key: "teaching",
    title: "助教",
    desc: "试卷生成、大纲设计、作业批改与反馈。",
    to: "/teaching",
    icon: <ExperimentOutlined data-oid="4hschjv" />,
    subLinks: [
      { label: "大纲设计", to: "/teaching/syllabus/ListPage", icon: <BookOutlined /> },
      { label: "试卷设计", to: "/teaching/exam/ListPage", icon: <FormOutlined /> },
    ],
  },
  {
    key: "research",
    title: "助研",
    desc: "科研协作、资料整理、进度跟踪。",
    to: "/research",
    icon: <TeamOutlined data-oid="ga65l.j" />,
    subLinks: [
      { label: "科研协作", to: "/research/collaboration", icon: <TeamOutlined /> },
    ],
  },
  {
    key: "management",
    title: "助管",
    desc: "班级管理、通知发布、资料归档与跟进。",
    to: "/management",
    icon: <ControlOutlined data-oid="5f1:ofq" />,
    subLinks: [
      { label: "专业建设", to: "/management/major", icon: <BuildOutlined /> },
      { label: "政策响应", to: "/management/policy", icon: <NotificationOutlined /> },
    ],
  },
];

const FeatureHub: React.FC = () => {
  return (
    <ModuleHub
      headline="nju-edu-ai-system"
      subtitle="南京大学教育AI"
      features={modules}
    />
  );
};

export default FeatureHub;
