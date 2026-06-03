import React from "react";
import { API_BASE_URL } from "@/api/config";
import { unlinkAccountIdentity } from "@/api/account";
import AccountSection from "../components/Section";
import { useAccountContext } from "..";

const providerLabel: Record<string, string> = {
  email: "邮箱",
  github: "GitHub",
  google: "Google",
};

const OAuth: React.FC = () => {
  const { data, reload } = useAccountContext();

  const startOAuth = (provider: string) => {
    window.location.href = `${API_BASE_URL}/auth/${provider}?mode=bind`;
  };

  const unlink = async (provider: string) => {
    await unlinkAccountIdentity(provider);
    await reload();
  };

  return (
    <AccountSection title="第三方绑定" subtitle="绑定 GitHub、Google 等外部账号，后续可以用多种方式登录同一个账户。">
      <div className="account-list">
        {(data?.identities || []).map((item) => (
          <div className="account-list__item" key={item.provider}>
            <div>
              <div className="account-list__title">{providerLabel[item.provider] || item.provider}</div>
              <div className="account-list__meta">
                {item.linked ? `${item.provider_name || "已绑定"} · ${item.provider_email || "无邮箱"}` : "未绑定"}
              </div>
            </div>
            {item.provider === "email" ? (
              <span className="account-empty">基础登录方式</span>
            ) : item.linked ? (
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

export default OAuth;
