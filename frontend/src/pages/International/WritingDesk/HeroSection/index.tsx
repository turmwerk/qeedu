import React from "react";
import Button from "@/ui/Button";

type Props = {
  headline: string;
  description: string;
  onCreate: () => void;
};

const HeroSection: React.FC<Props> = ({ headline, description, onCreate }) => (
  <section className="rounded-[34px] border border-slate-200 bg-[linear-gradient(135deg,#fff7ed_0%,#eff6ff_52%,#f5f3ff_100%)] px-5 py-4 shadow-[0_24px_54px_rgba(15,23,42,0.08)] md:px-6 md:py-5 dark:border-white/10 dark:bg-[linear-gradient(135deg,rgba(124,45,18,0.22)_0%,rgba(30,41,59,0.92)_100%)]">
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div className="max-w-3xl">
        <div className="text-xs font-bold uppercase tracking-[0.24em] text-slate-400">Communication Desk</div>
        <div className="mt-2 text-3xl font-black leading-tight text-slate-900 dark:text-white">{headline}</div>
        <div className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{description}</div>
      </div>
      <Button variant="primary" onClick={onCreate}>
        新建沟通草稿
      </Button>
    </div>
  </section>
);

export default HeroSection;
