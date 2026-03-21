import React from "react";
import {
  Group as PanelGroup,
  Panel,
  Separator as PanelResizeHandle,
} from "react-resizable-panels";

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
  const leftDefaultSize = `${initialSplit}%`;
  const leftMinSize = `${minSplit}%`;
  const leftMaxSize = `${maxSplit}%`;
  const rightDefaultSize = `${100 - initialSplit}%`;
  const rightMinSize = `${100 - maxSplit}%`;
  const rightMaxSize = `${100 - minSplit}%`;

  return (
    <PanelGroup
      orientation="horizontal"
      resizeTargetMinimumSize={{ coarse: 24, fine: 12 }}
      className={["min-w-0", className].filter(Boolean).join(" ")}
      {...rest}
    >
      <Panel
        defaultSize={leftDefaultSize}
        minSize={leftMinSize}
        maxSize={leftMaxSize}
        className={leftClassName || "flex min-w-0 flex-col"}
      >
        {left}
      </Panel>

      <PanelResizeHandle
        className="group relative z-10 w-0 shrink-0 touch-none overflow-visible"
        data-oid="g75ffu_"
      >
        <div className="absolute inset-y-0 left-1/2 w-3 -translate-x-1/2 cursor-col-resize">
          <div className="absolute inset-y-4 left-1/2 w-px -translate-x-1/2 rounded-full bg-slate-300/80 transition-colors group-hover:bg-[#007acc]/80 dark:bg-white/20 dark:group-hover:bg-[#007acc]/80" />
        </div>
      </PanelResizeHandle>

      <Panel
        defaultSize={rightDefaultSize}
        minSize={rightMinSize}
        maxSize={rightMaxSize}
        className={rightClassName || "flex min-w-0 flex-col"}
      >
        {right}
      </Panel>
    </PanelGroup>
  );
};

export default SplitSiderLayout;
