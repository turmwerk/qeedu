import React, { useEffect, useState } from "react";
import { Layout } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import {
  ReadOutlined,
  SearchOutlined,
  ExperimentOutlined,
  TeamOutlined,
  ControlOutlined,
  CodeOutlined,
  BookOutlined,
  FormOutlined,
  BuildOutlined,
  NotificationOutlined,
  HomeOutlined,
  ArrowLeftOutlined,
  UserOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import Dropdown from "@/components/Dropdown";
import Button from "@/components/Button";
import SearchModal from "@/layouts/MainLayout/components/SearchModal";
import { getStoredTheme, toggleTheme } from "@/utils/theme";

const { Header } = Layout;



const menuButtonBase =
  "relative inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3.5 py-1 text-[14px] font-semibold rounded-xl transition-[color] hover:text-[var(--brand-purple)]";
const menuButtonUnderline = 
  "after:content-[''] after:absolute after:left-0 after:-bottom-[1px] after:h-[1.5px] after:w-0 after:bg-current after:transition-all after:duration-200 hover:after:w-full";
const menuButtonIdle = "text-[var(--brand-blue)] bg-transparent";
const menuButtonActive =
  "text-[var(--brand-purple)] bg-[var(--brand-accent-soft)]";

const buildItems = (
  pathname: string,
  navigate: ReturnType<typeof useNavigate>,
  items: Array<{ label: string; path: string; icon?: React.ReactNode }>,
) =>
  items.map((item) => {
    const normalizedItemPath = item.path.replace(/\/ListPage$/i, "");
    const itemActive =
      pathname === item.path ||
      pathname === normalizedItemPath ||
      pathname.startsWith(`${normalizedItemPath}/`);
    return {
      label: item.icon ? (
        <span className="inline-flex items-center gap-1.5">
          <span className="hidden sm:inline-flex">{item.icon}</span>
          <span>{item.label}</span>
        </span>
      ) : item.label,
      active: itemActive,
      onClick: () => {
        if (!itemActive) navigate(item.path);
      },
    };
  });

const MainHeader: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  const isStudy = location.pathname.startsWith("/study");
  const isTeaching = location.pathname.startsWith("/teaching");
  const isManagement = location.pathname.startsWith("/management");
  const isResearch = location.pathname.startsWith("/research");

  const [searchVisible, setSearchVisible] = useState(false);
  const [theme, setTheme] = useState(getStoredTheme());

  useEffect(() => {
    const handler = () => setTheme(getStoredTheme());
    window.addEventListener('theme-change', handler);
    window.addEventListener('storage', handler);
    return () => {
      window.removeEventListener('theme-change', handler);
      window.removeEventListener('storage', handler);
    };
  }, []);

  const handleToggleTheme = () => {
    const next = toggleTheme();
    setTheme(next);
  };

  // Compute a deterministic "parent" route so the back button never
  // ping-pongs between two pages via browser history.
  const getBackTarget = (pathname: string): string => {
    // Exact matches first
    const exact: Record<string, string> = {
      "/study": "/",
      "/teaching": "/",
      "/research": "/",
      "/management": "/",
      "/study/code-tutor": "/study",
      "/study/code-tutor/ListPage": "/study/code-tutor",
      "/teaching/exam/ListPage": "/teaching",
      "/teaching/syllabus/ListPage": "/teaching",
      "/management/major": "/management",
      "/management/policy": "/management",
      "/research/collaboration": "/research",
    };
    if (exact[pathname]) return exact[pathname];

    // Prefix matches (detail pages, etc.)
    if (pathname.startsWith("/teaching/exam/detail")) return "/teaching/exam/ListPage";
    if (pathname.startsWith("/teaching/syllabus/detail")) return "/teaching/syllabus/ListPage";
    if (pathname.startsWith("/study/code-tutor/")) return "/study/code-tutor/ListPage";
    if (pathname.startsWith("/study/")) return "/study";
    if (pathname.startsWith("/teaching/")) return "/teaching";
    if (pathname.startsWith("/management/")) return "/management";
    if (pathname.startsWith("/research/")) return "/research";

    // Fallback: go home
    return "/";
  };
  const backTarget = isHomePage ? undefined : getBackTarget(location.pathname);



  return (
    <Header
      className="main-header bg-transparent border-0 shadow-none pt-0 pb-0 pl-0 pr-1 sm:px-4 flex items-center justify-between relative z-[100] leading-[20px] h-[36px] sm:h-[46px]"
      data-oid="hoa5tyk"
    >
      <SearchModal open={searchVisible} onClose={() => setSearchVisible(false)} />
      <div className="flex items-center gap-1 sm:gap-3" data-oid="40dtg53">
        {!isHomePage && (
          <Button
            className={`${menuButtonBase} ${menuButtonUnderline} ${menuButtonIdle}`}
            onClick={() => navigate(backTarget!)}
            data-oid="36x2h-h"
          >
            <ArrowLeftOutlined />
            <span className="hidden sm:inline">返回</span>
          </Button>
        )}
        {isHomePage && (
          <span className="inline-flex items-center gap-2 text-[var(--brand-blue)] select-none">
            <HomeOutlined style={{ fontSize: 20 }} />
            <span className="text-[16px] sm:text-[18px] font-bold tracking-wide">南京大学·智能教学</span>
          </span>
        )}
      </div>
      <div className="flex items-center gap-1 sm:gap-1.5" data-oid="lg2sztd">
        <Button
          className={`${menuButtonBase} ${menuButtonUnderline} ${menuButtonIdle}`}
          onClick={() => {}}
          data-oid="settings-button"
        >
          <SettingOutlined />
          <span className="hidden sm:inline">设置</span>
        </Button>
        <Button
          className={`${menuButtonBase} ${menuButtonUnderline} ${menuButtonIdle}`}
          onClick={handleToggleTheme}
          data-oid="theme-button"
        >
              {theme === 'dark' ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="leading-none inline-block">
                  <path d="M12 4V2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M12 22v-2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M4.93 4.93L3.51 3.51" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M20.49 20.49l-1.42-1.42" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M4 12H2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M22 12h-2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M4.93 19.07l-1.42 1.42" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M20.49 3.51l-1.42 1.42" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8" />
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="leading-none inline-block">
                  <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
          <span className="hidden sm:inline">主题</span>
        </Button>
        <Button
          className={`${menuButtonBase} ${menuButtonUnderline} ${menuButtonIdle}`}
          onClick={() => setSearchVisible(true)}
          data-oid="search-button"
        >
          <SearchOutlined />
          <span className="hidden sm:inline">搜索</span>
        </Button>
        {!isHomePage && (
          <Button
            className={`${menuButtonBase} ${menuButtonUnderline} ${menuButtonIdle}`}
            onClick={() => navigate("/")}
            data-oid="obxmeer"
          >
            <HomeOutlined />
            <span className="hidden sm:inline">首页</span>
          </Button>
        )}

        <div className="hidden sm:block">
          <Dropdown
            active={isStudy}
            button={
              <span className="inline-flex items-center gap-1.5">
                <ReadOutlined />
                <span>助学</span>
              </span>
            }
            buttonClassName={`${menuButtonBase} ${
              isStudy ? menuButtonActive : menuButtonIdle
            }`}
            onButtonClick={() => {
              if (location.pathname !== "/study") navigate("/study");
            }}
            items={buildItems(location.pathname, navigate, [
              { label: "编程辅导", path: "/study/code-tutor", icon: <CodeOutlined /> },
            ])}
            showBorder={false}
            portalToBody={true}
          />
        </div>
        <div className="hidden sm:block">
          <Dropdown
            active={isTeaching}
            button={
              <span className="inline-flex items-center gap-1.5">
                <ExperimentOutlined />
                <span>助教</span>
              </span>
            }
            buttonClassName={`${menuButtonBase} ${
              isTeaching ? menuButtonActive : menuButtonIdle
            }`}
            onButtonClick={() => {
              if (location.pathname !== "/teaching") navigate("/teaching");
            }}
            items={buildItems(location.pathname, navigate, [
              { label: "大纲设计", path: "/teaching/syllabus/ListPage", icon: <BookOutlined /> },
              { label: "试卷设计", path: "/teaching/exam/ListPage", icon: <FormOutlined /> },
            ])}
            showBorder={false}
            portalToBody={true}
          />
        </div>
        <div className="hidden sm:block">
          <Dropdown
            active={isManagement}
            button={
              <span className="inline-flex items-center gap-1.5">
                <ControlOutlined />
                <span>助管</span>
              </span>
            }
            buttonClassName={`${menuButtonBase} ${
              isManagement ? menuButtonActive : menuButtonIdle
            }`}
            onButtonClick={() => {
              if (location.pathname !== "/management") navigate("/management");
            }}
            items={buildItems(location.pathname, navigate, [
              { label: "专业建设", path: "/management/major", icon: <BuildOutlined /> },
              { label: "政策响应", path: "/management/policy", icon: <NotificationOutlined /> },
            ])}
            showBorder={false}
            portalToBody={true}
          />
        </div>
        <div className="hidden sm:block">
          <Dropdown
            active={isResearch}
            button={
              <span className="inline-flex items-center gap-1.5">
                <TeamOutlined />
                <span>助研</span>
              </span>
            }
            buttonClassName={`${menuButtonBase} ${
              isResearch ? menuButtonActive : menuButtonIdle
            }`}
            onButtonClick={() => {
              if (location.pathname !== "/research") navigate("/research");
            }}
            items={buildItems(location.pathname, navigate, [
              { label: "科研协作", path: "/research/collaboration", icon: <TeamOutlined /> },
            ])}
            showBorder={false}
            portalToBody={true}
          />
        </div>

        <Button
          className={`${menuButtonBase} ${menuButtonUnderline} ${menuButtonIdle}`}
          onClick={() => navigate("/login")}
          data-oid="login-button"
        >
          <UserOutlined />
          <span className="hidden sm:inline">登录</span>
        </Button>
      </div>
    </Header>
  );
};

export default MainHeader;
