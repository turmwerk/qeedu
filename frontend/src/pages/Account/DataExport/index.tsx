import React from "react";
import AccountSection from "../components/Section";
import { useAccountContext } from "..";

const DataExport: React.FC = () => {
  const { data } = useAccountContext();

  const exportJson = () => {
    if (!data) return;
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "qeedu-account-data.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <AccountSection title="数据导出" subtitle="导出当前账户资料、偏好、绑定状态和活动记录。">
      <div className="account-list">
        <div className="account-list__item">
          <div>
            <div className="account-list__title">账户资料 JSON</div>
            <div className="account-list__meta">包含前端已加载的安全字段，不包含密码 hash、token 或密钥。</div>
          </div>
          <button className="account-button" type="button" onClick={exportJson}>导出</button>
        </div>
      </div>
    </AccountSection>
  );
};

export default DataExport;
