import React from "react";
import AccountSection from "../components/Section";
import StatusCard from "../components/StatusCard";

const Billing: React.FC = () => (
  <AccountSection title="额度与账单" subtitle="当前项目按免费模型优先策略运行，后续可接入用户级用量计费。">
    <div className="account-grid account-grid--three">
      <StatusCard label="AI 额度" value="未限制" detail="暂未启用用户级限额" />
      <StatusCard label="本月用量" value="统计接入中" detail="后端可按 account_events 扩展" />
      <StatusCard label="账单状态" value="无待支付账单" detail="当前无付费项目" />
    </div>
  </AccountSection>
);

export default Billing;
