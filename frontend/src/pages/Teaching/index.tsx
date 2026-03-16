import React from "react";
import { FormOutlined, BookOutlined } from "@ant-design/icons";
import ModuleHub from "@/feature/ModuleHub";

const TeachingHub: React.FC = () => {
  return (
    <ModuleHub
      headline="助教模块可以帮你更高效备课与出题"
      subtitle="试卷设计 · 大纲生成 · 作业批改"
      features={[
        {
          key: "exam-design",
          title: "试卷设计",
          desc: "快速搭建题型组合并输出大题。",
          to: "/teaching/exam/ListPage",
          icon: <FormOutlined data-oid="u.yjbbr" />,
        },
        {
          key: "syllabus",
          title: "大纲生成",
          desc: "匹配教学目标与考核内容。",
          to: "/teaching/syllabus/ListPage",
          icon: <BookOutlined data-oid="_swv0qp" />,
        },
      ]}
      data-oid="ahxrm9d"
    />
  );
};

export default TeachingHub;
