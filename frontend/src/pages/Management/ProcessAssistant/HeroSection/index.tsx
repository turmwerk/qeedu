import React from "react";
import Button from "@/ui/Button";

type Props = {
  headline: string;
  description: string;
  onOpenOverview: () => void;
  onCreate: () => void;
};

const HeroSection: React.FC<Props> = ({ headline, description, onOpenOverview, onCreate }) => (
  <section className="rounded-[34px] border border-sky-100 bg-[radial-gradient(circle_at_top_right,#ffffff_0%,#e0f2fe_32%,#dbeafe_62%,#fae8ff_100%)] px-5 py-4 shadow-[0_24px_60px_rgba(56,189,248,0.16)] md:px-6 md:py-5">
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div className="max-w-3xl">
        <div className="text-xs font-bold uppercase tracking-[0.24em] text-sky-600/80">Management Flow Studio</div>
        <div className="mt-2 text-3xl font-black leading-tight text-slate-900 md:text-[2.5rem] dark:text-white">{headline}</div>
        <div className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{description}</div>
      </div>
      <div className="flex gap-3">
        <Button
          className="rounded-2xl border border-sky-200 bg-white px-4 py-2.5 text-sm font-semibold text-sky-700 hover:bg-sky-50"
          onClick={onOpenOverview}
        >
          案例总览
        </Button>
        <Button
          className="rounded-2xl bg-[linear-gradient(135deg,#38bdf8_0%,#818cf8_100%)] px-4 py-2.5 text-sm font-semibold text-white"
          onClick={onCreate}
        >
          新建案例
        </Button>
      </div>
    </div>
  </section>
);

export default HeroSection;
