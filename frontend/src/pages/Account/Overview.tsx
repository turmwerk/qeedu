import React from "react";
import { useAuth } from "@/hooks/useAuth";
import AccountSection from "./AccountSection";

const Overview: React.FC = () => {
  const { user } = useAuth();

  return (
    <AccountSection title="账户概览" subtitle="快速查看你的账户状态、登录信息和常用入口。">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {[
          ["用户名", user?.name || "未设置"],
          ["账户状态", "正常"],
          ["邮箱验证", "已启用邮箱验证码"],
          ["默认语言", "跟随全局设置"],
          ["AI 模型", "deepseek-v4-flash"],
          ["数据同步", "本地与云端服务"],
        ].map(([label, value]) => (
          <div key={label} className="rounded-lg border border-[var(--brand-border)] bg-[var(--surface-container-low)] p-4">
            <div className="text-xs text-[var(--brand-muted)]">{label}</div>
            <div className="mt-2 text-sm font-semibold text-[var(--brand-text)]">{value}</div>
          </div>
        ))}
      </div>
    </AccountSection>
  );
};

export default Overview;
