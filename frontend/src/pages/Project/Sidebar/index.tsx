import React, { useState } from "react";
import { SidebarView } from "./constants";
import ActivityBar from "./ActivityBar";
import Panel from "./Panel";

const Sidebar: React.FC = () => {
  const [activeView, setActiveView] = useState<SidebarView | null>(
    SidebarView.EXPLORER,
  );

  const handleViewChange = (view: SidebarView) => {
    // 再次点击关闭面板
    setActiveView((prev) => (prev === view ? null : view));
  };

  return (
    <div className="flex h-full shrink-0">
      <ActivityBar activeView={activeView} onViewChange={handleViewChange} />
      <Panel activeView={activeView} />
    </div>
  );
};

export default Sidebar;
