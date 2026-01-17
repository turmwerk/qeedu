import React, { useEffect, useMemo, useState } from "react";
import { Layout } from "antd";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Header from "./components/Header";
import Sider from "./components/Sider";

const { Content } = Layout;

const MainLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [siderOpen, setSiderOpen] = useState(false);

  useEffect(() => {
    // 首次访问站点时引导至登录（仅一次，保存在 localStorage）
    try {
      const visited = localStorage.getItem("site-has-visited");
      if (!visited) {
        localStorage.setItem("site-has-visited", "1");
        navigate("/login");
      }
    } catch (e) {
      // ignore
    }
  }, [navigate]);
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [location.pathname]);

  useEffect(() => {
    const handleToggleSider = () => {
      setSiderOpen((v) => {
        const newState = !v;
        // 立即通知所有监听者新的状态
        setTimeout(() => {
          window.dispatchEvent(
            new CustomEvent("syllabus-sider-state", {
              detail: { open: newState },
            })
          );
        }, 0);
        return newState;
      });
    };
    const handleGetState = () => {
      window.dispatchEvent(
        new CustomEvent("syllabus-sider-state", {
          detail: { open: siderOpen },
        })
      );
    };
    window.addEventListener("toggle-syllabus-sider", handleToggleSider);
    window.addEventListener("get-syllabus-sider-state", handleGetState);
    return () => {
      window.removeEventListener("toggle-syllabus-sider", handleToggleSider);
      window.removeEventListener("get-syllabus-sider-state", handleGetState);
    };
  }, [siderOpen]);

  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent("syllabus-sider-state", {
        detail: { open: siderOpen },
      })
    );
  }, [siderOpen]);

  const showSiderToggle = useMemo(
    () => location.pathname.startsWith("/teaching/syllabus"),
    [location.pathname]
  );

  return (
    <div className="flex h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 relative overflow-hidden">
      {/* 全局流动光球背景 */}
      <div
        className="fixed inset-0 overflow-hidden pointer-events-none z-0"
        data-oid="lqlqe9:"
      >
        <div
          className="absolute w-[600px] h-[600px] rounded-full bg-gradient-to-r from-purple-300/20 to-blue-300/20 blur-[120px] -top-48 -left-48 animate-[globalFloat_25s_ease-in-out_infinite]"
          data-oid="411sr1b"
        />

        <div
          className="absolute w-[500px] h-[500px] rounded-full bg-gradient-to-r from-pink-300/20 to-purple-300/20 blur-[100px] top-1/3 -right-32 animate-[globalFloat_30s_ease-in-out_infinite_reverse]"
          data-oid="e351e_:"
        />

        <div
          className="absolute w-[450px] h-[450px] rounded-full bg-gradient-to-r from-blue-300/15 to-indigo-300/15 blur-[90px] bottom-0 left-1/4 animate-[globalFloat_28s_ease-in-out_infinite]"
          data-oid="4iutmqo"
        />
      </div>
      <style data-oid="q4cg0al">{`
        @keyframes globalFloat {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(40px, -40px) scale(1.15); }
          66% { transform: translate(-30px, 30px) scale(0.85); }
        }
      `}</style>
      
      {/* 左侧栏 */}
      <Sider open={siderOpen && showSiderToggle} onClose={() => setSiderOpen(false)} />
      
      {/* 右侧内容区域 */}
      <Layout className="flex-1 relative z-10 flex flex-col min-h-0 h-full">
        <Header
          onToggleSider={() => setSiderOpen((v) => !v)}
          showSiderToggle={showSiderToggle}
          siderOpen={siderOpen}
          data-oid="d8-wqm."
        />
        <Content className="m-0 p-0 relative z-10 flex-1 min-h-0" data-oid="gzlcfm-">
          <div className="h-full min-h-0" data-oid="giq3cbp">
            <Outlet />
          </div>
        </Content>
      </Layout>
    </div>
  );
};

export default MainLayout;
