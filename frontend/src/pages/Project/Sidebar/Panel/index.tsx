import React from "react";
import { SidebarView } from "../constants";
import ExplorerPanel from "./ExplorerPanel";
import SearchPanel from "./SearchPanel";
import SourceControlPanel from "./SourceControlPanel";
import RemotePanel from "./RemotePanel";
import ExtensionsPanel from "./ExtensionsPanel";

interface PanelProps {
  activeView: SidebarView | null;
}

const Panel: React.FC<PanelProps> = ({ activeView }) => {
  if (!activeView) return null;

  return (
    <div className="flex h-full min-w-0 flex-1 flex-col overflow-hidden border-r border-[#3c3c3c] bg-[#252526]">
      {(() => {
        switch (activeView) {
          case SidebarView.EXPLORER:
            return <ExplorerPanel />;
          case SidebarView.SEARCH:
            return <SearchPanel />;
          case SidebarView.SCM:
            return <SourceControlPanel />;
          case SidebarView.REMOTE:
            return <RemotePanel />;
          case SidebarView.EXTENSIONS:
            return <ExtensionsPanel />;
          default:
            return null;
        }
      })()}
    </div>
  );
};

export default Panel;
