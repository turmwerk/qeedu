import React from "react";
import ModuleHub from "@/feature/ModuleHub";
import { admissionsCategoryCatalog } from "../../resourceCatalog";
import { ReadOutlinedIcon } from "@/ui/Icon";

const AdmissionsCategoriesPage: React.FC = () => {
  return (
    <ModuleHub
      headline="按招生专业分类"
      subtitle="先保留 2025 年本科招生专业类完整路由与分流数据"
      features={admissionsCategoryCatalog.map((category) => ({
        key: category.key,
        title: category.title,
        desc: `${category.duration} 年制 · ${category.tracks.length} 个分流专业/方向`,
        to: `/study/resource-pack/admissions-categories/${category.slug}`,
        icon: <ReadOutlinedIcon />,
      }))}
      gridCols="grid-cols-1 md:grid-cols-2 xl:grid-cols-3"
      data-oid="admissions-category-page"
    />
  );
};

export default AdmissionsCategoriesPage;
