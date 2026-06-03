import type { Language } from "@/context/LanguageContext";
import { zhCN, type LocaleKeys } from "./zh-CN";
import { zhTW } from "./zh-TW";
import { en } from "./en";

const locales: Record<Language, LocaleKeys> = {
  "zh-CN": zhCN,
  "zh-TW": zhTW,
  en,
};

export { locales };
export type { LocaleKeys };
