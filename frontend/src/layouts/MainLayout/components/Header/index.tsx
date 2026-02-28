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
  IdcardOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import Dropdown from "@/components/Dropdown";
import Button from "@/components/Button";
import SearchModal from "@/layouts/MainLayout/components/SearchModal";
import { getStoredTheme, toggleTheme } from "@/utils/theme";

const { Header } = Layout;

// 路由配置：根据路由路径返回对应的标题和icon
const routeConfig: Record<string, { title: string; icon?: React.ReactNode }> = {
  "/": {
    title: "南京大学 · 智能教学",
    icon: <HomeOutlined data-oid="kbp6.my" />,
  },
  "/study": {
    title: "南京大学 · 助学模块",
    icon: <ReadOutlined data-oid="_p4uz6n" />,
  },
  "/study/code-tutor": {
    title: "编程辅导",
    icon: <CodeOutlined data-oid="_xkn:g-" />,
  },
  "/teaching": {
    title: "南京大学 · 助教模块",
    icon: <ExperimentOutlined data-oid="b7xm4-i" />,
  },
  "/teaching/syllabus/ListPage": {
    title: "大纲设计",
    icon: <BookOutlined data-oid="gayo2n4" />,
  },
  "/teaching/syllabus/detail": {
    title: "大纲设计",
    icon: <BookOutlined data-oid="gayo2n4" />,
  },
  "/teaching/exam/ListPage": {
    title: "试卷设计",
    icon: <FormOutlined data-oid="noyy4d9" />,
  },
  "/teaching/exam/detail": {
    title: "试卷设计",
    icon: <FormOutlined data-oid="noyy4d9" />,
  },
  "/research": {
    title: "南京大学 · 助研模块",
    icon: <TeamOutlined data-oid="zrp6b0:" />,
  },
  "/research/collaboration": {
    title: "科研协作",
    icon: <TeamOutlined data-oid="we:bhac" />,
  },
  "/management": {
    title: "南京大学 · 助管模块",
    icon: <ControlOutlined data-oid="q346jl0" />,
  },
  "/management/major": {
    title: "专业建设",
    icon: <BuildOutlined data-oid="h1vbz2u" />,
  },
  "/management/policy": {
    title: "政策响应",
    icon: <NotificationOutlined data-oid="5ip:1a0" />,
  },
};

const menuButtonBase =
  "relative inline-flex items-center gap-1.5 px-3.5 py-1.5 text-[14px] font-semibold rounded-xl transition-[color] hover:text-[var(--brand-purple)]";
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
        <span className="inline-flex items-center gap-1.5">{item.icon}{item.label}</span>
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

  const backRouteMap: Record<string, string> = {
    "/teaching": "/",
    "/teaching/exam/ListPage": "/teaching",
    "/teaching/syllabus/ListPage": "/teaching",
  };
  const backTarget = location.pathname.startsWith("/teaching/exam/detail")
    ? "/teaching/exam/ListPage"
    : location.pathname.startsWith("/teaching/syllabus/detail")
      ? "/teaching/syllabus/ListPage"
      : backRouteMap[location.pathname];

  // 获取当前路由的配置
  const currentConfig = routeConfig[location.pathname] || {
    title: "nju-edu-ai-system",
  };

  return (
    <Header
      className="main-header bg-transparent border-0 shadow-none py-2 px-4 flex items-center justify-between relative z-[100] leading-[20px] h-[56px]"
      data-oid="hoa5tyk"
    >
      <SearchModal open={searchVisible} onClose={() => setSearchVisible(false)} />
      <div className="flex items-center gap-3" data-oid="40dtg53">
        {!isHomePage && (
          <Button
            className={`${menuButtonBase} ${menuButtonUnderline} ${menuButtonIdle}`}
            onClick={() => (backTarget ? navigate(backTarget) : navigate(-1))}
            data-oid="36x2h-h"
          >
            <ArrowLeftOutlined />
            <span>返回</span>
          </Button>
        )}
        {currentConfig.icon && (
          <span
            className="text-[24px] text-[var(--brand-blue)] flex items-center"
            data-oid="rx_r2du"
          >
            {currentConfig.icon}
          </span>
        )}
        <h1
          className="m-0 text-[20px] font-bold text-[var(--brand-blue)]"
          data-oid="62z39-1"
        >
          {currentConfig.title}
        </h1>
      </div>
      <div className="flex items-center gap-1.5" data-oid="lg2sztd">
        <Button
          className={`${menuButtonBase} ${menuButtonUnderline} ${menuButtonIdle}`}
          onClick={() => {}}
          data-oid="settings-button"
        >
          <SettingOutlined />
          <span>设置</span>
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
          <span>主题</span>
        </Button>
        <Button
          className={`${menuButtonBase} ${menuButtonUnderline} ${menuButtonIdle}`}
          onClick={() => setSearchVisible(true)}
          data-oid="search-button"
        >
          <SearchOutlined />
          <span>搜索</span>
        </Button>
        {!isHomePage && (
          <Button
            className={`${menuButtonBase} ${menuButtonUnderline} ${menuButtonIdle}`}
            onClick={() => navigate("/")}
            data-oid="obxmeer"
          >
            <HomeOutlined />
            <span>首页</span>
          </Button>
        )}

        <Dropdown
          active={isStudy}
          button={
            <span className="inline-flex items-center gap-1.5">
              <ReadOutlined />
              助学
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
        <Dropdown
          active={isTeaching}
          button={
            <span className="inline-flex items-center gap-1.5">
              <ExperimentOutlined />
              助教
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
        <Dropdown
          active={isManagement}
          button={
            <span className="inline-flex items-center gap-1.5">
              <ControlOutlined />
              助管
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
        <Dropdown
          active={isResearch}
          button={
            <span className="inline-flex items-center gap-1.5">
              <TeamOutlined />
              助研
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

        <Dropdown
          button={
            <span className="inline-flex items-center justify-center gap-1.5 min-w-[3.5em]">
              <UserOutlined />
              登录
            </span>
          }
          buttonClassName={`${menuButtonBase} ${menuButtonIdle}`}
          items={[
            {
              label: (
                <span className="inline-flex items-center justify-center gap-1.5 min-w-[3.5em]">
                  <IdcardOutlined />
                  注册
                </span>
              ),
              onClick: () => navigate("/register"),
            },
          ]}
          onButtonClick={() => navigate("/login")}
          showBorder={false}
          portalToBody={true}
        />
      </div>
    </Header>
  );
};

export default MainHeader;
