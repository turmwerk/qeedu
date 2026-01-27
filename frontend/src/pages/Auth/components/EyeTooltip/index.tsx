import React from "react";
import Button from "@/components/Button";

export interface EyeTooltipProps {
  on: boolean;
  onToggle: () => void;
  ariaLabel?: string;
  children: React.ReactNode;
}

export default function EyeTooltip({ on, onToggle, ariaLabel, children }: EyeTooltipProps) {
  return (
    <div className="absolute right-0 top-0 w-[56px] h-[56px] p-0 inline-flex items-center justify-center box-border">
      <div className="group relative">
        <Button
          type="button"
          className="border-0 bg-transparent text-[var(--brand-muted)] hover:text-[#6d28d9] group-hover:text-[#6d28d9] cursor-pointer w-[56px] h-[56px] p-0 inline-flex items-center justify-center box-border outline-none"
          onClick={onToggle}
          aria-label={ariaLabel}
        >
          {children}
        </Button>

        <div className="hidden group-hover:block absolute right-0 top-[66px] w-[280px] bg-black text-white text-sm leading-5 p-3 rounded shadow-lg z-50">
          <div>长度为8-16位字符</div>
          <div>字母/数字以及标点符号至少包含2种</div>
          <div>不允许有空格、中文</div>
          <div className="absolute left-1/2 -translate-x-1/2 -top-2 w-0 h-0 border-8 border-transparent border-b-black"></div>
        </div>
      </div>
    </div>
  );
}
