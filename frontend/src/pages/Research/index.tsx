import React from "react";
import { TeamOutlined } from "@ant-design/icons";
import ModuleHub from "@/components/ModuleHub";

const ResearchHub: React.FC = () => {
  return (
    <ModuleHub
      headline="助研模块可以帮你更高效推进科研协作"
      subtitle="课题协作 · 文献整理 · 进度跟踪"
      features={[ 
        {
          key: "collaboration",
          title: "科研协作",
          desc: "协同沟通、任务对齐、材料归档。",
          to: "/research/collaboration",
          icon: <TeamOutlined data-oid="1ux_w27" />,
        },
      ]}
      data-oid="zl63wec"
    />
  );
};

export default ResearchHub;
