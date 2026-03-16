export const buildAssistantDialogId = (projectName: string) => `code-tutor-ai-${projectName}`;

export const buildAssistantIntro = (projectName: string) =>
  `你好！我是 AI 编程助手。正在帮你学习《${projectName}》。\n\n你可以向我询问代码思路、调试错误或请求代码讲解。`;