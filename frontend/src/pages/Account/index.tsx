import React, { useEffect, useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import {
  ApiOutlined,
  AuditOutlined,
  BellOutlined,
  CloudDownloadOutlined,
  ControlOutlined,
  CreditCardOutlined,
  DashboardOutlined,
  DatabaseOutlined,
  ExperimentOutlined,
  HistoryOutlined,
  IdcardOutlined,
  KeyOutlined,
  LockOutlined,
  LoginOutlined,
  MenuOutlined,
  QuestionCircleOutlined,
  SafetyOutlined,
  SettingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useAuth } from "@/hooks/useAuth";

interface AccountNavItem {
  to: string;
  label: string;
  icon: React.ReactNode;
  end?: boolean;
}

const navGroups: Array<{ title: string; items: AccountNavItem[] }> = [
  {
    title: "账户",
    items: [
      { to: "/account", label: "账户概览", icon: <DashboardOutlined />, end: true },
      { to: "/account/profile", label: "个人资料", icon: <UserOutlined /> },
      { to: "/account/preferences", label: "账户偏好", icon: <ControlOutlined /> },
    ],
  },
  {
    title: "身份与安全",
    items: [
      { to: "/account/security", label: "密码与安全", icon: <LockOutlined /> },
      { to: "/account/identity", label: "身份信息", icon: <IdcardOutlined /> },
      { to: "/account/sign-in", label: "登录方式", icon: <LoginOutlined /> },
      { to: "/account/sessions", label: "活跃会话", icon: <HistoryOutlined /> },
      { to: "/account/oauth", label: "第三方绑定", icon: <KeyOutlined /> },
    ],
  },
  {
    title: "AI 与通知",
    items: [
      { to: "/account/notifications", label: "通知偏好", icon: <BellOutlined /> },
      { to: "/account/ai-preferences", label: "AI 偏好", icon: <ApiOutlined /> },
      { to: "/account/model-config", label: "模型配置", icon: <ExperimentOutlined /> },
      { to: "/account/context-policy", label: "上下文策略", icon: <DatabaseOutlined /> },
    ],
  },
  {
    title: "数据与合规",
    items: [
      { to: "/account/privacy", label: "隐私与授权", icon: <SafetyOutlined /> },
      { to: "/account/billing", label: "额度与账单", icon: <CreditCardOutlined /> },
      { to: "/account/data", label: "数据导出", icon: <CloudDownloadOutlined /> },
      { to: "/account/activity", label: "活动日志", icon: <HistoryOutlined /> },
      { to: "/account/audit", label: "审计记录", icon: <AuditOutlined /> },
    ],
  },
  {
    title: "系统",
    items: [
      { to: "/account/settings", label: "设置", icon: <SettingOutlined /> },
      { to: "/account/help", label: "帮助反馈", icon: <QuestionCircleOutlined /> },
    ],
  },
];

const AccountSidebar: React.FC<{ className?: string; onNavigate?: () => void }> = ({ className = "", onNavigate }) => {
  const { user } = useAuth();

  return (
    <aside className={`account-sidebar ${className}`} aria-label="个人中心导航">
      <div className="account-sidebar__avatar-link">
        <div className="account-sidebar__avatar">
          {(user?.name || "用户").slice(0, 1).toUpperCase()}
        </div>
      </div>

      <div className="account-sidebar__identity">
        <div className="account-sidebar__title">{user?.name || "用户"}</div>
        <div className="account-sidebar__subtitle">QeEdu 个人中心</div>
      </div>

      <nav className="account-nav" aria-label="账户导航">
        {navGroups.map((group) => (
          <div className="account-nav__group" key={group.title}>
            <div className="account-nav__group-title">{group.title}</div>
            {group.items.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={onNavigate}
                className={({ isActive }) =>
                  `account-nav__item ${isActive ? "account-nav__item--active" : ""}`
                }
              >
                <span className="account-nav__icon">{item.icon}</span>
                <span>{item.label}</span>
              </NavLink>
            ))}
          </div>
        ))}
      </nav>
    </aside>
  );
};

