import React from "react";
import { LinkOutlined } from "@ant-design/icons";
import ModuleHub from "@/feature/ModuleHub";
import type { Feature } from "@/feature/ModuleHub";
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
      headline="甯哥敤缃戠珯"
      subtitle="缂栫▼缁冧範 路 寮€婧愮ぞ鍖?路 AI 鍓嶆部"
      features={COMMON_SITES}
      renderFeature={renderSite}
      gridCols="grid-cols-2 lg:grid-cols-3"
    />
  </div>
);

export default CommonSection;
