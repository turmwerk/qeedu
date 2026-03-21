import React from "react";

type Props = {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  actions?: React.ReactNode;
  align?: "left" | "center";
  className?: string;
};

const OverviewMetricsHeader: React.FC<Props> = ({
  title,
  subtitle,
  actions,
  align = "left",
  className,
}) => {
  const contentAlignClass = align === "center" ? "mx-auto text-center" : "text-left";

  return (
    <div
      className={`flex flex-col gap-4 ${
        actions ? "xl:flex-row xl:items-start xl:justify-between" : ""
      } ${className ?? ""}`}
    >
      <div className={`min-w-0 max-w-4xl ${contentAlignClass}`}>
        <div className="text-2xl font-black text-slate-900 dark:text-white">{title}</div>
        {subtitle ? (
          <div className="mt-2 text-[15px] leading-7 text-slate-600 dark:text-slate-300">
            {subtitle}
          </div>
        ) : null}
      </div>

      {actions ? (
        <div className="flex flex-wrap items-center gap-3 xl:justify-end">{actions}</div>
      ) : null}
    </div>
  );
};

export default OverviewMetricsHeader;
