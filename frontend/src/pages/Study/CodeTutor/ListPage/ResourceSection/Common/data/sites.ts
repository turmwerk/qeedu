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
  {
    key: "colab",
    icon: "☁️",
    title: "Google Colab",
    desc: "在线 Jupyter 笔记本环境，支持免费 GPU/TPU 试用，适合快速实验与分享。",
    url: "https://colab.research.google.com/",
    linkLabel: "打开 Colab",
  },
  {
    key: "vercel",
    icon: "🚀",
    title: "Vercel",
    desc: "前端部署与预览平台，支持一键部署、自动化 CI/CD 与团队协作。",
    url: "https://vercel.com/",
    linkLabel: "访问 Vercel",
  },
  {
    key: "arxiv",
    icon: "📄",
    title: "arXiv",
    desc: "开放学术预印本平台，覆盖机器学习与计算机科学最新论文。",
    url: "https://arxiv.org/",
    linkLabel: "浏览 arXiv",
  },
  {
    key: "pytorch",
    icon: "🔥",
    title: "PyTorch",
    desc: "开源深度学习框架，支持动态图与丰富生态。",
    url: "https://pytorch.org/",
    linkLabel: "访问 PyTorch",
  },
  {
    key: "tensorflow",
    icon: "🧠",
    title: "TensorFlow",
    desc: "Google 维护的开源深度学习框架，适合训练、部署与生产落地。",
    url: "https://www.tensorflow.org/",
    linkLabel: "访问 TensorFlow",
  },
];
