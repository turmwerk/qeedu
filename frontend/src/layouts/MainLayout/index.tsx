import React, { useEffect, useRef, useState } from "react";
import { Layout } from "antd";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Header from "./components/Header";
import Sider from "./components/Sider";
import Footer from "./components/Footer";
import FloatActions from "./components/FloatActions";
import SyllabusListModal from "@/pages/Teaching/Syllabus/components/ListModal";
import ExamListModal from "@/pages/Teaching/ExamDesign/components/ListModal";
import { getStoredTheme, applyTheme } from "@/utils/theme";
import SnowLayer from "@/components/SnowLayer";
import StarsLayer from "@/components/StarsLayer";

const { Content } = Layout;

const MainLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [syllabusSiderOpen, setSyllabusSiderOpen] = useState(false);
  const [examSiderOpen, setExamSiderOpen] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  // Theme control (centralized here)
  const [theme, setTheme] = useState<"light" | "dark">(() => getStoredTheme());

  useEffect(() => {
    // Ensure document and other parts are updated
    applyTheme(theme);

    const onThemeChange = (e: Event) => {
      const t = (e as CustomEvent).detail?.theme as "light" | "dark" | undefined;
      if (t) setTheme(t);
      else setTheme(getStoredTheme());
    };
    const onStorage = () => setTheme(getStoredTheme());

    window.addEventListener("theme-change", onThemeChange as EventListener);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener("theme-change", onThemeChange as EventListener);
      window.removeEventListener("storage", onStorage);
    };
  }, [theme]);

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
    const el = scrollContainerRef.current;
    if (el) {
      el.scrollTo({ top: 0, left: 0, behavior: "auto" });
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    }
  }, [location.pathname]);

  useEffect(() => {
    const handleToggleSyllabusSider = () => {
      setSyllabusSiderOpen((v) => {
        const newState = !v;
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
    const handleGetSyllabusState = () => {
      window.dispatchEvent(
        new CustomEvent("syllabus-sider-state", {
          detail: { open: syllabusSiderOpen },
        })
      );
    };
    const handleToggleExamSider = () => {
      setExamSiderOpen((v) => {
        const newState = !v;
        setTimeout(() => {
          window.dispatchEvent(
            new CustomEvent("exam-sider-state", {
              detail: { open: newState },
            })
          );
        }, 0);
        return newState;
      });
    };
    const handleGetExamState = () => {
      window.dispatchEvent(
        new CustomEvent("exam-sider-state", {
          detail: { open: examSiderOpen },
        })
      );
    };
    window.addEventListener("toggle-syllabus-sider", handleToggleSyllabusSider);
    window.addEventListener("get-syllabus-sider-state", handleGetSyllabusState);
    window.addEventListener("toggle-exam-sider", handleToggleExamSider);
    window.addEventListener("get-exam-sider-state", handleGetExamState);
    return () => {
      window.removeEventListener(
        "toggle-syllabus-sider",
        handleToggleSyllabusSider
      );
      window.removeEventListener(
        "get-syllabus-sider-state",
        handleGetSyllabusState
      );
      window.removeEventListener("toggle-exam-sider", handleToggleExamSider);
      window.removeEventListener("get-exam-sider-state", handleGetExamState);
    };
  }, [examSiderOpen, syllabusSiderOpen]);

  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent("syllabus-sider-state", {
        detail: { open: syllabusSiderOpen },
      })
    );
  }, [syllabusSiderOpen]);

  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent("exam-sider-state", {
        detail: { open: examSiderOpen },
      })
    );
  }, [examSiderOpen]);

  // 只要路径包含 detail 视为 detail 页面
  const isDetailPage = /\/detail(\/|$)/.test(location.pathname);
  const isHomePage = location.pathname === "/";
  // 侧边栏切换按钮逻辑：只在大纲/试卷详情页显示
  const isSyllabusDetail = location.pathname.startsWith("/teaching/syllabus") && location.pathname !== "/teaching/syllabus/ListPage";
  const isExamDetail = location.pathname.startsWith("/teaching/exam/detail");

  useEffect(() => {
    if (location.pathname === "/teaching/syllabus/ListPage") {
      setSyllabusSiderOpen(false);
    }
    if (location.pathname === "/teaching/exam/ListPage") {
      setExamSiderOpen(false);
    }
  }, [location.pathname]);

  return (
    <div data-theme={theme} className={`app-root flex flex-col h-screen relative overflow-hidden${isHomePage ? ' home-theme-bg' : ''}`}>
      {/* 主题梯度背景 + header/footer 透明 */}
      <style>{`
        .app-root {
          background: var(--app-root-bg) !important;
          background-color: var(--app-root-bg-color) !important;
          color: var(--brand-text);
        }
        .main-header, footer {
          background-color: transparent !important;
          background: transparent !important;
          border: none !important;
          box-shadow: none !important;
        }
      `}</style>
      {/* 全屏雪花特效：固定定位在最底层，pointer-events:none 不影响交互 */}
      <SnowLayer />
      {/* 深色主题独立星点背景（不连线，不跟鼠标交互） */}
      {theme === 'dark' && <StarsLayer />}

      {/* 全局 Header */}
      <div className="flex-shrink-0 relative z-[100]">
        <Header
          data-oid="d8-wqm."
        />
      </div>

      {/* Header 下方：侧边栏 + 内容 */}
      <div className="flex flex-1 min-h-0 min-w-0 relative z-10 overflow-hidden">
        {/* 左侧栏 */}
        <Sider
          open={syllabusSiderOpen && isSyllabusDetail}
          onClose={() => setSyllabusSiderOpen(false)}
          storageKey="syllabus_outlines"
          title="大纲列表"
          createEventName="syllabus-outline-create"
          updatedEventName="syllabus-outlines-updated"
          currentIdEventName="syllabus-current-id"
          selectEventName="syllabus-outline-select"
          deleteEventName="syllabus-outline-delete"
          widthEventName="syllabus-sider-width"
          getWidthEventName="get-syllabus-sider-width"
          listModalComponent={SyllabusListModal}
        />
        <Sider
          open={examSiderOpen && isExamDetail}
          onClose={() => setExamSiderOpen(false)}
          storageKey="exam_design_exams_v1"
          title="试卷列表"
          createEventName="exam-exam-create"
          updatedEventName="exam-exams-updated"
          currentIdEventName="exam-current-id"
          selectEventName="exam-exam-select"
          deleteEventName="exam-exam-delete"
          widthEventName="exam-sider-width"
          getWidthEventName="get-exam-sider-width"
          listModalComponent={ExamListModal}
        />
        
        {/* 右侧内容区域 */}
        <Layout style={{ minWidth: 0 }} className={`flex-1 relative flex flex-col min-h-0 min-w-0 h-full${isDetailPage ? ' bg-white/[0.45] dark:bg-white/[0.06] backdrop-blur-[18px] backdrop-saturate-[160%]' : ''}`}>
          <Content className="m-0 p-0 relative z-10 flex-1 min-h-0 min-w-0" data-oid="gzlcfm-">
            <div
              className={`h-full min-h-0 flex flex-col ${isDetailPage ? "overflow-hidden" : "overflow-y-auto overflow-x-hidden"}`}
              data-oid="giq3cbp"
              ref={scrollContainerRef}
            >
              <div className="flex-1 min-w-0 w-full">
                <Outlet />
              </div>
              {!isDetailPage && !isHomePage && <Footer />}
            </div>
            {/* 除了 detail 页面，所有页面都显示 FloatActions */}
            {!isDetailPage && <FloatActions />}
          </Content>
        </Layout>
      </div>
    </div>
  );
};

export default MainLayout;
