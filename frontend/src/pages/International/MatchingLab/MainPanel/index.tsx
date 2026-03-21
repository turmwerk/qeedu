import React from "react";
import ResourceBoard from "@/feature/RecordWorkspace/ResourceBoard";
import { matchingLabQuickActions, matchingLabRecords } from "@/pages/International/featureData";
import Button from "@/ui/Button";
import List from "@/ui/List";
import { showToast } from "@/ui/Toast";
import {
  workbenchMainPanelShellClassName,
  workbenchScrollAreaClassName,
} from "@/pages/shared/workbench";

type MatchingLabRecord = (typeof matchingLabRecords)[number];

type Props = {
  records: MatchingLabRecord[];
  selected: MatchingLabRecord | null;
  onOpenRecord: (recordId: string) => void;
};

const MainPanel: React.FC<Props> = ({ records, selected, onOpenRecord }) => (
  <div className={workbenchMainPanelShellClassName}>
    <div className={workbenchScrollAreaClassName}>
      <div className="space-y-6">
        <div className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
          <div className="rounded-[28px] border border-slate-200 bg-white/70 p-5 shadow-[0_18px_40px_rgba(15,23,42,0.06)] dark:border-white/10 dark:bg-white/6">
            <div className="mb-4 text-xl font-black text-slate-900 dark:text-white">分析记录</div>
            <List
              items={records}
              keyExtractor={(item) => item.id}
              onItemClick={(item) => onOpenRecord(item.id)}
              renderItem={(item) => (
                <div className="space-y-2">
                  <div className="text-sm font-bold text-slate-900 dark:text-white">{item.title}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-300">{item.subtitle}</div>
                  <div className="text-sm leading-6 text-slate-600 dark:text-slate-300">{item.summary}</div>
                </div>
              )}
              actions={[
                {
                  label: "打开",
                  onClick: (item) => onOpenRecord(item.id),
                },
              ]}
            />
          </div>

          <div className="space-y-6">
            <div className="rounded-[28px] border border-slate-200 bg-white/70 p-5 shadow-[0_18px_44px_rgba(15,23,42,0.06)] dark:border-white/10 dark:bg-white/6">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="text-xs font-bold uppercase tracking-[0.22em] text-slate-400">Profile Snapshot</div>
                  <div className="mt-2 text-xl font-black text-slate-900 dark:text-white">画像与候选矩阵</div>
                </div>
                <Button variant="primary" onClick={() => showToast("已运行项目推荐")}>
                  运行推荐
                </Button>
              </div>
              {selected ? (
                <div className="space-y-4">
                  <div className="rounded-[22px] border border-slate-200 bg-slate-50 p-4 text-sm leading-7 text-slate-700 dark:border-white/10 dark:bg-slate-900/40 dark:text-slate-200">
                    {selected.content}
                  </div>
                  <div className="grid gap-3 md:grid-cols-3">
                    {(selected.recommendations ?? []).map((item: any, index: number) => (
                      <div
                        key={item.title}
                        className={`rounded-[22px] border p-4 ${
                          index === 0
                            ? "border-emerald-200 bg-emerald-50 dark:border-emerald-400/20 dark:bg-emerald-500/10"
                            : index === 1
                              ? "border-sky-200 bg-sky-50 dark:border-sky-400/20 dark:bg-sky-500/10"
                              : "border-violet-200 bg-violet-50 dark:border-violet-400/20 dark:bg-violet-500/10"
                        }`}
                      >
                        <div className="text-sm font-bold text-slate-900 dark:text-white">{item.title}</div>
                        <div className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{item.reason}</div>
                        <div className="mt-3 text-2xl font-black text-slate-900 dark:text-white">{item.score}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>

            <div className="grid gap-6 xl:grid-cols-[minmax(0,0.96fr)_minmax(320px,1.04fr)]">
              <div className="rounded-[28px] border border-slate-200 bg-white/70 p-5 shadow-[0_18px_44px_rgba(15,23,42,0.06)] dark:border-white/10 dark:bg-white/6">
                <div className="text-xs font-bold uppercase tracking-[0.22em] text-slate-400">Decision Actions</div>
                <div className="mt-4 grid gap-3">
                  {matchingLabQuickActions.map((item) => (
                    <Button
                      key={item.id}
                      variant="secondary"
                      className="justify-start"
                      onClick={() => showToast(`${item.title} 已触发`)}
                    >
                      {item.title}
                    </Button>
                  ))}
                  <Button variant="primary" onClick={() => showToast("已锁定当前优先级")}>
                    锁定优先级
                  </Button>
                </div>
              </div>
              <ResourceBoard resources={selected?.resources ?? []} />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default MainPanel;
