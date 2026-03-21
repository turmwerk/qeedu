import React from "react";
import type { WorkspaceMetric } from "@/feature/RecordWorkspace";

type Props = {
  headline: string;
  description: string;
  metrics: WorkspaceMetric[];
};

const HeroSection: React.FC<Props> = ({ headline, description, metrics }) => (
  <section className="rounded-[34px] border border-emerald-100 bg-[radial-gradient(circle_at_top_left,#ffffff_0%,#ccfbf1_28%,#dbeafe_62%,#ede9fe_100%)] px-5 py-4 shadow-[0_24px_60px_rgba(45,212,191,0.16)] md:px-6 md:py-5">
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div className="max-w-3xl">
        <div className="text-xs font-bold uppercase tracking-[0.24em] text-emerald-600/80">Departure Board</div>
        <div className="mt-2 text-3xl font-black leading-tight text-slate-900 md:text-[2.5rem] dark:text-white">{headline}</div>
        <div className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{description}</div>
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        {metrics.map((metric) => (
          <div key={metric.label} className="rounded-[22px] border border-white/70 bg-white/80 px-4 py-3">
            <div className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-600/70">{metric.label}</div>
            <div className="mt-1 text-[2rem] font-black leading-none text-slate-900 dark:text-white">{metric.value}</div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default HeroSection;
