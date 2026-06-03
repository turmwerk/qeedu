import { useEffect, useRef, useState } from "react";
import GlobeIcon from "@/ui/Icon/GlobeIcon";
import { useLanguage, type Language } from "@/context/LanguageContext";
import { useTranslation } from "@/hooks/useTranslation";

interface LanguageSwitcherProps {
  className?: string;
  iconSize?: number;
}

export function LanguageSwitcher({ className = "", iconSize = 18 }: LanguageSwitcherProps) {
  const { language, setLanguage } = useLanguage();
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const languages: { code: Language; name: string }[] = [
    { code: "zh-CN", name: t("languages.zh-CN") },
    { code: "zh-TW", name: t("languages.zh-TW") },
    { code: "en", name: t("languages.en") },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    setIsOpen(false);
  };

  return (
    <>
      <div className={`language-switcher-root relative ${className}`} ref={dropdownRef}>
        <button
          aria-label={t("tooltips.languageSwitcher")}
          className={`inline-flex h-9 w-9 items-center justify-center text-[var(--brand-text)] transition-all duration-300 hover:scale-110 hover:text-[var(--brand-purple)] active:scale-95 ${
            isOpen ? "scale-110 text-[var(--brand-purple)]" : ""
          }`}
          onClick={() => setIsOpen((open) => !open)}
          title={t("tooltips.languageSwitcher")}
          type="button"
        >
          <span
            className="inline-flex items-center justify-center"
            style={{
              transition: "transform 0.25s ease-out",
              transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
            }}
          >
            <GlobeIcon size={iconSize} />
          </span>
        </button>

        <div
          className={`language-dropdown ${isOpen ? "open" : ""} absolute right-0 top-full z-50 mt-2 w-40 origin-top-right rounded-xl border border-[var(--brand-border)] bg-[var(--surface-container)] py-2 backdrop-blur-xl`}
          style={{
            boxShadow:
              "0 10px 40px rgba(0, 0, 0, 0.3), 0 4px 12px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
          }}
        >
          {languages.map((lang) => (
            <button
              key={lang.code}
              className={`language-item relative flex w-[calc(100%-12px)] items-center justify-between overflow-hidden rounded-lg border border-transparent px-3 py-2 text-left text-sm transition-all duration-150 active:scale-[0.98] mx-1.5 ${
                language === lang.code
                  ? "bg-white/5 text-[var(--brand-purple)]"
                  : "text-[var(--brand-text)]"
              }`}
              onClick={() => handleLanguageChange(lang.code)}
              type="button"
            >
              <span className="relative z-10 font-medium">{lang.name}</span>
              {language === lang.code && (
                <span className="checkmark-icon relative z-10 font-bold text-[var(--brand-purple)]">
                  ✓
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}

export default LanguageSwitcher;
