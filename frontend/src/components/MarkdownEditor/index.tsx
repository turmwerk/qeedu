import React, { useMemo, useRef, useState } from "react";

import MarkdownView from "@/components/MarkdownView";

interface Props {
  value?: string;
  onClose: (updated: string | null) => void; // pass null to cancel
}

const MarkdownEditor: React.FC<Props> = ({ value = "", onClose }) => {
  const [text, setText] = useState(value);
  const [split, setSplit] = useState(50);
  const isDragging = useRef(false);
  const wrapRef = useRef<HTMLDivElement | null>(null);

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
      className="fixed inset-0 z-[9999] bg-black/40 backdrop-blur-sm flex items-stretch justify-center p-0"
      role="dialog"
      aria-modal="true"
      data-oid="kupzl1n"
    >
      <div
        className="w-full h-full max-w-none max-h-none rounded-none bg-white/90 border border-white/60 shadow-2xl backdrop-blur-xl overflow-hidden flex flex-col"
        data-oid="4z5ik1d"
      >
        <div
          className="flex items-center justify-between gap-4 px-6 py-4 border-b border-white/40"
          data-oid="rgqi2cx"
        >
          <div className="text-lg font-semibold text-gray-900" data-oid="rue9-_q">
            画布编辑
          </div>
          <div className="flex items-center gap-2" data-oid="o.thfwc">
            <button
              className="inline-flex items-center justify-center rounded-md border border-gray-200 bg-white/80 px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
              onClick={() => onClose(null)}
              data-oid="zqqe::h"
            >
              取消
            </button>
            <button
              className="inline-flex items-center justify-center rounded-md bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-lg transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
              onClick={() => onClose(text)}
              data-oid="jh7rruz"
            >
              保存并退出
            </button>
          </div>
        </div>

        <div
          ref={wrapRef}
          className="grid p-0 bg-gradient-to-br from-white/60 via-purple-50/40 to-blue-50/40 flex-1 min-h-0"
          style={{ gridTemplateColumns: columns }}
          onMouseMove={onMouseMove}
          onMouseUp={stopDrag}
          onMouseLeave={stopDrag}
          onTouchMove={onTouchMove}
          onTouchEnd={stopDrag}
          data-oid="cxj8ddf"
        >
          <div
            className="rounded-l-xl border border-purple-200/40 bg-white/70 p-5 shadow-[0_10px_30px_rgba(124,58,237,0.12)] overflow-auto min-h-[320px] max-h-[68vh]"
            data-oid="0wsywgy"
          >
            <MarkdownView
              value={text}
              showControls={false}
              data-oid="6c4gr3x"
            />
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
            className="min-h-0 w-full resize-none border border-purple-200/50 bg-white/80 p-5 text-sm text-gray-800 shadow-[0_10px_30px_rgba(124,58,237,0.12)] outline-none transition focus:ring-2 focus:ring-purple-400/60"
            value={text}
            onChange={(e) => setText(e.target.value)}
            data-oid="elbgi1-"
          />
        </div>
      </div>
    </div>
  );
};

export default MarkdownEditor;
