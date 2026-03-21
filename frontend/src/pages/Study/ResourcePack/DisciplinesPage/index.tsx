import React from "react";
import ModuleHub from "@/feature/ModuleHub";
import { disciplineCatalog } from "../../resourceCatalog";
import { BookOutlinedIcon } from "@/ui/Icon";

const DisciplinesPage: React.FC = () => {
  return (
    <ModuleHub
      headline="按学科大类专业分类"
      subtitle="先按学科方法与知识结构筛选方向，再继续下钻到具体专业、关键词和已接通的资源入口"
      features={disciplineCatalog.map((discipline) => ({
        key: discipline.key,
        title: discipline.title,
        desc: `${discipline.desc} 适合先按学科气质筛选，再继续进入具体专业资源包；当前共 ${discipline.majors.length} 个专业入口。`,
        details: discipline.majors.slice(0, 4).map((major) => major.title),
        to: `/study/resource-pack/disciplines/${discipline.slug}`,
        icon: <BookOutlinedIcon />,
      }))}
      gridCols="grid-cols-1 md:grid-cols-2 xl:grid-cols-3"
      data-oid="discipline-page"
    />
  );
};

export default DisciplinesPage;
