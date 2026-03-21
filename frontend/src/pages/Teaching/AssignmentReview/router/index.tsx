import React, { useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import FeatureRecordDialog from "@/feature/FeatureRecordDialog";
import type { WorkspaceMetric, WorkspaceTask } from "@/feature/RecordWorkspace/types";
import { useFeatureRecords } from "@/hooks/useFeatureRecords";
import { assignmentReviewAdapter } from "@/pages/Teaching/featureAdapters";
import { assignmentReviewPageData } from "@/pages/Teaching/featureData";
import ConfirmDialog from "@/ui/ConfirmDialog";
import Button from "@/ui/Button";
import { showToast } from "@/ui/Toast";
import ListPage from "../ListPage";
import DetailPage from "../DetailPage";
import type { AssignmentReviewRecord } from "../types";

type PriorityItem = {
  id: string;
  title: string;
  detail: string;
  priority?: WorkspaceTask["priority"];
};

const priorityOrder: Record<NonNullable<WorkspaceTask["priority"]>, number> = {
  high: 0,
  medium: 1,
  low: 2,
};

const buildMetrics = (records: AssignmentReviewRecord[]): WorkspaceMetric[] => {
  const submissionStats = records.reduce(
    (summary, record) => {
      (record.submissions ?? []).forEach((submission) => {
        summary.total += 1;
        if (submission.status === "已完成") summary.completed += 1;
        else summary.pending += 1;
      });
      return summary;
    },
    { total: 0, pending: 0, completed: 0 },
  );

  return [
    {
      label: "批改任务",
      value: String(records.length),
      description: records.length ? "当前工作区中的作业任务总数" : "还没有创建批改任务",
      tone: "orange",
    },
    {
      label: "待处理提交",
      value: String(submissionStats.pending),
      description: submissionStats.total
        ? `共 ${submissionStats.total} 份提交，仍需继续批改或回写`
        : "等待导入学生提交",
      tone: "blue",
    },
    {
      label: "已完成回写",
      value: String(submissionStats.completed),
      description: submissionStats.completed
        ? "已完成反馈回写的学生提交数量"
        : "当前还没有已完成回写的提交",
      tone: "green",
    },
  ];
};

const buildQueueSummary = (records: AssignmentReviewRecord[]) => {
  const pendingTasks = records.filter((record) => record.status === "待批改").length;
  const reviewingSubmissions = records.reduce(
    (count, record) =>
      count +
      (record.submissions ?? []).filter((submission) => submission.status === "复核中")
        .length,
    0,
  );
  const waitingWriteback = records.reduce(
    (count, record) =>
      count +
      (record.submissions ?? []).filter((submission) => submission.status === "待回写")
        .length,
    0,
  );

  return [
    {
      label: "待批改任务",
      value: String(pendingTasks),
      hint: pendingTasks ? "优先进入尚未开始的作业任务" : "当前没有待开始任务",
      tone: "orange" as const,
    },
    {
      label: "复核中提交",
      value: String(reviewingSubmissions),
      hint: reviewingSubmissions ? "建议优先统一语气与扣分口径" : "当前没有复核中的提交",
      tone: "blue" as const,
    },
    {
      label: "待回写提交",
      value: String(waitingWriteback),
      hint: waitingWriteback ? "尽快回写学生端并关闭任务" : "当前没有待回写提交",
      tone: "green" as const,
    },
  ];
};

const buildPriorityItems = (records: AssignmentReviewRecord[]): PriorityItem[] =>
  records
    .flatMap((record) =>
      (record.tasks ?? [])
        .filter((task) => !task.done)
        .map((task) => ({
          id: `${record.id}-${task.id}`,
          title: task.title,
          detail: `${record.title} · ${task.detail ?? "等待推进具体批改动作"}`,
          priority: task.priority,
          updatedAt: record.updatedAt,
        })),
    )
    .sort((left, right) => {
      const leftPriority = left.priority ? priorityOrder[left.priority] : 99;
      const rightPriority = right.priority ? priorityOrder[right.priority] : 99;
      if (leftPriority !== rightPriority) return leftPriority - rightPriority;
      return right.updatedAt - left.updatedAt;
    })
    .slice(0, 4)
    .map(({ updatedAt: _updatedAt, ...item }) => item);

export const ListRoute: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { records, createRecord, removeRecord, duplicateRecord } =
    useFeatureRecords(assignmentReviewAdapter);
  const [keyword, setKeyword] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const createOpen = location.pathname.endsWith("/new");
  const filteredRecords = useMemo(() => {
    const lowered = keyword.trim().toLowerCase();
    if (!lowered) return records;
    return records.filter((item) =>
      [item.title, item.subtitle, item.summary, item.status, ...(item.tags ?? [])]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(lowered),
    );
  }, [keyword, records]);

  const handleCreate = (values: Record<string, unknown>) => {
    const created = createRecord(values);
    navigate(`/teaching/assignment-review/tasks/${created.id}`);
    showToast("已创建新的批改任务");
  };

  const handleOpenRecord = (id: string) => {
    navigate(`/teaching/assignment-review/tasks/${id}`);
  };

  const handleDuplicate = (id: string) => {
    const duplicated = duplicateRecord(id);
    if (!duplicated) return;
    showToast("已复制任务");
    handleOpenRecord(duplicated.id);
  };

  const handleDelete = () => {
    if (!deleteId) return;
    removeRecord(deleteId);
    setDeleteId(null);
    showToast("已删除批改任务");
  };

  return (
    <>
      <ListPage
        records={filteredRecords}
        hasRecords={records.length > 0}
        keyword={keyword}
        metrics={buildMetrics(records)}
        queueSummary={buildQueueSummary(records)}
        priorityItems={buildPriorityItems(records)}
        onKeywordChange={setKeyword}
        onOpenRecord={handleOpenRecord}
        onOpenLatest={() => {
          const latest = records[0];
          if (latest) handleOpenRecord(latest.id);
        }}
        onOpenCreate={() => navigate("/teaching/assignment-review/tasks/new")}
        onDuplicateRecord={handleDuplicate}
        onDeleteRecord={setDeleteId}
      />

      <FeatureRecordDialog
        open={createOpen}
        title="新建批改任务"
        fields={assignmentReviewPageData.createFields}
        onClose={() => navigate("/teaching/assignment-review")}
        onSubmit={handleCreate}
        submitText="创建并进入工作室"
      />

      <ConfirmDialog
        open={!!deleteId}
        title="删除批改任务"
        description="删除后本地记录会移除，但不会影响已完成的教学内容。"
        danger
        onCancel={() => setDeleteId(null)}
        onConfirm={handleDelete}
      />
    </>
  );
};

