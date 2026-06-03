import React, { useEffect, useState } from "react";
import { updateAccountPreferences, type AccountPreference } from "@/api/account";
import AccountSection from "../components/Section";
import { useAccountContext } from "..";

const Notifications: React.FC = () => {
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
    <AccountSection title="通知偏好" subtitle="控制邮件提醒、产品消息和安全通知。">
      <div className="account-list">
        {[
          ["email_notifications", "邮件提醒", "作业、流程、论文等业务通知。"],
          ["product_notifications", "站内产品消息", "功能更新、任务完成和系统提示。"],
          ["security_emails", "安全邮件", "密码、邮箱和登录异常提醒。"],
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

export default Notifications;
