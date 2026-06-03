import http from "./http";

export interface StoredDialogFile {
  name: string;
  type?: string;
  size?: number;
  lastModified?: number;
}

export interface StoredDialogMessage {
  from: "user" | "bot";
  text: string;
  files?: StoredDialogFile[];
  versions?: string[];
  versionIndex?: number;
}

const historyPath = (dialogId: string) =>
  `/ai/dialogs/${encodeURIComponent(dialogId)}/messages`;

export async function fetchDialogMessages(dialogId: string): Promise<StoredDialogMessage[]> {
  const res = await http.get<{ messages?: StoredDialogMessage[] }>(historyPath(dialogId));
  return Array.isArray(res.data.messages) ? res.data.messages : [];
}

export async function saveDialogMessages(
  dialogId: string,
  messages: StoredDialogMessage[],
): Promise<void> {
  await http.put(historyPath(dialogId), { messages });
}

export async function clearDialogMessages(dialogId: string): Promise<void> {
  await http.delete(historyPath(dialogId));
}