export const DetailRoute: React.FC = () => {
  const navigate = useNavigate();
  const { assignmentId, submissionId } = useParams();
  const { records, patchRecord } = useFeatureRecords(assignmentReviewAdapter);

  const selectedRecord =
    records.find((item) => item.id === assignmentId) ?? null;
  const selectedSubmission =
    selectedRecord?.submissions?.find((item) => item.id === submissionId) ??
    selectedRecord?.submissions?.[0];

  if (!selectedRecord) {
    return (
      <div className="flex w-full min-w-0 flex-col gap-6 px-4 py-6 md:px-6 xl:px-8">
        <div className="rounded-[28px] border border-dashed border-slate-300 bg-white/70 p-10 text-center text-slate-500 dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
          <div>没有找到对应的批改任务，可能已被删除或尚未创建。</div>
          <div className="mt-4 flex justify-center">
            <Button variant="primary" onClick={() => navigate("/teaching/assignment-review")}>
              返回任务概览
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const updateSelected = (patch: Partial<AssignmentReviewRecord> & Record<string, unknown>) => {
    patchRecord(selectedRecord.id, patch);
  };

  const handleAppendContent = (content: string, replace = false) => {
    updateSelected({
      content: replace
        ? content
        : `${selectedRecord.content ?? ""}\n\n${content}`.trim(),
    });
    showToast(replace ? "已替换当前工作区内容" : "已追加到当前工作区");
  };

  const handleToggleTask = (taskId: string) => {
    if (!selectedRecord.tasks?.length) return;
    updateSelected({
      tasks: selectedRecord.tasks.map((task) =>
        task.id === taskId ? { ...task, done: !task.done } : task,
      ),
    });
  };

  const handleGenerateFeedback = () => {
    const studentLabel = selectedSubmission?.studentName ?? "当前学生";
    updateSelected({
      content: `${selectedRecord.content}\n\n## ${studentLabel} 反馈草稿\n- 先肯定功能完成度\n- 再指出结构与测试问题\n- 最后给出下次提交建议`.trim(),
    });
    showToast("已生成反馈草稿");
  };

  const handleWriteback = () => {
    if (!selectedSubmission || !selectedRecord.submissions?.length) return;
    updateSelected({
      submissions: selectedRecord.submissions.map((item) =>
        item.id === selectedSubmission.id ? { ...item, status: "已完成" } : item,
      ),
    });
    showToast(`已回写 ${selectedSubmission.studentName} 的反馈`);
  };

  return (
    <DetailPage
      record={selectedRecord}
      selectedSubmission={selectedSubmission}
      onBack={() => navigate("/teaching/assignment-review")}
      onSelectSubmission={(nextSubmissionId) =>
        navigate(
          `/teaching/assignment-review/tasks/${selectedRecord.id}/submissions/${nextSubmissionId}`,
        )
      }
      onToggleTask={handleToggleTask}
      onGenerateFeedback={handleGenerateFeedback}
      onWriteback={handleWriteback}
      onExportRubric={() => showToast("Rubric 已导出")}
      onAppendContent={handleAppendContent}
      onContentChange={(content) => updateSelected({ content })}
      onUploadFolder={(files) => {
        showToast(`已选择 ${files.length} 个文件，后续可接入批量导入流程`);
      }}
    />
  );
};
