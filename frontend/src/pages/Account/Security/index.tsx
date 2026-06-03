import React, { useState } from "react";
import { changeAccountPassword } from "@/api/account";
import AccountSection from "../components/Section";
import StatusCard from "../components/StatusCard";
import { useAccountContext } from "..";

const Security: React.FC = () => {
  const { data, reload } = useAccountContext();
  const [form, setForm] = useState({ current_password: "", new_password: "", confirm_password: "" });
  const [message, setMessage] = useState("");

  const save = async () => {
    setMessage("");
    if (form.new_password !== form.confirm_password) {
      setMessage("两次新密码不一致");
      return;
    }
    try {
      await changeAccountPassword({
        current_password: form.current_password,
        new_password: form.new_password,
      });
      setForm({ current_password: "", new_password: "", confirm_password: "" });
      await reload();
      setMessage("密码已更新");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "密码更新失败");
    }
  };

  return (
    <>
      <AccountSection title="密码与安全" subtitle="修改登录密码并查看当前账户安全状态。">
        <div className="account-grid">
          <StatusCard label="密码状态" value={data?.has_password ? "已设置" : "未设置"} detail={data?.has_password ? "修改密码需要当前密码" : "首次设置无需当前密码"} />
          <StatusCard label="安全通知" value={data?.preferences.security_emails ? "开启" : "关闭"} detail="可在通知偏好中调整" />
        </div>
        <div className="account-form" style={{ marginTop: 14 }}>
          {data?.has_password && (
            <label className="account-label account-form__full">
              当前密码
              <input className="account-input" type="password" value={form.current_password} autoComplete="current-password" onChange={(e) => setForm((prev) => ({ ...prev, current_password: e.target.value }))} />
            </label>
          )}
          <label className="account-label">
            新密码
            <input className="account-input" type="password" value={form.new_password} autoComplete="new-password" onChange={(e) => setForm((prev) => ({ ...prev, new_password: e.target.value }))} />
          </label>
          <label className="account-label">
            确认新密码
            <input className="account-input" type="password" value={form.confirm_password} autoComplete="new-password" onChange={(e) => setForm((prev) => ({ ...prev, confirm_password: e.target.value }))} />
          </label>
        </div>
        <div className="account-actions">
          {message && <span className="account-empty">{message}</span>}
          <button className="account-button" type="button" onClick={save}>更新密码</button>
        </div>
      </AccountSection>

      <AccountSection title="防泄露措施" subtitle="账户安全相关数据的存储与传输策略。">
        <div className="account-list">
          <div className="account-list__item">
            <div>
              <div className="account-list__title">密码不会明文存储</div>
              <div className="account-list__meta">后端仅保存 bcrypt hash，接口响应不会返回密码或 hash。</div>
            </div>
          </div>
          <div className="account-list__item">
            <div>
              <div className="account-list__title">登录态使用 httpOnly Cookie</div>
              <div className="account-list__meta">前端脚本无法读取 token，降低 XSS 泄露风险。</div>
            </div>
          </div>
        </div>
      </AccountSection>
    </>
  );
};

export default Security;
