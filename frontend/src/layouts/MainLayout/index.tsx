import React, { useEffect, useRef, useState } from "react";
import { Layout } from "antd";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Header from "./Header";
import Sider from "./Sider";
import Footer from "./Footer";
import FloatActions from "./FloatActions";
import SyllabusListModal from "@/pages/Teaching/Syllabus/ListModal";
import ExamListModal from "@/pages/Teaching/ExamDesign/ListModal";
import { SYLLABUS_EVENTS, SYLLABUS_STORAGE_KEY, SYLLABUS_TITLE } from "@/pages/Teaching/Syllabus/constants";
import { EXAM_EVENTS, EXAM_STORAGE_KEY, EXAM_TITLE } from "@/pages/Teaching/ExamDesign/constants";
import { allWorkspaceModules } from "@/pages/workspaceRegistry";
import { getStoredTheme, applyTheme } from "@/utils/theme/controller";
import SnowLayer from "@/effects/SnowLayer";
import StarsLayer from "@/effects/StarsLayer";

const { Content } = Layout;

const MainLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [syllabusSiderOpen, setSyllabusSiderOpen] = useState(false);
  const [examSiderOpen, setExamSiderOpen] = useState(false);
  const [workspaceSiders, setWorkspaceSiders] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(allWorkspaceModules.map((module) => [module.key, false])),
  );
  const workspaceSidersRef = useRef(workspaceSiders);
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
    // 首次访问站点时引导至登录（仅一次，保存�?localStorage�?
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
    window.addEventListener(SYLLABUS_EVENTS.toggleSider, handleToggleSyllabusSider);
    window.addEventListener(SYLLABUS_EVENTS.getSiderState, handleGetSyllabusState);
    window.addEventListener(EXAM_EVENTS.toggleSider, handleToggleExamSider);
    window.addEventListener(EXAM_EVENTS.getSiderState, handleGetExamState);
    return () => {
      window.removeEventListener(SYLLABUS_EVENTS.toggleSider, handleToggleSyllabusSider);
      window.removeEventListener(SYLLABUS_EVENTS.getSiderState, handleGetSyllabusState);
      window.removeEventListener(EXAM_EVENTS.toggleSider, handleToggleExamSider);
      window.removeEventListener(EXAM_EVENTS.getSiderState, handleGetExamState);
    };
  }, [examSiderOpen, syllabusSiderOpen]);

  useEffect(() => {
    workspaceSidersRef.current = workspaceSiders;
  }, [workspaceSiders]);

  useEffect(() => {
    const cleanups = allWorkspaceModules.map((module) => {
      const handleToggle = () => {
        setWorkspaceSiders((prev) => {
          const nextOpen = !prev[module.key];
          window.setTimeout(() => {
            window.dispatchEvent(
              new CustomEvent(module.events.siderState, {
                detail: { open: nextOpen },
              }),
            );
          }, 0);
          return {
            ...prev,
            [module.key]: nextOpen,
          };
        });
      };

      const handleGetState = () => {
        window.dispatchEvent(
          new CustomEvent(module.events.siderState, {
            detail: { open: workspaceSidersRef.current[module.key] ?? false },
          }),
        );
      };

      window.addEventListener(module.events.toggleSider, handleToggle);
      window.addEventListener(module.events.getSiderState, handleGetState);
      return () => {
        window.removeEventListener(module.events.toggleSider, handleToggle);
        window.removeEventListener(module.events.getSiderState, handleGetState);
      };
    });

    return () => {
      cleanups.forEach((cleanup) => cleanup());
    };
  }, []);

  useEffect(() => {
    window.dispatchEvent(
        new CustomEvent(SYLLABUS_EVENTS.siderState, {
        detail: { open: syllabusSiderOpen },
      })
    );
  }, [syllabusSiderOpen]);

  useEffect(() => {
    window.dispatchEvent(
        new CustomEvent(EXAM_EVENTS.siderState, {
        detail: { open: examSiderOpen },
      })
    );
  }, [examSiderOpen]);

  useEffect(() => {
    allWorkspaceModules.forEach((module) => {
      window.dispatchEvent(
        new CustomEvent(module.events.siderState, {
          detail: { open: workspaceSiders[module.key] ?? false },
        }),
      );
    });
  }, [workspaceSiders]);

  // 只要路径包含 detail 视为 detail 页面
  const isDetailPage = /\/detail(\/|$)/.test(location.pathname);
  const isHomePage = location.pathname === "/";
  // 侧边栏切换按钮逻辑：只在大�?试卷详情页显�?
  const isSyllabusDetail = location.pathname.startsWith("/teaching/syllabus") && location.pathname !== "/teaching/syllabus/ListPage";
  const isExamDetail = location.pathname.startsWith("/teaching/exam/detail");

  useEffect(() => {
    if (location.pathname === "/teaching/syllabus/ListPage") {
      setSyllabusSiderOpen(false);
    }
    if (location.pathname === "/teaching/exam/ListPage") {
      setExamSiderOpen(false);
    }
    allWorkspaceModules.forEach((module) => {
      if (location.pathname === `${module.routeBase}/ListPage`) {
        setWorkspaceSiders((prev) =>
          prev[module.key]
            ? {
                ...prev,
                [module.key]: false,
              }
            : prev,
        );
      }
    });
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
      {/* 全屏雪花特效：固定定位在最底层，pointer-events:none 不影响交�?*/}
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
        {/* 左侧�?*/}
        <Sider
          open={syllabusSiderOpen && isSyllabusDetail}
          onClose={() => setSyllabusSiderOpen(false)}
          storageKey={SYLLABUS_STORAGE_KEY}
          title={SYLLABUS_TITLE}
          createEventName={SYLLABUS_EVENTS.create}
          updatedEventName={SYLLABUS_EVENTS.updated}
          currentIdEventName={SYLLABUS_EVENTS.currentId}
          selectEventName={SYLLABUS_EVENTS.select}
          deleteEventName={SYLLABUS_EVENTS.delete}
          widthEventName={SYLLABUS_EVENTS.siderWidth}
          getWidthEventName={SYLLABUS_EVENTS.getSiderWidth}
          listModalComponent={SyllabusListModal}
        />
        <Sider
          open={examSiderOpen && isExamDetail}
          onClose={() => setExamSiderOpen(false)}
          storageKey={EXAM_STORAGE_KEY}
          title={EXAM_TITLE}
          createEventName={EXAM_EVENTS.create}
          updatedEventName={EXAM_EVENTS.updated}
          currentIdEventName={EXAM_EVENTS.currentId}
          selectEventName={EXAM_EVENTS.select}
          deleteEventName={EXAM_EVENTS.delete}
          widthEventName={EXAM_EVENTS.siderWidth}
          getWidthEventName={EXAM_EVENTS.getSiderWidth}
          listModalComponent={ExamListModal}
        />
        {allWorkspaceModules.map((module) => {
          const isWorkspaceDetail = location.pathname.startsWith(`${module.routeBase}/detail`);
          return (
            <Sider
              key={module.key}
              open={(workspaceSiders[module.key] ?? false) && isWorkspaceDetail}
              onClose={() =>
                setWorkspaceSiders((prev) => ({
                  ...prev,
                  [module.key]: false,
                }))
              }
              storageKey={module.storageKey}
              title={module.listTitle}
              createEventName={module.events.create}
              updatedEventName={module.events.updated}
              currentIdEventName={module.events.currentId}
              selectEventName={module.events.select}
              deleteEventName={module.events.delete}
              widthEventName={module.events.siderWidth}
              getWidthEventName={module.events.getSiderWidth}
              listModalComponent={module.listModalComponent}
              buildCreatedItem={({ id, createdAt, payload }) =>
                module.buildRecord({ id, createdAt, payload })
              }
              detailPathBuilder={module.detailPathBuilder}
            />
          );
        })}
        
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
