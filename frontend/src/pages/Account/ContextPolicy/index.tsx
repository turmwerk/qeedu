import React, { useEffect, useState } from "react";
import { updateAccountPreferences, type AccountPreference } from "@/api/account";
import AccountSection from "../components/Section";
import { useAccountContext } from "..";

const ContextPolicy: React.FC = () => {
  const { data, reload } = useAccountContext();
  const [form, setForm] = useState<Partial<AccountPreference>>({});

  useEffect(() => {
    if (data?.preferences) setForm(data.preferences);
  }, [data?.preferences]);

  const toggle = async (key: keyof AccountPreference, checked: boolean) => {
    const next = { ...form, [key]: checked };
    setForm(next);
    await updateAccountPreferences(next);
    await reload();
  };

  return (
    <AccountSection title="上下文策略" subtitle="控制 AI 是否自动引用当前文件、项目文件和历史对话。">
      <div className="account-list">
        {[
          ["context_current_file", "当前文件", "AI 输入框可一键附加当前编辑器文件。"],
          ["context_project_files", "项目文件", "运行和解释代码时允许读取项目相关文件。"],
          ["context_history", "历史对话", "允许 AI 使用历史对话作为上下文。"],
        ].map(([key, title, meta]) => (
          <label className="account-switch-row" key={key}>
            <span>
              <span className="account-list__title">{title}</span>
              <span className="account-list__meta">{meta}</span>
            </span>
            <input type="checkbox" checked={Boolean(form[key as keyof AccountPreference])} onChange={(e) => void toggle(key as keyof AccountPreference, e.target.checked)} />
          </label>
        ))}
      </div>
    </AccountSection>
  );
};

export default ContextPolicy;
