import React, { useEffect, useMemo, useRef, useState } from "react";
import { MenuOutlined, SettingOutlined } from "@ant-design/icons";
import MarkdownEditor from "@/components/MarkdownEditor";
import MarkdownView from "@/components/MarkdownView";
import Button from "@/components/Button";
import { getStoredTheme, toggleTheme } from "@/utils/theme";

const actionBtn =
  "inline-flex items-center gap-1.5 bg-white dark:bg-white/10 border border-[var(--brand-border)] dark:border-white/30 text-[var(--brand-blue)] px-2.5 py-1.5 rounded-xl font-semibold transition-[background,border-color,box-shadow,transform,color] hover:bg-[var(--brand-accent-soft)] dark:hover:bg-white/18 hover:border-[var(--brand-purple)] hover:text-[var(--brand-purple)] hover:shadow-[var(--brand-shadow)] hover:-translate-y-[1px]";

const siderToggleBtn =
  "flex items-center justify-center w-9 h-9 rounded-lg bg-transparent border border-transparent dark:border-white/30 text-[var(--brand-blue)] transition-[background,border-color,color] hover:text-[var(--brand-purple)] hover:bg-[var(--brand-accent-soft)] dark:hover:bg-white/18 hover:border-[var(--brand-purple)]";

const FullScreenMarkdownCanvas: React.FC<{
  value: string;
  onClose: (updated: string | null) => void;
}> = ({ value, onClose }) => {
  const [text, setText] = useState(value);
  const [split, setSplit] = useState(50);
  const isDragging = useRef(false);
  const wrapRef = useRef<HTMLDivElement | null>(null);
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

  const handleToggleSider = () => {
    window.dispatchEvent(new Event("toggle-syllabus-sider"));
    setSiderOpen((v) => !v);
  };

  const handleToggleTheme = () => {
    const next = toggleTheme();
    setTheme(next);
  };

  useEffect(() => {
    document.documentElement.setAttribute("data-canvas-open", "true");
    requestAnimationFrame(() => {
      setIsAnimating(true);
    });
    return () => {
      document.documentElement.removeAttribute("data-canvas-open");
    };
  }, []);

  const startDrag = () => {
    isDragging.current = true;
  };

  const stopDrag = () => {
    isDragging.current = false;
  };

  const onDrag = (clientX: number) => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const rect = wrap.getBoundingClientRect();
    const next = ((clientX - rect.left) / rect.width) * 100;
    const clamped = Math.min(70, Math.max(30, next));
    setSplit(clamped);
  };

  const onMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging.current) return;
    onDrag(event.clientX);
  };

  const onTouchMove = (event: React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging.current) return;
    onDrag(event.touches[0].clientX);
  };

  const columns = useMemo(() => `${split}% 6px ${100 - split}%`, [split]);

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col min-h-0 bg-white/95 dark:bg-[#152236]/95 backdrop-blur-xl transition-opacity duration-300 ease-out ${
        isAnimating ? "opacity-100" : "opacity-0"
      }`}
    >

          <div className="flex items-center justify-between gap-4 px-4 py-2 border-b border-white/40 dark:border-white/10 bg-gradient-to-r from-white/70 via-purple-50/60 to-indigo-50/60 dark:from-[#1a2d48]/80 dark:via-[#1e293b]/70 dark:to-[#1a2d48]/70 shadow-[0_10px_30px_rgba(124,58,237,0.08)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.3)]">
            <div className="flex items-center gap-3">
              {!siderOpen && (
                <Button
                  className={siderToggleBtn}
                  onClick={handleToggleSider}
                  aria-label="打开侧边栏"
                >
                  <MenuOutlined />
                </Button>
              )}
              <div className="text-lg font-semibold text-[var(--brand-blue)]">画布编辑</div>
            </div>
            <div className="flex items-center gap-1.5">
              <Button className={actionBtn} onClick={() => {}}>
                <SettingOutlined />
                <span>设置</span>
              </Button>
              <Button className={actionBtn} onClick={handleToggleTheme}>
                {theme === "dark" ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="inline-block">
                    <path d="M12 4V2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M12 22v-2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M4.93 4.93L3.51 3.51" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M20.49 20.49l-1.42-1.42" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M4 12H2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M22 12h-2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M4.93 19.07l-1.42 1.42" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M20.49 3.51l-1.42 1.42" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8" />
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="inline-block">
                    <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
                <span>主题</span>
              </Button>
              <Button className={actionBtn} onClick={() => onClose(null)}>
                <span>取消</span>
              </Button>
              <Button className={actionBtn} onClick={() => onClose(text)}>
                <span>保存并退出</span>
              </Button>
            </div>
          </div>

          <div
            ref={wrapRef}
            className="grid p-0 bg-gradient-to-br from-white/60 via-purple-50/40 to-blue-50/40 dark:from-[#152236]/80 dark:via-[#1a2d48]/60 dark:to-[#152236]/60 flex-1 min-h-0 overflow-hidden"
            style={{ gridTemplateColumns: columns }}
            onMouseMove={onMouseMove}
            onMouseUp={stopDrag}
            onMouseLeave={stopDrag}
            onTouchMove={onTouchMove}
            onTouchEnd={stopDrag}
          >
            <div className="border border-purple-200/40 dark:border-white/10 bg-white/70 dark:bg-[#1e293b]/80 shadow-[0_10px_30px_rgba(124,58,237,0.12)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.3)] min-h-0 h-full overflow-hidden">
              <div className="h-full overflow-auto p-5">
                <MarkdownView value={text} />
              </div>
            </div>

            <div
              className="relative"
              onMouseDown={startDrag}
              onTouchStart={startDrag}
              role="separator"
              aria-label="Resize panes"
              aria-orientation="vertical"
            >
              <div className="absolute inset-y-6 left-1/2 -translate-x-1/2 w-[2px] rounded-full bg-purple-300/70 dark:bg-white/20" />
              <div className="absolute inset-0 cursor-col-resize" />
            </div>

            <div className="min-h-0 h-full w-full border border-purple-200/50 dark:border-white/10 bg-white/80 dark:bg-[#1e293b]/80 shadow-[0_10px_30px_rgba(124,58,237,0.12)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.3)]">
              <MarkdownEditor
                value={text}
                onChange={setText}
                title="Markdown"
                minimap={false}
                className="h-full rounded-none border-0"
              />
            </div>
          </div>
    </div>
  );
};

export default FullScreenMarkdownCanvas;
