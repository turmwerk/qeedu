import React, { useEffect, useRef, useState } from "react";
import { Layout } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import Dropdown from "@/ui/Dropdown";
import Button from "@/ui/Button";
import {
  ArrowLeftOutlinedIcon,
  GlobalOutlinedIcon,
  HomeOutlinedIcon,
  SearchOutlinedIcon,
  SettingOutlinedIcon,
  TeamOutlinedIcon,
  UserOutlinedIcon,
} from "@/ui/Icon";
import SearchModal from "@/layouts/MainLayout/SearchModal";
import { useAuth } from "@/hooks/useAuth";
import { getStoredTheme, toggleTheme } from "@/utils/theme/controller";
import { internationalModuleCatalog } from "@/pages/International/moduleCatalog";
import { managementModuleCatalog, managementIcon } from "@/pages/Management/moduleCatalog";
import { researchModuleCatalog } from "@/pages/Research/moduleCatalog";
import { studyModuleCatalog, studyIcon } from "@/pages/Study/moduleCatalog";
import { teachingModuleCatalog, teachingIcon } from "@/pages/Teaching/moduleCatalog";

const { Header } = Layout;

const menuButtonBase =
  "relative inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3.5 py-1 text-[14px] font-semibold rounded-xl transition-[color] hover:text-[var(--brand-purple)]";
const menuButtonUnderline =
  "after:content-[''] after:absolute after:left-0 after:-bottom-[1px] after:h-[1.5px] after:w-0 after:bg-current after:transition-all after:duration-200 hover:after:w-full";
const menuButtonIdle = "text-[var(--brand-blue)] bg-transparent";
const menuButtonActive =
  "text-[var(--brand-purple)] bg-[var(--brand-accent-soft)]";

type DropdownItem = {
  label: string;
  path: string;
  icon?: React.ReactNode;
};

