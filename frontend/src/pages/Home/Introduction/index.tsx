import React from "react";
import NavButton from "./NavButton";
import ModuleCard from "@/feature/ModuleHub/ModuleCard";
import {
  BookOutlinedIcon,
  CodeOutlinedIcon,
  InfoCircleOutlinedIcon,
  RocketOutlinedIcon,
} from "@/ui/Icon";
import { useTranslation } from "@/hooks/useTranslation";

interface IntroductionProps {
  onScrollToNext?: () => void;
}

const Introduction: React.FC<IntroductionProps> = ({ onScrollToNext }) => {
  const { t } = useTranslation();
  const quickActions = [
    {
      title: "立即开始",
      desc: "从首页快速进入常用教育 AI 模块与入口。",
      to: "/",
      icon: <RocketOutlinedIcon />,
      subLinks: [
        { label: "浏览全部模块", onClick: () => onScrollToNext?.() },
        { label: "进入助学首页", to: "/study" },
      ],
      onClick: () => onScrollToNext?.(),
    },
    {
      title: t("home.introduction.learnMore.title"),
      desc: t("home.introduction.learnMore.desc"),
      href: "https://qeedu.tech/",
      icon: <InfoCircleOutlinedIcon />,
      subLinks: [
        { label: t("home.introduction.learnMore.docs"), href: "https://docs.qeedu.tech/" },
        { label: t("home.introduction.learnMore.account"), href: "https://cloud.qeedu.tech/account" },
      ],
    },
    {
      title: "智能教学IDE",
      desc: "进入代码辅导场景，在浏览器中直接编程。",
      to: "/study/code-tutor/ListPage",
      icon: <CodeOutlinedIcon />,
      subLinks: [
        { label: "项目列表", to: "/study/code-tutor/ListPage" },
        { label: "进入 IDE", to: "/study/code-tutor/ProjectPage" },
      ],
    },
    {
      title: "学科资源包",
      desc: "查看课程与专业相关的资源整合入口。",
      to: "/study/resource-pack",
      icon: <BookOutlinedIcon />,
      subLinks: [
        { label: "学院总览", to: "/study/resource-pack/nju-schools" },
        { label: "专业分类", to: "/study/resource-pack/admissions-categories" },
      ],
    },
  ];

  return (
    <section
      className="relative w-full flex flex-col items-center justify-center min-h-[100svh] h-auto bg-transparent overflow-visible -mt-px z-[1] px-0 py-16 md:min-h-[90vh] md:h-[90vh] md:overflow-hidden md:py-0"
    >
      <div className="flex flex-col items-center justify-center w-full gap-5 px-4 md:h-full md:flex-1 md:gap-6">
        <div className="flex flex-col items-center md:-mt-8">
          <h1 className="text-[38px] sm:text-[48px] font-black text-[var(--brand-blue)] text-center mb-2 select-none">
            启育·QeEdu
          </h1>
          <div className="text-[16px] sm:text-[20px] text-[var(--brand-muted)] text-center select-none">
            面向高校全角色、全场景的 AI 原生智能体平台
          </div>
        </div>
        <div className="mt-2 grid w-full max-w-[1120px] grid-cols-1 justify-items-center gap-3 md:grid-cols-[minmax(0,500px)_minmax(0,500px)] md:justify-center">
          {quickActions.map((item) => (
            <div key={item.title} className="w-full max-w-[500px]">
              <ModuleCard
                title={item.title}
                desc={item.desc}
                subLinks={item.subLinks}
                to={item.to}
                href={item.href}
                icon={item.icon}
                onClick={item.onClick}
              />
            </div>
          ))}
        </div>
      </div>
      <div className="relative z-10 mt-2 md:absolute md:left-1/2 md:bottom-8 md:mt-0 md:-translate-x-1/2">
        <NavButton onClick={onScrollToNext || (() => {})} ariaLabel="向下滚动" />
      </div>
    </section>
  );
};

export default Introduction;
