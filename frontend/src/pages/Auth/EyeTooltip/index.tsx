import React from "react";
import Button from "@/ui/Button";

export interface EyeTooltipProps {
  on: boolean;
  onToggle: () => void;
  ariaLabel?: string;
  children: React.ReactNode;
}

export default function EyeTooltip({ on, onToggle, ariaLabel, children }: EyeTooltipProps) {
  return (
    <div className="absolute right-0 top-0 w-[56px] h-[56px] p-0 inline-flex items-center justify-center box-border">
      <style>{`
        .auth-eye-tooltip {
          background: rgba(255, 255, 255, 0.92);
          border-color: rgba(17, 24, 39, 0.14);
          box-shadow: 0 18px 44px rgba(15, 23, 42, 0.18), inset 0 1px 0 rgba(255, 255, 255, 0.78);
          color: #111827;
          -webkit-backdrop-filter: blur(18px) saturate(150%);
          backdrop-filter: blur(18px) saturate(150%);
        }
        .auth-eye-tooltip-arrow {
          background: rgba(255, 255, 255, 0.92);
          border-color: rgba(17, 24, 39, 0.14);
        }
        .auth-eye-trigger {
          background: rgba(255, 255, 255, 0.92) !important;
          border: 1px solid rgba(17, 24, 39, 0.14) !important;
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.78) !important;
          color: var(--brand-blue) !important;
          -webkit-backdrop-filter: blur(16px) saturate(150%);
          backdrop-filter: blur(16px) saturate(150%);
        }
        .auth-eye-trigger:hover,
        .auth-eye-trigger:focus-visible {
          border-color: rgba(26, 158, 26, 0.52) !important;
          color: var(--brand-purple) !important;
          outline: none !important;
        }
        [data-theme="dark"] .auth-eye-tooltip {
          background: rgba(10, 10, 10, 0.92) !important;
          border-color: rgba(31, 196, 31, 0.34) !important;
          box-shadow:
            0 18px 44px rgba(0, 0, 0, 0.60),
            inset 0 1px 0 rgba(255, 255, 255, 0.12),
            inset 0 -1px 0 rgba(255, 255, 255, 0.06) !important;
          color: var(--brand-text) !important;
        }
        [data-theme="dark"] .auth-eye-tooltip div {
          color: var(--brand-text) !important;
        }
        [data-theme="dark"] .auth-eye-tooltip-arrow {
          background: rgba(10, 10, 10, 0.92) !important;
          border-color: rgba(31, 196, 31, 0.34) !important;
        }
        [data-theme="dark"] .auth-eye-trigger {
          background: rgba(255, 255, 255, 0.16) !important;
          border-color: rgba(31, 196, 31, 0.28) !important;
          box-shadow:
            0 18px 44px rgba(0, 0, 0, 0.60),
            inset 0 1px 0 rgba(255, 255, 255, 0.18),
            inset 0 -1px 0 rgba(255, 255, 255, 0.10) !important;
          color: var(--brand-text) !important;
        }
        [data-theme="dark"] .auth-eye-trigger:hover,
        [data-theme="dark"] .auth-eye-trigger:focus-visible {
          background: rgba(255, 255, 255, 0.16) !important;
          border-color: #1fc41f !important;
          color: #1fc41f !important;
          box-shadow:
            0 0 0 1px rgba(31, 196, 31, 0.18),
            0 18px 44px rgba(0, 0, 0, 0.60),
            inset 0 1px 0 rgba(255, 255, 255, 0.18),
            inset 0 -1px 0 rgba(255, 255, 255, 0.10) !important;
        }
      `}</style>
      <div className="auth-eye-tooltip-root group/auth-eye-tooltip relative inline-flex h-full w-full items-center justify-center">
        <Button
          type="button"
          className={`auth-eye-trigger ${on ? "text-[var(--brand-purple)]" : "text-[var(--brand-blue)]"} hover:text-[var(--brand-purple)] group-hover:text-[var(--brand-purple)] cursor-pointer w-[46px] h-[46px] p-0 inline-flex items-center justify-center box-border outline-none rounded-2xl`}
          onClick={onToggle}
          aria-label={ariaLabel}
        >
          {children}
        </Button>
        <div className="auth-eye-tooltip pointer-events-none absolute bottom-full left-1/2 z-50 mb-1 hidden w-[220px] -translate-x-1/2 whitespace-normal rounded-xl border px-3 py-3 text-sm leading-5 opacity-0 transition-opacity duration-150 group-hover/auth-eye-tooltip:block group-hover/auth-eye-tooltip:opacity-100 group-focus-within/auth-eye-tooltip:block group-focus-within/auth-eye-tooltip:opacity-100">
          <div>长度为 8-16 位字符</div>
          <div>字母/数字以及标点符号至少包含 2 种</div>
          <div>不允许有空格、中英文</div>
          <div className="auth-eye-tooltip-arrow absolute left-1/2 top-full h-3 w-3 -translate-x-1/2 -translate-y-1/2 rotate-45 border-b border-r" />
        </div>
      </div>
    </div>
  );
}
