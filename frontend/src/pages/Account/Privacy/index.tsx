import React from "react";
import AccountSection from "../components/Section";
import Field from "../components/Field";
import { useAccountContext } from "..";

const Privacy: React.FC = () => {
  const { data } = useAccountContext();
  return (
    <AccountSection title="隐私与授权" subtitle="查看资料可见范围和数据使用授权。">
      <div className="account-grid">
        <Field label="资料可见范围" value={data?.preferences.profile_visible || "private"} />
        <Field label="匿名使用数据" value={data?.preferences.share_usage_data ? "允许" : "不允许"} />
        <Field label="AI 当前文件授权" value={data?.preferences.context_current_file ? "允许" : "不允许"} />
        <Field label="AI 项目文件授权" value={data?.preferences.context_project_files ? "允许" : "不允许"} />
      </div>
    </AccountSection>
  );
};

export default Privacy;
