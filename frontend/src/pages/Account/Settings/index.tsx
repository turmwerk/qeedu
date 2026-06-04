import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import {
  deleteAccount,
  updateAccountPreferences,
  updateAccountProfile,
  type AccountPreference,
  type AccountProfile,
} from "@/api/account";
import { useAuth } from "@/hooks/useAuth";
import { getEffectsEnabled, setEffectsEnabled } from "@/utils/effects/controller";
import { applyTheme, getStoredTheme, type Theme } from "@/utils/theme/controller";
import { useTranslation } from "@/hooks/useTranslation";
import AccountSection from "../components/Section";
import StatusCard from "../components/StatusCard";
import { useAccountContext } from "..";

type ProfileDraft = Pick<AccountProfile, "name" | "avatar_url" | "bio" | "role" | "school" | "major" | "timezone" | "locale">;

const roleOptions = [
  { value: "student", label: "学生", page: "/study", module: "助学", desc: "学业雷达、资源包、目标拆解与代码辅导。" },
  { value: "teacher", label: "教师/助教", page: "/teaching", module: "助教", desc: "大纲生成、试卷设计、作业初审与反馈初稿。" },
  { value: "researcher", label: "科研人员", page: "/research", module: "助研", desc: "文献检索、结构化精读、论文写作与投稿节奏。" },
  { value: "manager", label: "管理人员", page: "/management", module: "助管", desc: "事务流程、通知公告、材料审核、问答与数据看板。" },
  { value: "international", label: "国际交流", page: "/international", module: "助国际化", desc: "项目匹配、文书邮件、行前保障、境外支持与来华服务。" },
  { value: "admin", label: "平台管理员", page: "/management", module: "中台运营", desc: "权限分级、运行看板、流程复核与校本知识库维护。" },
] as const;

const moduleOptions = [
  { value: "/study", label: "助学", desc: "学生画像、课程资源、风险预警与成长规划。" },
  { value: "/teaching", label: "助教", desc: "教学材料生成、批改辅助与人工复核。" },
  { value: "/research", label: "助研", desc: "科研任务链路、证据摘录与写作推进。" },
  { value: "/management", label: "助管", desc: "事务办理、节点管理、公告材料与数据看板。" },
  { value: "/international", label: "助国际化", desc: "一站式、可追踪、可提醒、可复核的国际交流工作流。" },
  { value: "/account", label: "个人中心", desc: "账户资料、登录方式、AI 偏好与安全状态。" },
] as const;

const outputStyleOptions = [
  { value: "concise", label: "简洁", desc: "适合快速问答和移动端阅读。" },
  { value: "balanced", label: "平衡", desc: "兼顾解释、依据和下一步行动。" },
  { value: "detailed", label: "详细", desc: "适合流程办理、材料复核和论文写作。" },
] as const;

const visibilityOptions = [
  { value: "private", label: "仅自己可见", desc: "默认最小暴露，适合个人资料和敏感学习记录。" },
  { value: "team", label: "同组织可见", desc: "便于同学院、课题组或办公室协作。" },
  { value: "public", label: "公开", desc: "仅建议用于展示型资料，不包含隐私数据。" },
] as const;

const languageLabels: Record<string, string> = {
  "zh-CN": "简体中文",
  "zh-TW": "繁體中文",
  en: "English",
};

const roleByValue = Object.fromEntries(roleOptions.map((item) => [item.value, item]));
const moduleByPage = Object.fromEntries(moduleOptions.map((item) => [item.value, item]));

