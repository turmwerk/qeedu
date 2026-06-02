import React, { useMemo, useState } from "react";
import ActionDock from "@/feature/RecordWorkspace/ActionDock";
import TemplateWorkbench from "@/feature/RecordWorkspace/TemplateWorkbench";
import SearchBar from "@/ui/SearchBar";
import Button from "@/ui/Button";
import List from "@/ui/List";
import { showToast } from "@/ui/Toast";
import {
  announcementGeneratorQuickActions,
  announcementGeneratorRecords,
} from "@/pages/Management/featureData";
import {
  buildRecordActionPrompt,
  runRecordAIAction,
  workbenchMainPanelShellClassName,
  workbenchScrollAreaClassName,
} from "@/pages/shared/workbench";

type AnnouncementRecord = (typeof announcementGeneratorRecords)[number];

type Props = {
  records: AnnouncementRecord[];
  selected: AnnouncementRecord | null;
  onOpenRecord: (recordId: string) => void;
  onDuplicate: (recordId: string) => void;
  onRequestDelete: (recordId: string) => void;
  onAppendContent: (content: string) => void;
};

const MainPanel: React.FC<Props> = ({
  records,
  selected,
  onOpenRecord,
  onDuplicate,
  onRequestDelete,
  onAppendContent,
}) => {
  const [keyword, setKeyword] = useState("");
  const [tab, setTab] = useState<"正式通知" | "FAQ" | "短版">("正式通知");

  const filtered = useMemo(() => {
    const lowered = keyword.trim().toLowerCase();
    if (!lowered) return records;
    return records.filter((item) =>
      [item.title, item.subtitle, item.summary, ...(item.tags ?? [])]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(lowered),
    );
  }, [keyword, records]);

  const previewContent = useMemo(() => {
    if (!selected) return "";
    if (tab === "FAQ") return `${selected.content}\n\n## FAQ\n1. GPA 如何计算？\n2. 材料如何命名？`;
    if (tab === "短版") return `【简版提醒】${selected.title}\n请于规定时间内完成材料提交与系统填报，详情见正式通知。`;
    return selected.content;
  }, [selected, tab]);

  const dialogId = selected ? `management-announcement-${selected.id}` : null;
  const runAIAction = (action: string) => {
    runRecordAIAction(dialogId, buildRecordActionPrompt(action, selected));
  };

  return (
    <div className={workbenchMainPanelShellClassName}>
      <div className={workbenchScrollAreaClassName}>
        <div className="space-y-6">
          <div className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
            <div className="space-y-4">
              <div className="rounded-[28px] border border-slate-200 bg-white/70 p-5 shadow-[0_18px_40px_rgba(15,23,42,0.06)] dark:border-white/10 dark:bg-white/6">
                <div className="mb-4">
                  <SearchBar value={keyword} onChange={setKeyword} placeholder="搜索通知标题或渠道" />
                </div>
                <List
                  items={filtered}
                  keyExtractor={(item) => item.id}
                  onItemClick={(item) => onOpenRecord(item.id)}
                  renderItem={(item) => (
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-3">
                        <div className="text-sm font-bold text-slate-900 dark:text-white">{item.title}</div>
                        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600 dark:bg-white/10 dark:text-slate-200">
                          {item.status}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-300">{item.subtitle}</div>
                      <div className="text-sm leading-6 text-slate-600 dark:text-slate-300">{item.summary}</div>
                    </div>
                  )}
                  actions={[
                    { label: "继续", onClick: (item) => onOpenRecord(item.id) },
                    { label: "复制", onClick: (item) => onDuplicate(item.id) },
                    {
                      label: "删除",
                      onClick: (item) => onRequestDelete(item.id),
                      className:
                        "rounded-lg border border-rose-200 bg-rose-50 px-2.5 py-1.5 text-sm font-semibold text-rose-600 hover:bg-rose-100 dark:border-rose-400/20 dark:bg-rose-500/10 dark:text-rose-200",
                    },
                  ]}
                />
              </div>
              <div className="workbench-surface-accent rounded-[28px] border border-violet-200/70 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.98)_0%,rgba(245,243,255,0.96)_38%,rgba(224,231,255,0.92)_100%)] p-5 shadow-[0_20px_48px_rgba(129,140,248,0.16)]">
                <div className="text-xs font-bold uppercase tracking-[0.22em] text-violet-500/80">Channels</div>
                <div className="mt-3 grid gap-3">
                  {[
                    ["官网", "适合完整版通知"],
                    ["邮件", "适合附 FAQ 和附件说明"],
                    ["公众号", "适合压缩短版"],
                    ["群通知", "适合提醒截止时间"],
                  ].map(([title, desc]) => (
                    <button
                      key={title}
                      type="button"
                      onClick={() => showToast(`${title} 渠道已加入当前发布方案`)}
                      className="workbench-surface-muted rounded-[20px] border border-white/80 bg-white/90 px-4 py-3 text-left hover:border-violet-300 hover:bg-white"
                    >
                      <div className="font-semibold text-slate-900 dark:text-white">{title}</div>
                      <div className="mt-1 text-sm text-slate-600 dark:text-slate-300">{desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {selected ? (
                <>
                  <div className="rounded-[30px] border border-slate-200 bg-white/70 p-5 shadow-[0_20px_48px_rgba(15,23,42,0.06)] dark:border-white/10 dark:bg-white/6">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <div className="text-xs font-bold uppercase tracking-[0.22em] text-slate-400">Structured Brief</div>
                        <div className="mt-2 text-2xl font-black text-slate-900 dark:text-white">{selected.title}</div>
                        <div className="mt-2 text-sm text-slate-500 dark:text-slate-300">{selected.subtitle}</div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Button
                          variant="secondary"
                          onClick={() => {
                            setTab("FAQ");
                            runAIAction("请基于当前通知生成 FAQ，覆盖资格边界、材料格式、时间节点和咨询方式。");
                          }}
                        >
                          生成 FAQ
                        </Button>
                        <Button
                          variant="secondary"
                          onClick={() => {
                            setTab("短版");
                            runAIAction("请把当前正式通知压缩成公众号短版，保留对象、截止时间、材料要求和咨询入口。");
                          }}
                        >
                          公众号短版
                        </Button>
                        <Button
                          variant="primary"
                          onClick={() => {
                            onAppendContent("\n\n## 发布版\n- 已整理正式通知结构与渠道说明");
                            runAIAction("请将当前通知草稿整理成可发布的正式通知版本，结构清晰、语气正式，并补充渠道发布注意事项。");
                          }}
                        >
                          生成正式通知
                        </Button>
                      </div>
                    </div>
                    <div className="mt-4 grid gap-3 md:grid-cols-2">
                      {[
                        ["通知对象", selected.tags?.[0] ?? "未指定"],
                        ["状态", selected.status ?? "草稿"],
                        ["渠道", selected.subtitle ?? "待补充"],
                        ["最近更新", "刚刚可继续追问"],
                      ].map(([label, value]) => (
                        <div key={label} className="rounded-[22px] border border-slate-200 bg-slate-50 px-4 py-3 dark:border-white/10 dark:bg-slate-900/40">
                          <div className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">{label}</div>
                          <div className="mt-2 text-sm font-semibold text-slate-900 dark:text-white">{value}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(320px,0.94fr)]">
                    <div className="workbench-surface-accent rounded-[30px] border border-indigo-200/70 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.98)_0%,rgba(238,242,255,0.96)_36%,rgba(245,243,255,0.94)_100%)] p-5 shadow-[0_20px_52px_rgba(99,102,241,0.14)]">
                      <div className="mb-4 flex flex-wrap items-center gap-2">
                        {(["正式通知", "FAQ", "短版"] as const).map((item) => (
                          <Button
                            key={item}
                            className={`rounded-full px-4 py-2 text-sm font-semibold ${
                              tab === item
                                ? "bg-[linear-gradient(135deg,#818cf8_0%,#38bdf8_100%)] text-white"
                                : "border border-slate-200 bg-white text-slate-700"
                            }`}
                            onClick={() => setTab(item)}
                          >
                            {item}
                          </Button>
                        ))}
                      </div>
                      <div className="workbench-surface-muted rounded-[24px] border border-white/80 bg-white/88 p-5 text-sm leading-7 text-slate-700 dark:text-slate-200">
                        {previewContent}
                      </div>
                    </div>
                    <div className="space-y-6">
                      <TemplateWorkbench templates={selected.templates ?? []} onInsert={onAppendContent} />
                      <ActionDock
                        actions={announcementGeneratorQuickActions}
                        templates={selected.templates ?? []}
                        onInsert={onAppendContent}
                        onRunAI={(prompt) => runAIAction(prompt)}
                      />
                    </div>
                  </div>
                </>
              ) : (
                <div className="rounded-[28px] border border-dashed border-slate-300 bg-white/70 p-10 text-center text-slate-500 dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
                  先创建一条通知记录。
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainPanel;
