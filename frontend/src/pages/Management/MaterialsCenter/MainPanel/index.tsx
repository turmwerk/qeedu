import React from "react";
import ActionDock from "@/feature/RecordWorkspace/ActionDock";
import ResourceBoard from "@/feature/RecordWorkspace/ResourceBoard";
import List from "@/ui/List";
import Button from "@/ui/Button";
import { showToast } from "@/ui/Toast";
import {
  materialsCenterQuickActions,
  materialsCenterRecords,
} from "@/pages/Management/featureData";
import {
  workbenchMainPanelShellClassName,
  workbenchScrollAreaClassName,
} from "@/pages/shared/workbench";

type MaterialsCenterRecord = (typeof materialsCenterRecords)[number];

type Props = {
  records: MaterialsCenterRecord[];
  selected: MaterialsCenterRecord | null;
  onOpenRecord: (recordId: string) => void;
  onUpdateSelected: (patch: Record<string, unknown>) => void;
};

const MainPanel: React.FC<Props> = ({ records, selected, onOpenRecord, onUpdateSelected }) => (
  <div className={workbenchMainPanelShellClassName}>
    <div className={workbenchScrollAreaClassName}>
      <div className="space-y-6">
        <div className="grid gap-6 xl:grid-cols-[280px_minmax(0,1fr)]">
          <div className="rounded-[28px] border border-slate-200 bg-white/70 p-5 shadow-[0_18px_40px_rgba(15,23,42,0.06)] dark:border-white/10 dark:bg-white/6">
            <div className="mb-4 text-lg font-black text-slate-900 dark:text-white">材料集合树</div>
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
              actions={[{ label: "打开", onClick: (item) => onOpenRecord(item.id) }]}
            />
          </div>

          <div className="space-y-6">
            {selected ? (
              <>
                <div className="rounded-[28px] border border-slate-200 bg-white/70 p-5 shadow-[0_18px_44px_rgba(15,23,42,0.06)] dark:border-white/10 dark:bg-white/6">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <div className="text-xs font-bold uppercase tracking-[0.22em] text-slate-400">Review Table</div>
                      <div className="mt-2 text-2xl font-black text-slate-900 dark:text-white">{selected.title}</div>
                      <div className="mt-2 text-sm text-slate-500 dark:text-slate-300">{selected.subtitle}</div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button variant="secondary" onClick={() => showToast("模板已下载")}>下载模板</Button>
                      <Button
                        variant="secondary"
                        onClick={() => {
                          onUpdateSelected({ status: "待补件", updatedAt: Date.now() });
                          showToast("已更新为待补件");
                        }}
                      >
                        更新审核状态
                      </Button>
                      <Button variant="primary" onClick={() => showToast("缺件清单已导出")}>导出缺件清单</Button>
                    </div>
                  </div>
                  <div className="mt-5 overflow-hidden rounded-[24px] border border-slate-200 dark:border-white/10">
                    <div className="grid grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr] bg-slate-100 px-4 py-3 text-xs font-bold uppercase tracking-[0.18em] text-slate-500 dark:bg-slate-900/50 dark:text-slate-300">
                      <span>材料项</span>
                      <span>状态</span>
                      <span>补件情况</span>
                      <span>动作</span>
                    </div>
                    {[
                      ["成绩单", "已收齐", "无需补件", "预览"],
                      ["语言成绩", "审核中", "等待核验", "核验"],
                      ["课程计划", "缺失", "需补件", "提醒"],
                      ["签字页", "缺失", "需补件", "提醒"],
                    ].map(([title, status, issue, action]) => (
                      <div
                        key={title}
                        className="grid grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr] items-center border-t border-slate-200 bg-white px-4 py-4 text-sm dark:border-white/10 dark:bg-white/5"
                      >
                        <span className="font-semibold text-slate-900 dark:text-white">{title}</span>
                        <span className="text-slate-600 dark:text-slate-300">{status}</span>
                        <span className="text-slate-600 dark:text-slate-300">{issue}</span>
                        <Button variant="secondary" size="sm" onClick={() => showToast(`${title} 已执行 ${action}`)}>
                          {action}
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
                  <ResourceBoard resources={selected.resources ?? []} />
                  <div className="space-y-6">
                    <ActionDock
                      actions={materialsCenterQuickActions}
                      templates={[]}
                      onInsert={(content) => {
                        onUpdateSelected({
                          content: `${selected.content}\n\n${content}`.trim(),
                          updatedAt: Date.now(),
                        });
                        showToast("已把动作写入当前集合记录");
                      }}
                    />
                    <div className="rounded-[28px] border border-sky-200/70 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.98)_0%,rgba(236,254,255,0.95)_34%,rgba(219,234,254,0.92)_100%)] p-5 shadow-[0_22px_52px_rgba(56,189,248,0.14)]">
                      <div className="text-xs font-bold uppercase tracking-[0.22em] text-sky-500/80">Template & Review Pulse</div>
                      <div className="mt-2 text-xl font-black text-slate-900 dark:text-white">模板与审核脉冲</div>
                      <div className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
                        下载模板、查看缺件热点，并把当前集合的审核口径同步给右侧助手。
                      </div>
                      <div className="mt-4 grid gap-3">
                        {["上传学生材料包", "预览报名表 PDF", "批量导出审核摘要"].map((label) => (
                          <Button
                            key={label}
                            variant="secondary"
                            className="justify-start"
                            onClick={() => showToast(`${label} 功能已触发`)}
                          >
                            {label}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default MainPanel;