const buildItems = (
  pathname: string,
  navigate: ReturnType<typeof useNavigate>,
  items: DropdownItem[],
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

const studyDropdownItems: DropdownItem[] = studyModuleCatalog.map((item) => ({
  label: item.title,
  path: item.to,
  icon: item.icon,
}));

const teachingDropdownItems: DropdownItem[] = teachingModuleCatalog.map((item) => ({
  label: item.title,
  path: item.to,
  icon: item.icon,
}));

const managementDropdownItems: DropdownItem[] = managementModuleCatalog.map((item) => ({
  label: item.title,
  path: item.to,
  icon: item.icon,
}));

const researchDropdownItems: DropdownItem[] = researchModuleCatalog.map((item) => ({
  label: item.title,
  path: item.to,
  icon: item.icon,
}));

const internationalDropdownItems: DropdownItem[] = internationalModuleCatalog.map((item) => ({
  label: item.title,
  path: item.to,
  icon: item.icon,
}));

const MainHeader: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const navStackRef = useRef<string[]>([]);
  const { isAuthenticated, user, logout } = useAuth();
  const isHomePage = location.pathname === "/";
  const isStudy = location.pathname.startsWith("/study");
  const isTeaching = location.pathname.startsWith("/teaching");
  const isInternational = location.pathname.startsWith("/international");
  const isManagement = location.pathname.startsWith("/management");
  const isResearch = location.pathname.startsWith("/research");

  const [searchVisible, setSearchVisible] = useState(false);
  const [theme, setTheme] = useState(getStoredTheme());

  useEffect(() => {
    const handler = () => setTheme(getStoredTheme());
    window.addEventListener("theme-change", handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener("theme-change", handler);
      window.removeEventListener("storage", handler);
    };
  }, []);

  const handleToggleTheme = () => {
    const next = toggleTheme();
    setTheme(next);
  };

  const normalizeRoute = (pathname: string, search: string): string => {
    const canonicalPath =
      pathname === "/study/code-tutor"
        ? "/study/code-tutor/ListPage"
        : pathname === "/research/collaboration"
          ? "/research/paper-writing"
          : /\/ListPage$/i.test(pathname)
            ? pathname.replace(/\/ListPage$/i, "")
            : /\/detail\/([^/]+)$/i.test(pathname) && pathname.startsWith("/research/literature-search")
              ? pathname.replace(/\/detail\/([^/]+)$/i, "/queries/$1")
              : /\/detail\/([^/]+)$/i.test(pathname) && pathname.startsWith("/research/paper-reader")
                ? pathname.replace(/\/detail\/([^/]+)$/i, "/papers/$1")
                : /\/detail\/([^/]+)$/i.test(pathname) && pathname.startsWith("/research/paper-writing")
                  ? pathname.replace(/\/detail\/([^/]+)$/i, "/drafts/$1")
                  : pathname;
    return `${canonicalPath}${search}`;
  };

  useEffect(() => {
    const current = normalizeRoute(location.pathname, location.search);
    const stack = navStackRef.current;
    const last = stack[stack.length - 1];

    if (last !== current) {
      stack.push(current);
      if (stack.length > 120) stack.shift();
    }
  }, [location.pathname, location.search]);

  const getFallbackBackTarget = (pathname: string): string => {
    const exact: Record<string, string> = {
      "/study": "/",
      "/study/resource-pack": "/study",
      "/study/resource-pack/nju-schools": "/study/resource-pack",
      "/study/resource-pack/disciplines": "/study/resource-pack",
      "/study/resource-pack/admissions-categories": "/study/resource-pack",
      "/study/progress-radar": "/study",
      "/study/career-planner": "/study",
      "/study/code-tutor": "/study",
      "/study/code-tutor/ListPage": "/study/code-tutor",
      "/study/code-tutor/ProjectPage": "/study/code-tutor/ListPage",
      "/teaching": "/",
      "/teaching/syllabus/ListPage": "/teaching",
      "/teaching/exam/ListPage": "/teaching",
      "/teaching/assignment-review": "/teaching",
      "/teaching/assignment-review/tasks": "/teaching/assignment-review",
      "/management": "/",
      "/research": "/",
      "/research/conference-list": "/research",
      "/research/collaboration": "/research",
      "/international": "/",
      "/international/exchange-hub": "/international",
      "/international/matching-lab": "/international",
      "/international/process-flow": "/international",
      "/international/writing-desk": "/international",
      "/international/pre-departure": "/international",
      "/international/welcome-portal": "/international",
      "/international/cultural-training": "/international",
      "/international/abroad-life": "/international",
      "/international/return-service": "/international",
      "/research/literature-search": "/research",
      "/research/paper-reader": "/research",
      "/research/paper-writing": "/research",
      "/management/process-assistant": "/management",
      "/management/announcement-generator": "/management",
      "/management/materials-center": "/management",
      "/management/student-qa": "/management",
      "/management/dashboard": "/management",
      "/management/timeline": "/management",
    };

    if (exact[pathname]) return exact[pathname];

    if (pathname.startsWith("/study/resource-pack/nju-schools/")) {
      return "/study/resource-pack/nju-schools";
    }
    if (pathname.startsWith("/study/resource-pack/admissions-categories/")) {
      return "/study/resource-pack/admissions-categories";
    }
    if (pathname.startsWith("/study/resource-pack/disciplines/")) {
      const parts = pathname.split("/").filter(Boolean);
      if (parts.length >= 5) {
        return `/study/resource-pack/disciplines/${parts[3]}`;
      }
      return "/study/resource-pack/disciplines";
    }

    if (pathname.startsWith("/teaching/syllabus/detail")) return "/teaching/syllabus/ListPage";
    if (pathname.startsWith("/teaching/exam/detail")) return "/teaching/exam/ListPage";
    if (pathname.startsWith("/teaching/assignment-review/tasks/")) {
      const parts = pathname.split("/").filter(Boolean);
      if (parts.length >= 6) return `/teaching/assignment-review/tasks/${parts[3]}`;
      return "/teaching/assignment-review/tasks";
    }

    if (pathname.startsWith("/management/process-assistant/cases/")) {
      return "/management/process-assistant";
    }
    if (pathname.startsWith("/management/announcement-generator/")) {
      return "/management/announcement-generator";
    }
    if (pathname.startsWith("/management/materials-center/collections/")) {
      return "/management/materials-center";
    }
    if (pathname.startsWith("/management/student-qa/threads/")) {
      return "/management/student-qa";
    }
    if (pathname.startsWith("/management/dashboard/insights/")) {
      return "/management/dashboard";
    }
    if (pathname.startsWith("/management/timeline/")) {
      return "/management/timeline";
    }

    if (pathname.startsWith("/research/literature-search/queries/")) return "/research/literature-search";
    if (pathname.startsWith("/research/paper-reader/papers/")) return "/research/paper-reader";
    if (pathname.startsWith("/research/paper-writing/drafts/")) return "/research/paper-writing";

    if (pathname.startsWith("/international/exchange-hub/programs/")) return "/international/exchange-hub";
    if (pathname.startsWith("/international/matching-lab/analyses/")) return "/international/matching-lab";
    if (pathname.startsWith("/international/process-flow/plans/")) return "/international/process-flow";
    if (pathname.startsWith("/international/writing-desk/drafts/")) return "/international/writing-desk";
    if (pathname.startsWith("/international/pre-departure/cases/")) return "/international/pre-departure";
    if (pathname.startsWith("/international/welcome-portal/cases/")) return "/international/welcome-portal";
    if (pathname.startsWith("/international/cultural-training/profiles/")) return "/international/cultural-training";
    if (pathname.startsWith("/international/abroad-life/tickets/")) return "/international/abroad-life";
    if (pathname.startsWith("/international/return-service/cases/")) return "/international/return-service";

    if (pathname.startsWith("/study/code-tutor/")) return "/study/code-tutor/ListPage";
    if (pathname.startsWith("/study/")) return "/study";
    if (pathname.startsWith("/teaching/")) return "/teaching";
    if (pathname.startsWith("/management/")) return "/management";
    if (pathname.startsWith("/research/")) return "/research";
    if (pathname.startsWith("/international/")) return "/international";

    return "/";
  };

  const handleBack = () => {
    const stack = navStackRef.current;

    if (stack.length > 1) {
      stack.pop();
      const prev = stack[stack.length - 1];
      if (prev) {
        navigate(prev);
        return;
      }
    }

    navigate(getFallbackBackTarget(location.pathname));
  };

  return (
    <Header
      className="main-header bg-transparent border-0 shadow-none pt-0 pb-0 pl-0 pr-1 sm:px-4 flex items-center justify-between relative z-[100] leading-[20px] h-[36px] sm:h-[46px]"
      data-oid="hoa5tyk"
    >
      <SearchModal open={searchVisible} onClose={() => setSearchVisible(false)} />
      <div className="flex items-center gap-1 sm:gap-3" data-oid="40dtg53">
        {!isHomePage && (
          <Button
            className={`${menuButtonBase} ${menuButtonUnderline} ${menuButtonIdle} !pl-0 sm:!pl-2`}
            onClick={handleBack}
            data-oid="36x2h-h"
          >
            <ArrowLeftOutlinedIcon />
            <span className="hidden sm:inline">返回</span>
          </Button>
        )}
        {isHomePage && (
          <span className="inline-flex items-center gap-2 text-[var(--brand-blue)] select-none">
            <HomeOutlinedIcon style={{ fontSize: 20 }} />
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
          <SettingOutlinedIcon />
          <span className="hidden sm:inline">设置</span>
        </Button>
        <Button
          className={`${menuButtonBase} ${menuButtonUnderline} ${menuButtonIdle}`}
          onClick={handleToggleTheme}
          data-oid="theme-button"
        >
          {theme === "dark" ? (
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
          <SearchOutlinedIcon />
          <span className="hidden sm:inline">搜索</span>
        </Button>
        {!isHomePage && (
          <Button
            className={`${menuButtonBase} ${menuButtonUnderline} ${menuButtonIdle}`}
            onClick={() => navigate("/")}
            data-oid="obxmeer"
          >
            <HomeOutlinedIcon />
            <span className="hidden sm:inline">首页</span>
          </Button>
        )}

        <div className="hidden sm:block">
          <Dropdown
            active={isStudy}
            button={
              <span className="inline-flex items-center gap-1.5">
                {studyIcon}
                <span>助学</span>
              </span>
            }
            buttonClassName={`${menuButtonBase} ${isStudy ? menuButtonActive : menuButtonIdle}`}
            onButtonClick={() => {
              if (location.pathname !== "/study") navigate("/study");
            }}
            items={buildItems(location.pathname, navigate, studyDropdownItems)}
            showBorder={false}
            portalToBody={true}
          />
        </div>

        <div className="hidden sm:block">
          <Dropdown
            active={isTeaching}
            button={
              <span className="inline-flex items-center gap-1.5">
                {teachingIcon}
                <span>助教</span>
              </span>
            }
            buttonClassName={`${menuButtonBase} ${isTeaching ? menuButtonActive : menuButtonIdle}`}
            onButtonClick={() => {
              if (location.pathname !== "/teaching") navigate("/teaching");
            }}
            items={buildItems(location.pathname, navigate, teachingDropdownItems)}
            showBorder={false}
            portalToBody={true}
          />
        </div>

        <div className="hidden sm:block">
          <Dropdown
            active={isManagement}
            button={
              <span className="inline-flex items-center gap-1.5">
                {managementIcon}
                <span>助管</span>
              </span>
            }
            buttonClassName={`${menuButtonBase} ${isManagement ? menuButtonActive : menuButtonIdle}`}
            onButtonClick={() => {
              if (location.pathname !== "/management") navigate("/management");
            }}
            items={buildItems(location.pathname, navigate, managementDropdownItems)}
            showBorder={false}
            portalToBody={true}
          />
        </div>

        <div className="hidden sm:block">
          <Dropdown
            active={isResearch}
            button={
              <span className="inline-flex items-center gap-1.5">
                <TeamOutlinedIcon />
                <span>助研</span>
              </span>
            }
            buttonClassName={`${menuButtonBase} ${isResearch ? menuButtonActive : menuButtonIdle}`}
            onButtonClick={() => {
              if (location.pathname !== "/research") navigate("/research");
            }}
            items={buildItems(location.pathname, navigate, researchDropdownItems)}
            showBorder={false}
            portalToBody={true}
          />
        </div>

        <div className="hidden sm:block">
          <Dropdown
            active={isInternational}
            button={
              <span className="inline-flex items-center gap-1.5">
                <GlobalOutlinedIcon />
                <span>国际交流</span>
              </span>
            }
            buttonClassName={`${menuButtonBase} ${isInternational ? menuButtonActive : menuButtonIdle}`}
            onButtonClick={() => {
              if (location.pathname !== "/international") navigate("/international");
            }}
            items={buildItems(location.pathname, navigate, internationalDropdownItems)}
            showBorder={false}
            portalToBody={true}
          />
        </div>

        {isAuthenticated ? (
          <Dropdown
            active={false}
            button={
              <span className="inline-flex items-center gap-1.5">
                <UserOutlinedIcon />
                <span>{user?.name || "用户"}</span>
              </span>
            }
            buttonClassName={`${menuButtonBase} ${menuButtonIdle} hidden sm:inline-flex`}
            items={[
              {
                label: "退出登录",
                active: false,
                onClick: logout,
              },
            ]}
            showBorder={false}
            portalToBody={true}
          />
        ) : null}

        <Button
          className={`${menuButtonBase} ${menuButtonUnderline} ${menuButtonIdle} ${isAuthenticated ? "sm:!hidden" : ""}`}
          onClick={() => (isAuthenticated ? logout() : navigate("/login"))}
          data-oid="login-button"
        >
          <UserOutlinedIcon />
          <span className="hidden sm:inline">{isAuthenticated ? "退出" : "登录"}</span>
        </Button>
      </div>
    </Header>
  );
};

export default MainHeader;
