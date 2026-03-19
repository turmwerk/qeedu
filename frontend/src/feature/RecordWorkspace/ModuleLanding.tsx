import React from "react";
import { useNavigate } from "react-router-dom";
import ModuleHub, { type Feature } from "@/feature/ModuleHub";
import Button from "@/ui/Button";
import type { WorkspaceConfig } from "./types";

type Props = {
  config: WorkspaceConfig;
  headline?: string;
  subtitle?: string;
  features: Feature[];
  gridCols?: string;
};

const WorkspaceModuleLanding: React.FC<Props> = ({
  config,
  headline,
  subtitle,
  features,
  gridCols = "grid-cols-1 md:grid-cols-2 xl:grid-cols-3",
}) => {
  const navigate = useNavigate();

  return (
    <div className="flex w-full min-w-0 flex-col gap-6 px-4 py-6 md:px-6 xl:px-8">
      <section className="rounded-[30px] bg-white/[0.70] px-6 py-6 shadow-[0_18px_46px_rgba(87,102,141,0.14)] backdrop-blur-[32px] dark:bg-white/[0.08]">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-4xl">
            <div className="text-[12px] font-semibold uppercase tracking-[0.18em] text-[#74849c] dark:text-[#cbd5e1]">
              {config.title}
            </div>
            <h1 className="mt-2 text-[30px] font-black leading-tight text-[var(--brand-blue)] dark:text-white">
              {headline ?? config.headline}
            </h1>
            <p className="mt-3 max-w-3xl text-[15px] leading-7 text-[#607082] dark:text-[#d9e4f4]">
              {subtitle ?? config.subtitle}
            </p>
            <p className="mt-3 max-w-3xl text-[15px] leading-7 text-[#607082] dark:text-[#d9e4f4]">
              {config.description}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {(config.capabilities ?? config.assistantPrompts).slice(0, 5).map((item) => (
                <span
                  key={item}
                  className="rounded-full bg-[#eef4ff] px-3 py-1 text-[13px] font-semibold text-[#4566d4] dark:bg-white/10 dark:text-white"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button
              className="rounded-2xl bg-[var(--brand-blue)] px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
              onClick={() => navigate(`${config.routeBase}/ListPage`, { state: { openCreate: true } })}
            >
              {config.createButtonLabel}
            </Button>
            <Button
              className="rounded-2xl border border-[#cbd5e1] bg-white/70 px-4 py-2 text-sm font-semibold text-[#334155] transition hover:border-[#94a3b8] hover:bg-white dark:bg-white/10 dark:text-white"
              onClick={() => navigate(`${config.routeBase}/ListPage`)}
            >
              进入工作台
            </Button>
          </div>
        </div>
      </section>

      <ModuleHub features={features} gridCols={gridCols} />
    </div>
  );
};

export default WorkspaceModuleLanding;
