import React, { useEffect, useMemo, useState } from "react";
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
import { useTranslation } from "@/hooks/useTranslation";
import { useAccountData } from "./hooks/useAccountData";

interface AccountNavItem {
  to: string;
  labelKey: keyof typeof navLabelKeys;
  icon: React.ReactNode;
  end?: boolean;
}

const navLabelKeys = {
  overview: "account.nav.overview",
  profile: "account.nav.profile",
  preferences: "account.nav.preferences",
  security: "account.nav.security",
  identity: "account.nav.identity",
  signIn: "account.nav.signIn",
  sessions: "account.nav.sessions",
  notifications: "account.nav.notifications",
  aiPreferences: "account.nav.aiPreferences",
  modelConfig: "account.nav.modelConfig",
  contextPolicy: "account.nav.contextPolicy",
  privacy: "account.nav.privacy",
  billing: "account.nav.billing",
  dataExport: "account.nav.dataExport",
  activity: "account.nav.activity",
  audit: "account.nav.audit",
  settings: "account.nav.settings",
  help: "account.nav.help",
} as const;

const navGroups: Array<{ titleKey: "account.nav.account" | "account.nav.identitySecurity" | "account.nav.aiNotifications" | "account.nav.dataCompliance" | "account.nav.system"; items: AccountNavItem[] }> = [
  {
    titleKey: "account.nav.account",
    items: [
      { to: "/account", labelKey: "overview", icon: <DashboardOutlined />, end: true },
      { to: "/account/profile", labelKey: "profile", icon: <UserOutlined /> },
      { to: "/account/preferences", labelKey: "preferences", icon: <ControlOutlined /> },
    ],
  },
  {
    titleKey: "account.nav.identitySecurity",
    items: [
      { to: "/account/security", labelKey: "security", icon: <LockOutlined /> },
      { to: "/account/identity", labelKey: "identity", icon: <IdcardOutlined /> },
      { to: "/account/sign-in", labelKey: "signIn", icon: <LoginOutlined /> },
      { to: "/account/sessions", labelKey: "sessions", icon: <HistoryOutlined /> },
    ],
  },
  {
    titleKey: "account.nav.aiNotifications",
    items: [
      { to: "/account/notifications", labelKey: "notifications", icon: <BellOutlined /> },
      { to: "/account/ai-preferences", labelKey: "aiPreferences", icon: <ApiOutlined /> },
      { to: "/account/model-config", labelKey: "modelConfig", icon: <ExperimentOutlined /> },
      { to: "/account/context-policy", labelKey: "contextPolicy", icon: <DatabaseOutlined /> },
    ],
  },
  {
    titleKey: "account.nav.dataCompliance",
    items: [
      { to: "/account/privacy", labelKey: "privacy", icon: <SafetyOutlined /> },
      { to: "/account/billing", labelKey: "billing", icon: <CreditCardOutlined /> },
      { to: "/account/data", labelKey: "dataExport", icon: <CloudDownloadOutlined /> },
      { to: "/account/activity", labelKey: "activity", icon: <HistoryOutlined /> },
      { to: "/account/audit", labelKey: "audit", icon: <AuditOutlined /> },
    ],
  },
  {
    titleKey: "account.nav.system",
    items: [
      { to: "/account/settings", labelKey: "settings", icon: <SettingOutlined /> },
      { to: "/account/help", labelKey: "help", icon: <QuestionCircleOutlined /> },
    ],
  },
];

type AccountDataReturn = ReturnType<typeof useAccountData>;

export type AccountOutletContext = AccountDataReturn;

export function useAccountContext() {
  return useOutletContext<AccountOutletContext>();
}

const AccountSidebar: React.FC<{ onNavigate?: () => void }> = React.memo(({ onNavigate }) => {
  const { t } = useTranslation();

  return (
    <aside className="account-sidebar" aria-label={t("account.title")}>
      <nav className="account-nav" aria-label={t("account.title")}>
        {navGroups.map((group) => (
          <div className="account-nav__group" key={group.titleKey}>
            <div className="account-nav__group-title">{t(group.titleKey)}</div>
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
                <span>{t(navLabelKeys[item.labelKey])}</span>
              </NavLink>
            ))}
          </div>
        ))}
      </nav>
    </aside>
  );
});

AccountSidebar.displayName = "AccountSidebar";

