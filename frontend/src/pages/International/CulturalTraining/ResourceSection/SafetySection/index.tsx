import React from "react";
import { LinkOutlined } from "@ant-design/icons";
import ModuleHub from "@/feature/ModuleHub";
import type { Feature } from "@/feature/ModuleHub/types";
import Card from "@/ui/Card";
import {
  SAFETY_CARDS,
  type SafetyCardItem,
} from "./data/safety";

const renderCard = (item: Feature) => {
  const card = item as SafetyCardItem;
  const Icon = card.iconComponent;
  return (
    <Card
      iconLayout="stacked"
      icon={<Icon />}
      title={card.title}
      desc={card.desc}
      level={card.badgeLabel}
      badge="text-[#b45309] bg-[#ffedd5]"
      darkBadge="text-[#fdba74] bg-[#7c2d12]/60"
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

const SafetySection: React.FC = () => (
  <div className="w-full min-w-0 overflow-x-hidden">
    <ModuleHub
      headline="当地法律与安全"
      subtitle="法律须知 · 安全事项 · 应急联系"
      features={SAFETY_CARDS}
      renderFeature={renderCard}
      gridCols="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
    />
  </div>
);

export default SafetySection;
