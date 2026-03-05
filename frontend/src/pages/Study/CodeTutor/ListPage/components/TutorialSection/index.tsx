import React from "react";
import ModuleHub from "@/components/ModuleHub";
import type { Feature } from "@/components/ModuleHub";
import Card from "@/components/Card";
import { TUTORIALS, LEVEL_BADGE } from "./data/tutorials";
import type { TutorialItem } from "./data/tutorials";

const renderTutorial = (item: Feature) => {
  const tut = item as TutorialItem;
  const badge = LEVEL_BADGE[tut.level];
  return (
    <Card
      iconLayout="stacked"
      icon={tut.icon}
      title={tut.title}
      desc={tut.desc}
      level={tut.level}
      badge={badge.light}
      darkBadge={badge.dark}
      lang={tut.lang}
      time={tut.time}
      showArrow
    />
  );
};

const TutorialSection: React.FC = () => (
  <ModuleHub
    headline="入门教程"
    subtitle="基础语法 · 面向对象 · 数据结构 · 算法入门"
    features={TUTORIALS}
    renderFeature={renderTutorial}
    gridCols="grid-cols-2 lg:grid-cols-3"
  />
);

export default TutorialSection;
