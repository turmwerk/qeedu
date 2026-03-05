import React from "react";

export interface HoverTooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  wrapperClassName?: string;
  tooltipClassName?: string;
}

const HoverTooltip: React.FC<HoverTooltipProps> = ({
  content,
  children,
  wrapperClassName = "",
  tooltipClassName = "",
}) => {
  return (
    <div className={`group relative ${wrapperClassName}`}>
      {children}
      <div
        className={`hidden group-hover:block absolute bottom-full mb-1 left-1/2 -translate-x-1/2 z-50 bg-black/90 text-white rounded-lg shadow-lg whitespace-nowrap ${tooltipClassName}`}
      >
        {content}
        <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-[6px] border-transparent border-t-black/90" />
      </div>
    </div>
  );
};

export default HoverTooltip;
