import React from "react";

type Props = {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  icon?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
};

const PageHeader: React.FC<Props> = ({ title, subtitle, icon, children, className }) => {
  return (
    <div
      className={`flex items-center justify-between gap-3 mb-3 py-1.5 min-w-0 ${className ?? ""}`}
    >
      {/* Left: icon + title/subtitle */}
      <div className="flex items-center gap-2 min-w-0">
        {icon && (
          <span className="flex items-center shrink-0 text-[20px] text-[var(--brand-accent)]">
            {icon}
          </span>
        )}
        <div className="min-w-0">
          {title && (
            <h2 className="text-[var(--brand-accent)] font-bold m-0 leading-snug">
              {title}
            </h2>
          )}
          {subtitle && (
            <div className="text-[#666] mt-0.5 text-sm leading-snug">{subtitle}</div>
          )}
        </div>
      </div>

      {/* Right: action buttons — always one row, no wrap */}
      {children && (
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 flex-nowrap">
          {children}
        </div>
      )}
    </div>
  );
};

export default PageHeader;
