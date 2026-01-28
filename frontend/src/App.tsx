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
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
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
      `}</style>
      <div className="app-root" data-oid="p4vlg_w">
        <RouterProvider router={router} data-oid="39ik16v" />
        <ToastContainer data-oid="wudi7e5" />
      </div>
    </ConfigProvider>
  );
};

export default App;
