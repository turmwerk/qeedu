import React from "react";
import Button from "@/ui/Button";

type Props = {
  headline: string;
  description: string;
  onCreate: () => void;
};

const HeroSection: React.FC<Props> = ({ headline, description, onCreate }) => (
  <section className="rounded-[34px] border border-violet-100 bg-[radial-gradient(circle_at_top_left,#ffffff_0%,#ede9fe_28%,#dbeafe_62%,#ccfbf1_100%)] px-5 py-4 shadow-[0_24px_60px_rgba(129,140,248,0.18)] md:px-6 md:py-5">
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div className="max-w-3xl">
        <div className="text-xs font-bold uppercase tracking-[0.24em] text-violet-600/80">Decision Lab</div>
        <div className="mt-2 text-3xl font-black leading-tight text-slate-900 md:text-[2.5rem] dark:text-white">{headline}</div>
        <div className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{description}</div>
      </div>
      <Button
        className="rounded-2xl bg-[linear-gradient(135deg,#8b5cf6_0%,#2dd4bf_100%)] px-4 py-2.5 text-sm font-semibold text-white"
        onClick={onCreate}
      >
        新建分析
      </Button>
    </div>
  </section>
);

export default HeroSection;
