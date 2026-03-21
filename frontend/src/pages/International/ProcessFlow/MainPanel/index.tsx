import React from "react";
import ActionDock from "@/feature/RecordWorkspace/ActionDock";
import ChecklistBoard from "@/feature/RecordWorkspace/ChecklistBoard";
import TimelinePanel from "@/feature/RecordWorkspace/TimelinePanel";
import { processFlowQuickActions, processFlowRecords } from "@/pages/International/featureData";
import Button from "@/ui/Button";
import { showToast } from "@/ui/Toast";
import {
  workbenchMainPanelShellClassName,
  workbenchScrollAreaClassName,
} from "@/pages/shared/workbench";

type ProcessFlowRecord = (typeof processFlowRecords)[number];

type Props = {
  selected: ProcessFlowRecord | null;
  onToggleTask: (taskId: string) => void;
  onStatusChange: (milestoneId: string, status: string) => void;
};

const MainPanel: React.FC<Props> = ({ selected, onToggleTask, onStatusChange }) => (
  <div className={workbenchMainPanelShellClassName}>
    <div className={workbenchScrollAreaClassName}>
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
          <ChecklistBoard tasks={selected?.tasks ?? []} onToggle={onToggleTask} />
          <TimelinePanel milestones={selected?.milestones ?? []} onStatusChange={onStatusChange} />
        </div>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.08fr)_minmax(320px,0.92fr)]">
          <div className="rounded-[28px] border border-slate-200 bg-white/70 p-5 shadow-[0_18px_44px_rgba(15,23,42,0.06)] dark:border-white/10 dark:bg-white/6">
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
          <ActionDock actions={processFlowQuickActions} templates={[]} onInsert={() => showToast("流程动作提示已复制")} />
        </div>
      </div>
    </div>
  </div>
);

export default MainPanel;