const Account: React.FC = () => {
  const location = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    setDrawerOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!drawerOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setDrawerOpen(false);
    };
    window.addEventListener("keydown", handleKeydown);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", handleKeydown);
    };
  }, [drawerOpen]);

  return (
    <div className="account-shell">
      <style>{`
        .account-shell {
          --account-sidebar-width: 230px;
          --account-mobile-header-height: 62px;
          position: relative;
          z-index: 2;
          min-height: calc(100vh - var(--main-header-height, 46px));
          color: var(--brand-text);
        }

        .account-desktop {
          position: relative;
          min-height: calc(100vh - var(--main-header-height, 46px));
        }

        .account-sidebar {
          display: flex;
          flex-direction: column;
          width: var(--account-sidebar-width);
          min-height: calc(100vh - var(--main-header-height, 46px));
          padding: 16px 18px 24px;
          color: var(--brand-text);
          background: var(--surface-container);
          border-right: 1px solid var(--brand-border);
          overflow-x: hidden;
          overflow-y: auto;
          backdrop-filter: blur(14px);
        }

        .account-desktop__sidebar {
          position: fixed;
          inset: var(--main-header-height, 46px) auto 0 0;
          z-index: 10;
        }

        .account-desktop__content {
          min-width: 0;
          margin-left: var(--account-sidebar-width);
          min-height: calc(100vh - var(--main-header-height, 46px));
          display: flex;
          flex-direction: column;
        }

        .account-desktop__main {
          flex: 1;
          width: min(1120px, calc(100vw - var(--account-sidebar-width) - 96px));
          margin: 0 auto;
          padding: 46px 0 54px;
        }

        .account-sidebar__avatar-link {
          display: flex;
          justify-content: center;
          width: 152px;
          height: 152px;
          margin: 0 auto 14px;
        }

        .account-sidebar__avatar {
          display: grid;
          place-items: center;
          width: 152px;
          height: 152px;
          border-radius: 50%;
          background: rgba(31, 196, 31, 0.12);
          border: 1px solid rgba(31, 196, 31, 0.28);
          color: var(--brand-purple);
          font-size: 52px;
          font-weight: 900;
          transition: transform 220ms ease;
        }

        .account-sidebar__avatar-link:hover .account-sidebar__avatar {
          transform: scale(1.08);
        }

        .account-sidebar__identity {
          text-align: center;
        }

        .account-sidebar__title {
          color: var(--brand-text);
          font-size: 22px;
          font-weight: 800;
          line-height: 1.2;
        }

        .account-sidebar__subtitle {
          margin-top: 6px;
          color: var(--brand-muted);
          font-size: 12px;
        }

        .account-nav {
          display: flex;
          flex-direction: column;
          gap: 8px;
          align-items: stretch;
          margin-top: 10px;
          flex: 1;
        }

        .account-nav__group {
          display: flex;
          flex-direction: column;
          gap: 1px;
        }

        .account-nav__group-title {
          padding: 9px 12px 5px;
          color: var(--brand-muted);
          font-size: 11px;
          font-weight: 800;
          line-height: 1;
          letter-spacing: 0;
        }

        .account-nav__item {
          display: inline-flex;
          align-items: center;
          justify-content: flex-start;
          gap: 8px;
          min-height: 36px;
          padding: 0 12px;
          border-radius: 8px;
          border: 0;
          color: var(--brand-muted);
          font-size: 14px;
          font-weight: 700;
          line-height: 1;
          text-decoration: none;
          transition:
            color 160ms ease,
            transform 160ms ease,
            background-color 160ms ease,
            box-shadow 160ms ease;
        }

        .account-nav__item:hover,
        .account-nav__item:focus-visible {
          color: var(--brand-purple);
          background: rgba(31, 196, 31, 0.10);
          box-shadow: inset 0 0 0 1px rgba(31, 196, 31, 0.10);
          text-decoration: none;
          outline: none;
        }

        .account-nav__item--active {
          color: var(--brand-purple);
          background: rgba(31, 196, 31, 0.10);
          box-shadow: inset 0 0 0 1px rgba(31, 196, 31, 0.14);
        }

        .account-nav__icon {
          width: 18px;
          height: 18px;
          font-size: 18px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }

        .account-mobile {
          display: none;
          min-height: calc(100vh - var(--main-header-height, 46px));
        }

        .account-mobile__header {
          position: sticky;
          top: 0;
          z-index: 30;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          min-height: var(--account-mobile-header-height);
          padding: 10px 14px;
          background: var(--surface-container);
          border-bottom: 1px solid var(--brand-border);
          backdrop-filter: blur(12px);
        }

        .account-mobile__menu {
          width: 40px;
          height: 40px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border: 0;
          border-radius: 8px;
          color: var(--brand-text);
          background: transparent;
        }

        .account-mobile__overlay {
          position: fixed;
          inset: 0;
          z-index: 40;
          border: 0;
          background: rgba(0, 0, 0, 0.58);
        }

        .account-mobile__drawer {
          position: fixed;
          inset: 0 auto 0 0;
          z-index: 50;
          transform: translateX(-100%);
          transition: transform 260ms cubic-bezier(.2, .9, .2, 1);
          will-change: transform;
        }

        .account-mobile__drawer.is-open {
          transform: translateX(0);
        }

        .account-mobile__main {
          min-height: calc(100vh - var(--account-mobile-header-height));
          padding: 24px 18px 42px;
        }

        @media (max-width: 900px) {
          .account-shell {
            --account-sidebar-width: min(82vw, 320px);
          }

          .account-desktop {
            display: none;
          }

          .account-mobile {
            display: block;
          }

          .account-sidebar {
            width: var(--account-sidebar-width);
            min-height: 100%;
            padding: 26px 20px;
          }

          .account-sidebar__avatar,
          .account-sidebar__avatar-link {
            width: 128px;
            height: 128px;
          }

          .account-sidebar__avatar {
            font-size: 42px;
          }

          .account-sidebar__title {
            font-size: 20px;
          }

          .account-nav {
            gap: 7px;
            margin-top: 14px;
          }

          .account-nav__item {
            min-height: 36px;
            padding: 0 8px;
            font-size: 13px;
          }
        }
      `}</style>

      <div className="account-desktop">
        <AccountSidebar className="account-desktop__sidebar" />
        <div className="account-desktop__content">
          <main className="account-desktop__main">
            <Outlet />
          </main>
        </div>
      </div>

      <div className="account-mobile">
        <header className="account-mobile__header">
          <button
            className="account-mobile__menu"
            type="button"
            aria-label="打开个人中心导航"
            onClick={() => setDrawerOpen(true)}
          >
            <MenuOutlined />
          </button>
          <span className="text-sm font-semibold">个人中心</span>
        </header>

        {drawerOpen && (
          <button
            className="account-mobile__overlay"
            type="button"
            aria-label="关闭个人中心导航"
            onClick={() => setDrawerOpen(false)}
          />
        )}

        <aside className={`account-mobile__drawer ${drawerOpen ? "is-open" : ""}`} aria-label="移动端个人中心导航">
          <AccountSidebar onNavigate={() => setDrawerOpen(false)} />
        </aside>

        <main className="account-mobile__main">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Account;
