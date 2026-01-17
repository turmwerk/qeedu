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
} from "@ant-design/icons";

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
  "/teaching/syllabus": {
    title: "大纲设计",
    icon: <BookOutlined data-oid="gayo2n4" />,
  },
  "/teaching/exam": {
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

const MainHeader: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  // 获取当前路由的配置
  const currentConfig = routeConfig[location.pathname] || {
    title: "nju-edu-ai-system",
  };

  return (
    <Header
      className="bg-white/40 backdrop-blur-[32px] shadow-[0_20px_60px_rgba(147,51,234,0.2),0_0_0_1px_rgba(255,255,255,0.5)_inset] border-b border-white/30 py-2 px-10 flex items-center justify-between relative z-[100] leading-[20px] h-[56px]"
      data-oid="hoa5tyk"
    >
      <div className="flex items-center gap-3" data-oid="40dtg53">
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
      <div className="flex items-center gap-4" data-oid="lg2sztd">
        {!isHomePage && (
          <button
            className="flex items-center gap-1.5 px-4 py-1.5 text-sm font-medium text-[#1a1a1a] bg-transparent border-0 cursor-pointer rounded-lg transition-all hover:text-[#6236ff] hover:bg-[rgba(98,54,255,0.05)]"
            onClick={() => navigate("/")}
            data-oid="obxmeer"
          >
            <HomeOutlined data-oid="n:k00v0" />
            <span data-oid="wwhcunl">首页</span>
          </button>
        )}
        {isHomePage ? (
          <button
            className="flex items-center gap-1.5 px-4 py-1.5 text-sm font-medium text-[#1a1a1a] bg-transparent border-0 cursor-pointer rounded-lg transition-all hover:text-[#6236ff] hover:bg-[rgba(98,54,255,0.05)]"
            onClick={() => navigate("/login")}
            data-oid=".99sosb"
          >
            <UserOutlined data-oid="gg7zr4f" />
            <span data-oid="-boqnsj">登录 / 注册</span>
          </button>
        ) : (
          <button
            className="flex items-center gap-1.5 px-4 py-1.5 text-sm font-medium text-[#1a1a1a] bg-transparent border-0 cursor-pointer rounded-lg transition-all hover:text-[#6236ff] hover:bg-[rgba(98,54,255,0.05)]"
            onClick={() => navigate(-1)}
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
