import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Button from "@/ui/Button";
import WorkspaceListModal from "../ListModal";
import OverviewMetrics from "../OverviewMetrics";
import type { WorkspaceConfig, WorkspaceMetric, WorkspaceRecord } from "../types";

type Props = {
  config: WorkspaceConfig;
  records: WorkspaceRecord[];
  openSignal: number;
  onCreate: (payload: Record<string, unknown>) => void;
  onDelete: (id: string) => void;
  onRename: (id: string, title: string) => void;
  onEdit: (id?: string) => void;
};

const WorkspaceListPage: React.FC<Props> = ({
  config,
  records,
  openSignal,
  onCreate,
  onDelete,
  onRename,
  onEdit,
}) => {
  const navigate = useNavigate();

  const overviewMetrics = useMemo<WorkspaceMetric[]>(() => {
    const doneLike = ["已完成", "已归档", "已递交", "已提炼", "投稿准备"];
    const completedCount = records.filter((record) =>
      doneLike.some((status) => record.status?.includes(status)),
    ).length;
    const activeCount = Math.max(records.length - completedCount, 0);
    const taskStats = records.reduce(
      (acc, record) => {
        const tasks = record.tasks ?? [];
        acc.total += tasks.length;
        acc.done += tasks.filter((task) => task.done).length;
        return acc;
      },
      { total: 0, done: 0 },
    );
    const latest = records
      .slice()
      .sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0))[0];
    return [
      { label: "条目总数", value: String(records.length) },
      { label: "活跃推进", value: String(activeCount) },
      {
        label: "清单完成",
        value: taskStats.total ? `${taskStats.done}/${taskStats.total}` : "0/0",
      },
      {
        label: "最近更新",
        value: latest ? new Date(latest.updatedAt).toLocaleDateString() : "暂无",
      },
    ];
  }, [records]);

  const latestRecords = useMemo(
    () =>
      records
        .slice()
        .sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0))
        .slice(0, 4),
    [records],
  );

  const capabilityList = config.capabilities ?? config.assistantPrompts;
  const deliverableList = config.deliverables ?? [
    "结构化草稿",
    "阶段计划",
    "复盘纪要",
    "可复用模板",
  ];

  return (
    <div className="flex w-full min-w-0 flex-col gap-6 px-4 py-6 md:px-6 xl:px-8">
      <section className="rounded-[28px] bg-white/[0.62] px-6 py-6 shadow-[0_16px_40px_rgba(15,23,42,0.10)] backdrop-blur-[32px] dark:bg-white/[0.08]">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-4xl">
            <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-[#64748b] dark:text-[#cbd5e1]">
              {config.title}
            </div>
            <h1 className="mt-2 text-[30px] font-black leading-tight text-[var(--brand-blue)] dark:text-white">
              {config.headline}
            </h1>
            <p className="mt-3 max-w-3xl text-[15px] leading-7 text-[#5b6778] dark:text-[#d9e4f4]">
              {config.description}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {capabilityList.slice(0, 4).map((item) => (
                <span
                  key={item}
                  className="rounded-full bg-[#eff6ff] px-3 py-1 text-[13px] font-semibold text-[#2563eb] dark:bg-white/10 dark:text-white"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button
              className="rounded-2xl bg-[var(--brand-blue)] px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
              onClick={() => window.dispatchEvent(new Event(config.events.create))}
            >
              {config.createButtonLabel}
            </Button>
            {config.relatedLinks?.[0] && (
              <Button
                className="rounded-2xl border border-[#cbd5e1] bg-white/70 px-4 py-2 text-sm font-semibold text-[#334155] transition hover:border-[#94a3b8] hover:bg-white dark:bg-white/10 dark:text-white"
                onClick={() => navigate(config.relatedLinks![0].to)}
              >
                关联模块
              </Button>
            )}
          </div>
        </div>
      </section>

      <OverviewMetrics metrics={overviewMetrics} />

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.8fr)_360px]">
        <div>
          <WorkspaceListModal
            config={config}
            items={records}
            onEdit={onEdit}
            onCreate={onCreate}
            onDelete={onDelete}
            onRename={onRename}
            openSignal={openSignal}
          />
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl bg-white/[0.88] p-4 shadow-[0_8px_24px_rgba(15,23,42,0.08)] backdrop-blur-[24px] dark:bg-white/[0.12]">
            <div className="text-[16px] font-bold text-[var(--brand-blue)] dark:text-white">
              AI 代理能力
            </div>
            <div className="mt-3 space-y-2">
              {capabilityList.map((item) => (
                <div
                  key={item}
                  className="rounded-xl bg-[#f8fafc] px-3 py-2 text-sm leading-6 text-[#475569] dark:bg-white/10 dark:text-[#dbe5f3]"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl bg-white/[0.88] p-4 shadow-[0_8px_24px_rgba(15,23,42,0.08)] backdrop-blur-[24px] dark:bg-white/[0.12]">
            <div className="text-[16px] font-bold text-[var(--brand-blue)] dark:text-white">
              典型产出
            </div>
            <div className="mt-3 grid gap-2">
              {deliverableList.map((item) => (
                <div
                  key={item}
                  className="rounded-xl border border-[#dbeafe] px-3 py-2 text-sm font-semibold text-[#334155] dark:border-white/10 dark:text-[#e2e8f0]"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>

          {config.relatedLinks && config.relatedLinks.length > 0 && (
            <div className="rounded-2xl bg-white/[0.88] p-4 shadow-[0_8px_24px_rgba(15,23,42,0.08)] backdrop-blur-[24px] dark:bg-white/[0.12]">
              <div className="text-[16px] font-bold text-[var(--brand-blue)] dark:text-white">
                关联模块
              </div>
              <div className="mt-3 grid gap-2">
                {config.relatedLinks.map((item) => (
                  <Button
                    key={item.to}
                    className="justify-start rounded-xl border border-[#dbeafe] bg-white/70 px-3 py-2 text-left text-sm font-semibold text-[#334155] transition hover:border-[#93c5fd] hover:bg-white dark:border-white/10 dark:bg-white/5 dark:text-[#e2e8f0]"
                    onClick={() => navigate(item.to)}
                  >
                    {item.label}
                  </Button>
                ))}
              </div>
            </div>
          )}

          <div className="rounded-2xl bg-white/[0.88] p-4 shadow-[0_8px_24px_rgba(15,23,42,0.08)] backdrop-blur-[24px] dark:bg-white/[0.12]">
            <div className="text-[16px] font-bold text-[var(--brand-blue)] dark:text-white">
              最近更新
            </div>
            <div className="mt-3 space-y-3">
              {latestRecords.length > 0 ? (
                latestRecords.map((record) => (
                  <button
                    key={record.id}
                    type="button"
                    className="w-full rounded-xl border border-[#dbeafe] bg-white/70 px-3 py-3 text-left transition hover:border-[#93c5fd] hover:bg-white dark:border-white/10 dark:bg-white/5"
                    onClick={() => onEdit(record.id)}
                  >
                    <div className="text-sm font-semibold text-[#1f2937] dark:text-white">
                      {record.title}
                    </div>
                    <div className="mt-1 text-sm leading-6 text-[#6b7280] dark:text-[#d7e0ef]">
                      {record.subtitle || record.summary || "暂无摘要"}
                    </div>
                    <div className="mt-2 text-[12px] font-semibold uppercase tracking-[0.12em] text-[#94a3b8] dark:text-[#cbd5e1]">
                      {new Date(record.updatedAt).toLocaleString()}
                    </div>
                  </button>
                ))
              ) : (
                <div className="rounded-xl bg-[#f8fafc] px-3 py-3 text-sm text-[#64748b] dark:bg-white/10 dark:text-[#d7e0ef]">
                  当前还没有条目，先创建一条工作记录。
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default WorkspaceListPage;