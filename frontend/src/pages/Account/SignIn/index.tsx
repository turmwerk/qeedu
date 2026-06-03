import React from "react";
import { API_BASE_URL } from "@/api/config";
import { unlinkAccountIdentity } from "@/api/account";
import AccountSection from "../components/Section";
import { useAccountContext } from "..";

const providerLabel: Record<string, string> = {
  email: "邮箱",
  github: "GitHub",
  google: "Google",
  microsoft: "Microsoft",
};

const SignIn: React.FC = () => {
  const { data, reload } = useAccountContext();

  const startOAuth = (provider: string) => {
    window.location.href = `${API_BASE_URL}/auth/${provider}?mode=bind`;
  };

  const unlink = async (provider: string) => {
    await unlinkAccountIdentity(provider);
    await reload();
  };

  return (
    <AccountSection title="登录方式" subtitle="管理邮箱密码、邮箱验证码和第三方账号绑定。">
      <div className="account-list">
        <div className="account-list__item">
          <div>
            <div className="account-list__title">邮箱密码登录</div>
            <div className="account-list__meta">{data?.has_password ? "已启用" : "未设置密码，可到密码与安全中设置"}</div>
          </div>
        </div>
        <div className="account-list__item">
          <div>
            <div className="account-list__title">邮箱验证码登录</div>
            <div className="account-list__meta">{data?.profile.email ? `发送到 ${data.profile.email}` : "未绑定邮箱"}</div>
          </div>
        </div>
        {(data?.identities || []).filter((item) => item.provider !== "email").map((item) => (
          <div className="account-list__item" key={item.provider}>
            <div>
              <div className="account-list__title">{providerLabel[item.provider] || item.provider} 登录</div>
              <div className="account-list__meta">
                {item.linked
                  ? `${item.provider_name || "已绑定"} · ${item.provider_email || "无邮箱"}`
                  : "未绑定，绑定后可用于登录同一个账户"}
              </div>
            </div>
            {item.linked ? (
              <button className="account-button" type="button" onClick={() => unlink(item.provider)}>解绑</button>
            ) : (
              <button className="account-button" type="button" onClick={() => startOAuth(item.provider)}>绑定</button>
            )}
          </div>
        ))}
      </div>
    </AccountSection>
  );
};

export default SignIn;
