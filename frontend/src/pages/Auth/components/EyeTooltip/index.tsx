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
          className={`border-0 bg-transparent ${on ? "text-[var(--brand-purple)]" : "text-[var(--brand-blue)]"} hover:text-[var(--brand-purple)] group-hover:text-[var(--brand-purple)] cursor-pointer w-[56px] h-[56px] p-0 inline-flex items-center justify-center box-border outline-none`}
          onClick={onToggle}
          aria-label={ariaLabel}
        >
          {children}
        </Button>

        <div
          className="auth-eye-tooltip hidden group-hover:block absolute bottom-full mb-2 w-[220px] left-1/2 -translate-x-1/2 text-sm leading-5 p-3 rounded-xl shadow-lg z-50 bg-black/90 text-white"
        >
          <div>长度为 8-16 位字符</div>
          <div>字母/数字以及标点符号至少包含 2 种</div>
          <div>不允许有空格、中英文</div>
          <div className="auth-eye-tooltip-arrow absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-8 border-transparent border-t-black/90" />
        </div>
      </div>
    </div>
  );
}
