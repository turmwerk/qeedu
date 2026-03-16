import type { Feature } from "@/feature/ModuleHub/types";

export interface AIChatSiteItem extends Feature {
  url: string;
  linkLabel: string;
}

export const AI_CHAT_SITES: AIChatSiteItem[] = [
  {
    key: "gemini",
    icon: "♊",
    title: "Gemini",
    desc: "Google 的多模态助手，支持文本与图片交互。",
    url: "https://gemini.google.com/",
    linkLabel: "访问官网",
  },
  {
    key: "aistudio",
    icon: "🧪",
    title: "AI Studio",
    desc: "Google 的 AI Studio，面向开发者的模型与实践平台。",
    url: "https://aistudio.google.com/",
    linkLabel: "访问官网",
  },
  {
    key: "chatgpt",
    icon: "🤖",
    title: "ChatGPT",
    desc: "OpenAI 的对话式 AI，适合写作、编程与学习问答。",
    url: "https://chatgpt.com/",
    linkLabel: "访问官网",
  },
  {
    key: "doubao",
    icon: "🧋",
    title: "豆包",
    desc: "字节跳动推出的 AI 助手，覆盖日常问答与创作。",
    url: "https://www.doubao.com/",
    linkLabel: "访问官网",
  },
  {
    key: "deepseek",
    icon: "🔍",
    title: "DeepSeek",
    desc: "高性能推理与代码能力，面向开发与学习场景。",
    url: "https://www.deepseek.com/",
    linkLabel: "访问官网",
  },
  {
    key: "kimi",
    icon: "🌙",
    title: "Kimi",
    desc: "Moonshot AI 的长文本对话助手，擅长阅读与总结。",
    url: "https://kimi.moonshot.cn/",
    linkLabel: "访问官网",
  },
];
