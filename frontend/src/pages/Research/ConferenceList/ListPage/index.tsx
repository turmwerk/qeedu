import React, { useMemo, useState } from "react";
import Button from "@/ui/Button";
import { SearchOutlinedIcon } from "@/ui/Icon";
import type { ConferenceEntry } from "../data";

type Props = {
  conferences: ConferenceEntry[];
  selectedConferenceId: string;
  onSelectConference: (conferenceId: string) => void;
};

const priorityFilters = [
  { key: "all", label: "全部" },
  { key: "HCI", label: "HCI" },
  { key: "AI / NLP", label: "AI / NLP" },
  { key: "Systems", label: "Systems" },
];

const ListPage: React.FC<Props> = ({
  conferences,
  selectedConferenceId,
  onSelectConference,
}) => {
  const [keyword, setKeyword] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  const filteredConferences = useMemo(() => {
    const normalizedKeyword = keyword.trim().toLowerCase();
    return conferences.filter((conference) => {
      const matchesFilter =
        activeFilter === "all" ||
        conference.field === activeFilter ||
        conference.tags.includes(activeFilter);
      const matchesKeyword =
        !normalizedKeyword ||
        conference.name.toLowerCase().includes(normalizedKeyword) ||
        conference.fullName.toLowerCase().includes(normalizedKeyword) ||
        conference.tags.some((tag) => tag.toLowerCase().includes(normalizedKeyword));
      return matchesFilter && matchesKeyword;
    });
  }, [activeFilter, conferences, keyword]);

  return (
    <div className="flex h-full flex-col gap-5 p-5">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <div className="text-[13px] font-bold uppercase tracking-[0.18em] text-[#94a3b8]">
                会议清单
              </div>
              <div className="mt-2 text-[22px] font-black text-[#243246] dark:text-white">
                近期投稿会议
              </div>
              <div className="mt-2 max-w-[620px] text-[15px] leading-7 text-[#67748a] dark:text-[#dbe5f3]">
                上方提供搜索与筛选，列表按截止时间从近到远排序。每个会议都可以一键加入提醒，并在右侧查看投稿待办。
              </div>
            </div>
          <Button className="rounded-full border border-[#dbe1f3] bg-white px-4 py-3 text-sm font-semibold text-[#334155] dark:border-white/10 dark:bg-white/6 dark:text-white">
            按截止时间排序
          </Button>
        </div>

        <div className="flex gap-3">
          <div className="flex min-w-0 flex-1 items-center gap-3 rounded-[24px] border border-[#dbe1f3] bg-white px-5 py-4 dark:border-white/10 dark:bg-white/6">
            <SearchOutlinedIcon className="text-[#94a3b8]" />
            <input
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
              placeholder="搜索会议名称、领域或简称，例如 CHI / UIST / ACL"
              className="w-full bg-transparent text-[15px] text-[#243246] outline-none placeholder:text-[#94a3b8] dark:text-white"
            />
          </div>
          <Button className="rounded-[20px] bg-[var(--brand-blue)] px-6 py-4 text-sm font-semibold text-white">
            搜索
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          {priorityFilters.map((filter) => {
            const active = activeFilter === filter.key;
            return (
              <button
                key={filter.key}
                type="button"
                onClick={() => setActiveFilter(filter.key)}
                className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                  active
                    ? "border-[#c7d2fe] bg-[#eef2ff] text-[#4f46e5] dark:border-white/10 dark:bg-white/10 dark:text-white"
                    : "border-[#dbe1f3] bg-white text-[#667085] dark:border-white/10 dark:bg-white/6 dark:text-[#dbe5f3]"
                }`}
              >
                {filter.label}
              </button>
            );
          })}
        </div>

        <div className="flex items-center justify-between gap-3 text-[14px] text-[#6b7280] dark:text-[#dbe5f3]">
          <span>共 {filteredConferences.length} 个结果，最近截止在前</span>
          <span>支持点击会议卡片查看详情与待办</span>
        </div>
      </div>

      <div className="space-y-4">
        {filteredConferences.map((conference) => {
          const selected = conference.id === selectedConferenceId;
          return (
            <button
              key={conference.id}
              type="button"
              onClick={() => onSelectConference(conference.id)}
              className={`w-full rounded-[28px] border px-5 py-5 text-left transition ${
                selected
                  ? "border-[#c7d2fe] bg-[#f8faff] shadow-[0_20px_40px_rgba(99,102,241,0.12)] dark:border-white/10 dark:bg-white/8"
                  : "border-[#dbe1f3] bg-white/86 hover:border-[#c7d2fe] hover:bg-[#fbfcff] dark:border-white/10 dark:bg-white/6"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="text-[18px] font-black text-[#243246] dark:text-white">
                    {conference.name}
                  </div>
                  <div className="mt-2 text-[15px] leading-7 text-[#67748a] dark:text-[#dbe5f3]">
                    {conference.fullName}
                  </div>
                  <div className="text-[15px] text-[#67748a] dark:text-[#dbe5f3]">
                    {conference.ccf} · {conference.field} · {conference.tags.join(" / ")}
                  </div>
                </div>
                <div className="rounded-full bg-[#eef2ff] px-4 py-2 text-[15px] font-bold text-[#4f46e5] dark:bg-white/10 dark:text-[#c7d2fe]">
                  {conference.nextDeadlineDays} 天
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {conference.abstractDeadline ? (
                  <span className="rounded-full border border-[#dbe1f3] px-3 py-1.5 text-[13px] font-medium text-[#667085] dark:border-white/10 dark:text-[#dbe5f3]">
                    摘要 · {conference.nextDeadlineLabel === "摘要" ? conference.nextDeadlineDisplay : conference.abstractDeadline.slice(5).replace("-", "/")}
                  </span>
                ) : null}
                <span className="rounded-full border border-[#dbe1f3] px-3 py-1.5 text-[13px] font-medium text-[#667085] dark:border-white/10 dark:text-[#dbe5f3]">
                  全文 · {conference.paperDeadline.slice(5).replace("-", "/")}
                </span>
                {conference.tags.map((tag) => (
                  <span
                    key={`${conference.id}-${tag}`}
                    className="rounded-full border border-[#dbe1f3] px-3 py-1.5 text-[13px] font-medium text-[#667085] dark:border-white/10 dark:text-[#dbe5f3]"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="mt-5 flex items-center justify-between gap-4">
                <div className="text-[15px] font-semibold text-[#243246] dark:text-white">
                  {conference.note}
                </div>
                <span
                  className={`rounded-[18px] px-4 py-3 text-sm font-semibold ${
                    conference.reminderActive
                      ? "bg-[#dcfce7] text-[#059669] dark:bg-[#052e24] dark:text-[#bbf7d0]"
                      : "border border-[#dbe1f3] bg-white text-[#334155] dark:border-white/10 dark:bg-white/6 dark:text-white"
                  }`}
                >
                  {conference.reminderStatus}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ListPage;
