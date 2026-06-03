import React, { useEffect, useState } from "react";
import { getAccountEvents, type AccountEvent } from "@/api/account";
import AccountSection from "../components/Section";

const Activity: React.FC = () => {
  const [events, setEvents] = useState<AccountEvent[]>([]);

  useEffect(() => {
    void getAccountEvents().then(setEvents);
  }, []);

  return (
    <AccountSection title="活动日志" subtitle="查看最近的登录、资料、偏好和安全操作。">
      <div className="account-list">
        {events.length === 0 && <div className="account-empty">暂无活动记录。</div>}
        {events.map((event) => (
          <div className="account-list__item" key={event.id}>
            <div>
              <div className="account-list__title">{event.message || event.type}</div>
              <div className="account-list__meta">{event.type} · {new Date(event.created_at).toLocaleString()}</div>
            </div>
            <div className="account-list__meta">{event.ip}</div>
          </div>
        ))}
      </div>
    </AccountSection>
  );
};

export default Activity;
