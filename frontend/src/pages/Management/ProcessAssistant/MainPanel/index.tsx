import React, { useMemo, useState } from "react";
import ActionDock from "@/feature/RecordWorkspace/ActionDock";
import ChecklistBoard from "@/feature/RecordWorkspace/ChecklistBoard";
import ResourceBoard from "@/feature/RecordWorkspace/ResourceBoard";
import SearchBar from "@/ui/SearchBar";
import Button from "@/ui/Button";
import { showToast } from "@/ui/Toast";
import { processAssistantQuickActions, processAssistantRecords } from "@/pages/Management/featureData";
import {
  buildRecordActionPrompt,
  runRecordAIAction,
  workbenchMainPanelShellClassName,
  workbenchScrollAreaClassName,
} from "@/pages/shared/workbench";

const laneOrder = ["进行中", "阻塞中", "已完成"] as const;
type ProcessAssistantRecord = (typeof processAssistantRecords)[number];

type Props = {
  records: ProcessAssistantRecord[];
  selected: ProcessAssistantRecord | null;
  onOpenRecord: (recordId: string) => void;
  onRequestDelete: (recordId: string) => void;
  onUpdateSelected: (patch: Record<string, unknown>) => void;
};

const MainPanel: React.FC<Props> = ({
  records,
  selected,
  onOpenRecord,
  onRequestDelete,
  onUpdateSelected,
}) => {
  const [keyword, setKeyword] = useState("");

  const filtered = useMemo(() => {
    const lowered = keyword.trim().toLowerCase();
    if (!lowered) return records;
    return records.filter((record) =>
      [record.title, record.subtitle, record.summary, ...(record.tags ?? [])]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(lowered),
    );
  }, [keyword, records]);

  const lanes = laneOrder.map((status) => ({
    status,
    items: filtered.filter((record) => record.status === status),
  }));

  const dialogId = selected ? `management-process-${selected.id}` : null;
  const runAIAction = (action: string) => {
    runRecordAIAction(
      dialogId,
      buildRecordActionPrompt(action, selected, [
        {
          label: "任务清单",
          value: (selected?.tasks ?? [])
            .map((task: any) => `${task.done ? "已完成" : "未完成"} - ${task.title}：${task.detail ?? ""}`)
            .join("；"),
        },
      ]),
    );
  };

  return (
    <div className={workbenchMainPanelShellClassName}>
      <div className={workbenchScrollAreaClassName}>
        <div className="space-y-6">
          <div className="rounded-[28px] border border-slate-200 bg-white/70 p-5 shadow-[0_18px_40px_rgba(15,23,42,0.06)] dark:border-white/10 dark:bg-white/6">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="text-lg font-black text-slate-900 dark:text-white">流程泳道</div>
                <div className="text-sm text-slate-500 dark:text-slate-300">按状态观察事务案例，并直接进入异常处理。</div>
              </div>
              <div className="w-full max-w-sm">
                <SearchBar value={keyword} onChange={setKeyword} placeholder="搜索案例、负责人或标签" />
              </div>
            </div>
            <div className="grid gap-4 xl:grid-cols-3">
              {lanes.map((lane, index) => (
                <div
                  key={lane.status}
                  className={`rounded-[26px] border p-4 ${
                    index === 0
                      ? "border-sky-200 bg-sky-50/90 dark:border-sky-400/20 dark:bg-sky-500/10"
                      : index === 1
                        ? "border-rose-200 bg-rose-50/90 dark:border-rose-400/20 dark:bg-rose-500/10"
                        : "border-emerald-200 bg-emerald-50/90 dark:border-emerald-400/20 dark:bg-emerald-500/10"
                  }`}
                >
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <div className="text-sm font-black text-slate-900 dark:text-white">{lane.status}</div>
                    <span className="rounded-full bg-white/80 px-2.5 py-1 text-xs font-semibold text-slate-600 dark:bg-white/10 dark:text-slate-200">
                      {lane.items.length}
                    </span>
                  </div>
                  <div className="space-y-3">
                    {lane.items.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => onOpenRecord(item.id)}
                        className={`w-full rounded-[20px] border px-4 py-4 text-left transition ${
                          selected?.id === item.id
                            ? "border-slate-900 bg-slate-900 text-white dark:border-white dark:bg-white/10"
                            : "border-white/80 bg-white/90 hover:border-slate-300 hover:shadow-[0_10px_24px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-white/6"
                        }`}
                      >
                        <div className="text-sm font-bold">{item.title}</div>
                        <div className={`mt-1 text-xs ${selected?.id === item.id ? "text-slate-200" : "text-slate-500 dark:text-slate-300"}`}>{item.subtitle}</div>
                        <div className={`mt-2 text-sm leading-6 ${selected?.id === item.id ? "text-slate-100" : "text-slate-600 dark:text-slate-300"}`}>
                          {item.summary}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {selected ? (
            <div className="space-y-6">
              <div className="rounded-[30px] border border-slate-200 bg-white/70 p-5 shadow-[0_20px_44px_rgba(15,23,42,0.06)] dark:border-white/10 dark:bg-white/6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="text-xs font-bold uppercase tracking-[0.24em] text-slate-400">Case Brief</div>
                    <div className="mt-2 text-2xl font-black text-slate-900 dark:text-white">{selected.title}</div>
                    <div className="mt-2 text-sm text-slate-500 dark:text-slate-300">{selected.subtitle}</div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button variant="secondary" onClick={() => onUpdateSelected({ status: "已完成", updatedAt: Date.now() })}>
                      标记完成
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() =>
                        onUpdateSelected({
                          content: `${selected.content}\n\n- 已发送补件提醒`,
                          updatedAt: Date.now(),
                        })
                      }
                    >
                      请求补件
                    </Button>
                    <Button variant="secondary" onClick={() => onRequestDelete(selected.id)}>
                      删除案例
                    </Button>
                    <Button
                      variant="primary"
                      onClick={() =>
                        runAIAction("请根据当前案例重新生成角色化办理步骤，标出依赖关系、风险节点和补救动作。")
                      }
                    >
                      AI 生成步骤
                    </Button>
                  </div>
                </div>
                <div className="mt-4 rounded-[24px] border border-slate-200 bg-slate-50 p-4 text-sm leading-7 text-slate-700 dark:border-white/10 dark:bg-slate-900/40 dark:text-slate-200">
                  {selected.content}
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {(selected.tags ?? []).map((tag: string) => (
                    <span key={tag} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 dark:bg-white/10 dark:text-slate-200">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
                <ChecklistBoard tasks={selected.tasks ?? []} onToggle={(taskId) => onUpdateSelected({
                  tasks: (selected.tasks ?? []).map((task: any) =>
                    task.id === taskId ? { ...task, done: !task.done } : task,
                  ),
                })} />
                <div className="rounded-[30px] border border-slate-200 bg-white/70 p-5 shadow-[0_20px_44px_rgba(15,23,42,0.06)] dark:border-white/10 dark:bg-white/6">
                  <div className="text-xs font-bold uppercase tracking-[0.22em] text-slate-400">Exception Desk</div>
                  <div className="mt-2 text-xl font-black text-slate-900 dark:text-white">异常与补救动作</div>
                  <div className="mt-4 grid gap-3 md:grid-cols-2">
                    {[
                      ["缺件", "已识别 2 项材料缺失，建议先按风险等级提醒。", "发送补件提醒"],
                      ["格式不符", "当前 PDF 命名和页数不统一。", "生成标准说明"],
                      ["审批阻塞", "学院签字仍未完成。", "生成催办说明"],
                      ["责任人", "需要同步提醒学生与学院联系人。", "指派负责人"],
                    ].map(([title, desc, cta]) => (
                      <div
                        key={title}
                        className="rounded-[22px] border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-slate-900/40"
                      >
                        <div className="text-sm font-bold text-slate-900 dark:text-white">{title}</div>
                        <div className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{desc}</div>
                        <Button
                          variant="secondary"
                          size="sm"
                          className="mt-3"
                          onClick={() => {
                            if (cta === "指派负责人") {
                              showToast(`${cta} 已执行`);
                              return;
                            }
                            runAIAction(`请围绕异常「${title}」生成处理动作：${cta}。异常描述：${desc}`);
                          }}
                        >
                          {cta}
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid gap-6 xl:grid-cols-[minmax(0,1.04fr)_minmax(320px,0.96fr)]">
                <ActionDock
                  actions={processAssistantQuickActions}
                  templates={[]}
                  onInsert={(content) =>
                    onUpdateSelected({
                      content: `${selected.content}\n\n${content}`.trim(),
                      updatedAt: Date.now(),
                    })
                  }
                  onRunAI={(prompt) => runAIAction(prompt)}
                />
                <div className="space-y-6">
                  <ResourceBoard resources={selected.resources ?? []} />
                  <div className="rounded-[30px] border border-slate-200 bg-white/70 p-5 shadow-[0_20px_44px_rgba(15,23,42,0.06)] dark:border-white/10 dark:bg-white/6">
                    <div className="text-xs font-bold uppercase tracking-[0.22em] text-slate-400">Ops Shortcuts</div>
                    <div className="mt-2 text-xl font-black text-slate-900 dark:text-white">快捷动作</div>
                    <div className="mt-4 grid gap-3">
                      {[
                        "为学院老师生成催办说明",
                        "为学生生成可执行补件清单",
                        "压缩成 3 行摘要发给负责人",
                      ].map((label) => (
                        <Button
                          key={label}
                          variant="secondary"
                          className="justify-start"
                          onClick={() => runAIAction(`请${label}，要求输出可直接发送或同步给相关责任人的文本。`)}
                        >
                          {label}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default MainPanel;
