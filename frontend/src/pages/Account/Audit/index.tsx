import React, { useEffect, useState } from "react";
import { getAccountEvents, type AccountEvent } from "@/api/account";
import AccountSection from "../components/Section";

const Audit: React.FC = () => {
  const [events, setEvents] = useState<AccountEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    void getAccountEvents()
      .then((items) => {
        if (cancelled) return;
        setEvents(
          items.filter(
            (item) =>
              item.type.includes("password") ||
              item.type.includes("email") ||
              item.type.includes("identity") ||
              item.type.includes("account"),
          ),
        );
      })
      .catch(() => {
        if (!cancelled) setError("登录后可查看审计记录。");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <AccountSection title="审计记录" subtitle="集中查看安全、登录方式和账户关键变更。">
      <div className="account-list">
        {loading && <div className="account-empty">正在加载审计记录...</div>}
        {!loading && error && <div className="account-empty">{error}</div>}
        {!loading && !error && events.length === 0 && <div className="account-empty">暂无安全审计记录。</div>}
        {events.map((event) => (
          <div className="account-list__item" key={event.id}>
            <div>
              <div className="account-list__title">{event.message || event.type}</div>
              <div className="account-list__meta">{event.type} · {new Date(event.created_at).toLocaleString()}</div>
            </div>
          </div>
        ))}
      </div>
    </AccountSection>
  );
};

export default Audit;
