import React from "react";

export interface ToolItemProps {
  icon: React.ReactNode;
  title?: string;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}

const ToolItem: React.FC<ToolItemProps> = ({
  icon,
  title,
  onClick,
  className = "",
  disabled = false,
}) => {
  return (
    <button
      title={title}
      onClick={onClick}
      disabled={disabled}
      className={`flex h-7 w-7 shrink-0 cursor-pointer select-none items-center justify-center rounded text-[#9d9d9d] transition-colors hover:bg-white/10 hover:text-[#cccccc] disabled:cursor-not-allowed disabled:opacity-50 ${
        className
      }`}
    >
      <span className="text-sm">{icon}</span>
    </button>
  );
};

export default ToolItem;
