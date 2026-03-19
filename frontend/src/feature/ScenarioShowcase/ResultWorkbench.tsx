import React from "react";
import Button from "@/ui/Button";
import { ShowcasePanel, ShowcaseSectionHeader, ShowcaseTag, showcasePanelClass } from "./shared";
import type { ShowcaseFilterGroup, ShowcaseResult, ShowcaseTile } from "./types";

const ResultWorkbench: React.FC<{
  title: string;
  description?: string;
  searchPlaceholder: string;
  filters: ShowcaseFilterGroup[];
  results: ShowcaseResult[];
  previewTitle: string;
  previewDescription: string;
  previewTiles: ShowcaseTile[];
  timeline: Array<{ date: string; title: string; detail: string }>;
}> = ({
  title,
  description,
  searchPlaceholder,
  filters,
  results,
  previewTitle,
  previewDescription,
  previewTiles,
  timeline,
}) => (
  <div className="space-y-6">
    <section className={`${showcasePanelClass} p-6`}>
      <div className="flex flex-col gap-4 md:flex-row">
        <input
          readOnly
          value={searchPlaceholder}
          className="h-16 flex-1 rounded-[24px] border border-[#d7dff4] bg-white/90 px-6 text-[16px] text-[#4b5563] outline-none"
        />
        <div className="flex gap-3">
          <Button className="rounded-[22px] border border-[#d7dff4] bg-white px-6 py-3 text-sm font-semibold text-[#334155]">高级筛选</Button>
          <Button className="rounded-[22px] bg-[var(--brand-blue)] px-6 py-3 text-sm font-semibold text-white">搜索项目</Button>
        </div>
      </div>
    </section>

    <div className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
      <ShowcasePanel eyebrow="Filters" title="筛选条件" description="按国家、项目类型、院校、预算、时间和语言要求限定结果。">
        <div className="space-y-4">
          {filters.map((group) => (
            <div key={group.title} className="rounded-[24px] border border-[#dbe1f3] bg-white/76 p-4 dark:border-white/10 dark:bg-white/6">
              <div className="text-[14px] font-bold text-[#94a3b8]">{group.title}</div>
              <div className="mt-4 flex flex-wrap gap-2">
                {group.values.map((value, index) => (
                  <ShowcaseTag key={value} tone={index === 0 ? "blue" : "gray"}>
                    {value}
                  </ShowcaseTag>
                ))}
              </div>
            </div>
          ))}
        </div>
      </ShowcasePanel>

      <ShowcasePanel eyebrow="Results" title={title} description={description}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            <ShowcaseTag tone="gray">{results.length} 个结果</ShowcaseTag>
            <ShowcaseTag tone="gray">当前筛选：北美 + HCI</ShowcaseTag>
          </div>
          <div className="flex gap-2">
            <Button className="rounded-full border border-[#d7dff4] bg-white px-4 py-2 text-sm font-semibold text-[#64748b]">卡片视图</Button>
            <Button className="rounded-full border border-[#d7dff4] bg-white px-4 py-2 text-sm font-semibold text-[#64748b]">列表视图</Button>
          </div>
        </div>
        <div className="mt-5 space-y-4">
          {results.map((item) => (
            <div key={item.title} className={`${showcasePanelClass} p-5`}>
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="flex-1">
                  <div className="text-[18px] font-black text-[#243246] dark:text-white">{item.title}</div>
                  <div className="mt-2 text-[16px] text-[#67748a] dark:text-[#dbe5f3]">{item.meta}</div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {item.tags.map((tag) => (
                      <ShowcaseTag key={tag} tone="gray">
                        {tag}
                      </ShowcaseTag>
                    ))}
                  </div>
                  <div className="mt-4 text-[16px] font-semibold text-[#243246] dark:text-white">{item.summary}</div>
                </div>
                <div className="flex flex-col items-end gap-3">
                  {item.badge ? <ShowcaseTag>{item.badge}</ShowcaseTag> : null}
                  <Button className="rounded-[20px] border border-[#d7dff4] bg-white px-5 py-3 text-sm font-semibold text-[#334155]">查看详情</Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ShowcasePanel>
    </div>

    <ShowcasePanel eyebrow="Program Details" title={previewTitle} description={previewDescription}>
      <div className="grid gap-4 md:grid-cols-2">
        {previewTiles.map((tile) => (
          <div key={tile.title} className="rounded-[24px] border border-[#dbe1f3] bg-white/76 p-5 dark:border-white/10 dark:bg-white/6">
            <div className="text-[14px] font-bold uppercase tracking-[0.12em] text-[#94a3b8]">{tile.badge}</div>
            <div className="mt-2 text-[20px] font-black text-[#243246] dark:text-white">{tile.title}</div>
            <div className="mt-2 text-[15px] leading-7 text-[#67748a] dark:text-[#dbe5f3]">{tile.description}</div>
          </div>
        ))}
      </div>
      <div className="mt-5 rounded-[24px] border border-[#dbe1f3] bg-white/76 p-5 dark:border-white/10 dark:bg-white/6">
        <ShowcaseSectionHeader eyebrow="申请时间线" title="申请时间线" />
        <div className="mt-4 space-y-4">
          {timeline.map((item) => (
            <div key={`${item.date}-${item.title}`} className="border-t border-dashed border-[#d7dff4] pt-4 first:border-t-0 first:pt-0">
              <div className="text-[16px] font-black text-[#5672ff]">{item.date}</div>
              <div className="mt-1 text-[22px] font-black text-[#243246] dark:text-white">{item.title}</div>
              <div className="mt-2 text-[15px] leading-7 text-[#67748a] dark:text-[#dbe5f3]">{item.detail}</div>
            </div>
          ))}
        </div>
      </div>
    </ShowcasePanel>
  </div>
);

export default ResultWorkbench;
