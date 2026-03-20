import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import ChatDialog from "@/feature/ChatDialog";
import { useFeatureRecords } from "@/hooks/useFeatureRecords";
import { dashboardAdapter } from "@/pages/Management/featureAdapters";
import { dashboardPageData, dashboardQuickActions } from "@/pages/Management/featureData";
import Button from "@/ui/Button";
import { showToast } from "@/ui/Toast";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { sessionId } = useParams();
  const { records, patchRecord } = useFeatureRecords(dashboardAdapter);
  const selected = records.find((record) => record.id === sessionId) ?? records[0] ?? null;

  return (
    <div className="flex w-full min-w-0 flex-col gap-6 px-4 py-6 md:px-6 xl:px-8">
      <section className="rounded-[34px] bg-[radial-gradient(circle_at_top_left,#1d4ed8_0%,#0f172a_48%,#111827_100%)] p-6 text-white shadow-[0_24px_60px_rgba(15,23,42,0.28)]">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-3xl">
            <div className="text-xs font-bold uppercase tracking-[0.24em] text-sky-100/80">
              Operations Cockpit
            </div>
            <div className="mt-3 text-3xl font-black md:text-4xl">
              {dashboardPageData.headline}
            </div>
            <div className="mt-3 text-sm leading-7 text-slate-200">
              {dashboardPageData.description}
            </div>
          </div>
          <div className="grid min-w-[240px] gap-3 sm:grid-cols-3">
            {dashboardPageData.metrics.map((metric) => (
              <div
                key={metric.label}
                className="rounded-[22px] border border-white/10 bg-white/8 px-4 py-4"
              >
                <div className="text-xs font-bold uppercase tracking-[0.18em] text-sky-100/70">
                  {metric.label}
                </div>
                <div className="mt-2 text-3xl font-black">{metric.value}</div>
                <div className="mt-2 text-xs text-slate-300">{metric.detail}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-6 2xl:grid-cols-[minmax(0,1.25fr)_360px]">
        <div className="space-y-6">
          <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-[28px] border border-slate-200 bg-white/92 p-5 shadow-[0_18px_44px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-white/6">
              <div className="mb-5 flex items-center justify-between gap-3">
                <div>
                  <div className="text-xs font-bold uppercase tracking-[0.22em] text-slate-400">Trend Zone</div>
                  <div className="mt-2 text-xl font-black text-slate-900 dark:text-white">趋势区</div>
                </div>
                <div className="flex gap-2">
                  {["本周", "本月", "学期"].map((item, index) => (
                    <Button
                      key={item}
                      className={`rounded-full px-4 py-2 text-sm font-semibold ${
                        index === 0
                          ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                          : "border border-slate-200 bg-slate-50 text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-white"
                      }`}
                      onClick={() => showToast(`已切换到${item}视图`)}
                    >
                      {item}
                    </Button>
                  ))}
                </div>
              </div>
              <div className="grid gap-3">
                {[58, 76, 44, 88, 67, 73, 91].map((value, index) => (
                  <div key={value + index} className="grid grid-cols-[88px_minmax(0,1fr)_52px] items-center gap-3">
                    <span className="text-sm font-medium text-slate-500 dark:text-slate-300">周{index + 1}</span>
                    <div className="h-3 rounded-full bg-slate-100 dark:bg-white/10">
                      <div
                        className="h-3 rounded-full bg-[linear-gradient(90deg,#38bdf8_0%,#1d4ed8_100%)]"
                        style={{ width: `${value}%` }}
                      />
                    </div>
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{value}%</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[28px] border border-slate-200 bg-white/92 p-5 shadow-[0_18px_44px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-white/6">
              <div className="text-xs font-bold uppercase tracking-[0.22em] text-slate-400">Alert Stream</div>
              <div className="mt-2 text-xl font-black text-slate-900 dark:text-white">告警流</div>
              <div className="mt-4 space-y-3">
                {[
                  ["高优先", "补件环节逾期率抬升，建议前置 48 小时提醒。"],
                  ["中优先", "学生问答命中 FAQ 后响应时间下降明显。"],
                  ["观察中", "公告发布与审核任务在周中重叠。"],
                ].map(([label, desc], index) => (
                  <div
                    key={label}
                    className={`rounded-[22px] border px-4 py-4 ${
                      index === 0
                        ? "border-rose-200 bg-rose-50 dark:border-rose-400/20 dark:bg-rose-500/10"
                        : index === 1
                          ? "border-amber-200 bg-amber-50 dark:border-amber-400/20 dark:bg-amber-500/10"
                          : "border-slate-200 bg-slate-50 dark:border-white/10 dark:bg-white/5"
                    }`}
                  >
                    <div className="text-sm font-bold text-slate-900 dark:text-white">{label}</div>
                    <div className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{desc}</div>
                    <Button
                      variant="secondary"
                      size="sm"
                      className="mt-3"
                      onClick={() => showToast(`${label} 告警已打开`)}
                    >
                      查看详情
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-[28px] border border-slate-200 bg-white/92 p-5 shadow-[0_18px_44px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-white/6">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <div className="text-xs font-bold uppercase tracking-[0.22em] text-slate-400">Insight Sessions</div>
                <div className="mt-2 text-xl font-black text-slate-900 dark:text-white">洞察会话</div>
              </div>
              <Button
                variant="primary"
                onClick={() => {
                  if (!selected) return;
                  patchRecord(selected.id, {
                    content: `${selected.content}\n\n- 已追加本周洞察更新`,
                    updatedAt: Date.now(),
                  });
                  showToast("已刷新洞察");
                }}
              >
                刷新洞察
              </Button>
            </div>
            <div className="grid gap-4 lg:grid-cols-2">
              {records.map((record) => (
                <button
                  key={record.id}
                  type="button"
                  onClick={() => navigate(`/management/dashboard/insights/${record.id}`)}
                  className={`rounded-[24px] border px-4 py-4 text-left transition ${
                    selected?.id === record.id
                      ? "border-slate-900 bg-slate-900 text-white dark:border-white dark:bg-white/10"
                      : "border-slate-200 bg-slate-50 hover:border-slate-300 dark:border-white/10 dark:bg-white/5"
                  }`}
                >
                  <div className="text-sm font-bold">{record.title}</div>
                  <div className={`mt-2 text-sm leading-6 ${selected?.id === record.id ? "text-slate-100" : "text-slate-600 dark:text-slate-300"}`}>
                    {record.summary}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-[28px] border border-slate-200 bg-white/92 p-5 shadow-[0_18px_44px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-white/6">
            <div className="text-xs font-bold uppercase tracking-[0.22em] text-slate-400">Current Insight</div>
            <div className="mt-2 text-xl font-black text-slate-900 dark:text-white">
              {selected?.title ?? "暂无洞察会话"}
            </div>
            <div className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
              {selected?.content ?? "请先选择一个洞察会话。"}
            </div>
            <div className="mt-4 grid gap-3">
              {dashboardQuickActions.map((action) => (
                <Button
                  key={action.id}
                  variant="secondary"
                  className="justify-start"
                  onClick={() => showToast(`${action.title} 已触发`)}
                >
                  {action.title}
                </Button>
              ))}
              <Button variant="primary" onClick={() => showToast("周报导出中")}>
                导出周报
              </Button>
            </div>
          </div>
          {selected ? (
            <div className="rounded-[28px] border border-slate-200 bg-slate-950 p-4 text-white shadow-[0_22px_52px_rgba(15,23,42,0.24)]">
              <ChatDialog
                dialogId={`management-dashboard-${selected.id}`}
                botName="数据洞察助手"
                initMessage="我已经读取当前指标、趋势和告警流，可以继续输出本周洞察、例会摘要或下周行动建议。"
                transport={dashboardAdapter.createChatTransport(selected.title)}
              />
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
