import React, { useEffect, useState } from "react";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { getEffectsEnabled, toggleEffects } from "@/utils/effects/controller";
import { getStoredTheme, toggleTheme } from "@/utils/theme/controller";
import AccountSection from "./AccountSection";

const Settings: React.FC = () => {
  const [theme, setTheme] = useState(getStoredTheme());
  const [effectsEnabled, setEffectsEnabled] = useState(getEffectsEnabled());

  useEffect(() => {
    const syncTheme = () => setTheme(getStoredTheme());
    const syncEffects = () => setEffectsEnabled(getEffectsEnabled());
    window.addEventListener("theme-change", syncTheme);
    window.addEventListener("effects-change", syncEffects);
    window.addEventListener("storage", syncTheme);
    window.addEventListener("storage", syncEffects);
    return () => {
      window.removeEventListener("theme-change", syncTheme);
      window.removeEventListener("effects-change", syncEffects);
      window.removeEventListener("storage", syncTheme);
      window.removeEventListener("storage", syncEffects);
    };
  }, []);

  return (
    <AccountSection title="设置" subtitle="集中管理语言、主题和背景特效。">
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between rounded-lg border border-[var(--brand-border)] bg-[var(--surface-container-low)] p-4">
          <div>
            <div className="text-sm font-semibold">语言</div>
            <div className="text-xs text-[var(--brand-muted)]">简体中文 / 繁體中文 / English</div>
          </div>
          <LanguageSwitcher />
        </div>
        <button
          type="button"
          className="flex items-center justify-between rounded-lg border border-[var(--brand-border)] bg-[var(--surface-container-low)] p-4 text-left transition hover:border-[var(--brand-purple)] hover:text-[var(--brand-purple)]"
          onClick={() => setTheme(toggleTheme())}
        >
          <span>
            <span className="block text-sm font-semibold">主题</span>
            <span className="block text-xs text-[var(--brand-muted)]">当前：{theme === "dark" ? "暗色" : "亮色"}</span>
          </span>
          <span>{theme === "dark" ? "切换到亮色" : "切换到暗色"}</span>
        </button>
        <button
          type="button"
          className="flex items-center justify-between rounded-lg border border-[var(--brand-border)] bg-[var(--surface-container-low)] p-4 text-left transition hover:border-[var(--brand-purple)] hover:text-[var(--brand-purple)]"
          onClick={() => setEffectsEnabled(toggleEffects())}
        >
          <span>
            <span className="block text-sm font-semibold">背景特效</span>
            <span className="block text-xs text-[var(--brand-muted)]">当前：{effectsEnabled ? "开启" : "关闭"}</span>
          </span>
          <span>{effectsEnabled ? "关闭" : "开启"}</span>
        </button>
      </div>
    </AccountSection>
  );
};

export default Settings;
