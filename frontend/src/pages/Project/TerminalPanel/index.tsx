import React, { useEffect, useMemo } from "react";
import { CloseOutlined, DownOutlined, PlusOutlined } from "@ant-design/icons";
import { useContextMenu, type ContextMenuItem } from "@/ui/ContextMenu";
import { showToast } from "@/ui/Toast";
import PanelTabBar from "./PanelTabBar";
import TerminalView from "./Views/TerminalView";
import OutputView from "./Views/OutputView";
import ProblemsView from "./Views/ProblemsView";
import ConsoleView from "./Views/ConsoleView";
import PortsView from "./Views/PortsView";
import HistoryBridge from "./HistoryBridge";
import { clearWorkspaceHistory } from "./history";
import { useWorkspace } from "../context";
import {
  terminalProfiles,
  useTerminalSessionStore,
} from "./Views/TerminalView/sessionStore";
import {
  type TerminalPanelViewId as ViewId,
  useTerminalPanelViewStore,
} from "./viewStore";

interface TerminalPanelProps {
  onClose: () => void;
  onMinimize?: () => void;
}

type ViewConfig = {
  id: ViewId;
  label: string;
  render: () => React.ReactNode;
};

const viewConfigs: ViewConfig[] = [
  {
    id: "terminal",
    label: "终端",
    render: () => <TerminalView />,
  },
  {
    id: "output",
    label: "输出",
    render: () => <OutputView />,
  },
  {
    id: "problems",
    label: "问题",
    render: () => <ProblemsView />,
  },
  {
    id: "console",
    label: "调试控制台",
    render: () => <ConsoleView />,
  },
  {
    id: "ports",
    label: "端口",
    render: () => <PortsView />,
  },
];

const TerminalPanel: React.FC<TerminalPanelProps> = ({ onClose }) => {
  const { openAtEvent } = useContextMenu();
  const workspaceKey = useWorkspace((state) => state.workspaceKey);
  const activeViewId = useTerminalPanelViewStore((state) => state.activeViewId);
  const visibleViews = useTerminalPanelViewStore((state) => state.visibleViews);
  const setActiveViewId = useTerminalPanelViewStore(
    (state) => state.setActiveViewId,
  );
  const toggleViewVisibility = useTerminalPanelViewStore(
    (state) => state.toggleViewVisibility,
  );
  const resetViews = useTerminalPanelViewStore((state) => state.reset);
  const sessions = useTerminalSessionStore((state) => state.sessions);
  const activeSessionId = useTerminalSessionStore((state) => state.activeId);
  const selectedProfileId = useTerminalSessionStore(
    (state) => state.selectedProfileId,
  );
  const setSelectedProfileId = useTerminalSessionStore(
    (state) => state.setSelectedProfileId,
  );
  const addSession = useTerminalSessionStore((state) => state.addSession);

  const visibleConfigs = useMemo(
    () => viewConfigs.filter((view) => visibleViews.includes(view.id)),
    [visibleViews],
  );
  const tabs = useMemo(
    () => visibleConfigs.map((view) => ({ id: view.id, label: view.label })),
    [visibleConfigs],
  );
  const profileMap = useMemo(
    () => new Map(terminalProfiles.map((profile) => [profile.id, profile])),
    [],
  );
  const selectedProfile =
    profileMap.get(selectedProfileId) ?? terminalProfiles[0];
  const activeSession =
    sessions.find((session) => session.id === activeSessionId) ?? sessions[0];

  useEffect(() => {
    if (!visibleViews.includes(activeViewId)) {
      setActiveViewId(visibleViews[0] ?? "terminal");
    }
  }, [activeViewId, visibleViews]);

  useEffect(() => resetViews, [resetViews]);

  const handleViewBarContextMenu = (
    _id: string,
    event: React.MouseEvent,
  ) => {
    const items: ContextMenuItem[] = [
      { label: "隐藏面板", onClick: onClose },
      { type: "separator" },
      ...viewConfigs.map((view) => ({
        label: view.label,
        checked: visibleViews.includes(view.id),
        onClick: () => toggleViewVisibility(view.id),
      })),
    ];
    openAtEvent(event, items);
  };

  const handleAddSession = () => {
    addSession(selectedProfileId);
  };

  const handleProfileMenu = (event: React.MouseEvent) => {
    const items: ContextMenuItem[] = terminalProfiles.map((profile) => ({
      label: profile.title,
      checked: profile.id === selectedProfileId,
      onClick: () => setSelectedProfileId(profile.id),
    }));
    openAtEvent(event, items);
  };

  const handleClearHistory = async () => {
    if (!workspaceKey) return;
    try {
      await clearWorkspaceHistory(workspaceKey);
      showToast("已清空当前项目历史");
    } catch {
      showToast("清空历史失败");
    }
  };

  const activeConfig =
    visibleConfigs.find((view) => view.id === activeViewId) ??
    visibleConfigs[0] ??
    viewConfigs[0];

  return (
    <div className="flex h-full min-w-0 flex-col bg-[#1e1e1e]">
      <HistoryBridge />
      <PanelTabBar
        tabs={tabs}
        activeId={activeViewId}
        onTabClick={(id) => setActiveViewId(id as ViewId)}
        onTabContextMenu={handleViewBarContextMenu}
        rightSlot={
          <div className="flex items-center gap-2">
            {activeViewId === "terminal" && (
              <>
                <div className="flex items-center gap-1">
                  <button
                    className="flex h-6 w-6 items-center justify-center rounded text-[#9d9d9d] hover:bg-white/10 hover:text-[#dddddd]"
                    title={`新建终端（${selectedProfile?.title ?? "bash"}）`}
                    onClick={handleAddSession}
                  >
                    <PlusOutlined className="text-[10px]" />
                  </button>
                  <button
                    className="flex h-6 items-center gap-1 rounded px-1 text-[10px] text-[#9d9d9d] hover:bg-white/10 hover:text-[#dddddd]"
                    onClick={handleProfileMenu}
                    title="选择终端类型"
                  >
                    <span className="max-w-[60px] truncate">
                      {selectedProfile?.title ?? "bash"}
                    </span>
                    <DownOutlined className="text-[9px]" />
                  </button>
                </div>
                <div className="max-w-[140px] truncate text-[10px] text-[#8a8a8a]">
                  {activeSession?.title ?? ""}
                </div>
              </>
            )}
            <button
              className="rounded px-2 py-1 text-[10px] text-[#9d9d9d] hover:bg-white/10 hover:text-[#dddddd]"
              title="清空当前项目历史"
              onClick={handleClearHistory}
            >
              清空历史
            </button>
            <button
              className="flex h-7 w-7 items-center justify-center rounded text-[#9d9d9d] hover:bg-white/10 hover:text-[#dddddd]"
              title="隐藏面板"
              onClick={onClose}
            >
              <CloseOutlined className="text-[12px]" />
            </button>
          </div>
        }
      />
      <div className="min-h-0 flex-1 overflow-hidden">
        {activeConfig ? activeConfig.render() : null}
      </div>
    </div>
  );
};

export default TerminalPanel;
