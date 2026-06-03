import React from "react";
import AccountSection from "../components/Section";
import StatusCard from "../components/StatusCard";
import { useAccountContext } from "..";

const Overview: React.FC = () => {
  const { data, loading, error } = useAccountContext();

  if (loading) return <AccountSection title="账户概览" subtitle="正在加载账户状态..." />;
  if (error || !data) return <AccountSection title="账户概览" subtitle={error || "账户数据不可用"} />;

  const linkedCount = data.identities.filter((item) => item.linked).length;

  return (
    <>
      <AccountSection title="账户概览" subtitle="快速查看你的账户资料、登录方式、AI 偏好和安全状态。">
        <div className="account-grid account-grid--three">
          <StatusCard label="用户名" value={data.profile.name || "未设置"} detail={data.profile.email || "未绑定邮箱"} />
          <StatusCard label="账户状态" value={data.profile.status === "deleted" ? "已注销" : "正常"} detail="登录保护已启用" />
          <StatusCard label="登录方式" value={`${linkedCount} 个已绑定`} detail="支持邮箱、GitHub、Google、Microsoft" />
          <StatusCard label="默认模型" value={data.preferences.default_model || "deepseek-v4-flash"} detail="用于 AI 聊天与功能页" />
          <StatusCard label="代码模型" value={data.preferences.code_model || "deepseek-v4-flash"} detail="用于代码助手和运行解释" />
          <StatusCard label="背景特效" value={data.preferences.effects_enabled ? "开启" : "关闭"} detail="可在设置页调整" />
        </div>
      </AccountSection>

      <AccountSection title="最近活动" subtitle="展示最近的账户、安全和偏好修改记录。">
        <div className="account-list">
          {data.recent_events.length === 0 && <div className="account-empty">暂无活动记录。</div>}
          {data.recent_events.map((event) => (
            <div className="account-list__item" key={event.id}>
              <div>
                <div className="account-list__title">{event.message || event.type}</div>
                <div className="account-list__meta">
                  {event.type} · {new Date(event.created_at).toLocaleString()}
                </div>
              </div>
              <div className="account-list__meta">{event.ip}</div>
            </div>
          ))}
        </div>
      </AccountSection>
    </>
  );
};

export default Overview;
