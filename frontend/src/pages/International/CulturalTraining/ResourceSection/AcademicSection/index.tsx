import React from "react";
import { LinkOutlined } from "@ant-design/icons";
import ModuleHub from "@/feature/ModuleHub";
import type { Feature } from "@/feature/ModuleHub/types";
import Card from "@/ui/Card";
import {
  ACADEMIC_CARDS,
  type AcademicCardItem,
} from "./data/academics";

const renderCard = (item: Feature) => {
  const card = item as AcademicCardItem;
  const Icon = card.iconComponent;
  return (
    <Card
      iconLayout="stacked"
      icon={<Icon />}
      title={card.title}
      desc={card.desc}
      level={card.badgeLabel}
      badge="text-[#1d4ed8] bg-[#dbeafe]"
      darkBadge="text-[#bfdbfe] bg-[#1e3a8a]/60"
      subLinks={[
        {
          label: card.linkLabel,
          icon: <LinkOutlined />,
          onClick: () => window.open(card.url, "_blank"),
        },
      ]}
    />
  );
};

const gridCols = ACADEMIC_CARDS.length === 4 ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-2 lg:grid-cols-4";

const AcademicSection: React.FC = () => (
  <div className="w-full min-w-0 overflow-x-hidden">
    <ModuleHub
      headline="学术与课堂"
      subtitle="学术礼仪 · 课堂参与 · 邮件表达 · 学术诚信"
      features={ACADEMIC_CARDS}
      renderFeature={renderCard}
      gridCols={gridCols}
    />
  </div>
);

export default AcademicSection;
