import React from "react";
import { RightOutlined } from "@ant-design/icons";

type Level = "入门" | "基础" | "进阶" | "实战";

interface Tutorial {
  icon: string;
  title: string;
  desc: string;
  lang: string;
  time: string;
  level: Level;
  lightStyle: React.CSSProperties;
  darkStyle: React.CSSProperties;
  badge: string;
  darkBadge: string;
}

const TUTORIALS: Tutorial[] = [
  {
    icon: ">_",
    title: "Python 入门：变量与数据类型",
    desc: "从 Hello World 开始，掌握基础语法、内置类型与表达式计算。",
    lang: "Python",
    time: "约 2 小时",
    level: "入门",
    lightStyle: { background: "linear-gradient(135deg, rgba(249,168,212,0.70), rgba(252,231,243,0.60), rgba(251,207,232,0.50))" },
    darkStyle:  { background: "linear-gradient(135deg, rgba(219,39,119,0.65), rgba(157,23,77,0.55), rgba(131,24,67,0.70))" },
    badge: "text-[#be185d] bg-[#fce7f3]",
    darkBadge: "text-[#f9a8d4] bg-[#831843]/60",
  },
  {
    icon: "⊞",
    title: "面向对象编程：封装与继承",
    desc: "通过真实项目案例深入理解封装、继承、多态，奖励设计模式实践。",
    lang: "Python",
    time: "约 3 小时",
    level: "进阶",
    lightStyle: { background: "linear-gradient(135deg, rgba(216,180,254,0.70), rgba(237,233,254,0.60), rgba(233,213,255,0.50))" },
    darkStyle:  { background: "linear-gradient(135deg, rgba(124,58,237,0.65), rgba(109,40,217,0.55), rgba(91,33,182,0.70))" },
    badge: "text-[#7c3aed] bg-[#ede9fe]",
    darkBadge: "text-[#ddd6fe] bg-[#4c1d95]/60",
  },
  {
    icon: "{}",
    title: "JavaScript 异步编程精讲",
    desc: "彻底搞懂 Promise、async/await 与事件循环，告别回调地狱。",
    lang: "JavaScript",
    time: "约 2.5 小时",
    level: "基础",
    lightStyle: { background: "linear-gradient(135deg, rgba(147,197,253,0.70), rgba(219,234,254,0.60), rgba(191,219,254,0.50))" },
    darkStyle:  { background: "linear-gradient(135deg, rgba(29,78,216,0.65), rgba(30,64,175,0.55), rgba(30,58,138,0.70))" },
    badge: "text-[#1d4ed8] bg-[#dbeafe]",
    darkBadge: "text-[#bfdbfe] bg-[#1e3a8a]/60",
  },
  {
    icon: "⚙",
    title: "数据结构：链表与树",
    desc: "手写链表、二叉树，结合经典题目理解递归与指针操作。",
    lang: "Python",
    time: "约 4 小时",
    level: "进阶",
    lightStyle: { background: "linear-gradient(135deg, rgba(110,231,183,0.70), rgba(209,250,229,0.60), rgba(167,243,208,0.50))" },
    darkStyle:  { background: "linear-gradient(135deg, rgba(5,150,105,0.65), rgba(4,120,87,0.55), rgba(6,95,70,0.70))" },
    badge: "text-[#065f46] bg-[#d1fae5]",
    darkBadge: "text-[#6ee7b7] bg-[#064e3b]/60",
  },
  {
    icon: "◈",
    title: "算法入门：排序与搜索",
    desc: "从冒泡到快速排序，掌握时间复杂度分析与二分查找技巧。",
    lang: "Python",
    time: "约 3 小时",
    level: "基础",
    lightStyle: { background: "linear-gradient(135deg, rgba(252,211,77,0.70), rgba(254,249,195,0.60), rgba(253,230,138,0.50))" },
    darkStyle:  { background: "linear-gradient(135deg, rgba(180,83,9,0.65), rgba(146,64,14,0.55), rgba(120,53,15,0.70))" },
    badge: "text-[#92400e] bg-[#fef9c3]",
    darkBadge: "text-[#fcd34d] bg-[#78350f]/60",
  },
  {
    icon: "⬡",
    title: "TypeScript 类型体操实战",
    desc: "泛型、条件类型、映射类型全面解析，写出真正类型安全的代码。",
    lang: "TypeScript",
    time: "约 3.5 小时",
    level: "实战",
    lightStyle: { background: "linear-gradient(135deg, rgba(251,146,60,0.70), rgba(255,237,213,0.60), rgba(254,215,170,0.50))" },
    darkStyle:  { background: "linear-gradient(135deg, rgba(234,88,12,0.65), rgba(194,65,12,0.55), rgba(154,52,18,0.70))" },
    badge: "text-[#9a3412] bg-[#ffedd5]",
    darkBadge: "text-[#fed7aa] bg-[#7c2d12]/60",
  },
];

