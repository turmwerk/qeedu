import React, { useRef } from "react";
import TabItemComp, { type TabItemProps } from "./TabItem";
import ToolItemComp, { type ToolItemProps } from "./ToolItem";

export type { TabItemProps, ToolItemProps };
export { TabItemComp as TabItem, ToolItemComp as ToolItem };

export interface TabBarProps {
  tabs: TabItemProps[];
  activeId?: string;
  onTabClick?: (id: string) => void;
  onTabClose?: (id: string) => void;
  /** 右侧工具按钮列表 */
  tools?: ToolItemProps[];
  className?: string;
  height?: string;
}

const TabBar: React.FC<TabBarProps> = ({
  tabs,
  activeId,
  onTabClick,
  onTabClose,
  tools = [],
  className = "",
  height = "h-9",
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <div
      className={`flex w-full shrink-0 select-none items-stretch overflow-hidden border-b border-[#2d2d2d] bg-[#252526] ${
        height
      } ${className}`}
    >
      {/* Tab 列表（可滚动�?*/}
      <div
        ref={scrollRef}
        className="flex min-w-0 flex-1 items-stretch overflow-x-auto"
        style={{ scrollbarWidth: "none" }}
      >
        {tabs.map((tab) => (
          <TabItemComp
            key={tab.id}
            {...tab}
            isActive={tab.id === activeId}
            onClick={onTabClick}
            onClose={onTabClose}
          />
        ))}
      </div>

      {/* 工具按钮�?*/}
      {tools.length > 0 && (
        <div className="flex shrink-0 items-center gap-0.5 border-l border-[#2d2d2d] px-1">
          {tools.map((tool, i) => (
            <ToolItemComp key={i} {...tool} />
          ))}
        </div>
      )}
    </div>
  );
};

export default TabBar;
