import { Component, createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ErrorInfo, ReactNode } from "react";
import RuntimeTranslationLayer from "@/components/RuntimeTranslationLayer";

export const SUPPORTED_LANGUAGES = ["zh-CN", "zh-TW", "en"] as const;

export type Language = (typeof SUPPORTED_LANGUAGES)[number];

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);
const STORAGE_KEY = "story-language";

class LanguageErrorBoundary extends Component<
  { children: ReactNode; fallback?: ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: ReactNode; fallback?: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): { hasError: boolean } {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("LanguageProvider error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || <div>Language loading...</div>;
    }

    return this.props.children;
  }
}

const resolveInitialLanguage = (): Language => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && SUPPORTED_LANGUAGES.includes(saved as Language)) {
      return saved as Language;
    }
  } catch (error) {
    console.warn("Failed to load language from localStorage:", error);
  }
  return "zh-CN";
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(resolveInitialLanguage);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);

    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch (error) {
      console.warn("Failed to save language:", error);
    }

    try {
      document.documentElement.lang = lang;
    } catch (error) {
      console.warn("Failed to set document language:", error);
    }
  }, []);

  useEffect(() => {
    try {
      document.documentElement.lang = language;
    } catch (error) {
      console.warn("Failed to set document language:", error);
    }
  }, [language]);

  const value = useMemo(() => ({ language, setLanguage }), [language, setLanguage]);

  return (
    <LanguageErrorBoundary>
      <LanguageContext.Provider value={value}>
        <RuntimeTranslationLayer language={language} />
        {children}
      </LanguageContext.Provider>
    </LanguageErrorBoundary>
  );
}

export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext);

  if (!context) {
    console.error("useLanguage must be used within LanguageProvider");
    if (import.meta.env.PROD) {
      return {
        language: "zh-CN",
        setLanguage: () => console.warn("LanguageProvider not available"),
      };
    }
    throw new Error("useLanguage must be used within LanguageProvider");
  }

  return context;
}

export const getLanguageStorageKey = () => STORAGE_KEY;
