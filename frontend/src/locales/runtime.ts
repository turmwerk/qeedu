import type { Language } from "@/context/LanguageContext";
import { runtimeDictionary } from "./runtimeDictionary.generated";

const HAN_RE = /[\u4e00-\u9fff]/;

const runtimeOverrides: Record<string, { en: string; "zh-TW": string }> = {
  "简体中文 / 繁體中文 / English": {
    en: "Simplified Chinese / Traditional Chinese / English",
    "zh-TW": "簡體中文 / 繁體中文 / English",
  },
  "搜索结果 ": {
    en: "Search results ",
    "zh-TW": "搜尋結果 ",
  },
  "确定要删除": {
    en: "Delete ",
    "zh-TW": "確定要刪除",
  },
  "吗？删除后无法恢复。": {
    en: "? This cannot be undone.",
    "zh-TW": "嗎？刪除後無法復原。",
  },
  "确认删除「": {
    en: "Confirm deleting \"",
    "zh-TW": "確認刪除「",
  },
  "」吗？此操作不可恢复。": {
    en: "\"? This cannot be undone.",
    "zh-TW": "」嗎？此操作不可復原。",
  },
  "添加 ": {
    en: "Add ",
    "zh-TW": "新增 ",
  },
  " 到上下文": {
    en: " to context",
    "zh-TW": " 到上下文",
  },
  "暂无": {
    en: "No ",
    "zh-TW": "暫無",
  },
  "未命名": {
    en: "Untitled",
    "zh-TW": "未命名",
  },
  "思考中 ": {
    en: "Thinking ",
    "zh-TW": "思考中 ",
  },
  " 后重新获取": {
    en: " before retry",
    "zh-TW": " 後重新取得",
  },
};

const dictionary = {
  ...runtimeDictionary,
  ...runtimeOverrides,
} as Record<string, { en?: string; "zh-TW"?: string }>;

const replacementKeys = Object.keys(runtimeOverrides).sort((a, b) => b.length - a.length);

const dynamicRules: Array<{
  pattern: RegExp;
  format: Record<Exclude<Language, "zh-CN">, (...groups: string[]) => string>;
}> = [
  {
    pattern: /^搜索结果\s*(\d+)$/,
    format: {
      en: (count) => `Search results ${count}`,
      "zh-TW": (count) => `搜尋結果 ${count}`,
    },
  },
  {
    pattern: /^思考中\s*([\d.]+s)$/,
    format: {
      en: (elapsed) => `Thinking ${elapsed}`,
      "zh-TW": (elapsed) => `思考中 ${elapsed}`,
    },
  },
  {
    pattern: /^(\d+)s 后重新获取$/,
    format: {
      en: (seconds) => `${seconds}s before retry`,
      "zh-TW": (seconds) => `${seconds}s 後重新取得`,
    },
  },
  {
    pattern: /^添加 (.+) 到上下文$/,
    format: {
      en: (name) => `Add ${name} to context`,
      "zh-TW": (name) => `新增 ${name} 到上下文`,
    },
  },
  {
    pattern: /^确认删除「(.+)」吗？此操作不可恢复。$/,
    format: {
      en: (name) => `Delete "${name}"? This cannot be undone.`,
      "zh-TW": (name) => `確認刪除「${name}」嗎？此操作不可復原。`,
    },
  },
  {
    pattern: /^确定要删除"(.+)"吗？删除后无法恢复。$/,
    format: {
      en: (name) => `Delete "${name}"? This cannot be undone.`,
      "zh-TW": (name) => `確定要刪除「${name}」嗎？刪除後無法復原。`,
    },
  },
  {
    pattern: /^暂无(.+)$/,
    format: {
      en: (name) => `No ${translateRuntimeText(name, "en").toLowerCase()}`,
      "zh-TW": (name) => `暫無${translateRuntimeText(name, "zh-TW")}`,
    },
  },
  {
    pattern: /^未命名(.+)$/,
    format: {
      en: (name) => `Untitled ${translateRuntimeText(name, "en").toLowerCase()}`,
      "zh-TW": (name) => `未命名${translateRuntimeText(name, "zh-TW")}`,
    },
  },
];

export function hasRuntimeChinese(text: string): boolean {
  return HAN_RE.test(text);
}

export function translateRuntimeText(text: string, language: Language): string {
  if (language === "zh-CN" || !text) return text;

  const leading = text.match(/^\s*/)?.[0] ?? "";
  const trailing = text.match(/\s*$/)?.[0] ?? "";
  const body = text.slice(leading.length, text.length - trailing.length);
  if (!body || !HAN_RE.test(body)) return text;

  const direct = dictionary[body]?.[language];
  if (direct) return `${leading}${direct}${trailing}`;

  for (const rule of dynamicRules) {
    const match = body.match(rule.pattern);
    if (match) {
      return `${leading}${rule.format[language](...match.slice(1))}${trailing}`;
    }
  }

  let translated = body;
  for (const key of replacementKeys) {
    if (translated.includes(key)) {
      const value = dictionary[key]?.[language];
      if (value) translated = translated.split(key).join(value);
    }
  }

  return `${leading}${translated}${trailing}`;
}
