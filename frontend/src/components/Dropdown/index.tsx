import React from "react";
import Button from "@/components/Button";

export type DropdownItem = {
  label: React.ReactNode;
  onClick?: () => void;
};

interface DropdownProps {
  button?: React.ReactNode;
  items: DropdownItem[];
}

const Dropdown: React.FC<DropdownProps> = ({ button = "菜单", items }) => {
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
        className="bg-[var(--brand-accent)] text-white border-0 px-3.5 py-[7px] rounded-[16px] font-semibold text-[15px] transition-[box-shadow,background] hover:bg-[var(--brand-accent-strong)] hover:shadow-[var(--brand-shadow)]"
        aria-expanded="false"
        data-oid="2k_c_27"
      >
        {button}
      </Button>
      <div
        className="absolute right-0 top-[calc(100%+4px)] bg-white/90 backdrop-blur-[20px] rounded-xl p-2 min-w-[160px] shadow-[0_8px_32px_rgba(147,51,234,0.15)] border border-white/40 opacity-0 -translate-y-1.5 pointer-events-none z-10 flex flex-col transition-[opacity,transform] [transition:opacity_200ms_ease_500ms,transform_200ms_ease_500ms] group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto group-hover:[transition-delay:0ms] group-focus-within:opacity-100 group-focus-within:translate-y-0 group-focus-within:pointer-events-auto group-focus-within:[transition-delay:0ms]"
        role="menu"
        data-oid="z7um0kb"
      >
        {items.map((item, i) => (
          <Button
            key={i}
            className="bg-transparent border-0 text-left w-full px-3 py-2 rounded-lg text-[#1f1f1f] hover:bg-[var(--brand-accent-soft)]"
            role="menuitem"
            onClick={item.onClick}
            data-oid="i7-h8ep"
          >
            {item.label}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default Dropdown;
