import React from "react";
import ActionDock from "@/feature/RecordWorkspace/ActionDock";
import TimelinePanel from "@/feature/RecordWorkspace/TimelinePanel";
import { timelineQuickActions, timelineRecords } from "@/pages/Management/featureData";
import Button from "@/ui/Button";
import { showToast } from "@/ui/Toast";
import {
  workbenchMainPanelShellClassName,
  workbenchScrollAreaClassName,
} from "@/pages/shared/workbench";

type TimelineRecord = (typeof timelineRecords)[number];

type Props = {
  records: TimelineRecord[];
  selected: TimelineRecord | null;
  onOpenRecord: (recordId: string) => void;
  onStatusChange: (milestoneId: string, status: string) => void;
};

const MainPanel: React.FC<Props> = ({ records, selected, onOpenRecord, onStatusChange }) => (
  <div className={workbenchMainPanelShellClassName}>
    <div className={workbenchScrollAreaClassName}>
      <div className="space-y-6">
        <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-[28px] border border-slate-200 bg-white/70 p-5 shadow-[0_18px_44px_rgba(15,23,42,0.06)] dark:border-white/10 dark:bg-white/6">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <div className="text-xs font-bold uppercase tracking-[0.22em] text-slate-400">Timeline Selector</div>
                <div className="mt-2 text-xl font-black text-slate-900 dark:text-white">时间轴列表</div>
              </div>
              <Button variant="primary" onClick={() => showToast("新建时间轴功能已触发")}>新建时间轴</Button>
            </div>
            <div className="space-y-3">
              {records.map((record) => (
                <button
                  key={record.id}
                  type="button"
                  onClick={() => onOpenRecord(record.id)}
                  className={`w-full rounded-[22px] border px-4 py-4 text-left transition ${
                    selected?.id === record.id
                      ? "border-slate-900 bg-slate-900 text-white dark:border-white dark:bg-white/10"
                      : "border-slate-200 bg-slate-50 hover:border-slate-300 dark:border-white/10 dark:bg-white/5"
                  }`}
                >
                  <div className="text-sm font-bold">{record.title}</div>
                  <div className={`mt-2 text-sm ${selected?.id === record.id ? "text-slate-100" : "text-slate-600 dark:text-slate-300"}`}>{record.summary}</div>
                </button>
              ))}
            </div>
          </div>
          <TimelinePanel milestones={selected?.milestones ?? []} onStatusChange={onStatusChange} />
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-[28px] border border-slate-200 bg-white/70 p-5 shadow-[0_18px_44px_rgba(15,23,42,0.06)] dark:border-white/10 dark:bg-white/6">
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
                  <Button variant="secondary" size="sm" className="mt-3" onClick={() => showToast(`${title} 已发送`)}>
                    发送提醒
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-[28px] border border-rose-200/70 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.98)_0%,rgba(255,241,242,0.96)_34%,rgba(238,242,255,0.94)_100%)] p-5 shadow-[0_22px_52px_rgba(244,114,182,0.12)]">
              <div className="text-xs font-bold uppercase tracking-[0.22em] text-rose-500/80">Conflict Radar</div>
              <div className="mt-2 text-xl font-black text-slate-900 dark:text-white">冲突雷达</div>
              <div className="mt-4 space-y-3">
                {[
                  "03/28 院系审批与奖学金补件提醒重叠",
                  "04/08 材料汇总与会议通知发布时间冲突",
                ].map((item) => (
                  <div key={item} className="rounded-[20px] border border-white/80 bg-white/88 px-4 py-4 text-sm text-slate-700 dark:text-slate-200">
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
            <ActionDock actions={timelineQuickActions} templates={[]} onInsert={() => showToast("已复制时间轴动作提示")} />
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default MainPanel;
