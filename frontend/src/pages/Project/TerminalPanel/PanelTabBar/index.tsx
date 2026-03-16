import React from "react";
import TabBar, { type TabBarProps } from "@/ui/TabBar";

const PanelTabBar: React.FC<TabBarProps> = ({ showCloseButton, ...rest }) => {
  return <TabBar {...rest} showCloseButton={showCloseButton ?? false} />;
};

export default PanelTabBar;
