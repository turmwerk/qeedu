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
          border-color: var(--glass-btn-hover-border) !important;
          box-shadow: var(--glass-btn-hover-shadow) !important;
          color: var(--brand-purple) !important;
          transform: translateY(-1px);
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
