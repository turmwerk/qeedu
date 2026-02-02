import React, { useEffect, useMemo, useRef, useState } from "react";
import { MenuOutlined } from "@ant-design/icons";
import MarkdownEditor from "@/components/MarkdownEditor";
import MarkdownView from "@/components/MarkdownView";
import Button from "@/components/Button";

const FullScreenMarkdownCanvas: React.FC<{
  value: string;
  onClose: (updated: string | null) => void;
}> = ({ value, onClose }) => {
  const [text, setText] = useState(value);
  const [split, setSplit] = useState(50);
  const isDragging = useRef(false);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const [siderOpen, setSiderOpen] = useState(false);
  const [siderWidth, setSiderWidth] = useState(300);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const handleSiderState = (event: Event) => {
      const detail = (event as CustomEvent<{ open: boolean }>).detail;
      setSiderOpen(detail.open);
    };
    const handleSiderWidth = (event: Event) => {
      const detail = (event as CustomEvent<{ width: number }>).detail;
      setSiderWidth(detail.width);
    };
    window.addEventListener("syllabus-sider-state", handleSiderState as EventListener);
    window.addEventListener("syllabus-sider-width", handleSiderWidth as EventListener);
    window.dispatchEvent(new Event("get-syllabus-sider-state"));
    window.dispatchEvent(new Event("get-syllabus-sider-width"));

    return () => {
      window.removeEventListener("syllabus-sider-state", handleSiderState as EventListener);
      window.removeEventListener("syllabus-sider-width", handleSiderWidth as EventListener);
    };
  }, []);

  useEffect(() => {
    setText(value);
  }, [value]);

  const handleToggleSider = () => {
    window.dispatchEvent(new Event("toggle-syllabus-sider"));
    setSiderOpen((v) => !v);
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
      className={`fixed inset-0 z-[9999] flex min-h-0 items-stretch transition-opacity duration-300 ease-out ${
        isAnimating ? "opacity-100" : "opacity-0"
      }`}
    >
      <div
        style={{ width: siderOpen ? siderWidth : 0 }}
        className="flex-shrink-0 h-full transition-all duration-120 ease-out"
      />

      <div
        className={`flex-1 flex flex-col bg-black/40 backdrop-blur-sm min-h-0 h-full transition-all duration-300 ease-out ${
          isAnimating ? "scale-100" : "scale-95"
        }`}
      >
        <div
          className={`w-full h-full bg-white/90 border border-white/60 shadow-2xl backdrop-blur-xl overflow-hidden flex flex-col min-h-0 transition-transform duration-300 ease-out ${
            isAnimating ? "translate-y-0" : "translate-y-4"
          }`}
        >
          <div className="flex items-center justify-between gap-4 px-4 py-2 border-b border-white/40 bg-gradient-to-r from-white/70 via-purple-50/60 to-indigo-50/60 shadow-[0_10px_30px_rgba(124,58,237,0.08)]">
            <div className="flex items-center gap-3">
              {!siderOpen && (
                <Button
                  className="flex items-center justify-center w-9 h-9 rounded-lg bg-white border border-[var(--brand-border)] text-[var(--brand-accent)] hover:bg-[var(--brand-accent-soft)] hover:border-[var(--brand-accent)] hover:shadow-[var(--brand-shadow)] transition"
                  onClick={handleToggleSider}
                  aria-label="打开侧边栏"
                >
                  <MenuOutlined />
                </Button>
              )}
              <div className="text-lg font-semibold text-gray-900">画布编辑</div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                className="inline-flex items-center justify-center rounded-lg border border-[var(--brand-border)] bg-white px-4 py-2 text-sm font-semibold text-[#475569] shadow-[0_6px_14px_rgba(15,23,42,0.08)] transition hover:bg-white hover:shadow-[0_10px_22px_rgba(15,23,42,0.12)]"
                onClick={() => onClose(null)}
              >
                取消
              </Button>
              <Button
                className="inline-flex items-center justify-center rounded-lg border border-[#bfdbfe] bg-[#eff6ff] px-4 py-2 text-sm font-semibold text-[#1d4ed8] shadow-[0_10px_22px_rgba(59,130,246,0.2)] transition hover:bg-[#dbeafe] hover:shadow-[0_12px_26px_rgba(59,130,246,0.28)]"
                onClick={() => onClose(text)}
              >
                保存并退出
              </Button>
            </div>
          </div>

          <div
            ref={wrapRef}
            className="grid p-0 bg-gradient-to-br from-white/60 via-purple-50/40 to-blue-50/40 flex-1 min-h-0 overflow-hidden"
            style={{ gridTemplateColumns: columns }}
            onMouseMove={onMouseMove}
            onMouseUp={stopDrag}
            onMouseLeave={stopDrag}
            onTouchMove={onTouchMove}
            onTouchEnd={stopDrag}
          >
            <div className="border border-purple-200/40 bg-white/70 shadow-[0_10px_30px_rgba(124,58,237,0.12)] min-h-0 h-full overflow-hidden">
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
              <div className="absolute inset-y-6 left-1/2 -translate-x-1/2 w-[2px] rounded-full bg-purple-300/70" />
              <div className="absolute inset-0 cursor-col-resize" />
            </div>

            <div className="min-h-0 h-full w-full border border-purple-200/50 bg-white/80 shadow-[0_10px_30px_rgba(124,58,237,0.12)]">
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
      </div>
    </div>
  );
};

export default FullScreenMarkdownCanvas;