const Settings: React.FC = () => {
  const navigate = useNavigate();
  const auth = useAuth();
  const { data, reload } = useAccountContext();
  const { t } = useTranslation();
  const [theme, setTheme] = useState<Theme>(getStoredTheme());
  const [effectsEnabled, setEffectsEnabledState] = useState(getEffectsEnabled());
  const [profileForm, setProfileForm] = useState<ProfileDraft>({
    name: "",
    avatar_url: "",
    bio: "",
    role: "",
    school: "",
    major: "",
    timezone: "",
    locale: "",
  });
  const [preferenceForm, setPreferenceForm] = useState<Partial<AccountPreference>>({});
  const [danger, setDanger] = useState({ password: "", confirm: "" });
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!data?.profile) return;
    setProfileForm({
      name: data.profile.name || "",
      avatar_url: data.profile.avatar_url || "",
      bio: data.profile.bio || "",
      role: data.profile.role || "",
      school: data.profile.school || "",
      major: data.profile.major || "",
      timezone: data.profile.timezone || "",
      locale: data.profile.locale || "",
    });
  }, [data?.profile]);

  useEffect(() => {
    if (data?.preferences) setPreferenceForm(data.preferences);
  }, [data?.preferences]);

  useEffect(() => {
    const syncTheme = () => setTheme(getStoredTheme());
    const syncEffects = () => setEffectsEnabledState(getEffectsEnabled());
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

  const selectedRole = roleByValue[profileForm.role];
  const selectedModule = moduleByPage[String(preferenceForm.default_account_page || "/account")];
  const visibleContexts = useMemo(
    () =>
      [
        preferenceForm.context_current_file && "当前文件",
        preferenceForm.context_project_files && "项目文件",
        preferenceForm.context_history && "历史对话",
      ].filter(Boolean).join("、") || "最小上下文",
    [preferenceForm.context_current_file, preferenceForm.context_history, preferenceForm.context_project_files],
  );

  const updateProfileField = (key: keyof ProfileDraft, value: string) => {
    setProfileForm((prev) => ({ ...prev, [key]: value }));
    if (key === "role") {
      const nextRole = roleByValue[value];
      if (nextRole) {
        setPreferenceForm((prev) => ({ ...prev, default_account_page: nextRole.page }));
      }
    }
  };

  const updatePreferenceField = (key: keyof AccountPreference, value: string | boolean) => {
    setPreferenceForm((prev) => ({ ...prev, [key]: value }));
  };

  const saveWorkspaceSettings = async () => {
    setMessage("");
    if (profileForm.name.trim().length < 2) {
      setMessage("用户名需为 2-30 个字符");
      return;
    }
    setSaving(true);
    try {
      const nextPreferences: Partial<AccountPreference> = {
        ...preferenceForm,
        theme,
        effects_enabled: effectsEnabled,
        default_model: preferenceForm.default_model || "deepseek-v4-flash",
        code_model: preferenceForm.code_model || "deepseek-v4-flash",
      };
      await updateAccountProfile(profileForm);
      await updateAccountPreferences(nextPreferences);
      await reload();
      await auth.refresh();
      setMessage("个人工作台设置已保存");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "保存失败");
    } finally {
      setSaving(false);
    }
  };

  const setThemeAndPersist = (value: Theme) => {
    applyTheme(value);
    setTheme(value);
    updatePreferenceField("theme", value);
  };

  const setEffectsAndPersist = (checked: boolean) => {
    setEffectsEnabled(checked);
    setEffectsEnabledState(checked);
    updatePreferenceField("effects_enabled", checked);
  };

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
      <AccountSection title="个人工作台设置" subtitle="基于启育路演中的角色匹配、校情适配、流程落地与风险控制，配置你的默认工作方式。">
        <div className="account-grid account-grid--three">
          <StatusCard label="角色匹配" value={selectedRole?.module || "未选择"} detail={selectedRole?.desc || "选择校内身份后自动推荐默认模块。"} />
          <StatusCard label="默认入口" value={selectedModule?.label || "个人中心"} detail={selectedModule?.desc || "进入账户后默认查看个人中心。"} />
          <StatusCard label="AI 协同边界" value={visibleContexts} detail="控制 AI 能引用哪些上下文，降低数据外溢风险。" />
        </div>
        <div className="account-settings-principles" aria-label="启育设置原则">
          {["校本知识库 RAG", "引用溯源", "权限分级", "人工复核"].map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
      </AccountSection>

      <AccountSection title="角色画像与默认入口" subtitle="让平台优先匹配你最常使用的模块，把 AI 从回答问题推进到协同办事。">
        <div className="account-form">
          <label className="account-label">
            用户名
            <input className="account-input" value={profileForm.name} onChange={(e) => updateProfileField("name", e.target.value)} />
          </label>
          <label className="account-label">
            校内角色
            <select className="account-select" value={profileForm.role} onChange={(e) => updateProfileField("role", e.target.value)}>
              <option value="">未选择</option>
              {roleOptions.map((item) => (
                <option key={item.value} value={item.value}>{item.label}</option>
              ))}
            </select>
          </label>
          <label className="account-label">
            学院/部门
            <input className="account-input" value={profileForm.school} onChange={(e) => updateProfileField("school", e.target.value)} placeholder="例如：软件学院 / 国际处" />
          </label>
          <label className="account-label">
            专业/岗位方向
            <input className="account-input" value={profileForm.major} onChange={(e) => updateProfileField("major", e.target.value)} placeholder="例如：计算机科学 / 项目管理" />
          </label>
          <label className="account-label">
            默认入口
            <select className="account-select" value={String(preferenceForm.default_account_page || "/account")} onChange={(e) => updatePreferenceField("default_account_page", e.target.value)}>
              {moduleOptions.map((item) => (
                <option key={item.value} value={item.value}>{item.label}</option>
              ))}
            </select>
          </label>
          <label className="account-label">
            语言标记
            <select className="account-select" value={profileForm.locale} onChange={(e) => updateProfileField("locale", e.target.value)}>
              <option value="">跟随账户偏好</option>
              <option value="zh-CN">简体中文</option>
              <option value="zh-TW">繁體中文</option>
              <option value="en">English</option>
            </select>
          </label>
        </div>
        <div className="account-settings-option-grid">
          {moduleOptions.map((item) => (
            <button
              key={item.value}
              className={`account-settings-option ${preferenceForm.default_account_page === item.value ? "is-active" : ""}`}
              type="button"
              onClick={() => updatePreferenceField("default_account_page", item.value)}
            >
              <span>{item.label}</span>
              <small>{item.desc}</small>
            </button>
          ))}
        </div>
      </AccountSection>

      <AccountSection title="AI 协同与模型偏好" subtitle="围绕校本知识库、结构化工作流和多 Agent 编排，设置默认模型、输出风格和上下文授权。">
        <div className="account-form">
          <label className="account-label">
            默认聊天模型
            <select className="account-select" value={String(preferenceForm.default_model || "deepseek-v4-flash")} onChange={(e) => updatePreferenceField("default_model", e.target.value)}>
              <option value="deepseek-v4-flash">deepseek-v4-flash</option>
              <option value="openrouter-fast-free">OpenRouter 速度优先免费模型</option>
            </select>
          </label>
          <label className="account-label">
            代码助手模型
            <select className="account-select" value={String(preferenceForm.code_model || "deepseek-v4-flash")} onChange={(e) => updatePreferenceField("code_model", e.target.value)}>
              <option value="deepseek-v4-flash">deepseek-v4-flash</option>
              <option value="openrouter-fast-free">OpenRouter 速度优先免费模型</option>
            </select>
          </label>
          <label className="account-label account-form__full">
            输出风格
            <select className="account-select" value={String(preferenceForm.output_style || "balanced")} onChange={(e) => updatePreferenceField("output_style", e.target.value)}>
              {outputStyleOptions.map((item) => (
                <option key={item.value} value={item.value}>{item.label}</option>
              ))}
            </select>
          </label>
        </div>
        <div className="account-list" style={{ marginTop: 14 }}>
          {[
            ["context_current_file", "当前文件", "代码辅导和写作场景中，允许 AI 引用当前打开的文件。"],
            ["context_project_files", "项目文件", "允许 AI 在运行解释、项目诊断时读取相关项目文件。"],
            ["context_history", "历史对话", "允许 AI 使用当前页面历史对话保持上下文连续。"],
          ].map(([key, title, meta]) => (
            <label className="account-switch-row" key={key}>
              <span>
                <span className="account-list__title">{title}</span>
                <span className="account-list__meta">{meta}</span>
              </span>
              <input type="checkbox" checked={Boolean(preferenceForm[key as keyof AccountPreference])} onChange={(e) => updatePreferenceField(key as keyof AccountPreference, e.target.checked)} />
            </label>
          ))}
        </div>
      </AccountSection>

      <AccountSection title="风险控制与权限" subtitle="按“数据不出校、权限可控制、过程可追溯、人工做复核”的原则，收紧隐私和数据使用边界。">
        <div className="account-form">
          <label className="account-label">
            资料可见范围
            <select className="account-select" value={String(preferenceForm.profile_visible || "private")} onChange={(e) => updatePreferenceField("profile_visible", e.target.value)}>
              {visibilityOptions.map((item) => (
                <option key={item.value} value={item.value}>{item.label}</option>
              ))}
            </select>
          </label>
          <label className="account-label">
            时区
            <input className="account-input" value={profileForm.timezone} onChange={(e) => updateProfileField("timezone", e.target.value)} placeholder="Asia/Shanghai" />
          </label>
        </div>
        <div className="account-list" style={{ marginTop: 14 }}>
          <label className="account-switch-row">
            <span>
              <span className="account-list__title">匿名使用数据</span>
              <span className="account-list__meta">仅用于改进模块体验，不包含密码、密钥、原始材料和敏感身份信息。</span>
            </span>
            <input type="checkbox" checked={Boolean(preferenceForm.share_usage_data)} onChange={(e) => updatePreferenceField("share_usage_data", e.target.checked)} />
          </label>
          <div className="account-settings-option-grid">
            {visibilityOptions.map((item) => (
              <button
                key={item.value}
                className={`account-settings-option ${preferenceForm.profile_visible === item.value ? "is-active" : ""}`}
                type="button"
                onClick={() => updatePreferenceField("profile_visible", item.value)}
              >
                <span>{item.label}</span>
                <small>{item.desc}</small>
              </button>
            ))}
          </div>
        </div>
      </AccountSection>

      <AccountSection title="流程提醒与国际化支持" subtitle="让申请、教学、科研和管理流程具备可追踪、可提醒、可复核的闭环能力。">
        <div className="account-list">
          {[
            ["email_notifications", "邮件提醒", "用于作业、流程、论文、交换申请等关键节点提醒。"],
            ["product_notifications", "站内产品消息", "用于任务完成、材料补件、数据看板和系统提示。"],
            ["security_emails", "安全邮件", "用于密码、邮箱、登录异常和第三方绑定提醒。"],
          ].map(([key, title, meta]) => (
            <label className="account-switch-row" key={key}>
              <span>
                <span className="account-list__title">{title}</span>
                <span className="account-list__meta">{meta}</span>
              </span>
              <input type="checkbox" checked={Boolean(preferenceForm[key as keyof AccountPreference])} onChange={(e) => updatePreferenceField(key as keyof AccountPreference, e.target.checked)} />
            </label>
          ))}
        </div>
      </AccountSection>

      <AccountSection title="界面与语言" subtitle="管理语言、主题和背景特效；语言切换仍保持即时生效。">
        <div className="account-list">
          <div className="account-list__item">
            <div>
              <div className="account-list__title">{t("tooltips.languageSwitcher")}</div>
              <div className="account-list__meta">{languageLabels[String(profileForm.locale || preferenceForm.language || "zh-CN")] || "简体中文 / 繁體中文 / English"}</div>
            </div>
            <LanguageSwitcher />
          </div>
          <div className="account-form">
            <label className="account-label">
              主题
              <select className="account-select" value={theme} onChange={(e) => setThemeAndPersist(e.target.value as Theme)}>
                <option value="light">亮色</option>
                <option value="dark">暗色</option>
              </select>
            </label>
            <label className="account-label">
              背景特效
              <select className="account-select" value={effectsEnabled ? "on" : "off"} onChange={(e) => setEffectsAndPersist(e.target.value === "on")}>
                <option value="on">{t("common.enabled")}</option>
                <option value="off">{t("common.disabled")}</option>
              </select>
            </label>
          </div>
        </div>
      </AccountSection>

      <div className="account-actions">
        {message && <span className="account-empty">{message}</span>}
        <button className="account-button" type="button" onClick={saveWorkspaceSettings} disabled={saving}>
          {saving ? "保存中..." : "保存个人设置"}
        </button>
        <button className="account-button" type="button" onClick={logout}>{t("common.logout")}</button>
      </div>

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
          <button className="account-button account-button--danger" type="button" onClick={removeAccount}>注销账户</button>
        </div>
      </AccountSection>

      <style>{`
        .account-settings-principles,
        .account-settings-option-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 10px;
          margin-top: 16px;
        }

        .account-settings-principles span,
        .account-settings-option {
          min-width: 0;
          border: 1px solid var(--brand-border);
          border-radius: 8px;
          background: var(--surface-container-low);
          color: var(--brand-text);
          padding: 12px;
          text-align: left;
          transition: border-color 160ms ease, color 160ms ease, transform 160ms ease, box-shadow 160ms ease;
        }

        .account-settings-principles span {
          text-align: center;
          font-size: 13px;
          font-weight: 850;
        }

        .account-settings-option {
          cursor: pointer;
        }

        .account-settings-option span {
          display: block;
          color: var(--brand-text);
          font-size: 14px;
          font-weight: 850;
        }

        .account-settings-option small {
          display: block;
          margin-top: 6px;
          color: var(--brand-muted);
          font-size: 12px;
          line-height: 1.55;
        }

        .account-settings-option:hover,
        .account-settings-option:focus-visible,
        .account-settings-option.is-active {
          border-color: rgba(31, 196, 31, 0.72);
          box-shadow: 0 0 0 1px rgba(31, 196, 31, 0.10);
          outline: none;
          transform: translateY(-1px);
        }

        .account-settings-option:hover span,
        .account-settings-option:focus-visible span,
        .account-settings-option.is-active span {
          color: var(--brand-purple);
        }

        @media (max-width: 900px) {
          .account-settings-principles,
          .account-settings-option-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </>
  );
};

export default Settings;
