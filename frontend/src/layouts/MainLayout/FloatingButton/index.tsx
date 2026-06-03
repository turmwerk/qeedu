import React, { useEffect, useState } from "react";
import {
  ArrowUpOutlined,
  BgColorsOutlined,
  MoonOutlined,
  SettingOutlined,
  SunOutlined,
} from "@ant-design/icons";
import { getEffectsEnabled, toggleEffects } from "@/utils/effects/controller";
import { getStoredTheme, toggleTheme } from "@/utils/theme/controller";
import { useLanguage, type Language } from "@/context/LanguageContext";

interface FloatingButtonProps {
  scrollContainer?: HTMLElement | null;
  onClick?: () => void;
  visible?: boolean;
  icon?: React.ReactNode;
  ariaLabel?: string;
  title?: string;
  className?: string;
  style?: React.CSSProperties;
  size?: number | string;
  shape?: "circle" | "square" | string;
  color?: string;
  bgColor?: string;
  borderColor?: string;
  hoverStyle?: React.CSSProperties;
  activeStyle?: React.CSSProperties;
  hoverClassName?: string;
  activeClassName?: string;
}

const languages: { code: Language; label: string; name: string }[] = [
  { code: "zh-CN", label: "CN", name: "简体中文" },
  { code: "zh-TW", label: "TW", name: "繁體中文" },
  { code: "en", label: "EN", name: "English" },
];

const LegacyFloatingButton: React.FC<FloatingButtonProps> = ({
  onClick,
  visible = true,
  icon,
  ariaLabel,
  title,
  className = "",
  style,
  size = 36,
  shape = "circle",
  color,
  bgColor,
  borderColor,
}) => {
  if (!icon || !onClick) return null;
  const baseSize = typeof size === "number" ? `${size}px` : size;
  const shapeClass =
    shape === "circle"
      ? "rounded-full"
      : shape === "square"
        ? "rounded"
        : typeof shape === "string" && shape.startsWith("rounded")
          ? shape
          : "rounded-lg";

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      title={title}
      className={`inline-flex items-center justify-center border border-[var(--brand-border)] bg-[var(--surface-container)] text-[var(--brand-text)] transition hover:border-[var(--brand-purple)] hover:text-[var(--brand-purple)] ${visible ? "opacity-100" : "pointer-events-none opacity-0"} ${shapeClass} ${className}`}
      style={{
        width: baseSize,
        height: baseSize,
        color,
        background: bgColor,
        borderColor,
        ...style,
      }}
    >
      {icon}
    </button>
  );
};

const SettingsIcon = (
  <SettingOutlined
    style={{ fontSize: 20 }}
    className="animate-[spin_2s_linear_infinite] group-hover:animate-none"
  />
);

