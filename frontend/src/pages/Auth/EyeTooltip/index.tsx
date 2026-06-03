import React from "react";
import Button from "@/ui/Button";
import HoverTooltip from "@/ui/HoverTooltip";

export interface EyeTooltipProps {
  on: boolean;
  onToggle: () => void;
  ariaLabel?: string;
  children: React.ReactNode;
}

export default function EyeTooltip({ on, onToggle, ariaLabel, children }: EyeTooltipProps) {
  return (
    <div className="absolute right-0 top-0 w-[56px] h-[56px] p-0 inline-flex items-center justify-center box-border">
      <HoverTooltip
        tooltipClassName="auth-eye-tooltip w-[220px] text-sm leading-5 p-3"
        content={
          <>
            <div>长度为 8-16 位字符</div>
            <div>字母/数字以及标点符号至少包含 2 种</div>
            <div>不允许有空格、中英文</div>
          </>
        }
      >
        <Button
          type="button"
          className={`border-0 bg-transparent ${on ? "text-[var(--brand-purple)]" : "text-[var(--brand-blue)]"} hover:text-[var(--brand-purple)] group-hover:text-[var(--brand-purple)] cursor-pointer w-[56px] h-[56px] p-0 inline-flex items-center justify-center box-border outline-none`}
          onClick={onToggle}
          aria-label={ariaLabel}
        >
          {children}
        </Button>
      </HoverTooltip>
    </div>
  );
}
