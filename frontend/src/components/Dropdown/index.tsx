import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import DropdownButton from "@/components/Dropdown/components/DropdownButton";
import DropdownMenu from "@/components/Dropdown/components/DropdownMenu";

const TOP_Z = 2147483647;

export type DropdownItem = {
  label: React.ReactNode;
  onClick?: () => void;
  active?: boolean;
};

interface DropdownProps {
  button?: React.ReactNode;
  items: DropdownItem[];
  active?: boolean;
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
  active = false,
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

  // 获取当前选中的项
  const selectedItem = showSelected ? items.find((item) => item.active) : null;
  const hasActiveItem = items.some((item) => item.active);
  const buttonActive = active || hasActiveItem;
  const displayButton = selectedItem ? selectedItem.label : button;

  // 根据direction决定菜单位置和对齐方式
  const menuPositionClass = direction === "up" 
    ? "bottom-full" 
    : "top-full";
  
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

    const top = direction === "up"
      ? rect.top - menuRect.height
      : rect.bottom;
    
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
      minWidth: rect.width,
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
      const top = direction === "up"
        ? rect.top - menuRect.height
        : rect.bottom;
      
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
        minWidth: rect.width,
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
        className={`absolute left-0 right-0 ${direction === "up" ? "bottom-[calc(100%-2px)]" : "top-[calc(100%-2px)]"} h-[4px] pointer-events-auto`}
        data-oid="hd02w-p"
      />

      <DropdownButton
        showBorder={showBorder}
        disabled={buttonDisabled}
        active={buttonActive}
        className={buttonClassName}
        onClick={onButtonClick}
        direction={direction}
      >
        {displayButton}
      </DropdownButton>

      {items && items.length > 0 && (
        canPortal && portalContainer
          ? createPortal(
              <DropdownMenu
                menuRef={menuRef}
                items={items}
                open={open}
                showCheck={showCheck}

                showBorder={showBorder}
                style={menuStyle}
                isPortal
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onItemClick={(item) => {
                  setOpen(false);
                  item.onClick?.();
                }}
              />,
              portalContainer
            )
          : (
            <DropdownMenu
              menuRef={menuRef}
              items={items}
              open={open}
              showCheck={showCheck}
              showBorder={showBorder}
              menuAlignClass={menuAlignClass}
              menuPositionClass={menuPositionClass}
              isPortal={false}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onItemClick={(item) => {
                setOpen(false);
                item.onClick?.();
              }}
            />
          )
      )}
    </div>
  );
};

export default Dropdown;
