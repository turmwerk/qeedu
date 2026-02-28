import React from "react";
import Button from "@/components/Button";
import type { DropdownItem } from "@/components/Dropdown";

interface DropdownMenuProps {
  items: DropdownItem[];
  open?: boolean;
  showCheck?: boolean;
  direction?: "up" | "down";
  showBorder?: boolean;
  /** portal 模式下：由父组件计算好的 fixed 定位样式 */
  style?: React.CSSProperties;
  /** 非 portal 模式下：菜单相对定位的对齐类（left-0 / right-0） */
  menuAlignClass?: string;
  /** 非 portal 模式下：菜单相对定位的位置类（top-full / bottom-full） */
  menuPositionClass?: string;
  /** true 时走 portal 模式（fixed 定位），false 时走相对定位模式 */
  isPortal?: boolean;
  menuRef?: React.Ref<HTMLDivElement>;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  onItemClick?: (item: DropdownItem, index: number) => void;
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({
  items,
  open = false,
  showCheck = false,
  direction = "down",
  showBorder = true,
  style,
  menuAlignClass = "right-0",
  menuPositionClass = "top-full",
  isPortal = false,
  menuRef,
  onMouseEnter,
  onMouseLeave,
  onItemClick,
}) => {
  // dropdown 面板 bg-transparent 直接写在 className 中，不再用 <style>
  // 菜单项样式（使用 showBorder 区分有/无边框两种风格）
  // 面板已有毛玻璃背景，菜单项不再额外加背景/边框
  const itemActiveClass = showBorder
    ? "bg-white dark:bg-white/10 !text-[var(--brand-purple)] hover:bg-[var(--brand-accent-soft)] dark:hover:bg-white/18"
    : "!text-[var(--brand-purple)] border-0 after:!w-full";
  const itemIdleClass = showBorder
    ? "bg-white dark:bg-white/10 text-[var(--brand-blue)] border-0 hover:bg-[var(--brand-accent-soft)] dark:hover:bg-white/18 hover:text-[var(--brand-purple)]"
    : "text-[var(--brand-blue)] border-0 hover:text-[var(--brand-purple)]";

  const portalPanelClass = `bg-transparent border-none shadow-none pl-1 pt-1 pb-1 pr-0 min-w-[120px] flex flex-col gap-0.5 transition-[opacity] duration-150 ease-[cubic-bezier(0.16,1,0.3,1)] ${
    open
      ? "opacity-100 pointer-events-auto"
      : "opacity-0 pointer-events-none"
  }`;

  const relativePanelClass = `bg-transparent border-none shadow-none absolute ${menuAlignClass} ${menuPositionClass} pl-1 pt-1 pb-1 pr-0 min-w-[120px] flex flex-col gap-0.5 opacity-0 pointer-events-none z-[2147483647] transition-[opacity] duration-150 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:opacity-100 group-hover:pointer-events-auto group-focus-within:opacity-100 group-focus-within:pointer-events-auto`;

  return (
    <>
    <div
      ref={menuRef}
      style={isPortal ? style : undefined}
      className={isPortal ? portalPanelClass : relativePanelClass}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {items.map((item, i) => (
        <Button
          key={i}
          className={`dropdown-menu-item ${item.active ? "item-active" : ""} group/dropdown-item relative w-full pl-3 pr-[10px] py-1.5 rounded-lg text-sm font-semibold transition-[background,border-color,color] whitespace-nowrap after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[1.5px] after:w-0 after:bg-current after:transition-all after:duration-200 hover:after:w-full ${
            item.active ? itemActiveClass : itemIdleClass
          }`}
          onClick={() => onItemClick?.(item, i)}
        >
          <span className="inline-flex items-center justify-end gap-2 text-[14px] leading-[1.2] [&_.anticon]:text-[1em] [&_.anticon>svg]:h-[1em] [&_.anticon>svg]:w-[1em]">
            {item.label}
            {showCheck && item.active && <span>✓</span>}
          </span>
        </Button>
      ))}
    </div>
    </>
  );
};

export default DropdownMenu;
