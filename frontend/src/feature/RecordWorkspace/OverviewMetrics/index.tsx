import React from "react";
import Card from "@/ui/Card";
import type { WorkspaceMetric } from "../types";

type Props = {
  metrics: WorkspaceMetric[];
};

const OverviewMetrics: React.FC<Props> = ({ metrics }) => {
  const toneClass: Record<NonNullable<WorkspaceMetric["tone"]>, string> = {
    default: "text-[var(--brand-blue)] dark:text-white",
    blue: "text-[#4f46e5] dark:text-[#c7d2fe]",
    green: "text-[#059669] dark:text-[#bbf7d0]",
    orange: "text-[#d97706] dark:text-[#fde68a]",
  };

  const badgeClass: Record<NonNullable<WorkspaceMetric["tone"]>, string> = {
    default: "bg-[#eef2ff] text-[#4f46e5] dark:bg-white/10 dark:text-[#c7d2fe]",
    blue: "bg-[#eef2ff] text-[#4f46e5] dark:bg-white/10 dark:text-[#c7d2fe]",
    green: "bg-[#ecfdf5] text-[#059669] dark:bg-[#052e24] dark:text-[#bbf7d0]",
    orange: "bg-[#fff7ed] text-[#d97706] dark:bg-[#3b1d03] dark:text-[#fde68a]",
  };

  return (
    <div className="space-y-6">
      {/* 标题区域 */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          工作区概览
        </h2>
        <p className="text-[15px] text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          查看工作区的关键指标和活动统计，掌握项目进展情况和团队协作状态
        </p>
      </div>

      {/* 指标卡片网格 */}
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <Card
            key={metric.label}
            iconLayout="inline"
            title={metric.value}
            titleLink={metric.to}
            subTitle={metric.label.toUpperCase()}
            desc={metric.description}
            level={metric.badge}
            badge={badgeClass[metric.tone ?? "default"]}
            showArrow={!!metric.to}
            subLinks={metric.to ? [{
              label: "查看会议详情",
              to: metric.to
            }] : undefined}
            className={`
              [&>div:first-child>div:first-child>span:first-child]:${toneClass[metric.tone ?? "default"]}
              [&>div:nth-child(2)>span]:text-[12px] [&>div:nth-child(2)>span]:font-semibold [&>div:nth-child(2)>span]:tracking-[0.14em] [&>div:nth-child(2)>span]:text-[#75839a] [&>div:nth-child(2)>span]:dark:text-[#cbd5e1]
            `}
          />
        ))}
      </div>
    </div>
  );
};

export default OverviewMetrics;
