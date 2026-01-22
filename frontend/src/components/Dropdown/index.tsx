import React from "react";
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
}) => {
  const defaultButtonClass =
    "bg-white border border-[var(--brand-border)] text-[var(--brand-accent)] px-2.5 py-1.5 rounded-xl font-semibold transition-[background,border-color,box-shadow] hover:bg-[var(--brand-accent-soft)] hover:border-[var(--brand-accent)] hover:shadow-[0_8px_18px_rgba(59,130,246,0.18)]";
  const disabledButtonClass =
    "bg-[var(--brand-accent)] text-white border-0 px-3.5 py-[7px] rounded-[16px] font-semibold text-[15px] transition-[box-shadow,background]";

  // 获取当前选中的项
  const selectedItem = showSelected ? items.find((item) => item.active) : null;
  const displayButton = selectedItem ? selectedItem.label : button;

  // 根据direction决定菜单位置
  const menuPositionClass = direction === "up" 
    ? "bottom-[calc(100%+4px)] -translate-y-2 group-hover:translate-y-0" 
    : "top-[calc(100%+4px)] -translate-y-2 group-hover:translate-y-0";

  return (
    <div
      className="relative inline-block group"
      aria-haspopup="true"
      data-oid="td9_50p"
    >
      <span
        aria-hidden="true"
        className={`absolute left-0 right-0 ${direction === "up" ? "bottom-[calc(100%-2px)]" : "top-[calc(100%-2px)]"} h-[14px] pointer-events-auto`}
        data-oid="hd02w-p"
      />

      <Button
        className={
          buttonClassName ||
          (buttonDisabled ? disabledButtonClass : defaultButtonClass)
        }
        aria-expanded="false"
        onClick={onButtonClick}
        disabled={buttonDisabled}
        data-oid="2k_c_27"
      >
        {displayButton}
      </Button>
      <div
        className={`absolute right-0 ${menuPositionClass} bg-white/95 backdrop-blur-[16px] rounded-2xl p-1.5 min-w-[120px] shadow-[0_10px_24px_rgba(15,23,42,0.12)] border border-[rgba(59,130,246,0.12)] opacity-0 scale-[0.98] pointer-events-none z-10 flex flex-col transition-[opacity,transform,box-shadow] duration-[2000ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:opacity-100 group-hover:scale-[1.01] group-hover:pointer-events-auto group-hover:duration-160 group-hover:shadow-[0_14px_30px_rgba(15,23,42,0.16)] group-focus-within:opacity-100 group-focus-within:translate-y-0 group-focus-within:scale-[1.01] group-focus-within:pointer-events-auto group-focus-within:duration-160`}
        data-oid="z7um0kb"
      >
        {items.map((item, i) => (
          <Button
            key={i}
            className={`w-full px-3 py-1.5 rounded-lg border text-sm font-semibold transition-[background,border-color,color,box-shadow] ${
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
    </div>
  );
};

export default Dropdown;