const FloatingControls: React.FC<{ scrollContainer?: HTMLElement | null }> = ({ scrollContainer }) => {
  const { language, setLanguage } = useLanguage();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);
  const [atTop, setAtTop] = useState(true);
  const [theme, setTheme] = useState(getStoredTheme());
  const [effectsEnabled, setEffectsEnabled] = useState(getEffectsEnabled());

  useEffect(() => {
    const target = scrollContainer ?? window;
    const readTop = () => {
      const top = scrollContainer ? scrollContainer.scrollTop : window.scrollY;
      setAtTop(top < 60);
    };

    readTop();
    target.addEventListener("scroll", readTop, { passive: true });
    return () => target.removeEventListener("scroll", readTop);
  }, [scrollContainer]);

  useEffect(() => {
    const handleTheme = () => setTheme(getStoredTheme());
    const handleEffects = () => setEffectsEnabled(getEffectsEnabled());
    window.addEventListener("theme-change", handleTheme);
    window.addEventListener("effects-change", handleEffects);
    window.addEventListener("storage", handleTheme);
    window.addEventListener("storage", handleEffects);
    return () => {
      window.removeEventListener("theme-change", handleTheme);
      window.removeEventListener("effects-change", handleEffects);
      window.removeEventListener("storage", handleTheme);
      window.removeEventListener("storage", handleEffects);
    };
  }, []);

  const handleToggleSettings = () => {
    setSettingsOpen((open) => {
      if (open) setLanguageOpen(false);
      return !open;
    });
  };

  const handleToggleTheme = () => {
    setTheme(toggleTheme());
  };

  const handleToggleEffects = () => {
    setEffectsEnabled(toggleEffects());
  };

  const scrollToTop = () => {
    if (scrollContainer) {
      scrollContainer.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className={`float-controls ${atTop ? "is-top-hidden" : ""}`} aria-label="Quick controls">
      <style>{`
        .float-controls {
          position: fixed;
          right: 20px;
          bottom: 20px;
          z-index: 80;
          width: 42px;
          pointer-events: none;
        }

        .float-controls__button {
          position: absolute;
          right: 0;
          width: 40px;
          height: 40px;
          display: inline-grid;
          place-items: center;
          border: 1px solid var(--glass-btn-border);
          border-radius: 10px;
          color: var(--brand-blue);
          background: var(--glass-btn-bg);
          box-shadow: var(--glass-btn-shadow);
          cursor: pointer;
          pointer-events: auto;
          font-size: 20px;
          -webkit-backdrop-filter: blur(16px) saturate(180%);
          backdrop-filter: blur(16px) saturate(180%);
          transition:
            bottom 200ms ease,
            transform 180ms ease,
            opacity 180ms ease,
            background-color 180ms ease,
            border-color 180ms ease,
            color 180ms ease;
        }

        .float-controls__button:hover,
        .float-controls__button:focus-visible {
          border-color: var(--glass-btn-hover-border);
          background: var(--glass-btn-hover-bg);
          box-shadow: var(--glass-btn-hover-shadow);
          color: var(--brand-purple);
          transform: translateY(-1px);
          outline: none;
        }

        .float-controls__top {
          bottom: 0;
          transition: opacity 200ms ease, transform 200ms ease;
        }

        .float-controls.is-top-hidden .float-controls__top {
          opacity: 0;
          pointer-events: none;
          transform: translateY(6px) scale(0.92);
        }

        .float-controls__settings {
          bottom: 46px;
          transition: bottom 200ms ease;
        }

        .float-controls.is-top-hidden .float-controls__settings {
          bottom: 0;
        }

        .float-controls__opt-dynamic,
        .float-controls__opt-language,
        .float-controls__opt-theme {
          opacity: 0;
          transform: translateY(8px) scale(0.95);
          pointer-events: none;
          transition:
            bottom 200ms ease,
            transform 180ms ease,
            opacity 180ms ease;
        }

        .float-controls__opt-theme {
          bottom: 92px;
        }

        .float-controls.is-top-hidden .float-controls__opt-theme {
          bottom: 46px;
        }

        .float-controls__opt-language {
          bottom: 138px;
        }

        .float-controls.is-top-hidden .float-controls__opt-language {
          bottom: 92px;
        }

        .float-controls__opt-dynamic {
          bottom: 184px;
        }

        .float-controls.is-top-hidden .float-controls__opt-dynamic {
          bottom: 138px;
        }

        .float-controls__opt-dynamic.is-visible,
        .float-controls__opt-language.is-visible,
        .float-controls__opt-theme.is-visible {
          opacity: 1;
          transform: translateY(0) scale(1);
          pointer-events: auto;
        }

        .float-controls__button.is-active {
          color: var(--brand-purple);
          border-color: var(--glass-btn-hover-border);
          background: var(--glass-btn-hover-bg);
        }

        .float-controls__globe {
          font-size: 13px;
          font-weight: 900;
        }

        .float-controls__langs {
          position: absolute;
          right: 48px;
          bottom: 138px;
          display: flex;
          gap: 7px;
          opacity: 0;
          transform: translateX(8px);
          pointer-events: none;
          transition: transform 180ms ease, opacity 180ms ease, bottom 200ms ease;
        }

        .float-controls.is-top-hidden .float-controls__langs {
          bottom: 92px;
        }

        .float-controls__langs.is-open {
          opacity: 1;
          transform: translateX(0);
          pointer-events: auto;
        }

        .float-controls__lang {
          position: static;
          width: 40px;
          height: 40px;
          font-size: 12px;
          font-weight: 900;
        }

        @media (max-width: 900px) {
          .float-controls {
            right: 14px;
            bottom: 14px;
          }

          .float-controls__langs {
            right: 48px;
            bottom: 138px;
            width: 136px;
            flex-wrap: wrap;
            justify-content: flex-end;
          }

          .float-controls.is-top-hidden .float-controls__langs {
            bottom: 92px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .float-controls__button,
          .float-controls__langs {
            transition: none;
          }
        }
      `}</style>

      <div className={`float-controls__langs ${languageOpen ? "is-open" : ""}`}>
        {languages.map((item) => (
          <button
            key={item.code}
            className={`float-controls__button float-controls__lang ${language === item.code ? "is-active" : ""}`}
            type="button"
            title={item.name}
            aria-label={item.name}
            onClick={() => setLanguage(item.code)}
          >
            {item.label}
          </button>
        ))}
      </div>

      <button
        className={`float-controls__button float-controls__opt-dynamic ${settingsOpen ? "is-visible" : ""} ${effectsEnabled ? "is-active" : ""}`}
        type="button"
        title={effectsEnabled ? "关闭特效" : "开启特效"}
        aria-label={effectsEnabled ? "关闭特效" : "开启特效"}
        onClick={handleToggleEffects}
      >
        <BgColorsOutlined />
      </button>

      <button
        className={`float-controls__button float-controls__opt-language ${settingsOpen ? "is-visible" : ""}`}
        type="button"
        title="语言"
        aria-label="语言"
        onClick={() => setLanguageOpen((open) => !open)}
      >
        <span className="float-controls__globe">Aa</span>
      </button>

      <button
        className={`float-controls__button float-controls__opt-theme ${settingsOpen ? "is-visible" : ""}`}
        type="button"
        title="切换主题"
        aria-label="切换主题"
        onClick={handleToggleTheme}
      >
        {theme === "dark" ? <SunOutlined /> : <MoonOutlined />}
      </button>

      <button
        className={`float-controls__button float-controls__settings ${settingsOpen ? "is-active" : ""}`}
        type="button"
        title="设置"
        aria-label="设置"
        onClick={handleToggleSettings}
      >
        <span className="group inline-flex items-center justify-center">{SettingsIcon}</span>
      </button>

      <button
        className="float-controls__button float-controls__top"
        type="button"
        title="返回顶部"
        aria-label="返回顶部"
        onClick={scrollToTop}
      >
        <ArrowUpOutlined />
      </button>
    </div>
  );
};

const FloatingButton: React.FC<FloatingButtonProps> = (props) => {
  if (props.icon && props.onClick) {
    return <LegacyFloatingButton {...props} />;
  }
  return <FloatingControls scrollContainer={props.scrollContainer} />;
};

export default FloatingButton;
