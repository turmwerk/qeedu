export const CHAT_DIALOG_SEND_EVENT = "edu-ai:chat-dialog-send";

export type ChatDialogSendDetail = {
  dialogId: string;
  prompt: string;
  files?: File[];
  handled?: boolean;
};

const pendingPrompts: ChatDialogSendDetail[] = [];

export const sendChatDialogPrompt = (dialogId: string, prompt: string, files: File[] = []) => {
  if (typeof window === "undefined") return;
  const detail: ChatDialogSendDetail = { dialogId, prompt, files };
  window.dispatchEvent(
    new CustomEvent<ChatDialogSendDetail>(CHAT_DIALOG_SEND_EVENT, {
      detail,
    }),
  );
  if (!detail.handled) {
    pendingPrompts.push(detail);
  }
};

export const takePendingChatDialogPrompts = (dialogId: string) => {
  const matched = pendingPrompts.filter((item) => item.dialogId === dialogId);
  for (let index = pendingPrompts.length - 1; index >= 0; index -= 1) {
    if (pendingPrompts[index].dialogId === dialogId) {
      pendingPrompts.splice(index, 1);
    }
  }
  return matched;
};

export const isChatDialogSendEvent = (
  event: Event,
): event is CustomEvent<ChatDialogSendDetail> =>
  event.type === CHAT_DIALOG_SEND_EVENT &&
  typeof (event as CustomEvent<ChatDialogSendDetail>).detail?.dialogId === "string" &&
  typeof (event as CustomEvent<ChatDialogSendDetail>).detail?.prompt === "string";
