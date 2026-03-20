import React, { useId, useMemo, useRef, useState } from "react";

const SplitSiderLayout: React.FC<{
  left: React.ReactNode;
  right: React.ReactNode;
  initialSplit?: number;
  minSplit?: number;
  maxSplit?: number;
  className?: string;
  leftClassName?: string;
  rightClassName?: string;
} & React.HTMLAttributes<HTMLDivElement>> = ({
  left,
  right,
  initialSplit = 68,
  minSplit = 40,
  maxSplit = 80,
  className,
  leftClassName,
  rightClassName,
  ...rest
}) => {
  const [split, setSplit] = useState(initialSplit);
  const isDragging = useRef(false);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const layoutId = useId().replace(/[:]/g, "");
  const layoutClass = `split-layout-${layoutId}`;

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
    const clamped = Math.min(maxSplit, Math.max(minSplit, next));
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
    <>
      <style data-oid="split:cols">{`.${layoutClass} { grid-template-columns: ${columns}; }`}</style>
      <div
        ref={wrapRef}
        className={`grid items-start gap-0 min-h-full ${layoutClass} ${className || ""}`}
        onMouseMove={onMouseMove}
        onMouseUp={stopDrag}
        onMouseLeave={stopDrag}
        onTouchMove={onTouchMove}
        onTouchEnd={stopDrag}
        {...rest}
      >
        <div
          className={
            leftClassName || "flex min-w-0 flex-col"
          }
        >
          {left}
        </div>

        <div
          className="relative"
          onMouseDown={startDrag}
          onTouchStart={startDrag}
          role="separator"
          aria-label="Resize panes"
          aria-orientation="vertical"
          data-oid="g75ffu_"
        >
          <div className="absolute inset-y-6 left-1/2 -translate-x-1/2 w-[2px] rounded-full bg-purple-300/70" />
          <div className="absolute inset-0 cursor-col-resize" />
        </div>

        <div
          className={
            rightClassName || "flex min-w-0 flex-col"
          }
        >
          {right}
        </div>
      </div>
    </>
  );
};

export default SplitSiderLayout;
