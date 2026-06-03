import React, { useEffect, useState } from "react";
import { updateAccountPreferences, type AccountPreference } from "@/api/account";
import AccountSection from "../components/Section";
import { useAccountContext } from "..";

const Preferences: React.FC = () => {
  const { data, reload } = useAccountContext();
  const [form, setForm] = useState<Partial<AccountPreference>>({});
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (data?.preferences) setForm(data.preferences);
  }, [data?.preferences]);

  const update = (key: keyof AccountPreference, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const save = async () => {
    setMessage("");
    try {
      await updateAccountPreferences(form);
      await reload();
      setMessage("账户偏好已保存");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "保存失败");
    }
  };

  return (
    <AccountSection title="账户偏好" subtitle="设置个人中心默认视图、语言、主题和界面习惯。">
      <div className="account-form">
        <label className="account-label">
          默认语言
          <select className="account-select" value={form.language || "zh-CN"} onChange={(e) => update("language", e.target.value)}>
            <option value="zh-CN">简体中文</option>
            <option value="zh-TW">繁體中文</option>
            <option value="en">English</option>
          </select>
        </label>
        <label className="account-label">
          主题
          <select className="account-select" value={form.theme || "system"} onChange={(e) => update("theme", e.target.value)}>
            <option value="system">跟随系统</option>
            <option value="light">亮色</option>
            <option value="dark">暗色</option>
          </select>
        </label>
        <label className="account-label">
          默认个人中心页面
          <select className="account-select" value={form.default_account_page || "/account"} onChange={(e) => update("default_account_page", e.target.value)}>
            <option value="/account">账户概览</option>
            <option value="/account/profile">个人资料</option>
            <option value="/account/ai-preferences">AI 偏好</option>
            <option value="/account/settings">设置</option>
          </select>
        </label>
        <label className="account-label">
          资料可见范围
          <select className="account-select" value={form.profile_visible || "private"} onChange={(e) => update("profile_visible", e.target.value)}>
            <option value="private">仅自己可见</option>
            <option value="team">同组织可见</option>
            <option value="public">公开</option>
          </select>
        </label>
      </div>
      <div className="account-list" style={{ marginTop: 14 }}>
        {[
          ["effects_enabled", "背景特效", "控制暗色背景星点和连线等视觉效果。"],
          ["share_usage_data", "匿名使用数据", "用于改进功能，不包含密码和密钥。"],
        ].map(([key, title, meta]) => (
          <label className="account-switch-row" key={key}>
            <span>
              <span className="account-list__title">{title}</span>
              <span className="account-list__meta">{meta}</span>
            </span>
            <input
              type="checkbox"
              checked={Boolean(form[key as keyof AccountPreference])}
              onChange={(e) => update(key as keyof AccountPreference, e.target.checked)}
            />
          </label>
        ))}
      </div>
      <div className="account-actions">
        {message && <span className="account-empty">{message}</span>}
        <button className="account-button" type="button" onClick={save}>保存偏好</button>
      </div>
    </AccountSection>
  );
};

export default Preferences;
