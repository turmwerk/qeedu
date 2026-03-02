import React from "react";
import { LinkOutlined } from "@ant-design/icons";
import ModuleHub from "@/pages/shared/ModuleHub";
import type { Feature } from "@/pages/shared/ModuleHub";
import Card from "@/components/Card";
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
  <ModuleHub
    headline="常用网站"
    subtitle="编程练习 · 开源社区 · AI 前沿"
    features={COMMON_SITES}
    renderFeature={renderSite}
    gridCols="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
  />
);

export default CommonSection;
