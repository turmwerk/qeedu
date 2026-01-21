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
}

const Dropdown: React.FC<DropdownProps> = ({
  button = "菜单",
  items,
  buttonClassName,
  onButtonClick,
  buttonDisabled,
  showCheck = false,
}) => {
  return (
    <div
      className="relative inline-block group"
      aria-haspopup="true"
      data-oid="td9_50p"
    >
      <span
        aria-hidden="true"
        className="absolute left-0 right-0 top-[calc(100%-2px)] h-[14px] pointer-events-auto"
        data-oid="hd02w-p"
      />

      <Button
        className={
          buttonClassName ||
          "bg-[var(--brand-accent)] text-white border-0 px-3.5 py-[7px] rounded-[16px] font-semibold text-[15px] transition-[box-shadow,background] hover:bg-[var(--brand-accent-strong)] hover:shadow-[var(--brand-shadow)]"
        }
        aria-expanded="false"
        onClick={onButtonClick}
        disabled={buttonDisabled}
        data-oid="2k_c_27"
      >
        {button}
      </Button>
      <div
        className="absolute right-0 top-[calc(100%+4px)] bg-gradient-to-b from-white/95 via-white/90 to-purple-50/80 backdrop-blur-[22px] rounded-2xl p-1.5 min-w-[120px] shadow-[0_12px_36px_rgba(147,51,234,0.18),0_0_24px_rgba(236,72,153,0.18)] border border-white/50 opacity-0 -translate-y-2 scale-[0.98] pointer-events-none z-10 flex flex-col transition-[opacity,transform,box-shadow] duration-[2000ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:opacity-100 group-hover:translate-y-0 group-hover:scale-[1.01] group-hover:pointer-events-auto group-hover:duration-160 group-hover:shadow-[0_18px_48px_rgba(147,51,234,0.24),0_0_32px_rgba(236,72,153,0.28)] group-focus-within:opacity-100 group-focus-within:translate-y-0 group-focus-within:scale-[1.01] group-focus-within:pointer-events-auto group-focus-within:duration-160"
        data-oid="z7um0kb"
      >
        {items.map((item, i) => (
          <Button
            key={i}
            className={`w-full px-3 py-1.5 rounded-lg border transition-[background,border-color,color] ${
              item.active
                ? "bg-purple-100 text-[#4a2aa6] border-purple-300"
                : "bg-transparent text-[#1f1f1f] border-transparent hover:bg-[var(--brand-accent-soft)]"
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
