import { SUPPORTED_LANGUAGES, getLanguageStorageKey, useLanguage, type Language } from "@/context/LanguageContext";
import { locales, type LocaleKeys } from "@/locales";

type NestedKeyOf<ObjectType extends object> = {
  [Key in keyof ObjectType & (string | number)]: ObjectType[Key] extends object
    ? `${Key}` | `${Key}.${NestedKeyOf<ObjectType[Key]>}`
    : `${Key}`;
}[keyof ObjectType & (string | number)];

type TranslationKey = NestedKeyOf<LocaleKeys>;

function getNestedValue(obj: unknown, path: string): unknown {
  return path.split(".").reduce<unknown>((current, key) => {
    if (typeof current !== "object" || current === null) return undefined;
    return (current as Record<string, unknown>)[key];
  }, obj);
}

export const resolveStoredLanguage = (): Language => {
  try {
    const saved = localStorage.getItem(getLanguageStorageKey());
    if (saved && SUPPORTED_LANGUAGES.includes(saved as Language)) {
      return saved as Language;
    }
  } catch {
    // ignore storage errors
  }
  return "zh-CN";
};

export function translate(
  key: TranslationKey,
  params?: Record<string, string>,
  language: Language = resolveStoredLanguage(),
): string {
  const locale = locales[language];
  let value = getNestedValue(locale, key);

  if (typeof value !== "string") {
    value = getNestedValue(locales.en, key);
  }

  if (typeof value === "string") {
    if (params) {
      Object.keys(params).forEach((param) => {
        value = (value as string).replace(new RegExp(`\\{\\{${param}\\}\\}`, "g"), params[param]);
      });
    }
    return value;
  }

  console.warn(`Translation not found for key: ${key} in language: ${language}`);
  return key;
}

export function useTranslation() {
  const { language } = useLanguage();

  const t = (key: TranslationKey, params?: Record<string, string>): string => {
    return translate(key, params, language);
  };

  return { t, language };
}
