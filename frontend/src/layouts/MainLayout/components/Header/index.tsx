import React from "react";
import { Layout } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import {
  ReadOutlined,
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
  MenuOutlined,
} from "@ant-design/icons";
import Dropdown from "@/components/Dropdown";

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
  "/teaching/syllabus/DetailPage": {
    title: "大纲设计",
    icon: <BookOutlined data-oid="gayo2n4" />,
  },
  "/teaching/exam/ListPage": {
    title: "试卷设计",
    icon: <FormOutlined data-oid="noyy4d9" />,
  },
  "/teaching/exam/DetailPage": {
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
  "flex items-center gap-1.5 px-3.5 py-1.5 text-sm font-semibold rounded-xl border border-[var(--brand-border)] transition-[background,border-color,box-shadow,transform] hover:bg-[var(--brand-accent-soft)] hover:border-[var(--brand-accent)] hover:shadow-[var(--brand-shadow)] hover:-translate-y-[1px]";
const menuButtonIdle = "text-[var(--brand-accent)] bg-white";
const menuButtonActive =
  "text-[#4a2aa6] bg-[var(--brand-accent-soft)] border-[var(--brand-accent)]";

const buildItems = (
  pathname: string,
  navigate: ReturnType<typeof useNavigate>,
  items: Array<{ label: string; path: string }>,
) =>
  items.map((item) => {
    const itemActive = pathname === item.path;
    return {
      label: item.label,
      active: itemActive,
      onClick: () => {
        if (!itemActive) navigate(item.path);
      },
    };
  });

const MainHeader: React.FC<{
  onToggleSider?: () => void;
  showSiderToggle?: boolean;
  siderOpen?: boolean;
}> = ({ onToggleSider, showSiderToggle, siderOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  const isStudy = location.pathname.startsWith("/study");
  const isTeaching = location.pathname.startsWith("/teaching");
  const isManagement = location.pathname.startsWith("/management");
  const isResearch = location.pathname.startsWith("/research");

  const backRouteMap: Record<string, string> = {
    "/teaching": "/",
    "/teaching/exam/ListPage": "/teaching",
    "/teaching/syllabus/ListPage": "/teaching",
  };
  const backTarget = location.pathname.startsWith("/teaching/exam/DetailPage")
    ? "/teaching/exam/ListPage"
    : location.pathname.startsWith("/teaching/syllabus/DetailPage")
      ? "/teaching/syllabus/ListPage"
      : backRouteMap[location.pathname];

  // 获取当前路由的配置
  const currentConfig = routeConfig[location.pathname] || {
    title: "nju-edu-ai-system",
  };

  return (
    <Header
      className="main-header bg-white/40 backdrop-blur-[32px] shadow-[0_20px_60px_rgba(147,51,234,0.2),0_0_0_1px_rgba(255,255,255,0.5)_inset] border-b border-white/30 py-2 px-4 flex items-center justify-between relative z-[100] leading-[20px] h-[56px]"
      data-oid="hoa5tyk"
    >
      <div className="flex items-center gap-3" data-oid="40dtg53">
        {showSiderToggle && !siderOpen && (
          <button
            className="flex items-center justify-center w-9 h-9 rounded-lg bg-white border border-[var(--brand-border)] text-[var(--brand-accent)] hover:bg-[var(--brand-accent-soft)] hover:border-[var(--brand-accent)] hover:shadow-[var(--brand-shadow)] transition"
            onClick={onToggleSider}
            aria-label="打开侧边栏"
            data-oid="sider-toggle"
          >
            <MenuOutlined />
          </button>
        )}
        {currentConfig.icon && (
          <span
            className="text-[24px] text-[#6236ff] flex items-center"
            data-oid="rx_r2du"
          >
            {currentConfig.icon}
          </span>
        )}
        <h1
          className="m-0 text-[20px] font-bold text-[#1a1a1a]"
          data-oid="62z39-1"
        >
          {currentConfig.title}
        </h1>
      </div>
      <div className="flex items-center gap-3" data-oid="lg2sztd">
        {!isHomePage && (
          <button
            className={`${menuButtonBase} ${menuButtonIdle}`}
            onClick={() => navigate("/")}
            data-oid="obxmeer"
          >
            <HomeOutlined data-oid="n:k00v0" />
            <span data-oid="wwhcunl">首页</span>
          </button>
        )}

        <Dropdown
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
            if (!isStudy) navigate("/study");
          }}
          items={buildItems(location.pathname, navigate, [
            { label: "编程辅导", path: "/study/code-tutor" },
          ])}
        />
        <Dropdown
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
            if (!isTeaching) navigate("/teaching");
          }}
          items={buildItems(location.pathname, navigate, [
            { label: "大纲设计", path: "/teaching/syllabus/ListPage" },
            { label: "试卷设计", path: "/teaching/exam/ListPage" },
          ])}
        />
        <Dropdown
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
            if (!isManagement) navigate("/management");
          }}
          items={buildItems(location.pathname, navigate, [
            { label: "专业建设", path: "/management/major" },
            { label: "政策响应", path: "/management/policy" },
          ])}
        />
        <Dropdown
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
            if (!isResearch) navigate("/research");
          }}
          items={buildItems(location.pathname, navigate, [
            { label: "科研协作", path: "/research/collaboration" },
          ])}
        />

        {isHomePage ? (
          <button
            className={`${menuButtonBase} ${menuButtonIdle}`}
            onClick={() => navigate("/login")}
            data-oid=".99sosb"
          >
            <UserOutlined data-oid="gg7zr4f" />
            <span data-oid="-boqnsj">登录 / 注册</span>
          </button>
        ) : (
          <button
            className={`${menuButtonBase} ${menuButtonIdle}`}
            onClick={() => (backTarget ? navigate(backTarget) : navigate(-1))}
            data-oid="36x2h-h"
          >
            <ArrowLeftOutlined data-oid="o9u1a7c" />
            <span data-oid="8-4d5cu">返回</span>
          </button>
        )}
      </div>
    </Header>
  );
};

export default MainHeader;
