import React from "react";
import {
  SplitCellsOutlined,
  EllipsisOutlined,
} from "@ant-design/icons";
import TabBar, { type TabBarProps } from "@/ui/TabBar";
import { getFileColorClass } from "../../utils/filePresentation";
import { useWorkspace } from "../../context";
import { type TabItem } from "../types";

const FileTabBar: React.FC = () => {
  const { tabs, activeTabId, closeTab, setActiveTabId } = useWorkspace();

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
    tools: [
      { icon: <SplitCellsOutlined />, title: "拆分编辑器" },
      { icon: <EllipsisOutlined />, title: "更多操作" },
    ],
  };

  return <TabBar {...tabBarProps} />;
};

export default FileTabBar;
