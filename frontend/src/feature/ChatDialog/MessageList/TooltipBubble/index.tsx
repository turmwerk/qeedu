import React from "react";

interface TooltipBubbleProps {
  text: string;
  topPercent: number;
}

const TooltipBubble: React.FC<TooltipBubbleProps> = ({ text, topPercent }) => {
  return (
    <div
      className="pointer-events-none absolute right-6 flex items-center justify-end"
      style={{
        top: `calc(${topPercent * 100}%)`,
        transform: "translateY(-50%)",
        maxWidth: "500px"
      }}
    >
      <div className="bg-[var(--brand-accent)] text-white text-sm px-4 py-2.5 rounded-lg shadow-[0_10px_25px_rgba(15,23,42,0.25)] relative" style={{
        display: '-webkit-box',
        WebkitLineClamp: 3,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        wordBreak: 'break-word',
        overflowWrap: 'anywhere',
        whiteSpace: 'normal',
        minWidth: '150px',
        maxWidth: '100%'
      }}>
        {text}
        {/* 小三角指向右边 */}
        <div className="absolute top-1/2 -right-1 w-2 h-2 -mt-1 border-4 border-transparent border-l-[var(--brand-accent)]"></div>
      </div>
    </div>
  );
};

export default TooltipBubble;
