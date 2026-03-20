import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import ChatDialog from "@/feature/ChatDialog";
import ActionDock from "@/feature/RecordWorkspace/ActionDock";
import TimelinePanel from "@/feature/RecordWorkspace/TimelinePanel";
import { useFeatureRecords } from "@/hooks/useFeatureRecords";
import { timelineAdapter } from "@/pages/Management/featureAdapters";
import { timelinePageData, timelineQuickActions } from "@/pages/Management/featureData";
import Button from "@/ui/Button";
import { showToast } from "@/ui/Toast";

const Timeline: React.FC = () => {
  const navigate = useNavigate();
  const { timelineId } = useParams();
  const { records, patchRecord } = useFeatureRecords(timelineAdapter);
  const selected = records.find((record) => record.id === timelineId) ?? records[0] ?? null;

  return (
    <div className="flex w-full min-w-0 flex-col gap-6 px-4 py-6 md:px-6 xl:px-8">
      <section className="rounded-[34px] border border-slate-200 bg-[linear-gradient(135deg,#fff1f2_0%,#eef2ff_52%,#f8fafc_100%)] p-6 shadow-[0_24px_54px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-[linear-gradient(135deg,rgba(76,5,25,0.25)_0%,rgba(15,23,42,0.92)_100%)]">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-3xl">
            <div className="text-xs font-bold uppercase tracking-[0.24em] text-slate-400">
              Timeline Console
            </div>
            <div className="mt-3 text-3xl font-black text-slate-900 dark:text-white">
              {timelinePageData.headline}
            </div>
            <div className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
              {timelinePageData.description}
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {timelinePageData.metrics.map((metric) => (
              <div
                key={metric.label}
                className="rounded-[22px] border border-white/70 bg-white/80 px-4 py-4 dark:border-white/10 dark:bg-white/5"
              >
                <div className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">{metric.label}</div>
                <div className="mt-2 text-3xl font-black text-slate-900 dark:text-white">{metric.value}</div>
                <div className="mt-2 text-xs text-slate-500 dark:text-slate-300">{metric.detail}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-6 2xl:grid-cols-[minmax(0,1.16fr)_360px]">
        <div className="space-y-6">
          <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
            <div className="rounded-[28px] border border-slate-200 bg-white/92 p-5 shadow-[0_18px_44px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-white/6">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <div className="text-xs font-bold uppercase tracking-[0.22em] text-slate-400">
                    Timeline Selector
                  </div>
                  <div className="mt-2 text-xl font-black text-slate-900 dark:text-white">
                    时间轴列表
                  </div>
                </div>
                <Button variant="primary" onClick={() => showToast("新建时间轴功能已触发")}>
                  新建时间轴
                </Button>
              </div>
              <div className="space-y-3">
                {records.map((record) => (
                  <button
                    key={record.id}
                    type="button"
                    onClick={() => navigate(`/management/timeline/${record.id}`)}
                    className={`w-full rounded-[22px] border px-4 py-4 text-left transition ${
                      selected?.id === record.id
                        ? "border-slate-900 bg-slate-900 text-white dark:border-white dark:bg-white/10"
                        : "border-slate-200 bg-slate-50 hover:border-slate-300 dark:border-white/10 dark:bg-white/5"
                    }`}
                  >
                    <div className="text-sm font-bold">{record.title}</div>
                    <div className={`mt-2 text-sm ${selected?.id === record.id ? "text-slate-100" : "text-slate-600 dark:text-slate-300"}`}>
                      {record.summary}
                    </div>
                  </button>
                ))}
              </div>
            </div>
            <TimelinePanel
              milestones={selected?.milestones ?? []}
              onStatusChange={(milestoneId, status) => {
                if (!selected) return;
                patchRecord(selected.id, {
                  milestones: (selected.milestones ?? []).map((item: any) =>
                    item.id === milestoneId ? { ...item, status } : item,
                  ),
                });
              }}
            />
          </div>

          <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
            <div className="rounded-[28px] border border-slate-200 bg-white/92 p-5 shadow-[0_18px_44px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-white/6">
              <div className="text-xs font-bold uppercase tracking-[0.22em] text-slate-400">Reminder Board</div>
              <div className="mt-2 text-xl font-black text-slate-900 dark:text-white">提醒编辑区</div>
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                {[
                  ["T-3 天提醒", "适合材料提交前收口"],
                  ["T-1 天提醒", "适合高风险节点催办"],
                  ["定向提醒", "面向缺件学生或学院联系人"],
                  ["冲突协调", "同步会议、截止与面试冲突"],
                ].map(([title, desc]) => (
                  <div key={title} className="rounded-[22px] border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-slate-900/40">
                    <div className="text-sm font-bold text-slate-900 dark:text-white">{title}</div>
                    <div className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{desc}</div>
                    <Button
                      variant="secondary"
                      size="sm"
                      className="mt-3"
                      onClick={() => showToast(`${title} 已发送`)}
                    >
                      发送提醒
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[28px] border border-slate-200 bg-slate-950 p-5 text-white shadow-[0_22px_52px_rgba(15,23,42,0.24)]">
              <div className="text-xs font-bold uppercase tracking-[0.22em] text-rose-200/80">Conflict Radar</div>
              <div className="mt-2 text-xl font-black">冲突雷达</div>
              <div className="mt-4 space-y-3">
                {[
                  "03/28 院系审批与奖学金补件提醒重叠",
                  "04/08 材料汇总与会议通知发布时间冲突",
                ].map((item) => (
                  <div
                    key={item}
                    className="rounded-[20px] border border-white/10 bg-white/6 px-4 py-4 text-sm text-slate-100"
                  >
                    {item}
                    <Button
                      variant="secondary"
                      size="sm"
                      className="mt-3 w-full justify-center"
                      onClick={() => showToast("已生成冲突处理建议")}
                    >
                      解决冲突
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <ActionDock
            actions={timelineQuickActions}
            templates={[]}
            onInsert={() => showToast("已复制时间轴动作提示")}
          />
          {selected ? (
            <div className="rounded-[28px] border border-slate-200 bg-white/92 p-4 shadow-[0_18px_44px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-white/6">
              <ChatDialog
                dialogId={`management-timeline-${selected.id}`}
                botName="排期助手"
                initMessage="我已经读取当前时间轴、里程碑和冲突信息，可以继续重排节点、生成提醒策略或压缩未来三天计划。"
                transport={timelineAdapter.createChatTransport(selected.title)}
              />
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
};

export default Timeline;
