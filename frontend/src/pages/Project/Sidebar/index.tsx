import React from "react";
import { SidebarView } from "./constants";
import ActivityBar from "./ActivityBar";
import Panel from "./Panel";
import { useSidebarView } from "./SidebarViewContext";

const Sidebar: React.FC = () => {
  const { activeView, toggleView } = useSidebarView();

  const handleViewChange = (view: SidebarView) => {
    // 再次点击关闭面板
    toggleView(view);
  };

  return (
    <div className="flex h-full shrink-0">
      <ActivityBar activeView={activeView} onViewChange={handleViewChange} />
      <Panel activeView={activeView} />
    </div>
  );
};

export default Sidebar;
