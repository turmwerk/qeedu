import React, { useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import ChatDialog from "@/feature/ChatDialog";
import FeatureRecordDialog from "@/feature/FeatureRecordDialog";
import ActionDock from "@/feature/RecordWorkspace/ActionDock";
import ChecklistBoard from "@/feature/RecordWorkspace/ChecklistBoard";
import OverviewMetrics from "@/feature/RecordWorkspace/OverviewMetrics";
import ResourceBoard from "@/feature/RecordWorkspace/ResourceBoard";
import TemplateWorkbench from "@/feature/RecordWorkspace/TemplateWorkbench";
import { useFeatureRecords } from "@/hooks/useFeatureRecords";
import { assignmentReviewAdapter } from "@/pages/Teaching/featureAdapters";
import {
  assignmentReviewPageData,
  assignmentReviewQuickActions,
} from "@/pages/Teaching/featureData";
import SplitSiderLayout from "@/layouts/SplitSiderLayout";
import Button from "@/ui/Button";
import ConfirmDialog from "@/ui/ConfirmDialog";
import List from "@/ui/List";
import PageHeader from "@/ui/PageHeader";
import SearchBar from "@/ui/SearchBar";
import { showToast } from "@/ui/Toast";

const AssignmentReview: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { assignmentId, submissionId } = useParams();
  const { records, createRecord, patchRecord, removeRecord, duplicateRecord } =
    useFeatureRecords(assignmentReviewAdapter);
  const [keyword, setKeyword] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const createOpen = location.pathname.endsWith("/new");
  const filteredRecords = useMemo(() => {
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

  const selectedRecord =
    records.find((item) => item.id === assignmentId) ?? filteredRecords[0] ?? records[0] ?? null;
  const selectedSubmission =
    selectedRecord?.submissions?.find((item: any) => item.id === submissionId) ??
    selectedRecord?.submissions?.[0];

  const metricCards = assignmentReviewPageData.metrics.map((item, index) => ({
    label: item.label,
    value: item.value,
    description: item.detail,
    tone: (index === 0 ? "orange" : index === 2 ? "green" : "blue") as
      | "blue"
      | "green"
      | "orange",
  }));

  const openRecord = (id: string) => {
    navigate(`/teaching/assignment-review/tasks/${id}`);
  };

  const updateSelected = (patch: Record<string, unknown>) => {
    if (!selectedRecord) return;
    patchRecord(selectedRecord.id, patch);
  };

  const appendContent = (content: string, replace = false) => {
    if (!selectedRecord) return;
    updateSelected({
      content: replace
        ? content
        : `${selectedRecord.content ?? ""}\n\n${content}`.trim(),
      updatedAt: Date.now(),
    });
    showToast(replace ? "已替换当前工作区内容" : "已追加到当前工作区");
  };

  const toggleTask = (taskId: string) => {
    if (!selectedRecord?.tasks) return;
    updateSelected({
      tasks: selectedRecord.tasks.map((task: any) =>
        task.id === taskId ? { ...task, done: !task.done } : task,
      ),
    });
  };

  const handleCreate = (values: Record<string, unknown>) => {
    const created = createRecord(values);
    navigate(`/teaching/assignment-review/tasks/${created.id}`);
    showToast("已创建新的批改任务");
  };

  const handleGenerateFeedback = () => {
    if (!selectedRecord) return;
    const studentLabel = selectedSubmission?.studentName ?? "当前学生";
    updateSelected({
      content: `${selectedRecord.content}\n\n## ${studentLabel} 反馈草稿\n- 先肯定功能完成度\n- 再指出结构与测试问题\n- 最后给出下次提交建议`,
      updatedAt: Date.now(),
    });
    showToast("已生成反馈草稿");
  };

  const handleWriteback = () => {
    if (!selectedRecord || !selectedSubmission) return;
    updateSelected({
      submissions: selectedRecord.submissions.map((item: any) =>
        item.id === selectedSubmission.id ? { ...item, status: "已完成" } : item,
      ),
      status: "待回写",
      updatedAt: Date.now(),
    });
    showToast(`已回写 ${selectedSubmission.studentName} 的反馈`);
  };

  return (
    <div className="flex w-full min-w-0 flex-col gap-6 px-4 py-6 md:px-6 xl:px-8">
      <section className="rounded-[32px] border border-slate-200 bg-[linear-gradient(135deg,#f8fbff_0%,#eef4ff_52%,#fff7ed_100%)] p-6 shadow-[0_22px_48px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-[linear-gradient(135deg,rgba(30,41,59,0.9)_0%,rgba(30,64,175,0.24)_100%)]">
        <PageHeader
          title={
            <span className="text-3xl font-black text-slate-900 dark:text-white">
              {assignmentReviewPageData.headline}
            </span>
          }
          subtitle={
            <span className="text-sm text-slate-600 dark:text-slate-300">
              {assignmentReviewPageData.subtitle}
            </span>
          }
          className="mb-0"
        >
          <Button
            variant="secondary"
            onClick={() => navigate("/teaching/assignment-review/tasks")}
          >
            任务队列
          </Button>
          <Button
            variant="primary"
            onClick={() => navigate("/teaching/assignment-review/tasks/new")}
          >
            新建批改任务
          </Button>
        </PageHeader>
        <div className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300">
          {assignmentReviewPageData.description}
        </div>
      </section>

      <section className="rounded-[28px] border border-slate-200 bg-white/80 p-5 shadow-[0_18px_45px_rgba(15,23,42,0.08)] backdrop-blur-xl dark:border-white/10 dark:bg-white/5">
        <OverviewMetrics metrics={metricCards} />
      </section>

      <SplitSiderLayout
        initialSplit={38}
        leftClassName="min-w-0 pr-4"
        rightClassName="min-w-0 pl-4"
        left={
          <div className="space-y-5">
            <div className="rounded-[28px] border border-slate-200 bg-white/85 p-5 shadow-[0_18px_40px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-white/6">
              <PageHeader
                title={<span className="text-xl font-black text-slate-900 dark:text-white">任务与提交队列</span>}
                subtitle="筛选批改任务，直接进入具体提交。"
              />
              <div className="mb-4">
                <SearchBar
                  value={keyword}
                  onChange={setKeyword}
                  placeholder="搜索课程、任务或状态"
                />
              </div>
              <List
                items={filteredRecords}
                keyExtractor={(item) => item.id}
                onItemClick={(item) => openRecord(item.id)}
                renderItem={(item) => (
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="text-sm font-bold text-slate-900 dark:text-white">
                        {item.title}
                      </div>
                      <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-700 dark:bg-amber-500/15 dark:text-amber-200">
                        {item.status}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-300">
                      {item.subtitle}
                    </div>
                    <div className="text-sm leading-6 text-slate-600 dark:text-slate-300">
                      {item.summary}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {item.tags?.map((tag: string) => (
                        <span
                          key={tag}
                          className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600 dark:bg-white/10 dark:text-slate-200"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                actions={[
                  {
                    label: "打开",
                    onClick: (item) => openRecord(item.id),
                  },
                  {
                    label: "复制",
                    onClick: (item) => {
                      const duplicated = duplicateRecord(item.id);
                      if (duplicated) {
                        showToast("已复制任务");
                        openRecord(duplicated.id);
                      }
                    },
                  },
                  {
                    label: "删除",
                    onClick: (item) => setDeleteId(item.id),
                    className:
                      "rounded-lg border border-rose-200 bg-rose-50 px-2.5 py-1.5 text-sm font-semibold text-rose-600 hover:bg-rose-100 dark:border-rose-400/20 dark:bg-rose-500/10 dark:text-rose-200",
                  },
                ]}
              />
            </div>

            {selectedRecord ? (
              <div className="rounded-[28px] border border-slate-200 bg-slate-950 p-5 text-white shadow-[0_20px_48px_rgba(15,23,42,0.24)]">
                <div className="text-xs font-bold uppercase tracking-[0.24em] text-cyan-200/80">
                  Submission Queue
                </div>
                <div className="mt-3 space-y-3">
                  {selectedRecord.submissions?.map((item: any) => {
                    const active = item.id === selectedSubmission?.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() =>
                          navigate(
                            `/teaching/assignment-review/tasks/${selectedRecord.id}/submissions/${item.id}`,
                          )
                        }
                        className={`w-full rounded-2xl border px-4 py-3 text-left transition ${
                          active
                            ? "border-cyan-300 bg-cyan-400/15"
                            : "border-white/10 bg-white/5 hover:border-cyan-200/60 hover:bg-white/10"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <span className="font-semibold">{item.studentName}</span>
                          <span className="text-xs text-cyan-100/80">{item.score} 分</span>
                        </div>
                        <div className="mt-1 text-sm text-slate-300">{item.status}</div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : null}
          </div>
        }
        right={
          <div className="space-y-5">
            {selectedRecord ? (
              <section className="grid gap-5 2xl:grid-cols-[minmax(0,1.15fr)_360px]">
                <div className="space-y-5">
                  <div className="rounded-[28px] border border-slate-200 bg-white/90 p-5 shadow-[0_20px_44px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-white/6">
                    <PageHeader
                      title={
                        <span className="text-xl font-black text-slate-900 dark:text-white">
                          {selectedRecord.title}
                        </span>
                      }
                      subtitle={selectedRecord.subtitle}
                    >
                      <Button variant="secondary" onClick={handleGenerateFeedback}>
                        生成反馈
                      </Button>
                      <Button variant="secondary" onClick={() => showToast("Rubric 已导出")}>
                        导出 Rubric
                      </Button>
                      <Button variant="primary" onClick={handleWriteback}>
                        回写学生端
                      </Button>
                    </PageHeader>
                    <div className="mt-4 rounded-[24px] bg-slate-50 p-4 text-sm leading-7 text-slate-700 dark:bg-slate-900/50 dark:text-slate-200">
                      {selectedRecord.content}
                    </div>
                  </div>

                  <div className="grid gap-5 xl:grid-cols-[0.92fr_1.08fr]">
                    <ChecklistBoard
                      tasks={(selectedRecord.tasks ?? []).map((task: any) => ({
                        ...task,
                        owner: task.owner ?? "课程助教",
                      }))}
                      onToggle={toggleTask}
                    />
                    <div className="rounded-[28px] border border-slate-200 bg-white/90 p-5 shadow-[0_18px_42px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-white/6">
                      <div className="mb-4 flex items-center justify-between gap-3">
                        <div>
                          <div className="text-xs font-bold uppercase tracking-[0.22em] text-slate-400">
                            Review Notes
                          </div>
                          <div className="mt-1 text-lg font-black text-slate-900 dark:text-white">
                            当前提交与反馈编辑
                          </div>
                        </div>
                        {selectedSubmission ? (
                          <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-500/15 dark:text-blue-200">
                            {selectedSubmission.studentName}
                          </span>
                        ) : null}
                      </div>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="rounded-[22px] border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-slate-900/40">
                          <div className="text-sm font-semibold text-slate-900 dark:text-white">
                            当前分数与状态
                          </div>
                          <div className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-300">
                            <div>分数：{selectedSubmission?.score ?? "--"} 分</div>
                            <div>回写状态：{selectedSubmission?.status ?? "未开始"}</div>
                          </div>
                        </div>
                        <div className="rounded-[22px] border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-slate-900/40">
                          <div className="text-sm font-semibold text-slate-900 dark:text-white">
                            批改动作
                          </div>
                          <div className="mt-3 flex flex-wrap gap-2">
                            {["人工复核", "统一语气", "添加建议"].map((label) => (
                              <Button
                                key={label}
                                variant="secondary"
                                size="sm"
                                onClick={() => {
                                  appendContent(`- ${label} 已执行`);
                                  showToast(`${label} 已记录`);
                                }}
                              >
                                {label}
                              </Button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-5">
                  <TemplateWorkbench
                    templates={selectedRecord.templates ?? []}
                    onInsert={appendContent}
                  />
                  <ActionDock
                    actions={assignmentReviewQuickActions}
                    templates={selectedRecord.templates ?? []}
                    onInsert={appendContent}
                  />
                  <ResourceBoard resources={selectedRecord.resources ?? []} />
                  <div className="rounded-[28px] border border-slate-200 bg-white/90 p-4 shadow-[0_18px_44px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-white/6">
                    <ChatDialog
                      dialogId={`assignment-review-${selectedRecord.id}-${selectedSubmission?.id ?? "main"}`}
                      botName="批改协同助手"
                      initMessage="我已经读取当前批改任务和提交上下文，可以继续生成反馈、复核 rubric 或整理回写建议。"
                      transport={assignmentReviewAdapter.createChatTransport(
                        `${selectedRecord.title}${selectedSubmission ? ` / ${selectedSubmission.studentName}` : ""}`,
                      )}
                    />
                  </div>
                </div>
              </section>
            ) : (
              <div className="rounded-[28px] border border-dashed border-slate-300 bg-white/70 p-10 text-center text-slate-500 dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
                还没有批改任务，先新建一条记录。
              </div>
            )}
          </div>
        }
      />

      <FeatureRecordDialog
        open={createOpen}
        title="新建批改任务"
        fields={assignmentReviewPageData.createFields}
        onClose={() => navigate("/teaching/assignment-review/tasks")}
        onSubmit={handleCreate}
        submitText="创建并进入工作室"
      />

      <ConfirmDialog
        open={!!deleteId}
        title="删除批改任务"
        description="删除后本地记录会移除，但不会影响已完成的教学内容。"
        danger
        onCancel={() => setDeleteId(null)}
        onConfirm={() => {
          if (deleteId) {
            removeRecord(deleteId);
            if (assignmentId === deleteId) {
              navigate("/teaching/assignment-review/tasks");
            }
            showToast("已删除批改任务");
          }
          setDeleteId(null);
        }}
      />
    </div>
  );
};

export default AssignmentReview;
