import React from "react";
import { RouterProvider } from "react-router-dom";
import { ConfigProvider } from "antd";
import zhCN from "antd/locale/zh_CN";
import router from "./router";
import ToastContainer from "@/components/Toast";

const App: React.FC = () => {
  return (
    <ConfigProvider
      locale={zhCN}
      theme={{
        token: {
          colorPrimary: "#6236FF", // 南大紫
          borderRadius: 6,
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
        :root {
          --brand-accent: #4b2a85;
          --brand-accent-strong: #3b1a6a;
          --brand-accent-soft: rgba(75, 42, 133, 0.08);
          --brand-accent-faint: rgba(75, 42, 133, 0.16);
          --brand-border: rgba(75, 42, 133, 0.18);
          --brand-shadow: 0 10px 24px rgba(75, 42, 133, 0.16);
          --brand-text: #2b1650;
          --brand-muted: #666;
          --brand-bg: #f5f3fb;
        }
        .app-root {
          min-height: 100vh;
          background: var(--brand-bg);
          color: var(--brand-text);
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
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
