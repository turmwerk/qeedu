import { sendChatDialogPrompt } from "@/feature/ChatDialog/events";
import { showToast } from "@/ui/Toast";

type PromptRecord = {
  title?: unknown;
  subtitle?: unknown;
  summary?: unknown;
  status?: unknown;
  tags?: unknown;
  content?: unknown;
};

type PromptExtra = {
  label: string;
  value: unknown;
};

const text = (value: unknown) => {
  if (Array.isArray(value)) return value.filter(Boolean).join("、");
  if (value === null || value === undefined) return "";
  return String(value);
};

export const buildRecordActionPrompt = (
  action: string,
  record: PromptRecord | null | undefined,
  extras: PromptExtra[] = [],
) => {
  const lines = [
    `请执行：${action}`,
    "",
    "当前记录：",
    record?.title ? `- 标题：${text(record.title)}` : "",
    record?.subtitle ? `- 副标题：${text(record.subtitle)}` : "",
    record?.status ? `- 状态：${text(record.status)}` : "",
    record?.tags ? `- 标签：${text(record.tags)}` : "",
    record?.summary ? `- 摘要：${text(record.summary)}` : "",
    ...extras.map((item) => (text(item.value) ? `- ${item.label}：${text(item.value)}` : "")),
    record?.content ? ["", "正文/草稿：", text(record.content)].join("\n") : "",
    "",
    "请直接给出可复制到当前页面的结构化结果，必要时补充风险点和下一步动作。",
  ];

  return lines.filter(Boolean).join("\n");
};

export const runRecordAIAction = (
  dialogId: string | null | undefined,
  prompt: string,
  toastMessage = "已发送到右侧 AI 助手",
) => {
  if (!dialogId) {
    showToast("请先选择一条记录");
    return;
  }
  sendChatDialogPrompt(dialogId, prompt);
  showToast(toastMessage);
};
