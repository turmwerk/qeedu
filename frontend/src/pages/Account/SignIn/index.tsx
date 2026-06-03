import React from "react";
import AccountSection from "../components/Section";
import { useAccountContext } from "..";

const SignIn: React.FC = () => {
  const { data } = useAccountContext();

  return (
    <AccountSection title="登录方式" subtitle="查看当前可用的邮箱密码、邮箱验证码和第三方登录方式。">
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
              <div className="account-list__title">{item.provider === "github" ? "GitHub 登录" : "Google 登录"}</div>
              <div className="account-list__meta">{item.linked ? "已绑定，可用于登录" : "未绑定"}</div>
            </div>
          </div>
        ))}
      </div>
    </AccountSection>
  );
};

export default SignIn;
