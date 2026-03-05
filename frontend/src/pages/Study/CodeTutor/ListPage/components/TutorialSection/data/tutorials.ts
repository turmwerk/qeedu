import type { Feature } from "@/components/ModuleHub";

export type Level = "入门" | "基础" | "进阶" | "实战";

export interface TutorialItem extends Feature {
  level: Level;
  lang: string;
  time: string;
}

export const TUTORIALS: TutorialItem[] = [
  {
    key: "python-basics",
    icon: ">_",
    title: "Python 入门：变量与数据类型",
    desc: "从 Hello World 开始，掌握基础语法、内置类型与表达式计算。",
    lang: "Python",
    time: "约 2 小时",
    level: "入门",
  },
  {
    key: "oop",
    icon: "⊞",
    title: "面向对象编程：封装与继承",
    desc: "通过真实项目案例深入理解封装、继承、多态，奖励设计模式实践。",
    lang: "Python",
    time: "约 3 小时",
    level: "进阶",
  },
  {
    key: "js-async",
    icon: "{}",
    title: "JavaScript 异步编程精讲",
    desc: "彻底搞懂 Promise、async/await 与事件循环，告别回调地狱。",
    lang: "JavaScript",
    time: "约 2.5 小时",
    level: "基础",
  },
  {
    key: "data-structures",
    icon: "⚙",
    title: "数据结构：链表与树",
    desc: "手写链表、二叉树，结合经典题目理解递归与指针操作。",
    lang: "Python",
    time: "约 4 小时",
    level: "进阶",
  },
  {
    key: "algorithms",
    icon: "◈",
    title: "算法入门：排序与搜索",
    desc: "从冒泡到快速排序，掌握时间复杂度分析与二分查找技巧。",
    lang: "Python",
    time: "约 3 小时",
    level: "基础",
  },
  {
    key: "ts-types",
    icon: "⬡",
    title: "TypeScript 类型体操实战",
    desc: "泛型、条件类型、映射类型全面解析，写出真正类型安全的代码。",
    lang: "TypeScript",
    time: "约 3.5 小时",
    level: "实战",
  },
];

/** Level badge Tailwind classes (light + dark). */
export const LEVEL_BADGE: Record<Level, { light: string; dark: string }> = {
  入门: { light: "text-[#be185d] bg-[#fce7f3]", dark: "text-[#f9a8d4] bg-[#831843]/60" },
  基础: { light: "text-[#1d4ed8] bg-[#dbeafe]", dark: "text-[#bfdbfe] bg-[#1e3a8a]/60" },
  进阶: { light: "text-[#7c3aed] bg-[#ede9fe]", dark: "text-[#ddd6fe] bg-[#4c1d95]/60" },
  实战: { light: "text-[#9a3412] bg-[#ffedd5]", dark: "text-[#fed7aa] bg-[#7c2d12]/60" },
};
