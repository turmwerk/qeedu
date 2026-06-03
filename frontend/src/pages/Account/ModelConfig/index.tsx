import React from "react";
import AccountSection from "../components/Section";
import Field from "../components/Field";
import { useAccountContext } from "..";

const ModelConfig: React.FC = () => {
  const { data } = useAccountContext();
  return (
    <AccountSection title="模型配置" subtitle="查看当前账号使用的模型策略。修改默认模型请到 AI 偏好。">
      <div className="account-grid">
        <Field label="默认聊天模型" value={data?.preferences.default_model || "deepseek-v4-flash"} />
        <Field label="代码助手模型" value={data?.preferences.code_model || "deepseek-v4-flash"} />
        <Field label="OpenRouter 策略" value="免费模型优先" />
        <Field label="DeepSeek 策略" value="deepseek-v4-flash" />
      </div>
    </AccountSection>
  );
};

export default ModelConfig;
