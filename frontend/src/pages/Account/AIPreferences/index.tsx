import React, { useEffect, useState } from "react";
import { updateAccountPreferences, type AccountPreference } from "@/api/account";
import AccountSection from "../components/Section";
import { useAccountContext } from "..";

const AIPreferences: React.FC = () => {
  const { data, reload } = useAccountContext();
  const [form, setForm] = useState<Partial<AccountPreference>>({});
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (data?.preferences) setForm(data.preferences);
  }, [data?.preferences]);

  const save = async () => {
    await updateAccountPreferences(form);
    await reload();
    setMessage("AI 偏好已保存");
  };

  return (
    <AccountSection title="AI 偏好" subtitle="设置 AI 输出风格、默认模型和功能页上下文策略。">
      <div className="account-form">
        <label className="account-label">
          默认聊天模型
          <input className="account-input" value={form.default_model || "deepseek-v4-flash"} onChange={(e) => setForm((prev) => ({ ...prev, default_model: e.target.value }))} />
        </label>
        <label className="account-label">
          代码助手模型
          <input className="account-input" value={form.code_model || "deepseek-v4-flash"} onChange={(e) => setForm((prev) => ({ ...prev, code_model: e.target.value }))} />
        </label>
        <label className="account-label">
          输出风格
          <select className="account-select" value={form.output_style || "balanced"} onChange={(e) => setForm((prev) => ({ ...prev, output_style: e.target.value }))}>
            <option value="concise">简洁</option>
            <option value="balanced">平衡</option>
            <option value="detailed">详细</option>
          </select>
        </label>
      </div>
      <div className="account-actions">
        {message && <span className="account-empty">{message}</span>}
        <button className="account-button" type="button" onClick={save}>保存 AI 偏好</button>
      </div>
    </AccountSection>
  );
};

export default AIPreferences;
