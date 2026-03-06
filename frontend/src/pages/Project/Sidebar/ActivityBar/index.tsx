import React from "react";
import {
  FolderOpenOutlined,
  SearchOutlined,
  BranchesOutlined,
  CloudServerOutlined,
  AppstoreOutlined,
  SettingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { ACTIVITY_BAR_ITEMS } from "../../data/activityBar";
import { SidebarView } from "../constants";

interface ActivityBarProps {
  activeView: SidebarView | null;
  onViewChange: (view: SidebarView) => void;
}

const ICON_MAP: Record<SidebarView, React.ReactNode> = {
  [SidebarView.EXPLORER]: <FolderOpenOutlined />,
  [SidebarView.SEARCH]: <SearchOutlined />,
  [SidebarView.SCM]: <BranchesOutlined />,
  [SidebarView.REMOTE]: <CloudServerOutlined />,
  [SidebarView.EXTENSIONS]: <AppstoreOutlined />,
};

const ActivityBar: React.FC<ActivityBarProps> = ({ activeView, onViewChange }) => {
  return (
    <div className="flex w-12 shrink-0 flex-col items-center justify-between border-r border-[#3c3c3c] bg-[#333333] py-1">
      {/* 顶部功能图标 */}
      <div className="flex flex-col items-center gap-0.5">
        {ACTIVITY_BAR_ITEMS.map(({ view, title }) => {
          const isActive = activeView === view;
          return (
            <button
              key={view}
              title={title}
              onClick={() => onViewChange(view)}
              className={`relative flex h-12 w-12 select-none items-center justify-center text-xl transition-colors ${
                isActive
                  ? "text-white before:absolute before:left-0 before:top-1/2 before:h-6 before:-translate-y-1/2 before:w-0.5 before:rounded-r before:bg-white before:content-['']"
                  : "text-[#858585] hover:text-[#cccccc]"
              }`}
            >
              {ICON_MAP[view]}
            </button>
          );
        })}
      </div>

      {/* 底部：账户 + 设置 */}
      <div className="flex flex-col items-center gap-0.5">
        {[
          { icon: <UserOutlined />, title: "账户" },
          { icon: <SettingOutlined />, title: "设置" },
        ].map(({ icon, title }) => (
          <button
            key={title}
            title={title}
            className="flex h-12 w-12 select-none items-center justify-center text-xl text-[#858585] transition-colors hover:text-[#cccccc]"
          >
            {icon}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ActivityBar;
