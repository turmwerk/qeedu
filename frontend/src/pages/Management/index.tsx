import React from "react";
import { BuildOutlined, NotificationOutlined } from "@ant-design/icons";
import ModuleHub from "@/pages/shared/ModuleHub";

const ManagementHub: React.FC = () => {
  return (
    <ModuleHub
      headline="助管模块可以帮你更高效完成教学管理"
      subtitle="班级管理 · 通知发布 · 资料归档"
      placeholder="你想怎么用助管？例如：通知发布 / 资料归档"
      features={[
        {
          key: "major-construct",
          title: "专业建设",
          desc: "培养方案优化与课程体系建设。",
          to: "/management/major",
          icon: <BuildOutlined data-oid="uw2stnm" />,
        },
        {
          key: "policy-response",
          title: "政策响应",
          desc: "政策解读、要求落实与跟进。",
          to: "/management/policy",
          icon: <NotificationOutlined data-oid="ytwgwpq" />,
        },
      ]}
      data-oid="yj.85pj"
    />
  );
};

export default ManagementHub;
