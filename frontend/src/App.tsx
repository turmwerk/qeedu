import React from "react";
import { RouterProvider } from "react-router-dom";
import { ConfigProvider } from "antd";
import antdEnUS from "antd/locale/en_US";
import antdZhCN from "antd/locale/zh_CN";
import antdZhTW from "antd/locale/zh_TW";
import router from "./router";
import ToastContainer from "@/ui/Toast";
import { LanguageProvider, useLanguage, type Language } from "@/context/LanguageContext";

const ANT_LOCALE_MAP: Record<Language, typeof antdZhCN> = {
  "zh-CN": antdZhCN,
  "zh-TW": antdZhTW,
  en: antdEnUS,
};

const AppContent: React.FC = () => {
  const { language } = useLanguage();

  return (
    <ConfigProvider
      locale={ANT_LOCALE_MAP[language]}
      theme={{
        token: {
          colorPrimary: "#1A9E1A",
          borderRadius: 6,
          fontFamily: "var(--font-family-base)",
        },
        components: {
          Layout: {
            siderBg: "#001529",
          },
        },
      }}
      data-oid="g3uwo.t"
    >
      <style data-oid="bf_-q_z">{`
        .app-root {
          min-height: 100vh;
        }
        @keyframes pageEnter {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .app-root > div {
          animation: pageEnter 0.3s ease-out;
        }
        /* Glass-morphism button */
        .glass-btn {
          background: var(--glass-btn-bg) !important;
          border: 1px solid var(--glass-btn-border) !important;
          box-shadow: var(--glass-btn-shadow) !important;
          -webkit-backdrop-filter: blur(16px) saturate(180%);
          backdrop-filter: blur(16px) saturate(180%);
          color: var(--brand-blue) !important;
          transition: background 0.2s, box-shadow 0.2s, color 0.2s, transform 0.15s, border-color 0.2s !important;
        }
        .glass-btn:hover {
          background: var(--glass-btn-hover-bg) !important;
          border-color: #1fc41f !important;
          box-shadow: var(--glass-btn-hover-shadow) !important;
          color: var(--brand-purple) !important;
          transform: translateY(-1px);
        }
        [data-theme="dark"] .glass-btn:hover,
        [data-theme="dark"] .chat-floating-action:hover {
          border-color: #1fc41f !important;
          box-shadow:
            0 0 0 2px #1fc41f,
            0 0 0 5px rgba(31, 196, 31, 0.28),
            var(--glass-btn-hover-shadow) !important;
        }
        .language-dropdown {
          opacity: 0;
          transform: scale(0.96) translateY(-6px);
          pointer-events: none;
          transition: opacity 120ms ease-out, transform 120ms ease-out;
          will-change: opacity, transform;
        }
        .language-dropdown.open {
          opacity: 1;
          transform: scale(1) translateY(0);
          pointer-events: auto;
        }
        .language-switcher-root .language-item:hover,
        .language-switcher-root .language-item:focus-visible {
          color: var(--brand-purple) !important;
          background: var(--brand-accent-soft) !important;
          border-color: var(--brand-purple) !important;
          outline: none;
        }
        .checkmark-icon {
          transition: transform 120ms ease-out;
        }
      `}</style>
      <div className="app-root" data-oid="p4vlg_w">
        <RouterProvider router={router} data-oid="39ik16v" />
        <ToastContainer data-oid="wudi7e5" />
      </div>
    </ConfigProvider>
  );
};

const App: React.FC = () => (
  <LanguageProvider>
    <AppContent />
  </LanguageProvider>
);

export default App;
