import React from "react";

type Props = {
  headline: string;
  description: string;
};

const Header: React.FC<Props> = ({ headline, description }) => (
  <section className="rounded-[34px] border border-slate-200 bg-[linear-gradient(135deg,#fefce8_0%,#eff6ff_52%,#ecfeff_100%)] px-5 py-4 shadow-[0_24px_54px_rgba(15,23,42,0.08)] md:px-6 md:py-5 dark:border-white/10 dark:bg-[linear-gradient(135deg,rgba(113,63,18,0.2)_0%,rgba(15,23,42,0.92)_100%)]">
    <div className="max-w-3xl">
      <div className="text-xs font-bold uppercase tracking-[0.24em] text-slate-400">Reading Desk</div>
      <div className="mt-2 text-3xl font-black leading-tight text-slate-900 dark:text-white">{headline}</div>
      <div className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{description}</div>
    </div>
  </section>
);

export default Header;
