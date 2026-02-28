import React from "react";
import { RouterProvider } from "react-router-dom";
import { ConfigProvider } from "antd";
import zhCN from "antd/locale/zh_CN";
import router from "./router";
import ToastContainer from "@/components/Toast";

const App: React.FC = () => {
  React.useEffect(() => {
    // 初始化主题（light/dark）
    import("@/utils/theme").then(({ initTheme }) => initTheme());
  }, []);

  return (
    <ConfigProvider
      locale={zhCN}
      theme={{
        token: {
          colorPrimary: "#6236FF", // 南大紫
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
        /* Glass-morphism button (light) */
        .glass-btn {
          background: rgba(255, 255, 255, 0.35) !important;
          border: 1px solid rgba(255, 255, 255, 0.45) !important;
          box-shadow: 0 8px 32px rgba(120, 90, 200, 0.10), inset 0 1px 0 rgba(255, 255, 255, 0.55) !important;
          -webkit-backdrop-filter: blur(16px) saturate(180%);
          backdrop-filter: blur(16px) saturate(180%);
          color: var(--brand-blue) !important;
          transition: background 0.2s, box-shadow 0.2s, color 0.2s, transform 0.15s, border-color 0.2s !important;
        }
        .glass-btn:hover {
          background: rgba(255, 255, 255, 0.50) !important;
          border-color: rgba(255, 255, 255, 0.60) !important;
          box-shadow: 0 14px 40px rgba(104, 86, 180, 0.16), inset 0 1px 0 rgba(255, 255, 255, 0.70) !important;
          color: var(--brand-purple) !important;
          transform: translateY(-1px);
        }
        [data-theme="dark"] .glass-btn {
          background: rgba(255, 255, 255, 0.12) !important;
          border: 1px solid rgba(255, 255, 255, 0.18) !important;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.15) !important;
          color: var(--brand-blue) !important;
        }
        [data-theme="dark"] .glass-btn:hover {
          background: rgba(255, 255, 255, 0.20) !important;
          border-color: rgba(255, 255, 255, 0.28) !important;
          box-shadow: 0 14px 40px rgba(0, 0, 0, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.22) !important;
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

export default App;
