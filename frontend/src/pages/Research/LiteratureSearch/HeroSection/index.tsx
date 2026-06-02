import React from "react";
import Button from "@/ui/Button";

type Props = {
  headline: string;
  description: string;
  selectedTitle?: string;
  onCreate: () => void;
};

const HeroSection: React.FC<Props> = ({ headline, description, selectedTitle, onCreate }) => (
  <section className="workbench-surface-accent rounded-[34px] border border-cyan-100 bg-[radial-gradient(circle_at_top_left,#ffffff_0%,#dbeafe_28%,#ccfbf1_62%,#ede9fe_100%)] px-5 py-4 shadow-[0_24px_60px_rgba(45,212,191,0.16)] md:px-6 md:py-5">
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div className="max-w-3xl">
        <div className="text-xs font-bold uppercase tracking-[0.24em] text-cyan-600/80">
          Retrieval Lab
        </div>
        <div className="mt-2 text-3xl font-black leading-tight text-slate-900 md:text-[2.8rem] dark:text-white">
          {headline}
        </div>
        <div className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{description}</div>
      </div>
      <div className="flex flex-col items-end gap-3">
        {selectedTitle ? (
          <div className="workbench-surface-muted rounded-[22px] border border-white/70 bg-white/80 px-4 py-3 text-sm font-semibold text-slate-700">
            当前检索：{selectedTitle}
          </div>
        ) : null}
        <Button
          className="rounded-2xl bg-[linear-gradient(135deg,#2dd4bf_0%,#60a5fa_100%)] px-4 py-2.5 text-sm font-semibold text-white"
          onClick={onCreate}
        >
          新建检索查询
        </Button>
      </div>
    </div>
  </section>
);

export default HeroSection;
