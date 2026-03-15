import React, { useState, useRef } from "react";
import Button from "@/ui/Button";
import HoverTooltip from "@/ui/HoverTooltip";
import GlobeIcon from "@/ui/Icon/GlobeIcon";
import SunIcon from "@/ui/Icon/SunIcon";
import MoonIcon from "@/ui/Icon/MoonIcon";
import SettingsIcon from "@/ui/Icon/SettingsIcon";
import { getStoredTheme, toggleTheme } from "@/utils/theme/controller";
import { showToast } from "@/ui/Toast";

/**
 * Auth 面板右上角操作栏
 * 桌面端 / 移动端：语言 | 主题 | 设置
 */
const AuthPanelActions: React.FC = () => {
  const [theme, setTheme] = useState(getStoredTheme());

  const handleToggleTheme = () => {
    const next = toggleTheme();
    setTheme(next);
  };

  const btnClass =
    "border-0 bg-transparent text-[var(--brand-blue)] hover:text-[var(--brand-purple)] cursor-pointer p-2 inline-flex items-center justify-center outline-none transition-colors rounded-lg leading-none";

  const ActionButton: React.FC<{
    label: string;
    ariaLabel: string;
    onClick: () => void;
    children: React.ReactNode;
  }> = ({ label, ariaLabel, onClick, children }) => {
    const [isJumping, setIsJumping] = useState(false);
    const jumpTimer = useRef<number | null>(null);

    return (
      <HoverTooltip
        content={label}
        tooltipClassName="text-xs leading-4 px-2.5 py-1.5"
      >
        <Button
          type="button"
          className={btnClass}
          aria-label={ariaLabel}
          onClick={onClick}
          onMouseEnter={() => {
            setIsJumping(true);
            if (jumpTimer.current) window.clearTimeout(jumpTimer.current);
            jumpTimer.current = window.setTimeout(() => {
              setIsJumping(false);
              jumpTimer.current = null;
            }, 120);
          }}
          onMouseLeave={() => {
            if (jumpTimer.current) {
              window.clearTimeout(jumpTimer.current);
              jumpTimer.current = null;
            }
            setIsJumping(false);
          }}
        >
          <span className={`inline-flex items-center justify-center transition-transform duration-100 ease-linear ${isJumping ? '-translate-y-1' : ''}`}>
            {children}
          </span>
        </Button>
      </HoverTooltip>
    );
  };

  /* Settings button: continuous spin when idle, stops + bounce on hover */
  const SettingsButton: React.FC = () => {
    const [hovered, setHovered] = useState(false);
    const [isJumping, setIsJumping] = useState(false);
    const jumpTimer = useRef<number | null>(null);

    return (
      <HoverTooltip
        content="设置"
        tooltipClassName="text-xs leading-4 px-2.5 py-1.5"
      >
        <Button
          type="button"
          className={btnClass}
          aria-label="设置"
          onClick={() => {}}
          onMouseEnter={() => {
            setHovered(true);
            setIsJumping(true);
            if (jumpTimer.current) window.clearTimeout(jumpTimer.current);
            jumpTimer.current = window.setTimeout(() => {
              setIsJumping(false);
              jumpTimer.current = null;
            }, 120);
          }}
          onMouseLeave={() => {
            setHovered(false);
            if (jumpTimer.current) {
              window.clearTimeout(jumpTimer.current);
              jumpTimer.current = null;
            }
            setIsJumping(false);
          }}
        >
          <span
            className={`inline-flex items-center justify-center transition-transform duration-100 ease-linear ${isJumping ? '-translate-y-1' : ''}`}
            style={{
              animation: hovered ? 'none' : 'authSettingsSpin 3s linear infinite',
            }}
          >
            <SettingsIcon />
          </span>
        </Button>
      </HoverTooltip>
    );
  };

  return (
    <>
      <style>{`
        @keyframes authSettingsSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
      <div className="flex items-center gap-0">
        {/* 语言按钮 */}
        <ActionButton label="切换语言" ariaLabel="语言" onClick={() => showToast("语言切换未实现")}>
          <GlobeIcon />
        </ActionButton>

        <span className="text-gray-300 text-[10px] select-none mx-0.5">|</span>

        {/* 主题切换按钮 */}
        <ActionButton label="切换主题" ariaLabel="切换主题" onClick={handleToggleTheme}>
          {theme === "dark" ? <SunIcon /> : <MoonIcon />}
        </ActionButton>

        <span className="text-gray-300 text-[10px] select-none mx-0.5">|</span>

        {/* 设置按钮 — 持续旋转，悬浮停止 */}
        <SettingsButton />
      </div>
    </>
  );
};

export default AuthPanelActions;
