import React from "react";
import Button from "@/ui/Button";
import { ShowcasePanel, ShowcaseTag, showcasePanelClass } from "./shared";
import type { ShowcaseRecord } from "./types";

const RecordList: React.FC<{
  eyebrow?: string;
  title: string;
  description?: string;
  actionLabel?: string;
  records: ShowcaseRecord[];
}> = ({ eyebrow, title, description, actionLabel, records }) => (
  <ShowcasePanel eyebrow={eyebrow} title={title} description={description} className="space-y-4">
    {actionLabel ? (
      <div className="mb-4 flex justify-end">
        <Button className="rounded-2xl bg-[var(--brand-blue)] px-5 py-3 text-sm font-semibold text-white">
          {actionLabel}
        </Button>
      </div>
    ) : null}
    <div className="space-y-4">
      {records.map((record) => (
        <div key={record.title} className={`${showcasePanelClass} p-5`}>
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div className="flex-1">
              <div className="text-[18px] font-black text-[#243246] dark:text-white">{record.title}</div>
              <div className="mt-2 text-[15px] text-[#67748a] dark:text-[#dbe5f3]">{record.meta}</div>
              {record.summary ? (
                <div className="mt-2 text-[15px] leading-7 text-[#67748a] dark:text-[#dbe5f3]">
                  {record.summary}
                </div>
              ) : null}
              {record.tags?.length ? (
                <div className="mt-4 flex flex-wrap gap-2">
                  {record.tags.map((tag) => (
                    <ShowcaseTag key={tag}>{tag}</ShowcaseTag>
                  ))}
                </div>
              ) : null}
            </div>
            {record.status ? <ShowcaseTag tone="gray">{record.status}</ShowcaseTag> : null}
          </div>
          {record.actions?.length ? (
            <div className="mt-5 flex flex-wrap gap-3 border-t border-dashed border-[#d7dff4] pt-4">
              {record.actions.map((action) => (
                <Button
                  key={`${record.title}-${action.label}`}
                  className={
                    action.primary
                      ? "rounded-2xl bg-[var(--brand-blue)] px-5 py-2.5 text-sm font-semibold text-white"
                      : "rounded-2xl border border-[#dbe1f3] bg-white px-5 py-2.5 text-sm font-semibold text-[#334155] dark:border-white/10 dark:bg-white/8 dark:text-white"
                  }
                >
                  {action.label}
                </Button>
              ))}
            </div>
          ) : null}
        </div>
      ))}
    </div>
  </ShowcasePanel>
);

export default RecordList;
