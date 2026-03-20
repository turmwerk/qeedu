import React from "react";
import { useParams } from "react-router-dom";
import ChatDialog from "@/feature/ChatDialog";
import ActionDock from "@/feature/RecordWorkspace/ActionDock";
import ChecklistBoard from "@/feature/RecordWorkspace/ChecklistBoard";
import TimelinePanel from "@/feature/RecordWorkspace/TimelinePanel";
import { useFeatureRecords } from "@/hooks/useFeatureRecords";
import { processFlowAdapter } from "@/pages/International/featureAdapters";
import { processFlowPageData, processFlowQuickActions } from "@/pages/International/featureData";
import Button from "@/ui/Button";
import { showToast } from "@/ui/Toast";

const ProcessFlow: React.FC = () => {
  const { planId } = useParams();
  const { records, patchRecord } = useFeatureRecords(processFlowAdapter);
  const selected = records.find((record) => record.id === planId) ?? records[0] ?? null;

  return (
    <div className="flex w-full min-w-0 flex-col gap-6 px-4 py-6 md:px-6 xl:px-8">
      <section className="rounded-[34px] bg-[linear-gradient(135deg,#1d4ed8_0%,#2563eb_48%,#0f172a_100%)] p-6 text-white shadow-[0_24px_60px_rgba(37,99,235,0.3)]">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.4fr)_360px]">
          <div>
            <div className="text-xs font-bold uppercase tracking-[0.24em] text-sky-100/80">
              Application Command Board
            </div>
            <div className="mt-3 text-3xl font-black md:text-4xl">{processFlowPageData.headline}</div>
            <div className="mt-3 text-sm leading-7 text-slate-100">{processFlowPageData.description}</div>
          </div>
          <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
            {processFlowPageData.metrics.map((metric) => (
              <div key={metric.label} className="rounded-[22px] border border-white/10 bg-white/8 px-4 py-4">
                <div className="text-xs font-bold uppercase tracking-[0.18em] text-sky-100/70">{metric.label}</div>
                <div className="mt-2 text-3xl font-black">{metric.value}</div>
                <div className="mt-2 text-xs text-slate-200">{metric.detail}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-6 2xl:grid-cols-[minmax(0,1.15fr)_360px]">
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-4">
            {["选项目", "做审批", "交材料", "等提名"].map((step, index) => (
              <div
                key={step}
                className={`rounded-[24px] border p-5 ${
                  index === 1
                    ? "border-amber-200 bg-amber-50 dark:border-amber-400/20 dark:bg-amber-500/10"
                    : "border-slate-200 bg-white/92 dark:border-white/10 dark:bg-white/6"
                }`}
              >
                <div className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Stage {index + 1}</div>
                <div className="mt-2 text-lg font-black text-slate-900 dark:text-white">{step}</div>
              </div>
            ))}
          </div>

          <div className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
            <ChecklistBoard
              tasks={selected?.tasks ?? []}
              onToggle={(taskId) => {
                if (!selected) return;
                patchRecord(selected.id, {
                  tasks: (selected.tasks ?? []).map((task: any) =>
                    task.id === taskId ? { ...task, done: !task.done } : task,
                  ),
                });
              }}
            />
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

          <div className="rounded-[28px] border border-slate-200 bg-white/92 p-5 shadow-[0_18px_44px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-white/6">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="text-xs font-bold uppercase tracking-[0.22em] text-slate-400">Risk Console</div>
                <div className="mt-2 text-xl font-black text-slate-900 dark:text-white">风险提醒与动作</div>
              </div>
              <Button variant="primary" onClick={() => showToast("已发送当前风险提醒")}>
                发送提醒
              </Button>
            </div>
            <div className="grid gap-3 md:grid-cols-3">
              {[
                "推荐信尚未确认，今天内需发出邀请",
                "院系审批临近截止，需要补课程计划说明",
                "成绩单上传已完成，可转入校内终检",
              ].map((item, index) => (
                <div
                  key={item}
                  className={`rounded-[22px] border p-4 ${
                    index === 0
                      ? "border-rose-200 bg-rose-50 dark:border-rose-400/20 dark:bg-rose-500/10"
                      : "border-slate-200 bg-slate-50 dark:border-white/10 dark:bg-slate-900/40"
                  }`}
                >
                  <div className="text-sm leading-6 text-slate-700 dark:text-slate-200">{item}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <ActionDock
            actions={processFlowQuickActions}
            templates={[]}
            onInsert={() => showToast("流程动作提示已复制")}
          />
          {selected ? (
            <div className="rounded-[28px] border border-slate-200 bg-slate-950 p-4 text-white shadow-[0_22px_52px_rgba(15,23,42,0.24)]">
              <ChatDialog
                dialogId={`international-process-${selected.id}`}
                botName="流程计划助手"
                initMessage="我已经读取当前计划、任务与里程碑，可以继续压缩三日执行计划、重排节点或生成补件提醒。"
                transport={processFlowAdapter.createChatTransport(selected.title)}
              />
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
};

export default ProcessFlow;
