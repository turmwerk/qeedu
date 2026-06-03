import React, { useEffect, useState } from "react";
import { uploadAccountAvatar, updateAccountEmail, updateAccountProfile } from "@/api/account";
import { sendEmailCode } from "@/api/auth";
import { apiAssetUrl } from "@/api/config";
import { useAuth } from "@/hooks/useAuth";
import AccountSection from "../components/Section";
import Field from "../components/Field";
import { useAccountContext } from "..";

const Profile: React.FC = () => {
  const { data, reload } = useAccountContext();
  const auth = useAuth();
  const profile = data?.profile;
  const [form, setForm] = useState({
    name: "",
    avatar_url: "",
    bio: "",
    role: "",
    school: "",
    major: "",
    timezone: "",
    locale: "",
  });
  const [emailForm, setEmailForm] = useState({ email: "", code: "" });
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!profile) return;
    setForm({
      name: profile.name || "",
      avatar_url: profile.avatar_url || "",
      bio: profile.bio || "",
      role: profile.role || "",
      school: profile.school || "",
      major: profile.major || "",
      timezone: profile.timezone || "",
      locale: profile.locale || "",
    });
    setEmailForm((prev) => ({ ...prev, email: profile.email || "" }));
  }, [profile]);

  const updateField = (key: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const saveProfile = async () => {
    setSaving(true);
    setMessage("");
    try {
      await updateAccountProfile(form);
      await reload();
      await auth.refresh();
      setMessage("个人资料已更新");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "保存失败");
    } finally {
      setSaving(false);
    }
  };

  const avatarSrc = form.avatar_url
    ? /^https?:\/\//i.test(form.avatar_url)
      ? form.avatar_url
      : apiAssetUrl(form.avatar_url)
    : "";

  const uploadAvatar = async (file: File | null | undefined) => {
    if (!file || uploadingAvatar) return;
    setMessage("");
    if (!/^image\/(jpeg|png|webp|gif)$/i.test(file.type)) {
      setMessage("头像仅支持 JPG、PNG、WebP 或 GIF");
      return;
    }
    if (file.size > 3 * 1024 * 1024) {
      setMessage("头像文件需小于 3MB");
      return;
    }
    setUploadingAvatar(true);
    try {
      const res = await uploadAccountAvatar(file);
      updateField("avatar_url", res.avatar_url);
      await reload();
      await auth.refresh();
      setMessage("头像已更新");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "头像上传失败");
    } finally {
      setUploadingAvatar(false);
    }
  };

  const sendCode = async () => {
    setMessage("");
    try {
      await sendEmailCode(emailForm.email, "change_email");
      setMessage("验证码已发送到新邮箱");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "验证码发送失败");
    }
  };

  const saveEmail = async () => {
    setSaving(true);
    setMessage("");
    try {
      await updateAccountEmail(emailForm);
      await reload();
      await auth.refresh();
      setMessage("绑定邮箱已更新");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "邮箱更新失败");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <AccountSection title="个人资料" subtitle="修改头像、用户名、展示资料和校内身份信息。">
        {profile && (
          <div className="account-grid">
            <Field label="用户 ID" value={profile.id} />
            <Field label="账户创建时间" value={new Date(profile.created_at).toLocaleString()} />
          </div>
        )}
        <div className="account-form" style={{ marginTop: 14 }}>
          <label className="account-label">
            用户名
            <input className="account-input" value={form.name} onChange={(e) => updateField("name", e.target.value)} />
          </label>
          <div className="account-label account-form__full">
            头像
            <div className="account-avatar-editor">
              <div className="account-avatar-preview" aria-label="当前头像">
                {avatarSrc ? <img src={avatarSrc} alt="头像" /> : <span>{form.name ? form.name.slice(0, 1).toUpperCase() : "U"}</span>}
              </div>
              <div className="account-avatar-controls">
                <label className="account-button account-avatar-upload">
                  {uploadingAvatar ? "上传中..." : "本地上传头像"}
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/gif"
                    onChange={(e) => {
                      void uploadAvatar(e.target.files?.[0]);
                      e.currentTarget.value = "";
                    }}
                  />
                </label>
                <input
                  className="account-input"
                  value={form.avatar_url}
                  onChange={(e) => updateField("avatar_url", e.target.value)}
                  placeholder="也可以粘贴头像 URL"
                />
              </div>
            </div>
          </div>
          <label className="account-label">
            角色
            <select className="account-select" value={form.role} onChange={(e) => updateField("role", e.target.value)}>
              <option value="">未选择</option>
              <option value="student">学生</option>
              <option value="teacher">教师</option>
              <option value="manager">教务管理</option>
              <option value="researcher">科研人员</option>
              <option value="international">国际交流</option>
              <option value="admin">管理员</option>
            </select>
          </label>
          <label className="account-label">
            学院
            <input className="account-input" value={form.school} onChange={(e) => updateField("school", e.target.value)} />
          </label>
          <label className="account-label">
            专业方向
            <input className="account-input" value={form.major} onChange={(e) => updateField("major", e.target.value)} />
          </label>
          <label className="account-label">
            时区
            <input className="account-input" value={form.timezone} onChange={(e) => updateField("timezone", e.target.value)} placeholder="Asia/Shanghai" />
          </label>
          <label className="account-label">
            语言标记
            <select className="account-select" value={form.locale} onChange={(e) => updateField("locale", e.target.value)}>
              <option value="">跟随账户偏好</option>
              <option value="zh-CN">简体中文</option>
              <option value="zh-TW">繁體中文</option>
              <option value="en">English</option>
            </select>
          </label>
          <label className="account-label account-form__full">
            简介
            <textarea className="account-textarea" value={form.bio} onChange={(e) => updateField("bio", e.target.value)} />
          </label>
        </div>
        <div className="account-actions">
          {message && <span className="account-empty">{message}</span>}
          <button className="account-button" type="button" onClick={saveProfile} disabled={saving}>
            {saving ? "保存中..." : "保存资料"}
          </button>
        </div>
      </AccountSection>

      <AccountSection title="绑定邮箱" subtitle="邮箱用于验证码登录、找回密码和安全通知。修改邮箱需要新邮箱验证码。">
        <div className="account-form">
          <label className="account-label">
            新邮箱
            <input className="account-input" value={emailForm.email} onChange={(e) => setEmailForm((prev) => ({ ...prev, email: e.target.value }))} />
          </label>
          <label className="account-label">
            验证码
            <input className="account-input" value={emailForm.code} onChange={(e) => setEmailForm((prev) => ({ ...prev, code: e.target.value }))} />
          </label>
        </div>
        <div className="account-actions">
          <button className="account-button" type="button" onClick={sendCode}>获取验证码</button>
          <button className="account-button" type="button" onClick={saveEmail} disabled={saving}>更新邮箱</button>
        </div>
      </AccountSection>
    </>
  );
};

export default Profile;
