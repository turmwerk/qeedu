import React from "react";
import { LinkOutlined } from "@ant-design/icons";
import ModuleHub from "@/feature/ModuleHub";
import type { Feature } from "@/feature/ModuleHub/types";
import Card from "@/ui/Card";
import {
  ADAPTATION_CARDS,
  type AdaptationCardItem,
} from "./data/adaptation";

const renderCard = (item: Feature) => {
  const card = item as AdaptationCardItem;
  const Icon = card.iconComponent;
  return (
    <Card
      iconLayout="stacked"
      icon={<Icon />}
      title={card.title}
      desc={card.desc}
      level={card.badgeLabel}
      badge="text-[#047857] bg-[#d1fae5]"
      darkBadge="text-[#6ee7b7] bg-[#064e3b]/60"
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

const gridCols =
  ADAPTATION_CARDS.length === 4 ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";

const AdaptationSection: React.FC = () => (
  <div className="w-full min-w-0 overflow-x-hidden">
    <ModuleHub
      headline="适应与支持"
      subtitle="文化适应 · 生活 FAQ · 支持入口"
      features={ADAPTATION_CARDS}
      renderFeature={renderCard}
      gridCols={gridCols}
    />
  </div>
);

export default AdaptationSection;
