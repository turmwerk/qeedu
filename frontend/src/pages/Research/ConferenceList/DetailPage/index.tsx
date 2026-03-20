import React from "react";
import type { ConferenceEntry } from "../data";

type Props = {
  conference: ConferenceEntry;
};

const priorityClassName: Record<ConferenceEntry["todos"][number]["priority"], string> = {
  高优先: "bg-[#fff1f2] text-[#ef4444] dark:bg-[#3d0a10] dark:text-[#fca5a5]",
  中优先: "bg-[#fff7ed] text-[#f59e0b] dark:bg-[#3b1d03] dark:text-[#fde68a]",
  低优先: "bg-[#eff6ff] text-[#3b82f6] dark:bg-[#0c1d3b] dark:text-[#bfdbfe]",
};

const DetailPage: React.FC<Props> = ({ conference }) => {
  const remainingCount = conference.progressTotal - conference.progressCompleted;

  return (
    <div className="flex h-full flex-col gap-5 p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-[13px] font-bold uppercase tracking-[0.18em] text-[#94a3b8]">
            投稿待办
          </div>
          <div className="mt-2 text-[22px] font-black text-[#243246] dark:text-white">
            {conference.name} 待办清单
          </div>
          <div className="mt-2 max-w-[620px] text-[15px] leading-7 text-[#67748a] dark:text-[#dbe5f3]">
            点击左侧某个会议后，右侧展示该会议的待办事项。这里把投稿 deadline、综述节奏与当前推进状态放在一起，方便快速切换优先级。
          </div>
        </div>
        <div className="rounded-[20px] border border-[#dbe1f3] bg-white px-4 py-3 text-sm font-semibold text-[#334155] dark:border-white/10 dark:bg-white/6 dark:text-white">
          会议详情
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-[minmax(0,1.2fr)_280px]">
        <div className="rounded-[28px] border border-[#dbe1f3] bg-white/86 p-5 dark:border-white/10 dark:bg-white/6">
          <div className="text-[20px] font-black text-[#243246] dark:text-white">{conference.name}</div>
          <div className="mt-3 space-y-2 text-[15px] leading-7 text-[#67748a] dark:text-[#dbe5f3]">
            <div>
              {conference.nextDeadlineLabel}截止 · {conference.nextDeadlineDisplay}
            </div>
            <div>全文截止 · {conference.paperDeadline.slice(5).replace("-", "/")}</div>
            <div>{conference.summary}</div>
          </div>
        </div>

        <div className="rounded-[28px] border border-[#dbe1f3] bg-white/86 p-5 dark:border-white/10 dark:bg-white/6">
          <div className="text-[34px] font-black leading-none text-[#243246] dark:text-white">
            {conference.progressCompleted} / {conference.progressTotal}
          </div>
          <div className="mt-3 text-[15px] leading-7 text-[#67748a] dark:text-[#dbe5f3]">
            已完成待办项 / 总待办项
          </div>
          <div className="text-[15px] leading-7 text-[#67748a] dark:text-[#dbe5f3]">
            剩余 {remainingCount} 项尚未处理
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {conference.todos.map((todo) => (
          <div
            key={todo.id}
            className="flex items-start justify-between gap-4 rounded-[26px] border border-[#dbe1f3] bg-white/86 px-5 py-5 dark:border-white/10 dark:bg-white/6"
          >
            <div className="flex items-start gap-4">
              <span
                className={`mt-1 h-7 w-7 rounded-full border ${
                  todo.done
                    ? "border-[#22c55e] bg-[#22c55e]"
                    : "border-[#cbd5e1] bg-transparent dark:border-white/20"
                }`}
              />
              <div>
                <div className="text-[17px] font-black text-[#243246] dark:text-white">
                  {todo.title}
                </div>
                <div className="mt-2 text-[15px] leading-7 text-[#67748a] dark:text-[#dbe5f3]">
                  {todo.detail}
                </div>
              </div>
            </div>
            <span
              className={`shrink-0 rounded-full px-3 py-1.5 text-sm font-semibold ${priorityClassName[todo.priority]}`}
            >
              {todo.priority}
            </span>
          </div>
        ))}
      </div>

      <div className="rounded-[28px] border border-[#dbe1f3] bg-white/86 p-5 dark:border-white/10 dark:bg-white/6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="text-[13px] font-bold uppercase tracking-[0.18em] text-[#94a3b8]">
              新增待办
            </div>
            <div className="mt-2 text-[20px] font-black text-[#243246] dark:text-white">
              新增待办事项
            </div>
          </div>
          <button className="rounded-[18px] bg-[var(--brand-blue)] px-5 py-3 text-sm font-semibold text-white">
            保存 Todo
          </button>
        </div>

        <div className="mt-5 grid gap-3 lg:grid-cols-[minmax(0,1fr)_180px_180px]">
          <input
            readOnly
            value={`Todo 标题，例如：完成${conference.reviewTask}`}
            className="rounded-[18px] border border-[#dbe1f3] bg-[#f8fafc] px-4 py-3 text-[15px] text-[#94a3b8] outline-none dark:border-white/10 dark:bg-white/6"
          />
          <input
            readOnly
            value="高优先"
            className="rounded-[18px] border border-[#dbe1f3] bg-[#f8fafc] px-4 py-3 text-[15px] text-[#475569] outline-none dark:border-white/10 dark:bg-white/6 dark:text-[#dbe5f3]"
          />
          <input
            readOnly
            value={`截止日期 ${conference.nextDeadlineDisplay}`}
            className="rounded-[18px] border border-[#dbe1f3] bg-[#f8fafc] px-4 py-3 text-[15px] text-[#475569] outline-none dark:border-white/10 dark:bg-white/6 dark:text-[#dbe5f3]"
          />
        </div>

        <textarea
          readOnly
          value={`补充说明：${conference.note} 当前综述任务“${conference.reviewTask}”还剩 ${conference.reviewCountdownDays} 天。`}
          className="mt-3 min-h-[112px] w-full rounded-[22px] border border-[#dbe1f3] bg-[#f8fafc] px-4 py-4 text-[15px] leading-7 text-[#67748a] outline-none dark:border-white/10 dark:bg-white/6 dark:text-[#dbe5f3]"
        />
      </div>
    </div>
  );
};

export default DetailPage;
