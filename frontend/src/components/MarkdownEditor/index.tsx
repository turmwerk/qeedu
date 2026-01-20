import React, { useEffect, useMemo, useRef, useState } from "react";
import { MenuOutlined } from "@ant-design/icons";

import MarkdownView from "@/components/MarkdownView";
import Button from "@/components/Button";

interface Props {
  value?: string;
  onClose: (updated: string | null) => void; // pass null to cancel
}

const MarkdownEditor: React.FC<Props> = ({ value = "", onClose }) => {
  const [text, setText] = useState(value);
  const [split, setSplit] = useState(50);
  const isDragging = useRef(false);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const [siderOpen, setSiderOpen] = useState(false);
  const [siderWidth, setSiderWidth] = useState(300);

  useEffect(() => {
    // 获取初始 sider 状态并监听状态变化
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
    <div className="fixed inset-0 z-[9999] flex min-h-0 items-stretch">
      {/* 左侧 Sider 占位 - 宽度与 MainLayout 的 Sider 同步 */}
      <div 
        style={{ width: siderOpen ? siderWidth : 0 }} 
        className="flex-shrink-0 h-full transition-all duration-120 ease-out" 
      />
      
      {/* 画布编辑区域 */}
      <div className="flex-1 flex flex-col bg-black/40 backdrop-blur-sm min-h-0 h-full">
        <div
          className="w-full h-full bg-white/90 border border-white/60 shadow-2xl backdrop-blur-xl overflow-hidden flex flex-col min-h-0"
          data-oid="4z5ik1d"
        >
        <div
          className="flex items-center justify-between gap-4 px-4 py-2 border-b border-white/40 bg-gradient-to-r from-white/70 via-purple-50/60 to-indigo-50/60 shadow-[0_10px_30px_rgba(124,58,237,0.08)]"
          data-oid="rgqi2cx"
        >
          <div className="flex items-center gap-3">
            {!siderOpen && (
              <Button
                className="flex items-center justify-center w-9 h-9 rounded-lg bg-white/60 border border-white/60 shadow-[0_6px_18px_rgba(124,58,237,0.18)] text-[#5b35b7] hover:brightness-110 transition"
                onClick={handleToggleSider}
                aria-label="打开侧边栏"
              >
                <MenuOutlined />
              </Button>
            )}
            <div className="text-lg font-semibold text-gray-900" data-oid="rue9-_q">
              画布编辑
            </div>
          </div>
          <div className="flex items-center gap-2" data-oid="o.thfwc">
            <Button
              className="inline-flex items-center justify-center rounded-md border border-gray-200 bg-white/80 px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
              onClick={() => onClose(null)}
              data-oid="zqqe::h"
            >
              取消
            </Button>
            <Button
              className="inline-flex items-center justify-center rounded-md bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-lg transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
              onClick={() => onClose(text)}
              data-oid="jh7rruz"
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
          data-oid="cxj8ddf"
        >
          <div
            className="border border-purple-200/40 bg-white/70 shadow-[0_10px_30px_rgba(124,58,237,0.12)] min-h-0 h-full overflow-hidden"
            data-oid="0wsywgy"
          >
            <div className="h-full overflow-auto p-5">
              <MarkdownView
                value={text}
                showControls={false}
                data-oid="6c4gr3x"
              />
            </div>
          </div>

          <div
            className="relative"
            onMouseDown={startDrag}
            onTouchStart={startDrag}
            role="separator"
            aria-label="Resize panes"
            aria-orientation="vertical"
            data-oid="k9rj6e2"
          >
            <div className="absolute inset-y-6 left-1/2 -translate-x-1/2 w-[2px] rounded-full bg-purple-300/70" />
            <div className="absolute inset-0 cursor-col-resize" />
          </div>

          <textarea
            className="min-h-0 h-full w-full resize-none border border-purple-200/50 bg-white/80 p-5 text-sm text-gray-800 shadow-[0_10px_30px_rgba(124,58,237,0.12)] outline-none transition focus:ring-2 focus:ring-purple-400/60"
            value={text}
            onChange={(e) => setText(e.target.value)}
            data-oid="elbgi1-"
          />
        </div>
      </div>
      </div>
    </div>
  );
};

export default MarkdownEditor;
