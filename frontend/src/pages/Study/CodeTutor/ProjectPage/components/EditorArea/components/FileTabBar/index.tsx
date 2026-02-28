import React from "react";
import {
  SplitCellsOutlined,
  EllipsisOutlined,
} from "@ant-design/icons";
import TabBar, { type TabBarProps } from "@/components/TabBar";
import { useWorkspace } from "../../../../context";
import { type TabItem } from "../../types";

/** 根据文件名取适当的颜色类 */
function fileColorClass(name: string): string {
  const ext = name.split(".").pop()?.toLowerCase() ?? "";
  if (["py"].includes(ext)) return "text-[#4ec9b0]";
  if (["ts", "tsx"].includes(ext)) return "text-[#519aba]";
  if (["js", "jsx"].includes(ext)) return "text-[#f1c40f]";
  if (["md", "markdown"].includes(ext)) return "text-[#519aba]";
  return "text-[#cccccc]";
}

const FileTabBar: React.FC = () => {
  const { tabs, activeTabId, closeTab, setActiveTabId } = useWorkspace();

  const tabBarProps: TabBarProps = {
    tabs: tabs.map((t: TabItem) => ({
      id: t.id,
      label: t.title,
      isDirty: t.isDirty,
      icon: (
        <span className={`text-xs ${fileColorClass(t.title)}`}>
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
