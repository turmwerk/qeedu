import React, { useState } from "react";
import Button from "@/components/Button";
import HoverTooltip from "@/components/HoverTooltip";
import { SettingOutlined } from "@ant-design/icons";
import { getStoredTheme, toggleTheme } from "@/utils/theme";
import { showToast } from "@/components/Toast";

/** 地球（语言）图标 */
function GlobeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M12 3c-2.4 4.5-2.4 13.5 0 18M12 3c2.4 4.5 2.4 13.5 0 18M3.5 12h17"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M4.5 8.5h15M4.5 15.5h15"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** 太阳图标 */
function SunIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8" />
      <path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"
        stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

/** 月亮图标 */
function MoonIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"
        stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/**
 * Auth 面板右上角操作栏。
 * 桌面端/移动端：语言 | 主题 | 设置
 */
const AuthPanelActions: React.FC = () => {
  const [theme, setTheme] = useState(getStoredTheme());

  const handleToggleTheme = () => {
    const next = toggleTheme();
    setTheme(next);
  };

  const btnClass =
    "border-0 bg-transparent text-[var(--brand-blue)] hover:text-[var(--brand-purple)] cursor-pointer p-1.5 inline-flex items-center justify-center outline-none transition-colors rounded-lg leading-none";

  const ActionButton: React.FC<{
    label: string;
    ariaLabel: string;
    onClick: () => void;
    children: React.ReactNode;
  }> = ({ label, ariaLabel, onClick, children }) => (
    <HoverTooltip
      content={label}
      tooltipClassName="text-xs leading-4 px-2.5 py-1.5"
    >
      <Button
        type="button"
        className={btnClass}
        aria-label={ariaLabel}
        onClick={onClick}
      >
        {children}
      </Button>
    </HoverTooltip>
  );

  return (
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

      <ActionButton label="设置" ariaLabel="设置" onClick={() => {}}>
        <SettingOutlined style={{ fontSize: 18 }} />
      </ActionButton>
    </div>
  );
};

export default AuthPanelActions;
