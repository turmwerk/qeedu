import React from "react";
import AccountSection from "../components/Section";

const Sessions: React.FC = () => (
  <AccountSection title="活跃会话" subtitle="当前登录态由 httpOnly Cookie 管理；后续可接入多设备会话表。">
    <div className="account-list">
      <div className="account-list__item">
        <div>
          <div className="account-list__title">当前浏览器会话</div>
          <div className="account-list__meta">有效期 7 天；退出登录会清除当前 Cookie。</div>
        </div>
        <span className="account-empty">正在使用</span>
      </div>
    </div>
  </AccountSection>
);

export default Sessions;
