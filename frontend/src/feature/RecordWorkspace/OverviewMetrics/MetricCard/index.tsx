import React from "react";
import { RightOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import type { WorkspaceMetric } from "../../types";

type Props = {
  metric: WorkspaceMetric;
};

const toneClassMap: Record<NonNullable<WorkspaceMetric["tone"]>, string> = {
  default:
    "border-slate-200 bg-white text-slate-900 shadow-[0_18px_40px_rgba(15,23,42,0.08)]",
  blue: "border-sky-100 bg-[linear-gradient(180deg,#ffffff_0%,#f0f9ff_100%)] text-slate-900 shadow-[0_18px_40px_rgba(14,165,233,0.10)]",
  green:
    "border-emerald-100 bg-[linear-gradient(180deg,#ffffff_0%,#ecfdf5_100%)] text-slate-900 shadow-[0_18px_40px_rgba(16,185,129,0.10)]",
  orange:
    "border-amber-100 bg-[linear-gradient(180deg,#ffffff_0%,#fff7ed_100%)] text-slate-900 shadow-[0_18px_40px_rgba(245,158,11,0.10)]",
};

const valueClassMap: Record<NonNullable<WorkspaceMetric["tone"]>, string> = {
  default: "text-slate-900 dark:text-white",
  blue: "text-sky-700 dark:text-sky-200",
  green: "text-emerald-700 dark:text-emerald-200",
  orange: "text-amber-700 dark:text-amber-200",
};

const badgeClassMap: Record<NonNullable<WorkspaceMetric["tone"]>, string> = {
  default: "bg-slate-100 text-slate-600 dark:bg-white/10 dark:text-slate-200",
  blue: "bg-sky-100 text-sky-700 dark:bg-sky-500/10 dark:text-sky-200",
  green: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-200",
  orange: "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-200",
};

const MetricCard: React.FC<Props> = ({ metric }) => {
  const navigate = useNavigate();
  const tone = metric.tone ?? "default";
  const clickable = !!metric.to;

  return (
    <div
      className={`group rounded-[24px] border px-5 py-5 backdrop-blur-xl transition ${
        clickable ? "cursor-pointer hover:-translate-y-0.5" : ""
      } ${toneClassMap[tone]} dark:border-white/10 dark:bg-white/6`}
      onClick={clickable ? () => navigate(metric.to as string) : undefined}
      onKeyDown={
        clickable
          ? (event) => {
              if (event.key === "Enter" || event.key === " ") navigate(metric.to as string);
            }
          : undefined
      }
      role={clickable ? "button" : undefined}
      tabIndex={clickable ? 0 : undefined}
    >
      <div className="flex items-start justify-between gap-3">
        <div className={`text-4xl font-black ${valueClassMap[tone]}`}>{metric.value}</div>
        {metric.badge ? (
          <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${badgeClassMap[tone]}`}>
            {metric.badge}
          </span>
        ) : null}
      </div>

      <div className="mt-6 text-sm font-bold tracking-[0.16em] text-slate-500 dark:text-slate-300">
        {metric.label}
      </div>

      <div className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
        {metric.description || "暂无补充说明"}
      </div>

      {metric.to ? (
        <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-slate-900 transition group-hover:text-[var(--brand-accent)] dark:text-white">
          查看详情
          <RightOutlined className="text-xs" />
        </div>
      ) : null}
    </div>
  );
};

export default MetricCard;
