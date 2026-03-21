import React from "react";
import ModuleHub from "@/feature/ModuleHub";
import {
  BankOutlinedIcon,
  BookOutlinedIcon,
  ReadOutlinedIcon,
} from "@/ui/Icon";
import { studyResourcePackSearchEntries } from "@/utils/search/global";

const resourcePackFeatures = [
  {
    key: "study-resource-pack-nju-schools",
    title: "按南京大学学院分类",
    desc: "从培养单位视角快速进入资源包，先确认学院定位，再继续查看本科专业、培养特色和后续可接入的学习资源。",
    details: ["学院定位", "本科专业", "培养特色", "资源入口"],
    to: "/study/resource-pack/nju-schools",
    icon: <BankOutlinedIcon />,
  },
  {
    key: "study-resource-pack-disciplines",
    title: "按学科大类专业分类",
    desc: "先按学科门类建立知识地图，再下钻到具体专业，适合从方法论、课程主线和能力标签三个方向开始浏览。",
    details: ["学科地图", "专业下钻", "能力标签", "课程主线"],
    to: "/study/resource-pack/disciplines",
    icon: <BookOutlinedIcon />,
  },
  {
    key: "study-resource-pack-admissions",
    title: "按招生专业分类",
    desc: "以本科招生专业类为索引组织入口，方便先看培养年限、分流方向和对应院系，再回到专业与学院页面继续对比。",
    details: ["培养年限", "分流方向", "对应院系", "横向对比"],
    to: "/study/resource-pack/admissions-categories",
    icon: <ReadOutlinedIcon />,
  },
];

const ResourcePackHub: React.FC = () => {
  const features = React.useMemo(
    () => [
      {
        ...resourcePackFeatures[0],
        searchIndex: studyResourcePackSearchEntries.filter((item) =>
          item.to.startsWith("/study/resource-pack/nju-schools"),
        ),
      },
      {
        ...resourcePackFeatures[1],
        searchIndex: studyResourcePackSearchEntries.filter((item) =>
          item.to.startsWith("/study/resource-pack/disciplines"),
        ),
      },
      {
        ...resourcePackFeatures[2],
        searchIndex: studyResourcePackSearchEntries.filter((item) =>
          item.to.startsWith("/study/resource-pack/admissions-categories"),
        ),
      },
    ],
    [],
  );

  return (
    <ModuleHub
      headline="学科资源包"
      subtitle="从学院、学科门类、招生专业类三个入口切入，再继续下钻到专业详情与相关资源"
      features={features}
      data-oid="resource-pack-hub"
    />
  );
};

export default ResourcePackHub;
