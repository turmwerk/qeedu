import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Button from "@/components/Button";

const TOP_Z = 2147483647;

export type DropdownItem = {
  label: React.ReactNode;
  onClick?: () => void;
  active?: boolean;
};

interface DropdownProps {
  button?: React.ReactNode;
  items: DropdownItem[];
  buttonClassName?: string;
  onButtonClick?: () => void;
  buttonDisabled?: boolean;
  showCheck?: boolean;
  direction?: "up" | "down"; // 上拉或下拉
  showSelected?: boolean; // 是否显示当前选择的内容
  showBorder?: boolean; // 按钮和菜单项是否显示边框，默认 true；false 时无边框，非激活项悬浮显示下划线
  portalToBody?: boolean; // 是否将菜单挂载到 body 以避免裁剪
}

const Dropdown: React.FC<DropdownProps> = ({
  button = "菜单",
  items,
  buttonClassName,
  onButtonClick,
  buttonDisabled,
  showCheck = false,
  direction = "down",
  showSelected = false,
  showBorder = true,
  portalToBody = false,
}) => {
  // showBorder=true: 按钮和菜单项都有边框，悬浮无下划线
  // showBorder=false: 按钮和菜单项都无边框，非激活项悬浮显示下划线

  const defaultButtonClass = showBorder
    ? "bg-white border border-[var(--brand-border)] text-[#1d4ed8] px-2.5 py-1.5 rounded-xl font-semibold transition-[background,border-color,color] hover:bg-[var(--brand-accent-soft)] hover:border-[#7c3aed] hover:text-[#7c3aed]"
    : "bg-transparent border-0 text-blue-600 px-2.5 py-1.5 rounded-xl font-semibold transition-[color] hover:text-[#6d28d9]";
  const disabledButtonClass =
    "bg-[var(--brand-accent)] text-white border-0 px-3.5 py-[7px] rounded-[16px] font-semibold text-[15px] transition-[box-shadow,background]";

  // 菜单项样式
  const itemActiveClass = showBorder
    ? "bg-[var(--brand-accent-soft)] text-[#6d28d9] border border-[#c4b5fd]"
    : "bg-white text-[#6d28d9] border-0";
  const itemIdleClass = showBorder
    ? "bg-white text-blue-600 border border-[var(--brand-border)] hover:border-[#6d28d9] hover:text-[#6d28d9]"
    : "bg-white text-blue-600 border-0 hover:text-[#6d28d9]";

  // 获取当前选中的项
  const selectedItem = showSelected ? items.find((item) => item.active) : null;
  const displayButton = selectedItem ? selectedItem.label : button;

  // 根据direction决定菜单位置和对齐方式
  const menuPositionClass = direction === "up" 
    ? "bottom-[calc(100%+4px)]" 
    : "top-[calc(100%+4px)]";
  
  const menuAlignClass = direction === "up" ? "left-0" : "right-0";

  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const [menuStyle, setMenuStyle] = useState<React.CSSProperties>({
    position: "fixed",
    top: -9999,
    left: -9999,
  });
  const [open, setOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setOpen(false);
    }, 150); // 增加延迟到 150ms，防止鼠标移动过快导致菜单消失
  };

  const canPortal = portalToBody && typeof document !== "undefined";
  const portalContainer = useMemo(
    () => (canPortal ? document.body : null),
    [canPortal]
  );

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  useLayoutEffect(() => {
    if (!open || !canPortal) return;
    const wrapper = wrapperRef.current;
    const menu = menuRef.current;
    if (!wrapper || !menu) return;

    const rect = wrapper.getBoundingClientRect();
    const menuRect = menu.getBoundingClientRect();

    const gap = 6;
    const top = direction === "up"
      ? rect.top - menuRect.height - gap
      : rect.bottom + gap;
    
    // 确保菜单不会超出屏幕边界
    let left = direction === "up" ? rect.left : rect.right - menuRect.width;
      
    if (left < 0) left = 8;
    if (left + menuRect.width > window.innerWidth) {
      left = window.innerWidth - menuRect.width - 8;
    }

    setMenuStyle({
      position: "fixed",
      top: Math.max(8, top),
      left: left,
      zIndex: TOP_Z,
      transformOrigin: direction === "up" ? "bottom left" : "top right",
    });
  }, [open, canPortal, direction]);

  useEffect(() => {
    if (!open || !canPortal) return;
    const handle = () => {
      const wrapper = wrapperRef.current;
      const menu = menuRef.current;
      if (!wrapper || !menu) return;
      const rect = wrapper.getBoundingClientRect();
      const menuRect = menu.getBoundingClientRect();
      const gap = 6;
      const top = direction === "up"
        ? rect.top - menuRect.height - gap
        : rect.bottom + gap;
      
      // 确保菜单不会超出屏幕边界
      let left = direction === "up" ? rect.left : rect.right - menuRect.width;
        
      if (left < 0) left = 8;
      if (left + menuRect.width > window.innerWidth) {
        left = window.innerWidth - menuRect.width - 8;
      }
      
      setMenuStyle({
        position: "fixed",
        top: Math.max(8, top),
        left: left,
        zIndex: TOP_Z,
        transformOrigin: direction === "up" ? "bottom left" : "top right",
      });
    };
    window.addEventListener("resize", handle);
    window.addEventListener("scroll", handle, true);
    return () => {
      window.removeEventListener("resize", handle);
      window.removeEventListener("scroll", handle, true);
    };
  }, [open, canPortal, direction]);

  return (
    <div
      ref={wrapperRef}
      className="relative inline-block group"
      style={{ isolation: "isolate" }}
      aria-haspopup="true"
      data-oid="td9_50p"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocusCapture={handleMouseEnter}
      onBlurCapture={handleMouseLeave}
    >
      <span
        aria-hidden="true"
        className={`absolute left-0 right-0 ${direction === "up" ? "bottom-[calc(100%-2px)]" : "top-[calc(100%-2px)]"} h-[14px] pointer-events-auto`}
        data-oid="hd02w-p"
      />

      <Button
        className={`group/dropdown-trigger ${
          buttonClassName ||
          (buttonDisabled ? disabledButtonClass : defaultButtonClass)
        }`}
        aria-expanded="false"
        onClick={onButtonClick}
        disabled={buttonDisabled}
        data-oid="2k_c_27"
      >
        <span
          className="inline-flex items-center gap-1.5 text-[14px] leading-[1.2] [&_.anticon]:text-[1em] [&_.anticon>svg]:h-[1em] [&_.anticon>svg]:w-[1em]"
        >
          {displayButton}
          {direction === "up" && (
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          )}
        </span>
      </Button>
      {items && items.length > 0 && (
        canPortal && portalContainer
          ? createPortal(
                  <div
                    ref={menuRef}
                    style={menuStyle}
                    className={`p-1 min-w-[120px] flex flex-col gap-0.5 transition-[opacity,transform] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                      open
                        ? "opacity-100 scale-[1.01] translate-y-0 pointer-events-auto"
                        : `opacity-0 scale-[0.98] ${direction === "up" ? "translate-y-2" : "-translate-y-2"} pointer-events-none`
                    }`}
                    data-oid="z7um0kb"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                  >
                {items.map((item, i) => (
                  <Button
                    key={i}
                    className={`group/dropdown-item relative w-full px-3 py-1.5 rounded-lg text-sm font-semibold transition-[background,border-color,color] whitespace-nowrap ${
                      item.active ? itemActiveClass : itemIdleClass
                    } ${
                      !showBorder
                        ? "after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[1.5px] after:w-0 after:bg-current after:transition-all after:duration-200 hover:after:w-full"
                        : ""
                    }`}
                    onClick={() => {
                      setOpen(false);
                      item.onClick?.();
                    }}
                    data-oid="i7-h8ep"
                  >
                    <span className="inline-flex items-center justify-center gap-2 text-[14px] leading-[1.2] [&_.anticon]:text-[1em] [&_.anticon>svg]:h-[1em] [&_.anticon>svg]:w-[1em]">
                      {item.label}
                      {showCheck && item.active && <span>✓</span>}
                    </span>
                  </Button>
                ))}
              </div>,
              portalContainer
            )
            : (
            <div
              ref={menuRef}
              className={`absolute ${menuAlignClass} ${menuPositionClass} p-1 min-w-[120px] flex flex-col gap-0.5 opacity-0 scale-[0.98] pointer-events-none z-[2147483647] transition-[opacity,transform] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] ${direction === "up" ? "translate-y-2 origin-bottom-left" : "-translate-y-2 origin-top-right"} group-hover:opacity-100 group-hover:scale-[1.01] group-hover:translate-y-0 group-hover:pointer-events-auto group-hover:duration-150 group-focus-within:opacity-100 group-focus-within:scale-[1.01] group-focus-within:translate-y-0 group-focus-within:pointer-events-auto group-focus-within:duration-150`}
              data-oid="z7um0kb"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              {items.map((item, i) => (
                <Button
                  key={i}
                  className={`group/dropdown-item relative w-full px-3 py-1.5 rounded-lg text-sm font-semibold transition-[background,border-color,color] whitespace-nowrap ${
                    item.active ? itemActiveClass : itemIdleClass
                  } ${
                    !showBorder
                      ? "after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[1.5px] after:w-0 after:bg-current after:transition-all after:duration-200 hover:after:w-full"
                      : ""
                  }`}
                  onClick={() => {
                    setOpen(false);
                    item.onClick?.();
                  }}
                  data-oid="i7-h8ep"
                >
                  <span className="inline-flex items-center justify-center gap-2 text-[14px] leading-[1.2] [&_.anticon]:text-[1em] [&_.anticon>svg]:h-[1em] [&_.anticon>svg]:w-[1em]">
                    {item.label}
                    {showCheck && item.active && <span>✓</span>}
                  </span>
                </Button>
              ))}
            </div>
          )
      )}
    </div>
  );
};

export default Dropdown;
