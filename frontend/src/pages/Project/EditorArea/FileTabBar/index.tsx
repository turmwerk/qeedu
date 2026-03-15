import React from "react";
import {
  SplitCellsOutlined,
  EllipsisOutlined,
} from "@ant-design/icons";
import TabBar, { type TabBarProps } from "@/ui/TabBar";
import { useContextMenu, type ContextMenuItem } from "@/ui/ContextMenu";
import { getFileColorClass } from "../../utils/filePresentation";
import { useWorkspace } from "../../context";
import { type TabItem } from "../types";

const FileTabBar: React.FC = () => {
  const {
    tabs,
    activeTabId,
    closeTab,
    closeOtherTabs,
    closeTabsToRight,
    closeSavedTabs,
    closeAllTabs,
    setActiveTabId,
  } = useWorkspace();
  const { openAtEvent } = useContextMenu();

  const copyText = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // ignore clipboard errors
    }
  };

  const handleTabContextMenu = (id: string, event: React.MouseEvent) => {
    const index = tabs.findIndex((t) => t.id === id);
    const hasRight = index >= 0 && index < tabs.length - 1;
    const canCloseOthers = tabs.length > 1;
    const canCloseSaved = tabs.some((t) => !t.isDirty);
    const items: ContextMenuItem[] = [
      { label: "Close", onClick: () => closeTab(id) },
      {
        label: "Close Others",
        onClick: () => closeOtherTabs(id),
        disabled: !canCloseOthers,
      },
      {
        label: "Close to Right",
        onClick: () => closeTabsToRight(id),
        disabled: !hasRight,
      },
      {
        label: "Close Saved",
        onClick: () => closeSavedTabs(),
        disabled: !canCloseSaved,
      },
      { type: "separator" },
      { label: "Close All", onClick: () => closeAllTabs() },
      { type: "separator" },
      { label: "Copy Path", onClick: () => copyText(id) },
      {
        label: "Copy Relative Path",
        onClick: () => copyText(id.replace(/^\//, "")),
      },
    ];
    openAtEvent(event, items);
  };

  const tabBarProps: TabBarProps = {
    tabs: tabs.map((t: TabItem) => ({
      id: t.id,
      label: t.title,
      isDirty: t.isDirty,
      icon: (
        <span className={`text-xs ${getFileColorClass(t.title)}`}>
          ●
        </span>
      ),
    })),
    activeId: activeTabId ?? undefined,
    onTabClick: setActiveTabId,
    onTabClose: closeTab,
    onTabContextMenu: handleTabContextMenu,
    tools: [
      { icon: <SplitCellsOutlined />, title: "拆分编辑器" },
      { icon: <EllipsisOutlined />, title: "更多操作" },
    ],
  };

  return <TabBar {...tabBarProps} />;
};

export default FileTabBar;
