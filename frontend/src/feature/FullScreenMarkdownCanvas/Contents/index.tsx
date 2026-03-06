import React, { useMemo, useRef } from "react";
import MarkdownEditor from "@/feature/MarkdownEditor";
import MarkdownView from "@/feature/MarkdownView";

type Props = {
  value: string;
  onChange: (val: string) => void;
};

const CanvasContents: React.FC<Props> = ({ value, onChange }) => {
  const [split, setSplit] = React.useState(50);
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
      ref={wrapRef}
      className="grid p-0 bg-gradient-to-br from-white/60 via-purple-50/40 to-blue-50/40 dark:from-[#152236]/80 dark:via-[#1a2d48]/60 dark:to-[#152236]/60 flex-1 min-h-0 overflow-hidden"
      style={{ gridTemplateColumns: columns }}
      onMouseMove={onMouseMove}
      onMouseUp={stopDrag}
      onMouseLeave={stopDrag}
      onTouchMove={onTouchMove}
      onTouchEnd={stopDrag}
    >
      {/* Preview pane */}
      <div className="border border-purple-200/40 dark:border-white/10 bg-white/70 dark:bg-[#1e293b]/80 shadow-[0_10px_30px_rgba(124,58,237,0.12)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.3)] min-h-0 h-full overflow-hidden">
        <div className="h-full overflow-auto p-5">
          <MarkdownView value={value} />
        </div>
      </div>

      {/* Drag handle */}
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

      {/* Editor pane */}
      <div className="min-h-0 h-full w-full border border-purple-200/50 dark:border-white/10 bg-white/80 dark:bg-[#1e293b]/80 shadow-[0_10px_30px_rgba(124,58,237,0.12)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.3)]">
        <MarkdownEditor
          value={value}
          onChange={onChange}
          title="Markdown"
          minimap={false}
          className="h-full rounded-none border-0"
        />
      </div>
    </div>
  );
};

export default CanvasContents;