const Account: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const auth = useAuth();
  const accountData = useAccountData();
  const { t } = useTranslation();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const outletContext = useMemo(() => accountData, [accountData]);

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
          min-height: 100%;
          display: flex;
          flex-direction: column;
          color: var(--brand-text);
        }

        .account-desktop {
          position: relative;
        }

        .account-sidebar {
          display: flex;
          flex-direction: column;
          width: var(--account-sidebar-width);
          height: calc(100vh - var(--main-header-height, 46px));
          min-height: 0;
          padding: 14px 14px 22px;
          color: var(--brand-text);
          background: var(--surface-container);
          border-right: 1px solid var(--brand-border);
          overflow-x: hidden;
          overflow-y: auto;
          overscroll-behavior: contain;
          scrollbar-gutter: stable;
          backdrop-filter: blur(14px);
        }

        .account-desktop__sidebar {
          position: fixed;
          inset: var(--main-header-height, 46px) auto 0 0;
          z-index: 10;
        }

        .account-content {
          min-width: 0;
          margin-left: var(--account-sidebar-width);
          flex: 1 1 auto;
          min-height: 0;
          display: flex;
          flex-direction: column;
        }

        .account-main {
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

        .account-select {
          appearance: none;
          cursor: pointer;
          padding-right: 38px;
          background-color: var(--surface-container-low);
          background-image:
            linear-gradient(45deg, transparent 50%, var(--brand-muted) 50%),
            linear-gradient(135deg, var(--brand-muted) 50%, transparent 50%),
            linear-gradient(to right, var(--brand-border), var(--brand-border));
          background-position:
            calc(100% - 18px) 52%,
            calc(100% - 13px) 52%,
            calc(100% - 34px) 50%;
          background-repeat: no-repeat;
          background-size: 5px 5px, 5px 5px, 1px 18px;
        }

        .account-select:hover {
          border-color: rgba(31, 196, 31, 0.62);
          box-shadow: 0 0 0 1px rgba(31, 196, 31, 0.08);
        }

        .account-select:focus {
          background-image:
            linear-gradient(45deg, transparent 50%, #1fc41f 50%),
            linear-gradient(135deg, #1fc41f 50%, transparent 50%),
            linear-gradient(to right, rgba(31, 196, 31, 0.45), rgba(31, 196, 31, 0.45));
        }

        .account-select option {
          background: var(--surface-container);
          color: var(--brand-text);
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

        [data-theme="dark"] .account-select {
          background-color: #050805;
          border-color: rgba(255, 255, 255, 0.16);
          color: rgba(255, 255, 255, 0.9);
        }

        [data-theme="dark"] .account-select:hover,
        [data-theme="dark"] .account-select:focus {
          border-color: rgba(31, 196, 31, 0.72);
        }

        [data-theme="dark"] .account-select option {
          background: #050805;
          color: rgba(255, 255, 255, 0.9);
        }

        .account-avatar-editor {
          display: grid;
          grid-template-columns: auto minmax(0, 1fr);
          align-items: center;
          gap: 14px;
          border: 1px solid var(--brand-border);
          border-radius: 8px;
          background: var(--surface-container-low);
          padding: 14px;
        }

        .account-avatar-preview {
          width: 72px;
          height: 72px;
          display: inline-grid;
          place-items: center;
          overflow: hidden;
          border: 1px solid var(--brand-border);
          border-radius: 50%;
          background: rgba(31, 196, 31, 0.10);
          color: var(--brand-purple);
          font-size: 24px;
          font-weight: 900;
        }

        .account-avatar-preview img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .account-avatar-controls {
          min-width: 0;
          display: grid;
          grid-template-columns: auto minmax(0, 1fr);
          gap: 10px;
          align-items: center;
        }

        .account-avatar-upload {
          position: relative;
          overflow: hidden;
        }

        .account-avatar-upload input {
          position: absolute;
          inset: 0;
          opacity: 0;
          cursor: pointer;
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

          .account-content {
            margin-left: 0;
            min-height: 0;
          }

          .account-main {
            width: 100%;
            padding: 20px 14px 42px;
          }

          .account-sidebar {
            width: var(--account-sidebar-width);
            height: 100dvh;
            max-height: 100dvh;
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

          .account-avatar-editor,
          .account-avatar-controls {
            grid-template-columns: 1fr;
            justify-items: stretch;
          }

          .account-avatar-preview {
            justify-self: start;
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
          <span className="account-mobile__title">{t("account.title")}</span>
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

      </div>

      <div className="account-content">
        <main className="account-main">
          <Outlet context={outletContext} />
        </main>
      </div>
    </div>
  );
};

export default Account;
