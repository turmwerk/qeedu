import type { Feature } from "@/pages/shared/ModuleHub";

export interface CsCourseItem extends Feature {
  url: string;
  linkLabel: string;
  school: string;
}

export const CS_COURSES: CsCourseItem[] = [
  {
    key: "cs50",
    icon: "📽",
    title: "CS50",
    desc: "哈佛大学计算机科学导论，从零开始学习编程基础，兼顾 C、Python、Web 开发。",
    school: "Harvard",
    url: "https://cs50.harvard.edu/x/",
    linkLabel: "前往课程",
  },
  {
    key: "cs162",
    icon: "🖥",
    title: "CS162",
    desc: "UC Berkeley 操作系统课程，深入进程、线程、文件系统与虚拟内存等核心概念。",
    school: "UC Berkeley",
    url: "https://cs162.org/",
    linkLabel: "前往课程",
  },
  {
    key: "cs168",
    icon: "🌐",
    title: "CS168",
    desc: "UC Berkeley 计算机网络课程，覆盖 TCP/IP、路由、DNS 与网络安全基础。",
    school: "UC Berkeley",
    url: "https://cs168.io/",
    linkLabel: "前往课程",
  },
  {
    key: "cs170",
    icon: "🧮",
    title: "CS170",
    desc: "UC Berkeley 算法设计与分析课程，涵盖分治、动态规划、NP 完全性等经典主题。",
    school: "UC Berkeley",
    url: "https://cs170.org/",
    linkLabel: "前往课程",
  },
  {
    key: "cs186",
    icon: "🗃",
    title: "CS186",
    desc: "UC Berkeley 数据库系统课程，深入索引、查询优化、事务与并发控制。",
    school: "UC Berkeley",
    url: "https://cs186berkeley.net/",
    linkLabel: "前往课程",
  },
  {
    key: "cs188",
    icon: "🤖",
    title: "CS188",
    desc: "UC Berkeley 人工智能导论，覆盖搜索、CSP、机器学习与强化学习基础。",
    school: "UC Berkeley",
    url: "https://inst.eecs.berkeley.edu/~cs188/",
    linkLabel: "前往课程",
  },
  {
    key: "cs229",
    icon: "📐",
    title: "CS229",
    desc: "Stanford 机器学习经典课程，系统讲解监督学习、无监督学习与深度学习理论。",
    school: "Stanford",
    url: "https://cs229.stanford.edu/",
    linkLabel: "前往课程",
  },
  {
    key: "6824",
    icon: "🔗",
    title: "6.824",
    desc: "MIT 分布式系统课程，通过 MapReduce、Raft、ZooKeeper 等 Lab 掌握分布式核心。",
    school: "MIT",
    url: "https://pdos.csail.mit.edu/6.824/",
    linkLabel: "前往课程",
  },
];
