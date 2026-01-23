import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Button from "@/components/Button";

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
  hideBorder?: boolean; // 是否隐藏按钮边框
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
  hideBorder = false,
  portalToBody = false,
}) => {
  const defaultButtonClass =
    "bg-white border border-[var(--brand-border)] text-[var(--brand-accent)] px-2.5 py-1.5 rounded-xl font-semibold transition-[background,border-color,box-shadow] hover:bg-[var(--brand-accent-soft)] hover:border-[var(--brand-accent)] hover:shadow-[0_8px_18px_rgba(59,130,246,0.18)]";
  const disabledButtonClass =
    "bg-[var(--brand-accent)] text-white border-0 px-3.5 py-[7px] rounded-[16px] font-semibold text-[15px] transition-[box-shadow,background]";
  const noBorderButtonClass =
    "bg-transparent text-[var(--brand-text)] px-2.5 py-1 rounded-lg text-sm font-medium hover:bg-[var(--brand-accent-soft)] transition-colors";

  // 获取当前选中的项
  const selectedItem = showSelected ? items.find((item) => item.active) : null;
  const displayButton = selectedItem ? selectedItem.label : button;

  // 根据direction决定菜单位置和对齐方式
  const menuPositionClass = direction === "up" 
    ? "bottom-[calc(100%+4px)] -translate-y-2 group-hover:translate-y-0" 
    : "top-[calc(100%+4px)] -translate-y-2 group-hover:translate-y-0";
  
  const menuAlignClass = direction === "up" ? "left-0" : "right-0";

  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const [menuStyle, setMenuStyle] = useState<React.CSSProperties>({});
  const [open, setOpen] = useState(false);

  const canPortal = portalToBody && typeof document !== "undefined";
  const portalContainer = useMemo(
    () => (canPortal ? document.body : null),
    [canPortal]
  );

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
    const left = direction === "up"
      ? rect.left
      : rect.right - menuRect.width;

    setMenuStyle({
      position: "fixed",
      top: Math.max(8, top),
      left: Math.max(8, left),
      zIndex: 9999,
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
      const left = direction === "up"
        ? rect.left
        : rect.right - menuRect.width;
      setMenuStyle({
        position: "fixed",
        top: Math.max(8, top),
        left: Math.max(8, left),
        zIndex: 9999,
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
      aria-haspopup="true"
      data-oid="td9_50p"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocusCapture={() => setOpen(true)}
      onBlurCapture={() => setOpen(false)}
    >
      <span
        aria-hidden="true"
        className={`absolute left-0 right-0 ${direction === "up" ? "bottom-[calc(100%-2px)]" : "top-[calc(100%-2px)]"} h-[14px] pointer-events-auto`}
        data-oid="hd02w-p"
      />

      <Button
        className={
          buttonClassName ||
          (buttonDisabled ? disabledButtonClass : (hideBorder ? noBorderButtonClass : defaultButtonClass))
        }
        aria-expanded="false"
        onClick={onButtonClick}
        disabled={buttonDisabled}
        data-oid="2k_c_27"
      >
        <span className="flex items-center gap-1.5">
          {displayButton}
          {direction === "up" && (
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          )}
        </span>
      </Button>
      {canPortal && portalContainer
        ? createPortal(
            <div
              ref={menuRef}
              style={menuStyle}
              className={`bg-white/95 backdrop-blur-[16px] rounded-2xl p-1.5 min-w-[120px] shadow-[0_10px_24px_rgba(15,23,42,0.12)] border border-[rgba(59,130,246,0.12)] flex flex-col transition-[opacity,transform,box-shadow] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                open
                  ? "opacity-100 scale-[1.01] pointer-events-auto shadow-[0_14px_30px_rgba(15,23,42,0.16)]"
                  : "opacity-0 scale-[0.98] pointer-events-none"
              }`}
              data-oid="z7um0kb"
            >
              {items.map((item, i) => (
                <Button
                  key={i}
                  className={`w-full px-3 py-1.5 rounded-lg border text-sm font-semibold transition-[background,border-color,color,box-shadow] whitespace-nowrap ${
                    item.active
                      ? "bg-[#eff6ff] text-[#1d4ed8] border-[#bfdbfe]"
                      : "bg-white/70 text-[#374151] border-transparent hover:bg-[var(--brand-accent-soft)] hover:border-[var(--brand-accent)]"
                  }`}
                  onClick={item.onClick}
                  data-oid="i7-h8ep"
                >
                  <span className="flex items-center justify-center gap-2">
                    <span>{item.label}</span>
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
            className={`absolute ${menuAlignClass} ${menuPositionClass} bg-white/95 backdrop-blur-[16px] rounded-2xl p-1.5 min-w-[120px] shadow-[0_10px_24px_rgba(15,23,42,0.12)] border border-[rgba(59,130,246,0.12)] opacity-0 scale-[0.98] pointer-events-none z-[999] flex flex-col transition-[opacity,transform,box-shadow] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:opacity-100 group-hover:scale-[1.01] group-hover:pointer-events-auto group-hover:duration-150 group-hover:shadow-[0_14px_30px_rgba(15,23,42,0.16)] group-focus-within:opacity-100 group-focus-within:translate-y-0 group-focus-within:scale-[1.01] group-focus-within:pointer-events-auto group-focus-within:duration-150`}
            data-oid="z7um0kb"
          >
            {items.map((item, i) => (
              <Button
                key={i}
                className={`w-full px-3 py-1.5 rounded-lg border text-sm font-semibold transition-[background,border-color,color,box-shadow] whitespace-nowrap ${
                  item.active
                    ? "bg-[#eff6ff] text-[#1d4ed8] border-[#bfdbfe]"
                    : "bg-white/70 text-[#374151] border-transparent hover:bg-[var(--brand-accent-soft)] hover:border-[var(--brand-accent)]"
                }`}
                onClick={item.onClick}
                data-oid="i7-h8ep"
              >
                <span className="flex items-center justify-center gap-2">
                  <span>{item.label}</span>
                  {showCheck && item.active && <span>✓</span>}
                </span>
              </Button>
            ))}
          </div>
        )}
    </div>
  );
};

export default Dropdown;
