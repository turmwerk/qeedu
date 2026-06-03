import React, { useEffect, useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate, useOutletContext } from "react-router-dom";
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
  LeftOutlined,
  LockOutlined,
  LoginOutlined,
  MenuOutlined,
  QuestionCircleOutlined,
  SafetyOutlined,
  SettingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useAuth } from "@/hooks/useAuth";
import { useAccountData } from "./hooks/useAccountData";

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

type AccountDataReturn = ReturnType<typeof useAccountData>;

export type AccountOutletContext = AccountDataReturn;

export function useAccountContext() {
  return useOutletContext<AccountOutletContext>();
}

const AccountSidebar: React.FC<{ onNavigate?: () => void }> = ({ onNavigate }) => (
  <aside className="account-sidebar" aria-label="个人中心导航">
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

const Account: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const auth = useAuth();
  const accountData = useAccountData();
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

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }
    navigate("/");
  };

  return (
    <div className="account-shell">
      <style>{`
        .account-shell {
          --account-sidebar-width: 232px;
          --account-mobile-header-height: 58px;
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
          padding: 14px 14px 22px;
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
          width: min(1120px, calc(100vw - var(--account-sidebar-width) - 72px));
          margin: 0 auto;
          padding: 36px 0 52px;
        }

        .account-nav {
          display: flex;
          flex-direction: column;
          gap: 8px;
          align-items: stretch;
        }

        .account-nav__group {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .account-nav__group-title {
          padding: 8px 11px 5px;
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
          min-height: 35px;
          padding: 0 11px;
          border-radius: 8px;
          border: 0;
          color: var(--brand-text);
          font-size: 13px;
          font-weight: 700;
          line-height: 1;
          text-decoration: none;
          transition: color 160ms ease, background-color 160ms ease, box-shadow 160ms ease;
        }

        .account-nav__item:hover,
        .account-nav__item:focus-visible,
        .account-nav__item--active {
          color: var(--brand-purple);
          background: rgba(31, 196, 31, 0.10);
          box-shadow: inset 0 0 0 1px rgba(31, 196, 31, 0.16);
          text-decoration: none;
          outline: none;
        }

        .account-nav__icon {
          width: 18px;
          height: 18px;
          font-size: 17px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }

        .account-section {
          width: 100%;
          border: 1px solid var(--brand-border);
          border-radius: 8px;
          background: var(--surface-container);
          box-shadow: var(--brand-shadow);
          padding: 22px;
        }

        .account-section + .account-section {
          margin-top: 16px;
        }

        .account-section__header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 16px;
          margin-bottom: 20px;
        }

        .account-section__header h1 {
          margin: 0;
          color: var(--brand-text);
          font-size: 24px;
          font-weight: 800;
          line-height: 1.2;
        }

        .account-section__header p {
          margin: 8px 0 0;
          color: var(--brand-muted);
          font-size: 14px;
          line-height: 1.7;
        }

        .account-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 12px;
        }

        .account-grid--three {
          grid-template-columns: repeat(3, minmax(0, 1fr));
        }

        .account-form {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 14px;
        }

        .account-form__full {
          grid-column: 1 / -1;
        }

        .account-label {
          display: flex;
          flex-direction: column;
          gap: 7px;
          color: var(--brand-text);
          font-size: 13px;
          font-weight: 750;
        }

        .account-input,
        .account-select,
        .account-textarea {
          width: 100%;
          border: 1px solid var(--brand-border);
          border-radius: 8px;
          background: var(--surface-container-low);
          color: var(--brand-text);
          font-size: 14px;
          outline: none;
          transition: border-color 160ms ease, box-shadow 160ms ease;
        }

        .account-input,
        .account-select {
          height: 38px;
          padding: 0 11px;
        }

        .account-textarea {
          min-height: 96px;
          resize: vertical;
          padding: 10px 11px;
        }

        .account-input:focus,
        .account-select:focus,
        .account-textarea:focus {
          border-color: var(--brand-purple);
          box-shadow: 0 0 0 3px rgba(31, 196, 31, 0.13);
        }

        .account-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          min-height: 38px;
          border: 1px solid var(--brand-border);
          border-radius: 8px;
          background: var(--surface-container-low);
          color: var(--brand-text);
          padding: 0 14px;
          font-size: 14px;
          font-weight: 800;
          cursor: pointer;
          transition: border-color 160ms ease, color 160ms ease, background-color 160ms ease;
        }

        .account-button:hover,
        .account-button:focus-visible {
          color: var(--brand-purple);
          border-color: var(--brand-purple);
          outline: none;
        }

        .account-button--danger {
          color: #ef4444;
          border-color: rgba(239, 68, 68, 0.45);
        }

        .account-button--danger:hover {
          color: #dc2626;
          border-color: #dc2626;
        }

        .account-actions {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 10px;
          margin-top: 16px;
        }

        .account-status-card,
        .account-field {
          border: 1px solid var(--brand-border);
          border-radius: 8px;
          background: var(--surface-container-low);
          padding: 15px;
          min-width: 0;
        }

        .account-status-card__label,
        .account-field__label {
          color: var(--brand-muted);
          font-size: 12px;
          font-weight: 700;
        }

        .account-status-card__value,
        .account-field__value {
          margin-top: 8px;
          color: var(--brand-text);
          font-size: 15px;
          font-weight: 800;
          overflow-wrap: anywhere;
        }

        .account-status-card__detail,
        .account-field__hint {
          margin-top: 7px;
          color: var(--brand-muted);
          font-size: 12px;
          line-height: 1.6;
        }

        .account-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .account-list__item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
          border: 1px solid var(--brand-border);
          border-radius: 8px;
          background: var(--surface-container-low);
          padding: 14px;
        }

        .account-list__title {
          color: var(--brand-text);
          font-size: 14px;
          font-weight: 800;
        }

        .account-list__meta {
          margin-top: 5px;
          color: var(--brand-muted);
          font-size: 12px;
          line-height: 1.6;
        }

        .account-switch-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
          border: 1px solid var(--brand-border);
          border-radius: 8px;
          background: var(--surface-container-low);
          padding: 14px;
        }

        .account-switch-row input {
          width: 18px;
          height: 18px;
          accent-color: var(--brand-purple);
        }

        .account-mobile {
          display: none;
          min-height: calc(100vh - var(--main-header-height, 46px));
        }

        .account-mobile__header {
          position: sticky;
          top: 0;
          z-index: 30;
          display: grid;
          grid-template-columns: auto auto 1fr auto;
          align-items: center;
          gap: 8px;
          min-height: var(--account-mobile-header-height);
          padding: 8px 14px 8px 18px;
          background: var(--surface-container);
          border-bottom: 1px solid var(--brand-border);
          backdrop-filter: blur(12px);
        }

        .account-mobile__button {
          width: 38px;
          height: 38px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border: 1px solid transparent;
          border-radius: 8px;
          color: var(--brand-text);
          background: transparent;
        }

        .account-mobile__button:hover {
          color: var(--brand-purple);
          border-color: var(--brand-purple);
        }

        .account-mobile__title {
          min-width: 0;
          color: var(--brand-text);
          font-size: 14px;
          font-weight: 800;
        }

        .account-mobile__account {
          width: auto;
          min-width: 40px;
          padding: 0 9px;
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
          transition: transform 240ms cubic-bezier(.2, .9, .2, 1);
          will-change: transform;
        }

        .account-mobile__drawer.is-open {
          transform: translateX(0);
        }

        .account-mobile__main {
          min-height: calc(100vh - var(--account-mobile-header-height));
          padding: 20px 14px 42px;
        }

        .account-empty {
          color: var(--brand-muted);
          font-size: 14px;
          line-height: 1.7;
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
            padding: 16px 14px 22px;
          }

          .account-grid,
          .account-grid--three,
          .account-form {
            grid-template-columns: 1fr;
          }

          .account-section {
            padding: 16px;
          }

          .account-section__header {
            flex-direction: column;
          }

          .account-section__header h1 {
            font-size: 21px;
          }

          .account-list__item,
          .account-switch-row {
            align-items: flex-start;
            flex-direction: column;
          }

          .account-actions {
            justify-content: stretch;
            flex-direction: column;
          }

          .account-actions .account-button {
            width: 100%;
          }
        }
      `}</style>

      <div className="account-desktop">
        <div className="account-desktop__sidebar">
          <AccountSidebar />
        </div>
        <div className="account-desktop__content">
          <main className="account-desktop__main">
            <Outlet context={accountData} />
          </main>
        </div>
      </div>

      <div className="account-mobile">
        <header className="account-mobile__header">
          <button className="account-mobile__button" type="button" aria-label="返回" onClick={handleBack}>
            <LeftOutlined />
          </button>
          <button
            className="account-mobile__button"
            type="button"
            aria-label="打开个人中心导航"
            onClick={() => setDrawerOpen(true)}
          >
            <MenuOutlined />
          </button>
          <span className="account-mobile__title">个人中心</span>
          <button
            className="account-mobile__button account-mobile__account"
            type="button"
            aria-label={auth.isAuthenticated ? "个人中心" : "登录"}
            onClick={() => navigate(auth.isAuthenticated ? "/account" : "/login")}
          >
            <UserOutlined />
          </button>
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
          <Outlet context={accountData} />
        </main>
      </div>
    </div>
  );
};

export default Account;
