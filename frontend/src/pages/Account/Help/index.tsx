import React, { useState } from "react";
import { submitAccountFeedback } from "@/api/account";
import AccountSection from "../components/Section";

const Help: React.FC = () => {
  const [form, setForm] = useState({ category: "功能问题", message: "" });
  const [message, setMessage] = useState("");

  const submit = async () => {
    setMessage("");
    try {
      await submitAccountFeedback(form);
      setForm((prev) => ({ ...prev, message: "" }));
      setMessage("反馈已提交");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "提交失败");
    }
  };

  return (
    <AccountSection title="帮助反馈" subtitle="提交功能问题、安全问题或改进建议。">
      <div className="account-form">
        <label className="account-label">
          类型
          <select className="account-select" value={form.category} onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}>
            <option>功能问题</option>
            <option>安全问题</option>
            <option>AI 输出问题</option>
            <option>界面建议</option>
          </select>
        </label>
        <label className="account-label account-form__full">
          反馈内容
          <textarea className="account-textarea" value={form.message} onChange={(e) => setForm((prev) => ({ ...prev, message: e.target.value }))} />
        </label>
      </div>
      <div className="account-actions">
        {message && <span className="account-empty">{message}</span>}
        <button className="account-button" type="button" onClick={submit}>提交反馈</button>
      </div>
    </AccountSection>
  );
};

export default Help;
