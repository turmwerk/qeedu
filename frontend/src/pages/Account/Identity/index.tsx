import React from "react";
import AccountSection from "../components/Section";
import Field from "../components/Field";
import { useAccountContext } from "..";

const Identity: React.FC = () => {
  const { data } = useAccountContext();
  const profile = data?.profile;

  return (
    <AccountSection title="身份信息" subtitle="查看校内角色、院系和专业方向；修改请前往个人资料。">
      <div className="account-grid">
        <Field label="角色" value={profile?.role} />
        <Field label="学院" value={profile?.school} />
        <Field label="专业方向" value={profile?.major} />
        <Field label="语言标记" value={profile?.locale} />
      </div>
    </AccountSection>
  );
};

export default Identity;
