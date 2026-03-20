import React from "react";
import ModuleHub from "@/feature/ModuleHub";
import {
  BankOutlinedIcon,
  BookOutlinedIcon,
  ReadOutlinedIcon,
} from "@/ui/Icon";

const resourcePackFeatures = [
  {
    key: "study-resource-pack-nju-schools",
    title: "按南京大学学院分类",
    desc: "先提供学院维度的完整入口与路由，后续逐步补齐学院内专业与资源内容。",
    to: "/study/resource-pack/nju-schools",
    icon: <BankOutlinedIcon />,
  },
  {
    key: "study-resource-pack-disciplines",
    title: "按学科大类专业分类",
    desc: "按学科门类查看专业资源，覆盖 sample 中全部学科与专业细分路由。",
    to: "/study/resource-pack/disciplines",
    icon: <BookOutlinedIcon />,
  },
  {
    key: "study-resource-pack-admissions",
    title: "按招生专业分类",
    desc: "以 2025 年本科招生专业类为索引保留完整路由和分流专业数据结构。",
    to: "/study/resource-pack/admissions-categories",
    icon: <ReadOutlinedIcon />,
  },
];

const ResourcePackHub: React.FC = () => {
  return (
    <ModuleHub
      headline="学科资源包"
      subtitle="学院分类 · 学科大类专业分类 · 招生专业分类"
      features={resourcePackFeatures}
      data-oid="resource-pack-hub"
    />
  );
};

export default ResourcePackHub;
