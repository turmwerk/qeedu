import React from "react";
import { CloseOutlined } from "@ant-design/icons";

export interface TabItemProps {
  id: string;
  label: string;
  icon?: React.ReactNode;
  isDirty?: boolean;
  isActive?: boolean;
  onClick?: (id: string) => void;
  onClose?: (id: string) => void;
  onContextMenu?: (id: string, event: React.MouseEvent) => void;
  showCloseButton?: boolean;
}

const TabItem: React.FC<TabItemProps> = ({
  id,
  label,
  icon,
  isDirty = false,
  isActive = false,
  onClick,
  onClose,
  onContextMenu,
  showCloseButton = true,
}) => {
  return (
    <div
      className={`group relative flex h-full min-w-0 shrink-0 cursor-pointer select-none items-center gap-1.5 border-r border-[#2d2d2d] px-3 text-xs transition-colors ${
        isActive
          ? "bg-[#1e1e1e] text-[#ffffff] after:absolute after:left-0 after:top-0 after:h-[2px] after:w-full after:bg-[#007acc] after:content-['']"
          : "bg-[#2d2d2d] text-[#9d9d9d] hover:bg-[#333333] hover:text-[#cccccc]"
      }`}
      onClick={() => onClick?.(id)}
      onContextMenu={(event) => {
        event.preventDefault();
        onContextMenu?.(id, event);
      }}
    >
      {icon && <span className="shrink-0 text-sm">{icon}</span>}
      <span className="max-w-[120px] truncate">{label}</span>

      {/* 关闭 / dirty 点 */}
      {showCloseButton && (
        <span
          className="ml-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded hover:bg-white/10"
          onClick={(e) => {
            e.stopPropagation();
            if (!isDirty) onClose?.(id);
          }}
        >
          {isDirty ? (
            <span className="block h-2 w-2 rounded-full bg-[#cccccc] group-hover:hidden" />
          ) : null}
          <CloseOutlined
            className={`text-[10px] ${
              isDirty ? "hidden group-hover:block" : ""
            } ${isActive ? "opacity-70" : "opacity-0 group-hover:opacity-70"}`}
          />
        </span>
      )}
    </div>
  );
};

export default TabItem;
