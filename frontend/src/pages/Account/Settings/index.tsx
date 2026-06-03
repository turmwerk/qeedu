import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { deleteAccount } from "@/api/account";
import { useAuth } from "@/hooks/useAuth";
import { getEffectsEnabled, toggleEffects } from "@/utils/effects/controller";
import { getStoredTheme, toggleTheme } from "@/utils/theme/controller";
import { useTranslation } from "@/hooks/useTranslation";
import AccountSection from "../components/Section";
import { useAccountContext } from "..";

const Settings: React.FC = () => {
  const navigate = useNavigate();
  const auth = useAuth();
  const { data } = useAccountContext();
  const { t } = useTranslation();
  const [theme, setTheme] = useState(getStoredTheme());
  const [effectsEnabled, setEffectsEnabled] = useState(getEffectsEnabled());
  const [danger, setDanger] = useState({ password: "", confirm: "" });
  const [message, setMessage] = useState("");

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

  const logout = async () => {
    await auth.logout();
    navigate("/login");
  };

  const removeAccount = async () => {
    setMessage("");
    try {
      await deleteAccount(danger);
      await auth.logout();
      navigate("/login");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "注销失败");
    }
  };

  return (
    <>
      <AccountSection title="设置" subtitle="管理个人中心里的语言、主题、背景特效和账户操作。">
        <div className="account-list">
          <div className="account-list__item">
            <div>
              <div className="account-list__title">{t("tooltips.languageSwitcher")}</div>
              <div className="account-list__meta">简体中文 / 繁體中文 / English</div>
            </div>
            <LanguageSwitcher />
          </div>
          <button className="account-list__item" type="button" onClick={() => setTheme(toggleTheme())}>
            <span>
              <span className="account-list__title">{t("common.theme")}</span>
              <span className="account-list__meta">{t("common.current", { value: theme === "dark" ? t("common.dark") : t("common.light") })}</span>
            </span>
            <span className="account-empty">{theme === "dark" ? t("common.switchToLight") : t("common.switchToDark")}</span>
          </button>
          <button className="account-list__item" type="button" onClick={() => setEffectsEnabled(toggleEffects())}>
            <span>
              <span className="account-list__title">{t("common.effects")}</span>
              <span className="account-list__meta">{t("common.current", { value: effectsEnabled ? t("common.enabled") : t("common.disabled") })}</span>
            </span>
            <span className="account-empty">{effectsEnabled ? t("common.disabled") : t("common.enabled")}</span>
          </button>
          <button className="account-button" type="button" onClick={logout}>{t("common.logout")}</button>
        </div>
      </AccountSection>

      <AccountSection title="危险操作" subtitle="注销账户会清除登录方式和敏感资料，请谨慎操作。">
        <div className="account-form">
          {data?.has_password && (
            <label className="account-label">
              当前密码
              <input className="account-input" type="password" value={danger.password} onChange={(e) => setDanger((prev) => ({ ...prev, password: e.target.value }))} />
            </label>
          )}
          <label className="account-label">
            输入 DELETE 确认
            <input className="account-input" value={danger.confirm} onChange={(e) => setDanger((prev) => ({ ...prev, confirm: e.target.value }))} />
          </label>
        </div>
        <div className="account-actions">
          {message && <span className="account-empty">{message}</span>}
          <button className="account-button account-button--danger" type="button" onClick={removeAccount}>注销账户</button>
        </div>
      </AccountSection>
    </>
  );
};

export default Settings;
