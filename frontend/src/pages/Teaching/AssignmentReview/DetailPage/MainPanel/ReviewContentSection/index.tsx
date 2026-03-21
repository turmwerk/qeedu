import React, { useState } from "react";
import MarkdownEditor from "@/feature/MarkdownEditor";
import MarkdownView from "@/feature/MarkdownView";
import Button from "@/ui/Button";
import type { AssignmentReviewRecord, AssignmentReviewSubmission } from "../../../types";

type Props = {
  record: AssignmentReviewRecord;
  selectedSubmission?: AssignmentReviewSubmission;
  onAppendContent: (content: string, replace?: boolean) => void;
  onContentChange: (content: string) => void;
};

const ReviewContentSection: React.FC<Props> = ({
  record,
  selectedSubmission,
  onAppendContent,
  onContentChange,
}) => {
  const [showRaw, setShowRaw] = useState(true);

  return (
    <section className="rounded-[28px] border border-slate-200 bg-white/90 p-5 shadow-[0_20px_44px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-white/6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="text-xs font-bold uppercase tracking-[0.22em] text-slate-400">
            Review Content
          </div>
          <div className="mt-1 text-xl font-black text-slate-900 dark:text-white">
            批改内容区
          </div>
          <div className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
            左侧直接维护 rubric、评语草稿和回写内容，右侧对话用于补全与复核。
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            variant={showRaw ? "primary" : "secondary"}
            size="sm"
            onClick={() => setShowRaw(true)}
          >
            编辑 Markdown
          </Button>
          <Button
            variant={!showRaw ? "primary" : "secondary"}
            size="sm"
            onClick={() => setShowRaw(false)}
          >
            预览内容
          </Button>
        </div>
      </div>

      {selectedSubmission ? (
        <div className="mt-4 grid gap-3 lg:grid-cols-[0.9fr_0.9fr_1.2fr]">
          <div className="rounded-[22px] border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-slate-900/40">
            <div className="text-sm font-semibold text-slate-900 dark:text-white">
              当前学生
            </div>
            <div className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-300">
              <div>{selectedSubmission.studentName}</div>
              <div>分数：{selectedSubmission.score} 分</div>
            </div>
          </div>

          <div className="rounded-[22px] border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-slate-900/40">
            <div className="text-sm font-semibold text-slate-900 dark:text-white">
              回写状态
            </div>
            <div className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-300">
              <div>{selectedSubmission.status}</div>
              <div>建议先完成反馈复核再执行回写。</div>
            </div>
          </div>

          <div className="rounded-[22px] border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-slate-900/40">
            <div className="text-sm font-semibold text-slate-900 dark:text-white">
              快速批改动作
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {["人工复核", "统一语气", "补充建议"].map((label) => (
                <Button
                  key={label}
                  variant="secondary"
                  size="sm"
                  onClick={() =>
                    onAppendContent(
                      `- ${selectedSubmission.studentName}：${label} 已执行`,
                    )
                  }
                >
                  {label}
                </Button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-4 rounded-[22px] border border-dashed border-slate-300 bg-slate-50 p-5 text-sm text-slate-500 dark:border-white/10 dark:bg-slate-900/40 dark:text-slate-300">
          还没有选中的学生提交，先从上方队列进入一个具体提交。
        </div>
      )}

      <div className="mt-4 min-h-[440px] overflow-hidden rounded-[24px] border border-slate-200 bg-slate-50/90 p-3 dark:border-white/10 dark:bg-slate-900/40">
        <div className="relative min-h-[410px]">
          <div
            className={`absolute inset-0 transition-all duration-300 ease-out ${
              showRaw
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-4 pointer-events-none"
            }`}
          >
            <MarkdownEditor
              value={record.content}
              onChange={onContentChange}
              minimap={false}
              showHeader={false}
              className="h-full w-full rounded-[18px] border border-[var(--brand-border)]"
            />
          </div>
          <div
            className={`absolute inset-0 transition-all duration-300 ease-out ${
              !showRaw && record.content
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-4 pointer-events-none"
            }`}
          >
            <div className="h-full overflow-auto rounded-[18px] bg-white p-4 dark:bg-slate-950/40">
              <MarkdownView value={record.content} />
            </div>
          </div>
          <div
            className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${
              !showRaw && !record.content
                ? "opacity-100"
                : "opacity-0 pointer-events-none"
            }`}
          >
            <div className="text-slate-400">还没有批改正文内容</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReviewContentSection;
