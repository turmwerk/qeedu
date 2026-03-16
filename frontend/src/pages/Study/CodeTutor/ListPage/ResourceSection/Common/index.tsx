import React from "react";
import { LinkOutlined } from "@ant-design/icons";
import ModuleHub from "@/feature/ModuleHub";
import type { Feature } from "@/feature/ModuleHub/types";
import Card from "@/ui/Card";
import { COMMON_SITES } from "./data/sites";
import type { CommonSiteItem } from "./data/sites";

const renderSite = (item: Feature) => {
  const site = item as CommonSiteItem;
  return (
    <Card
      iconLayout="stacked"
      icon={site.icon}
      title={site.title}
      desc={site.desc}
      subLinks={[
        {
          label: site.linkLabel,
          icon: <LinkOutlined />,
          onClick: () => window.open(site.url, "_blank"),
        },
      ]}
    />
  );
};

const CommonSection: React.FC = () => (
  <div className="w-full min-w-0 overflow-x-hidden">
    <ModuleHub
      headline="常用网站"
      subtitle="编程练习 · 开源社区 · AI 前沿"
      features={COMMON_SITES}
      renderFeature={renderSite}
      gridCols="grid-cols-2 lg:grid-cols-3"
    />
  </div>
);

export default CommonSection;
