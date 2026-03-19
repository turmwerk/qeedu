import React from "react";
import Button from "@/ui/Button";
import type { ShowcaseStat } from "./types";

export const showcasePanelClass =
  "rounded-[28px] border border-white/60 bg-white/[0.82] shadow-[0_18px_48px_rgba(87,102,141,0.12)] backdrop-blur-[32px] dark:border-white/10 dark:bg-white/[0.08]";

export const ShowcaseTag: React.FC<{
  children: React.ReactNode;
  tone?: "blue" | "green" | "orange" | "gray" | "red";
}> = ({ children, tone = "blue" }) => {
  const toneClass =
    tone === "green"
      ? "border-[#ccefdc] bg-[#edfff5] text-[#1b8f5f]"
      : tone === "orange"
        ? "border-[#ffe1c1] bg-[#fff6ec] text-[#d97706]"
        : tone === "red"
          ? "border-[#ffd4d4] bg-[#fff1f1] text-[#dc2626]"
          : tone === "gray"
            ? "border-[#e5e7eb] bg-white/78 text-[#667085]"
            : "border-[#d7e3ff] bg-[#f3f6ff] text-[#5672ff]";
  return (
    <span className={`rounded-full border px-3 py-1 text-[13px] font-semibold ${toneClass}`}>
      {children}
    </span>
  );
};

export const ShowcaseSectionHeader: React.FC<{
  eyebrow?: string;
  title: string;
  description?: string;
  actionLabel?: string;
}> = ({ eyebrow, title, description, actionLabel }) => (
  <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
    <div>
      {eyebrow ? (
        <div className="text-[13px] font-bold uppercase tracking-[0.18em] text-[#94a3b8]">
          {eyebrow}
        </div>
      ) : null}
      <div className="mt-1 text-[22px] font-black text-[#243246] dark:text-white">{title}</div>
      {description ? (
        <div className="mt-2 max-w-3xl text-[15px] leading-7 text-[#667085] dark:text-[#dbe5f3]">
          {description}
        </div>
      ) : null}
    </div>
    {actionLabel ? (
      <Button className="self-start rounded-full border border-[#dbe1f3] bg-white px-5 py-2 text-sm font-semibold text-[#334155] dark:border-white/10 dark:bg-white/8 dark:text-white">
        {actionLabel}
      </Button>
    ) : null}
  </div>
);

export const ShowcasePanel: React.FC<{
  eyebrow?: string;
  title: string;
  description?: string;
  className?: string;
  children: React.ReactNode;
}> = ({ eyebrow, title, description, className = "", children }) => (
  <section className={`${showcasePanelClass} p-6 ${className}`}>
    <ShowcaseSectionHeader eyebrow={eyebrow} title={title} description={description} />
    <div className="mt-5">{children}</div>
  </section>
);

export const ShowcaseStatGrid: React.FC<{
  stats: ShowcaseStat[];
  compact?: boolean;
}> = ({ stats, compact = false }) => (
  <div className={`grid gap-4 ${compact ? "md:grid-cols-2 xl:grid-cols-4" : "md:grid-cols-2"}`}>
    {stats.map((item) => (
      <div
        key={`${item.label}-${item.value}`}
        className="rounded-[24px] border border-white/20 bg-white/10 p-5 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.16)]"
      >
        <div className="text-[12px] font-bold uppercase tracking-[0.18em] text-white/72">
          {item.label}
        </div>
        <div className="mt-3 text-[38px] font-black leading-none">{item.value}</div>
        {item.detail ? <div className="mt-3 text-[16px] text-white/84">{item.detail}</div> : null}
      </div>
    ))}
  </div>
);
