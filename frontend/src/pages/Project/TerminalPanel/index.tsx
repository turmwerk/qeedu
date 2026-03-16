import React, { useEffect, useMemo, useState } from "react";
import { CloseOutlined, MinusOutlined } from "@ant-design/icons";
import { useContextMenu, type ContextMenuItem } from "@/ui/ContextMenu";
import type { ToolItemProps } from "@/ui/TabBar";
import PanelTabBar from "./PanelTabBar";
import TerminalView from "./Views/TerminalView";
import OutputView from "./Views/OutputView";
import ProblemsView from "./Views/ProblemsView";
import ConsoleView from "./Views/ConsoleView";
import PortsView from "./Views/PortsView";

interface TerminalPanelProps {
  onClose: () => void;
  onMinimize?: () => void;
}

type ViewId = "terminal" | "output" | "problems" | "console" | "ports";

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

const TerminalPanel: React.FC<TerminalPanelProps> = ({ onClose, onMinimize }) => {
  const { openAtEvent } = useContextMenu();
  const [activeViewId, setActiveViewId] = useState<ViewId>("terminal");
  const [visibleViews, setVisibleViews] = useState<ViewId[]>(() =>
    viewConfigs.map((view) => view.id),
  );

  const visibleConfigs = useMemo(
    () => viewConfigs.filter((view) => visibleViews.includes(view.id)),
    [visibleViews],
  );
  const tabs = useMemo(
    () => visibleConfigs.map((view) => ({ id: view.id, label: view.label })),
    [visibleConfigs],
  );
  const tools = useMemo<ToolItemProps[]>(() => {
    const items: ToolItemProps[] = [];
    if (onMinimize) {
      items.push({
        icon: <MinusOutlined className="text-[12px]" />,
        title: "最小化",
        onClick: onMinimize,
      });
    }
    items.push({
      icon: <CloseOutlined className="text-[12px]" />,
      title: "隐藏面板",
      onClick: onClose,
    });
    return items;
  }, [onClose, onMinimize]);

  useEffect(() => {
    if (!visibleViews.includes(activeViewId)) {
      setActiveViewId(visibleViews[0] ?? "terminal");
    }
  }, [activeViewId, visibleViews]);

  const toggleViewVisibility = (id: ViewId) => {
    setVisibleViews((prev) => {
      const isVisible = prev.includes(id);
      if (isVisible) {
        if (prev.length === 1) return prev;
        return prev.filter((viewId) => viewId !== id);
      }
      const next = [...prev, id];
      return viewConfigs.map((view) => view.id).filter((viewId) => next.includes(viewId));
    });
  };

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

  const activeConfig =
    visibleConfigs.find((view) => view.id === activeViewId) ??
    visibleConfigs[0] ??
    viewConfigs[0];

  return (
    <div className="flex h-full min-w-0 flex-col bg-[#1e1e1e]">
      <PanelTabBar
        tabs={tabs}
        activeId={activeViewId}
        onTabClick={(id) => setActiveViewId(id as ViewId)}
        onTabContextMenu={handleViewBarContextMenu}
        tools={tools}
      />
      <div className="min-h-0 flex-1 overflow-hidden">
        {activeConfig ? activeConfig.render() : null}
      </div>
    </div>
  );
};

export default TerminalPanel;
