import React from "react";
import ActionDock from "@/feature/RecordWorkspace/ActionDock";
import ResourceBoard from "@/feature/RecordWorkspace/ResourceBoard";
import type { WorkspaceQuickAction } from "@/feature/RecordWorkspace";
import Button from "@/ui/Button";
import List from "@/ui/List";
import { showToast } from "@/ui/Toast";
import { literatureSearchRecords } from "@/pages/Research/featureData";
import {
  buildRecordActionPrompt,
  runRecordAIAction,
  workbenchMainPanelShellClassName,
  workbenchScrollAreaClassName,
} from "@/pages/shared/workbench";

type LiteratureSearchRecord = (typeof literatureSearchRecords)[number];

type Props = {
  records: LiteratureSearchRecord[];
  selected: LiteratureSearchRecord | null;
  quickActions: WorkspaceQuickAction[];
  onOpenRecord: (recordId: string) => void;
  onOpenReader: () => void;
  onAppendContent: (content: string) => void;
};

const MainPanel: React.FC<Props> = ({
  records,
  selected,
  quickActions,
  onOpenRecord,
  onOpenReader,
  onAppendContent,
}) => {
  const dialogId = selected ? `research-literature-${selected.id}` : null;
  const runAIAction = (action: string) => {
    runRecordAIAction(
      dialogId,
      buildRecordActionPrompt(action, selected, [
        { label: "筛选条件", value: selected?.filters },
        {
          label: "候选论文",
          value: (selected?.savedPapers ?? [])
            .map((paper: any) => `${paper.title}（${paper.meta}，${paper.status}）`)
            .join("；"),
        },
      ]),
    );
  };

  return (
  <div className={workbenchMainPanelShellClassName}>
    <div className={workbenchScrollAreaClassName}>
      <div className="space-y-6">
        <div className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
          <div className="rounded-[28px] border border-slate-200 bg-white/70 p-5 shadow-[0_18px_40px_rgba(15,23,42,0.06)] dark:border-white/10 dark:bg-white/6">
            <div className="text-xs font-bold uppercase tracking-[0.22em] text-slate-400">Query Rail</div>
            <div className="mt-2 text-xl font-black text-slate-900 dark:text-white">查询列表</div>
            <div className="mt-4">
              <List
                items={records}
                keyExtractor={(item) => item.id}
                onItemClick={(item) => onOpenRecord(item.id)}
                renderItem={(item) => (
                  <div className="space-y-2">
                    <div className="text-sm font-bold text-slate-900 dark:text-white">{item.title}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-300">{item.subtitle}</div>
                    <div className="text-sm text-slate-600 dark:text-slate-300">{item.summary}</div>
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
          </div>

          <div className="space-y-6">
            <div className="rounded-[28px] border border-emerald-200/70 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.98)_0%,rgba(236,253,245,0.96)_34%,rgba(224,242,254,0.94)_100%)] p-5 shadow-[0_20px_48px_rgba(52,211,153,0.14)]">
              <div className="text-xs font-bold uppercase tracking-[0.22em] text-emerald-600/80">
                Query Builder
              </div>
              <div className="mt-3 rounded-[24px] border border-white/80 bg-white/88 p-4 text-sm leading-7 text-slate-700 dark:text-slate-200">
                {selected?.content ?? 'TS=("generative AI") AND (creative workflow)'}
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {(selected?.filters ?? []).map((filter: string) => (
                  <span
                    key={filter}
                    className="rounded-full border border-emerald-100 bg-white px-3 py-1 text-xs font-semibold text-emerald-700"
                  >
                    {filter}
                  </span>
                ))}
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button
                  variant="secondary"
                  onClick={() =>
                    runAIAction("请根据当前检索式执行一次检索策略分析，给出数据库语法改写、筛选顺序和下一步检索建议。")
                  }
                >
                  运行检索
                </Button>
                <Button
                  variant="secondary"
                  onClick={() =>
                    runAIAction("请根据当前候选论文生成 3 个主题聚类，列出代表论文、纳排理由和后续精读优先级。")
                  }
                >
                  主题聚类
                </Button>
              </div>
            </div>

            <div className="rounded-[28px] border border-slate-200 bg-white/70 p-5 shadow-[0_18px_44px_rgba(15,23,42,0.06)] dark:border-white/10 dark:bg-white/6">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="text-xs font-bold uppercase tracking-[0.22em] text-slate-400">
                    Saved Basket
                  </div>
                  <div className="mt-2 text-xl font-black text-slate-900 dark:text-white">
                    候选论文与移交动作
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="secondary" onClick={() => showToast("引用已导出为 BibTeX")}>
                    导出引用
                  </Button>
                  <Button variant="primary" onClick={onOpenReader}>
                    移交精读
                  </Button>
                </div>
              </div>
              <div className="grid gap-3">
                {(selected?.savedPapers ?? []).map((paper: any) => (
                  <div
                    key={paper.id}
                    className="rounded-[22px] border border-slate-200 bg-slate-50 px-4 py-4 dark:border-white/10 dark:bg-slate-900/40"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <div className="text-sm font-bold text-slate-900 dark:text-white">{paper.title}</div>
                        <div className="mt-1 text-xs text-slate-500 dark:text-slate-300">{paper.meta}</div>
                      </div>
                      <span className="rounded-full bg-blue-100 px-2.5 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-500/15 dark:text-blue-200">
                        {paper.status}
                      </span>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {["保存论文", "写筛选理由", "加入比较"].map((label) => (
                        <Button
                          key={label}
                          variant="secondary"
                          size="sm"
                          onClick={() => {
                            if (label === "写筛选理由" || label === "加入比较") {
                              runAIAction(`请针对论文「${paper.title}」执行「${label}」，并说明与当前检索主题的关系。`);
                              return;
                            }
                            showToast(`${paper.title}：${label}`);
                          }}
                        >
                          {label}
                        </Button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.08fr)_minmax(320px,0.92fr)]">
          <ActionDock
            actions={quickActions}
            templates={[]}
            onInsert={onAppendContent}
            onRunAI={(prompt) => runAIAction(prompt)}
          />
          <ResourceBoard resources={selected?.resources ?? []} />
        </div>
      </div>
    </div>
  </div>
  );
};

export default MainPanel;
