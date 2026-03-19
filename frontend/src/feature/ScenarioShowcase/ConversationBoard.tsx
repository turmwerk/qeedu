import React from "react";
import Button from "@/ui/Button";
import { ShowcasePanel, ShowcaseTag, showcasePanelClass } from "./shared";
import type { ShowcaseChecklistItem, ShowcaseMessage, ShowcaseSummaryItem } from "./types";

const toneClassMap = {
  blue: "bg-[#f3f6ff] text-[#5672ff] border-[#d7e3ff]",
  green: "bg-[#edfff5] text-[#1b8f5f] border-[#ccefdc]",
  orange: "bg-[#fff6ec] text-[#d97706] border-[#ffe1c1]",
  red: "bg-[#fff1f1] text-[#dc2626] border-[#ffd4d4]",
};

const ChecklistColumn: React.FC<{
  title: string;
  subtitle?: string;
  items: ShowcaseChecklistItem[];
}> = ({ title, subtitle, items }) => (
  <div className={`${showcasePanelClass} p-5`}>
    <div className="text-[13px] font-bold uppercase tracking-[0.18em] text-[#94a3b8]">Checklist</div>
    <div className="mt-2 text-[18px] font-black text-[#243246] dark:text-white">{title}</div>
    {subtitle ? <div className="mt-2 text-[14px] leading-7 text-[#67748a] dark:text-[#dbe5f3]">{subtitle}</div> : null}
    <div className="mt-5 space-y-3">
      {items.map((item) => (
        <div key={item.title} className="rounded-[22px] border border-[#dbe1f3] bg-white/76 p-4 dark:border-white/10 dark:bg-white/6">
          <div className="flex gap-3">
            <div
              className={`mt-1 h-5 w-5 rounded-full border ${
                item.checked ? "border-[#6177ff] bg-[#6177ff]" : "border-[#c7d2e6] bg-transparent"
              }`}
            />
            <div className="flex-1">
              <div className="flex items-start justify-between gap-3">
                <div className="text-[16px] font-bold text-[#243246] dark:text-white">{item.title}</div>
                {item.status ? (
                  <span
                    className={`rounded-full border px-3 py-1 text-[12px] font-semibold ${toneClassMap[item.tone ?? "blue"]}`}
                  >
                    {item.status}
                  </span>
                ) : null}
              </div>
              <div className="mt-2 text-[14px] leading-7 text-[#67748a] dark:text-[#dbe5f3]">{item.description}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const ConversationBoard: React.FC<{
  eyebrow?: string;
  title: string;
  description?: string;
  messages: ShowcaseMessage[];
  summaryTitle?: string;
  summaryItems?: ShowcaseSummaryItem[];
  checklistTitle?: string;
  checklistSubtitle?: string;
  checklistItems?: ShowcaseChecklistItem[];
  promptTabs?: string[];
  promptText?: string;
  promptSuffix?: string;
}> = ({
  eyebrow,
  title,
  description,
  messages,
  summaryTitle,
  summaryItems,
  checklistTitle,
  checklistSubtitle,
  checklistItems,
  promptTabs,
  promptText,
  promptSuffix,
}) => (
  <div className="grid gap-6 xl:grid-cols-[minmax(0,1.6fr)_360px]">
    <ShowcasePanel eyebrow={eyebrow} title={title} description={description}>
      <div className="space-y-5">
        {messages.map((message, index) => (
          <div key={`${message.role}-${message.time}-${index}`} className={`${showcasePanelClass} p-5`}>
            <div className="text-[14px] font-semibold text-[#6b7280] dark:text-[#cbd5e1]">
              {message.role} · {message.time}
            </div>
            <div className="mt-3 text-[16px] leading-8 text-[#243246] dark:text-[#edf2ff]">
              {message.content}
            </div>
            {message.cards?.length ? (
              <div className="mt-4 grid gap-3 md:grid-cols-3">
                {message.cards.map((card) => (
                  <div key={card.title} className="rounded-[22px] border border-[#dbe1f3] bg-white/76 p-4 dark:border-white/10 dark:bg-white/6">
                    <div className="text-[16px] font-bold text-[#243246] dark:text-white">{card.title}</div>
                    <div className="mt-2 text-[14px] leading-7 text-[#67748a] dark:text-[#dbe5f3]">{card.description}</div>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        ))}
        {promptTabs?.length || promptText ? (
          <div className={`${showcasePanelClass} p-5`}>
            {promptTabs?.length ? (
              <div className="flex flex-wrap gap-2">
                {promptTabs.map((tab, index) => (
                  <ShowcaseTag key={tab} tone={index === 0 ? "blue" : "gray"}>
                    {tab}
                  </ShowcaseTag>
                ))}
              </div>
            ) : null}
            {promptText ? <div className="mt-4 text-[16px] leading-8 text-[#243246] dark:text-[#edf2ff]">{promptText}</div> : null}
            <div className="mt-4 rounded-[24px] border border-[#dbe1f3] bg-white/78 px-4 py-4 text-[15px] leading-7 text-[#67748a] dark:border-white/10 dark:bg-white/6 dark:text-[#dbe5f3]">
              {promptSuffix ?? "继续围绕当前话题追问，系统会把上下文一并带入后续分析。"}
            </div>
            <div className="mt-4 flex justify-end">
              <Button className="rounded-2xl bg-[var(--brand-blue)] px-5 py-3 text-sm font-semibold text-white">发送给 LLM</Button>
            </div>
          </div>
        ) : null}
      </div>
    </ShowcasePanel>

    <div className="space-y-6">
      {summaryItems?.length ? (
        <ShowcasePanel eyebrow="Context" title={summaryTitle ?? "当前摘要"}>
          <div className="space-y-4">
            {summaryItems.map((item) => (
              <div key={item.title} className="rounded-[22px] border border-[#dbe1f3] bg-white/76 p-4 dark:border-white/10 dark:bg-white/6">
                <div className="text-[16px] font-bold text-[#243246] dark:text-white">{item.title}</div>
                <div className="mt-2 text-[14px] leading-7 text-[#67748a] dark:text-[#dbe5f3]">{item.description}</div>
              </div>
            ))}
          </div>
        </ShowcasePanel>
      ) : null}

      {checklistItems?.length ? (
        <ChecklistColumn title={checklistTitle ?? "任务清单"} subtitle={checklistSubtitle} items={checklistItems} />
      ) : null}
    </div>
  </div>
);

export default ConversationBoard;
