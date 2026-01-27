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
          className={`border-0 bg-transparent ${on ? 'text-[#6d28d9]' : 'text-blue-600'} hover:text-[#6d28d9] group-hover:text-[#6d28d9] cursor-pointer w-[56px] h-[56px] p-0 inline-flex items-center justify-center box-border outline-none`}
          onClick={onToggle}
          aria-label={ariaLabel}
        >
          {children}
        </Button>

        <div
          className="hidden group-hover:block absolute bottom-full mb-2 bg-black text-white text-sm leading-5 p-3 rounded shadow-lg z-50"
          style={{ width: 220, left: '50%', transform: 'translateX(-50%)' }}
        >
          <div>长度为8-16位字符</div>
          <div>字母/数字以及标点符号至少包含2种</div>
          <div>不允许有空格、中文</div>
          <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-8 border-transparent border-t-black" />
        </div>
      </div>
    </div>
  );
}
