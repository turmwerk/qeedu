import React from "react";
import Button from "@/ui/Button";

type Props = {
  headline: string;
  description: string;
  onOpenHistory: () => void;
  onCreate: () => void;
};

const HeroSection: React.FC<Props> = ({ headline, description, onOpenHistory, onCreate }) => (
  <section className="rounded-[34px] border border-[#dbe1f3] bg-[linear-gradient(135deg,#fff7ed_0%,#fff1f2_40%,#eef2ff_100%)] px-5 py-4 shadow-[0_24px_54px_rgba(15,23,42,0.08)] md:px-6 md:py-5 dark:border-white/10 dark:bg-[linear-gradient(135deg,rgba(120,53,15,0.3)_0%,rgba(49,46,129,0.2)_100%)]">
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div className="max-w-3xl">
        <div className="text-xs font-bold uppercase tracking-[0.24em] text-slate-400">Announcement Editor</div>
        <div className="mt-2 text-3xl font-black leading-tight text-slate-900 dark:text-white">{headline}</div>
        <div className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{description}</div>
      </div>
      <div className="flex gap-3">
        <Button variant="secondary" onClick={onOpenHistory}>
          历史记录
        </Button>
        <Button variant="primary" onClick={onCreate}>
          新建通知
        </Button>
      </div>
    </div>
  </section>
);

export default HeroSection;
