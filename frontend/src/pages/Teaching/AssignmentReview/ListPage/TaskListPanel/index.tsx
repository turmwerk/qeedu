import React from "react";
import List from "@/ui/List";
import PageHeader from "@/ui/PageHeader";
import SearchBar from "@/ui/SearchBar";
import { statusClassMap } from "../constants";
import type { AssignmentReviewListPageProps } from "../types";
import { formatUpdatedAt } from "../utils";

type TaskListPanelProps = Pick<
  AssignmentReviewListPageProps,
  | "records"
  | "hasRecords"
  | "keyword"
  | "onKeywordChange"
  | "onOpenRecord"
  | "onDuplicateRecord"
  | "onDeleteRecord"
>;

const TaskListPanel: React.FC<TaskListPanelProps> = ({
  records,
  hasRecords,
  keyword,
  onKeywordChange,
  onOpenRecord,
  onDuplicateRecord,
  onDeleteRecord,
}) => {
  return (
    <div className="flex h-full min-h-0 flex-col rounded-[28px] border border-slate-200 bg-white/90 p-5 shadow-[0_18px_40px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-white/6">
      <PageHeader
        title={<span className="text-xl font-black text-slate-900 dark:text-white">批改任务列表</span>}
        subtitle="先在首页筛选任务，再进入对应的具体批改工作区。"
      />
      <div className="mb-4 shrink-0">
        <SearchBar
          value={keyword}
          onChange={onKeywordChange}
          placeholder="搜索课程、任务、标签或状态"
        />
      </div>
      <List
        className="flex-1 min-h-0 !max-h-none"
        items={records}
        keyExtractor={(item) => item.id}
        onItemClick={(item) => onOpenRecord(item.id)}
        emptyText={
          hasRecords ? "没有找到匹配的批改任务。" : "还没有批改任务，先创建一条记录。"
        }
        renderItem={(item) => (
          <div className="space-y-3">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="text-sm font-black text-slate-900 dark:text-white">
                  {item.title}
                </div>
                <div className="mt-1 text-xs text-slate-500 dark:text-slate-300">
                  {item.subtitle || "待补充课程与提交信息"}
                </div>
              </div>
              <span
                className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                  statusClassMap[item.status ?? ""] ?? "bg-slate-100 text-slate-700"
                }`}
              >
                {item.status ?? "未标记"}
              </span>
            </div>

            <div className="text-sm leading-6 text-slate-600 dark:text-slate-300">
              {item.summary || "等待补充本次作业的批改目标、关注点和反馈策略。"}
            </div>

            <div className="flex flex-wrap gap-2">
              {(item.tags ?? []).map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600 dark:bg-white/10 dark:text-slate-200"
                >
                  {tag}
                </span>
              ))}
              <span className="rounded-full bg-sky-50 px-2.5 py-1 text-xs font-semibold text-sky-700">
                {(item.submissions ?? []).length} 份提交
              </span>
              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-500 dark:bg-white/10 dark:text-slate-300">
                {formatUpdatedAt(item.updatedAt)}
              </span>
            </div>
          </div>
        )}
        actions={[
          {
            label: "进入批改",
            onClick: (item) => onOpenRecord(item.id),
          },
          {
            label: "复制",
            onClick: (item) => onDuplicateRecord(item.id),
          },
          {
            label: "删除",
            onClick: (item) => onDeleteRecord(item.id),
            className:
              "rounded-lg border border-rose-200 bg-rose-50 px-2.5 py-1.5 text-sm font-semibold text-rose-600 hover:bg-rose-100 dark:border-rose-400/20 dark:bg-rose-500/10 dark:text-rose-200",
          },
        ]}
      />
    </div>
  );
};

export default TaskListPanel;
