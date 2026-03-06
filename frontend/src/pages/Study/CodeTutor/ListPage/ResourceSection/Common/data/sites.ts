import type { Feature } from "@/feature/ModuleHub/types";

export interface CommonSiteItem extends Feature {
  url: string;
  linkLabel: string;
}

export const COMMON_SITES: CommonSiteItem[] = [
  {
    key: "leetcode",
    icon: "🧠",
    title: "LeetCode",
    desc: "全球知名的算法练习平台，支持多语言，题目涵盖面试高频题与竞赛真题。",
    url: "https://leetcode.cn/",
    linkLabel: "去刷题",
  },
  {
    key: "github",
    icon: "🐙",
    title: "GitHub",
    desc: "全球最大的开源代码托管平台，代码协作、项目管理与 CI/CD 一站式解决。",
    url: "https://github.com/",
    linkLabel: "访问 GitHub",
  },
  {
    key: "codeforces",
    icon: "🏆",
    title: "Codeforces",
    desc: "顶级竞赛编程平台，周赛频繁、题目质量高，适合锻炼算法与思维能力。",
    url: "https://codeforces.com/",
    linkLabel: "去比赛",
  },
  {
    key: "kaggle",
    icon: "📊",
    title: "Kaggle",
    desc: "数据科学与机器学习竞赛平台，提供免费 GPU、海量数据集与社区 Notebook。",
    url: "https://www.kaggle.com/",
    linkLabel: "访问 Kaggle",
  },
  {
    key: "huggingface",
    icon: "🤗",
    title: "Hugging Face",
    desc: "开源 AI 模型社区，汇聚数十万预训练模型、数据集与 Spaces 在线 Demo。",
    url: "https://huggingface.co/",
    linkLabel: "探索模型",
  },
];
