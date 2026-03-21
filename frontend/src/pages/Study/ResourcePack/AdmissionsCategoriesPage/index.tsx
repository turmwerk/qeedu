import React from "react";
import ModuleHub from "@/feature/ModuleHub";
import { admissionsCategoryCatalog } from "../../resourceCatalog";
import { ReadOutlinedIcon } from "@/ui/Icon";

const compactTrackTitle = (value: string) =>
  value.replace(/（[^）]*）/g, "").trim();

const AdmissionsCategoriesPage: React.FC = () => {
  return (
    <ModuleHub
      headline="按招生专业分类"
      subtitle="先看培养年限、分流专业和对应院系，再回到学院页与学科页做横向对比"
      features={admissionsCategoryCatalog.map((category) => ({
        key: category.key,
        title: category.title,
        desc: `${category.duration} 年制，覆盖 ${category.tracks.length} 个分流专业或培养方向，适合继续对比培养院系、专业走向与资源入口。`,
        details: Array.from(
          new Set(category.tracks.map((track) => compactTrackTitle(track.title))),
        ).slice(0, 4),
        to: `/study/resource-pack/admissions-categories/${category.slug}`,
        icon: <ReadOutlinedIcon />,
      }))}
      gridCols="grid-cols-1 md:grid-cols-2 xl:grid-cols-3"
      data-oid="admissions-category-page"
    />
  );
};

export default AdmissionsCategoriesPage;
