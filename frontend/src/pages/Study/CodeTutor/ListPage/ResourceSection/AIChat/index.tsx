import React from "react";
import { LinkOutlined } from "@ant-design/icons";
import ModuleHub from "@/feature/ModuleHub";
import type { Feature } from "@/feature/ModuleHub/types";
import Card from "@/ui/Card";
import { AI_CHAT_SITES } from "./data/sites";
import type { AIChatSiteItem } from "./data/sites";

const renderSite = (item: Feature) => {
  const site = item as AIChatSiteItem;
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

const AIChatSection: React.FC = () => (
  <div className="w-full min-w-0 overflow-x-hidden">
    <ModuleHub
      headline="AI聊天网站"
      subtitle="精选的AI聊天资源，助你轻松获取AI的强大功能"
      features={AI_CHAT_SITES}
      renderFeature={renderSite}
      gridCols="grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
    />
  </div>
);

export default AIChatSection;
