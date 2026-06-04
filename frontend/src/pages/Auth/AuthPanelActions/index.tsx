import React, { useState, useRef } from "react";
import Button from "@/ui/Button";
import HoverTooltip from "@/ui/HoverTooltip";
import SunIcon from "@/ui/Icon/SunIcon";
import MoonIcon from "@/ui/Icon/MoonIcon";
import GitHubIcon from "@/ui/Icon/GitHubIcon";
import { getStoredTheme, toggleTheme } from "@/utils/theme/controller";
import LanguageSwitcher from "@/components/LanguageSwitcher";

/**
 * Auth 面板右上角操作栏
 * 桌面端 / 移动端：语言 | 主题 | GitHub 仓库
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

  const GitHubRepoButton: React.FC = () => {
    const [hovered, setHovered] = useState(false);
    const [isJumping, setIsJumping] = useState(false);
    const jumpTimer = useRef<number | null>(null);

    return (
      <HoverTooltip
        content="GitHub 仓库"
        tooltipClassName="text-xs leading-4 px-2.5 py-1.5"
      >
        <a
          href="https://github.com/turmwerk/qeedu"
          target="_blank"
          rel="noreferrer"
          className={btnClass}
          aria-label="GitHub 仓库"
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
            className={`inline-flex items-center justify-center transition-transform duration-100 ease-linear ${isJumping ? '-translate-y-1' : ''} ${hovered ? 'scale-[1.04]' : ''}`}
          >
            <GitHubIcon />
          </span>
        </a>
      </HoverTooltip>
    );
  };

  return (
    <>
      <div className="flex items-center gap-0">
        <LanguageSwitcher iconSize={22} />

        <span className="text-gray-300 text-[10px] select-none mx-0.5">|</span>

        {/* 主题切换按钮 */}
        <ActionButton label="切换主题" ariaLabel="切换主题" onClick={handleToggleTheme}>
          {theme === "dark" ? <SunIcon /> : <MoonIcon />}
        </ActionButton>

        <span className="text-gray-300 text-[10px] select-none mx-0.5">|</span>

        <GitHubRepoButton />
      </div>
    </>
  );
};

export default AuthPanelActions;
