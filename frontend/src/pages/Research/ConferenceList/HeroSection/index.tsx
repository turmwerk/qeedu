import React from "react";
import type { ConferenceEntry } from "../data";

type Props = {
  embedded?: boolean;
  selectedConference: ConferenceEntry | null;
};

const HeroSection: React.FC<Props> = ({ embedded = false, selectedConference }) => (
  <section
    className={`rounded-[34px] border border-slate-200 bg-[linear-gradient(135deg,#fdf2f8_0%,#eef2ff_42%,#ecfeff_100%)] shadow-[0_24px_54px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-[linear-gradient(135deg,rgba(76,29,149,0.24)_0%,rgba(15,23,42,0.92)_100%)] ${
      embedded ? "px-4 py-4 md:px-5 md:py-4" : "px-5 py-4 md:px-6 md:py-5"
    }`}
  >
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div className="max-w-3xl">
        <div className="text-xs font-bold uppercase tracking-[0.24em] text-slate-400">
          Conference Workbench
        </div>
        <div className="mt-2 text-3xl font-black leading-tight text-slate-900 dark:text-white">
          {embedded ? "近期会议与投稿策略" : "会议列表与投稿工作台"}
        </div>
        <div className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
          把会议筛选、当前会议待办、综述节奏和投稿策略对话放进同一个工作台里，减少来回跳转。
        </div>
      </div>
      {selectedConference ? (
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            ["当前会议", selectedConference.name],
            [`${selectedConference.nextDeadlineLabel}截止`, selectedConference.nextDeadlineDisplay],
            ["剩余待办", `${selectedConference.progressTotal - selectedConference.progressCompleted} 项`],
          ].map(([label, value]) => (
            <div
              key={label}
              className="rounded-[22px] border border-white/70 bg-white/80 px-4 py-3 dark:border-white/10 dark:bg-white/5"
            >
              <div className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">{label}</div>
              <div className="mt-1 text-lg font-black text-slate-900 dark:text-white">{value}</div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  </section>
);

export default HeroSection;
