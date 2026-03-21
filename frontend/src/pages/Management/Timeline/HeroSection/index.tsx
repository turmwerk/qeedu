import React from "react";
import type { WorkspaceMetric } from "@/feature/RecordWorkspace";

type Props = {
  headline: string;
  description: string;
  metrics: WorkspaceMetric[];
};

const HeroSection: React.FC<Props> = ({ headline, description, metrics }) => (
  <section className="rounded-[34px] border border-slate-200 bg-[linear-gradient(135deg,#fff1f2_0%,#eef2ff_52%,#f8fafc_100%)] px-5 py-4 shadow-[0_24px_54px_rgba(15,23,42,0.08)] md:px-6 md:py-5 dark:border-white/10 dark:bg-[linear-gradient(135deg,rgba(76,5,25,0.25)_0%,rgba(15,23,42,0.92)_100%)]">
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div className="max-w-3xl">
        <div className="text-xs font-bold uppercase tracking-[0.24em] text-slate-400">Timeline Console</div>
        <div className="mt-2 text-3xl font-black leading-tight text-slate-900 dark:text-white">{headline}</div>
        <div className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{description}</div>
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        {metrics.map((metric) => (
          <div key={metric.label} className="rounded-[22px] border border-white/70 bg-white/80 px-4 py-3 dark:border-white/10 dark:bg-white/5">
            <div className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">{metric.label}</div>
            <div className="mt-1 text-[2rem] font-black leading-none text-slate-900 dark:text-white">{metric.value}</div>
            <div className="mt-1 text-xs text-slate-500 dark:text-slate-300">
              {metric.description ?? metric.detail}
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default HeroSection;
