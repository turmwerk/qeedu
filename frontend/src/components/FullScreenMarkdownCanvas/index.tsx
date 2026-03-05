import React, { useEffect, useState } from "react";
import { getStoredTheme, toggleTheme } from "@/utils/theme";
import CanvasHeader from "./components/Header";
import CanvasContents from "./components/Contents";

const FullScreenMarkdownCanvas: React.FC<{
  value: string;
  onClose: (updated: string | null) => void;
  onSave?: (text: string) => void;
}> = ({ value, onClose, onSave }) => {
  const [text, setText] = useState(value);
  const [siderOpen, setSiderOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [theme, setTheme] = useState(getStoredTheme);

  useEffect(() => {
    const handleSiderState = (event: Event) => {
      const detail = (event as CustomEvent<{ open: boolean }>).detail;
      if (detail) setSiderOpen(detail.open);
    };
    const handleThemeChange = () => setTheme(getStoredTheme());
    window.addEventListener("syllabus-sider-state", handleSiderState as EventListener);
    window.addEventListener("theme-change", handleThemeChange);
    window.addEventListener("storage", handleThemeChange);
    window.dispatchEvent(new Event("get-syllabus-sider-state"));
    return () => {
      window.removeEventListener("syllabus-sider-state", handleSiderState as EventListener);
      window.removeEventListener("theme-change", handleThemeChange);
      window.removeEventListener("storage", handleThemeChange);
    };
  }, []);

  useEffect(() => {
    setText(value);
  }, [value]);

  useEffect(() => {
    document.documentElement.setAttribute("data-canvas-open", "true");
    requestAnimationFrame(() => setIsAnimating(true));
    return () => {
      document.documentElement.removeAttribute("data-canvas-open");
    };
  }, []);

  const handleToggleSider = () => {
    window.dispatchEvent(new Event("toggle-syllabus-sider"));
    setSiderOpen((v) => !v);
  };

  const handleToggleTheme = () => {
    const next = toggleTheme();
    setTheme(next);
  };

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col min-h-0 bg-white/95 dark:bg-[#152236]/95 backdrop-blur-xl transition-opacity duration-300 ease-out ${
        isAnimating ? "opacity-100" : "opacity-0"
      }`}
    >
      <CanvasHeader
        siderOpen={siderOpen}
        onToggleSider={handleToggleSider}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        onSave={() => onSave?.(text)}
        onClose={() => onClose(null)}
      />
      <CanvasContents value={text} onChange={setText} />
    </div>
  );
};

export default FullScreenMarkdownCanvas;
