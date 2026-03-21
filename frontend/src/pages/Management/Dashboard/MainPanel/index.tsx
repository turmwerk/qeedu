import React from "react";
import { dashboardQuickActions, dashboardRecords } from "@/pages/Management/featureData";
import Button from "@/ui/Button";
import { showToast } from "@/ui/Toast";
import {
  workbenchMainPanelShellClassName,
  workbenchScrollAreaClassName,
} from "@/pages/shared/workbench";

type DashboardRecord = (typeof dashboardRecords)[number];

type Props = {
  records: DashboardRecord[];
  selected: DashboardRecord | null;
  onOpenRecord: (recordId: string) => void;
  onRefreshInsight: () => void;
};

const MainPanel: React.FC<Props> = ({ records, selected, onOpenRecord, onRefreshInsight }) => (
  <div className={workbenchMainPanelShellClassName}>
    <div className={workbenchScrollAreaClassName}>
      <div className="space-y-6">
        <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[28px] border border-slate-200 bg-white/70 p-5 shadow-[0_18px_44px_rgba(15,23,42,0.06)] dark:border-white/10 dark:bg-white/6">
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
                    <div className="h-3 rounded-full bg-[linear-gradient(90deg,#38bdf8_0%,#1d4ed8_100%)]" style={{ width: `${value}%` }} />
                  </div>
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{value}%</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[28px] border border-slate-200 bg-white/70 p-5 shadow-[0_18px_44px_rgba(15,23,42,0.06)] dark:border-white/10 dark:bg-white/6">
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
                  <Button variant="secondary" size="sm" className="mt-3" onClick={() => showToast(`${label} 告警已打开`)}>
                    查看详情
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.08fr)_minmax(320px,0.92fr)]">
          <div className="rounded-[28px] border border-slate-200 bg-white/70 p-5 shadow-[0_18px_44px_rgba(15,23,42,0.06)] dark:border-white/10 dark:bg-white/6">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <div className="text-xs font-bold uppercase tracking-[0.22em] text-slate-400">Insight Sessions</div>
                <div className="mt-2 text-xl font-black text-slate-900 dark:text-white">洞察会话</div>
              </div>
              <Button variant="primary" onClick={onRefreshInsight}>刷新洞察</Button>
            </div>
            <div className="grid gap-4 lg:grid-cols-2">
              {records.map((record) => (
                <button
                  key={record.id}
                  type="button"
                  onClick={() => onOpenRecord(record.id)}
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

          <div className="rounded-[28px] border border-slate-200 bg-white/70 p-5 shadow-[0_18px_44px_rgba(15,23,42,0.06)] dark:border-white/10 dark:bg-white/6">
            <div className="text-xs font-bold uppercase tracking-[0.22em] text-slate-400">Current Insight</div>
            <div className="mt-2 text-xl font-black text-slate-900 dark:text-white">{selected?.title ?? "暂无洞察会话"}</div>
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
              <Button variant="primary" onClick={() => showToast("周报导出中")}>导出周报</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default MainPanel;
