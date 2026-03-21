import React from "react";
import ModuleHub from "@/feature/ModuleHub";
import { njuSchoolCatalog } from "../../resourceCatalog";
import { BankOutlinedIcon } from "@/ui/Icon";

const NJUSchoolsPage: React.FC = () => {
  return (
    <ModuleHub
      headline="按南京大学学院分类"
      subtitle="每个学院都给出不同的学科特色与引导词，方便先按培养单位建立整体认知，再继续下钻"
      features={njuSchoolCatalog.map((school) => ({
        key: school.key,
        title: school.title,
        desc: school.desc,
        details: school.details,
        to: `/study/resource-pack/nju-schools/${school.slug}`,
        icon: <BankOutlinedIcon />,
      }))}
      gridCols="grid-cols-1 md:grid-cols-2 xl:grid-cols-3"
      data-oid="nju-schools-page"
    />
  );
};

export default NJUSchoolsPage;