const levelColor: Record<Level, string> = {
  入门: "text-[#be185d] bg-[#fce7f3] dark:text-[#f9a8d4] dark:bg-[#831843]/60",
  基础: "text-[#1d4ed8] bg-[#dbeafe] dark:text-[#bfdbfe] dark:bg-[#1e3a8a]/60",
  进阶: "text-[#7c3aed] bg-[#ede9fe] dark:text-[#ddd6fe] dark:bg-[#4c1d95]/60",
  实战: "text-[#9a3412] bg-[#ffedd5] dark:text-[#fed7aa] dark:bg-[#7c2d12]/60",
};

function useIsDark() {
  const [dark, setDark] = React.useState(() =>
    document.documentElement.classList.contains("dark"),
  );
  React.useEffect(() => {
    const obs = new MutationObserver(() =>
      setDark(document.documentElement.classList.contains("dark")),
    );
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => obs.disconnect();
  }, []);
  return dark;
}

const TutorialSection: React.FC = () => {
  const isDark = useIsDark();

  return (
    <section className="rounded-xl p-[18px] bg-white/[0.58] dark:bg-white/[0.18] border-0 dark:border dark:border-white/[0.28] shadow-[0_8px_30px_rgba(120,90,200,0.14),inset_0_1px_0_rgba(255,255,255,0.74),inset_0_-1px_0_rgba(255,255,255,0.34)] dark:shadow-[0_10px_32px_rgba(0,0,0,0.42),inset_0_1px_0_rgba(255,255,255,0.22),inset_0_-1px_0_rgba(255,255,255,0.12)] backdrop-blur-[40px] backdrop-saturate-[210%]">
      <div className="mb-4 flex items-center gap-2">
        <h2 className="m-0 text-base font-semibold text-[var(--text-primary)]">入门教程</h2>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {TUTORIALS.map((tut, i) => (
          // eslint-disable-next-line react/forbid-dom-props
          <div
            key={i}
            style={isDark ? tut.darkStyle : tut.lightStyle}
            className="group relative flex cursor-pointer flex-col rounded-2xl p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg overflow-hidden"
          >
            {/* top row */}
            <div className="mb-4 flex items-start justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/70 dark:bg-white/20 text-lg font-bold text-gray-700 dark:text-white shadow-sm backdrop-blur-sm">
                {tut.icon}
              </div>
              <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${levelColor[tut.level]}`}>
                {tut.level}
              </span>
            </div>
            {/* title */}
            <div className="mb-1.5 text-[15px] font-bold leading-snug text-gray-800 dark:text-white">
              {tut.title}
            </div>
            {/* desc */}
            <div className="mb-4 flex-1 text-[13px] leading-relaxed text-gray-600 dark:text-white/80">
              {tut.desc}
            </div>
            {/* footer */}
            <div className="flex items-center justify-between text-[12px] text-gray-500 dark:text-white/60">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <span className="opacity-60">▶</span> {tut.lang}
                </span>
                <span className="flex items-center gap-1">
                  <span className="opacity-60">◷</span> {tut.time}
                </span>
              </div>
              <RightOutlined className="opacity-0 transition-opacity group-hover:opacity-60" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TutorialSection;
