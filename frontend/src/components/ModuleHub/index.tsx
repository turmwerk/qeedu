import React from "react";
import ModuleCard from "./components/ModuleCard";
import type { SubLink } from "./components/ModuleCard";

export type Feature = {
  key: string;
  title: string;
  desc: string;
  /** Navigation target. Required when using the default ModuleCard renderer. */
  to?: string;
  icon?: React.ReactNode;
  subLinks?: SubLink[];
  /** Any extra fields passed through to a custom renderFeature function. */
  [extra: string]: unknown;
};

type Props = {
  headline?: string;
  subtitle?: string;
  features: Feature[];
  /**
   * Custom card renderer. When provided it is called for every feature item
   * instead of the default <ModuleCard>. Useful for sub-pages that need a
   * different card style (e.g. stacked tutorial cards).
   */
  renderFeature?: (item: Feature) => React.ReactNode;
  /**
   * Tailwind grid-cols class applied to the card grid.
   * Defaults to `"grid-cols-2"` (the original ModuleHub layout).
   * Pass e.g. `"grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"` for tutorial grids.
   */
  gridCols?: string;
};

const ModuleHub: React.FC<Props> = ({
  headline,
  subtitle,
  features,
  renderFeature,
  gridCols = "grid-cols-2",
}) => {
  return (
    <div className="module-hub-section relative" data-oid="ntkw4hz">
      <div className="pt-16 pb-16 px-6 text-[#444] w-full relative z-10" data-oid="w:tm0qp">
        <div
          className="module-hub-shell bg-transparent px-[48px] pt-[8px] pb-[8px] w-[90%] max-w-[1040px] shadow-none flex flex-col gap-5 relative overflow-hidden mx-auto"
          data-oid="oes92qw"
        >
          {headline && (
            <h1
              className="m-0 font-black text-[var(--brand-blue)] text-center relative z-[1] text-[40px]"
              data-oid="x_3t9uw"
            >
              {headline}
            </h1>
          )}
          {subtitle && (
            <div
              className="text-[#666] text-[16px] tracking-[3px] text-center relative z-[1]"
              data-oid="1y85vfz"
            >
              {subtitle}
            </div>
          )}
          <div className={`module-hub-grid grid gap-x-8 gap-y-8 relative z-[1] ${gridCols}`} data-oid="offsvqz">
            {features.map((item) =>
              renderFeature ? (
                <React.Fragment key={item.key}>
                  {renderFeature(item)}
                </React.Fragment>
              ) : (
                <ModuleCard
                  key={item.key}
                  title={item.title}
                  desc={item.desc}
                  to={item.to as string}
                  icon={item.icon}
                  subLinks={item.subLinks}
                />
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModuleHub;
