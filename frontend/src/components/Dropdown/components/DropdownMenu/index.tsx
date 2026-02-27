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
  menuPositionClass = "top-[calc(100%+4px)]",
  isPortal = false,
  menuRef,
  onMouseEnter,
  onMouseLeave,
  onItemClick,
}) => {
  // 菜单项样式（使用 showBorder 区分有/无边框两种风格）
  const itemActiveClass = showBorder
    ? "bg-[var(--brand-accent-soft)] !text-[var(--brand-purple)] border border-[var(--brand-purple)]"
    : "!text-[var(--brand-purple)] border-0 after:!w-full";
  const itemIdleClass = showBorder
    ? "bg-white text-[var(--brand-blue)] border border-[var(--brand-border)] hover:border-[var(--brand-purple)] hover:text-[var(--brand-purple)]"
    : "text-[var(--brand-blue)] border-0 hover:text-[var(--brand-purple)]";

  const portalPanelClass = `dropdown-menu-panel p-1 min-w-[120px] flex flex-col gap-0.5 transition-[opacity,transform] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] ${
    open
      ? "opacity-100 scale-[1.01] translate-y-0 pointer-events-auto"
      : `opacity-0 scale-[0.98] ${
          direction === "up" ? "translate-y-2" : "-translate-y-2"
        } pointer-events-none`
  }`;

  const relativePanelClass = `dropdown-menu-panel absolute ${menuAlignClass} ${menuPositionClass} p-1 min-w-[120px] flex flex-col gap-0.5 opacity-0 scale-[0.98] pointer-events-none z-[2147483647] transition-[opacity,transform] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] ${
    direction === "up"
      ? "translate-y-2 origin-bottom-left"
      : "-translate-y-2 origin-top-right"
  } group-hover:opacity-100 group-hover:scale-[1.01] group-hover:translate-y-0 group-hover:pointer-events-auto group-hover:duration-150 group-focus-within:opacity-100 group-focus-within:scale-[1.01] group-focus-within:translate-y-0 group-focus-within:pointer-events-auto group-focus-within:duration-150`;

  return (
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
          className={`dropdown-menu-item ${item.active ? "item-active" : ""} group/dropdown-item relative w-full px-3 py-1.5 rounded-lg text-sm font-semibold transition-[background,border-color,color] whitespace-nowrap after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[1.5px] after:w-0 after:bg-current after:transition-all after:duration-200 hover:after:w-full ${
            item.active ? itemActiveClass : itemIdleClass
          }`}
          onClick={() => onItemClick?.(item, i)}
        >
          <span className="inline-flex items-center justify-center gap-2 text-[14px] leading-[1.2] [&_.anticon]:text-[1em] [&_.anticon>svg]:h-[1em] [&_.anticon>svg]:w-[1em]">
            {item.label}
            {showCheck && item.active && <span>✓</span>}
          </span>
        </Button>
      ))}
    </div>
  );
};

export default DropdownMenu;
