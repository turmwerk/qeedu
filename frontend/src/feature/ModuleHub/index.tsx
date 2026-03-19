import React from "react";
import ModuleCard from "./ModuleCard";
import type { Feature } from "./types";

export type { Feature } from "./types";

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
   * Defaults to `"grid-cols-2 lg:grid-cols-3"` so module hubs render
   * two cards per row on phones and three cards per row on desktop.
   * Pass e.g. `"grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"` for tutorial grids.
   */
  gridCols?: string;
};

const ModuleHub: React.FC<Props> = ({
  headline,
  subtitle,
  features,
  renderFeature,
  gridCols = "grid-cols-2 lg:grid-cols-3",
}) => {
  return (
    <div className="module-hub-section relative w-full max-w-full overflow-x-hidden" data-oid="ntkw4hz">
      <div className="pt-6 pb-6 sm:pt-16 sm:pb-16 px-0 sm:px-6 text-[#444] w-full relative z-10" data-oid="w:tm0qp">
        <div
          className="module-hub-shell bg-transparent px-1.5 sm:px-[48px] pt-[8px] pb-[8px] w-full sm:w-[90%] max-w-[1040px] shadow-none flex flex-col gap-5 relative overflow-hidden mx-auto"
          data-oid="oes92qw"
        >
          {headline && (
            <h1
              className="m-0 px-1 font-black text-[var(--brand-blue)] text-center relative z-[1] text-[30px] sm:text-[40px] leading-tight break-words"
              data-oid="x_3t9uw"
            >
              {headline}
            </h1>
          )}
          {subtitle && (
            <div
              className="px-1 text-[#666] text-[14px] sm:text-[16px] tracking-[1px] sm:tracking-[3px] text-center relative z-[1] break-words"
              data-oid="1y85vfz"
            >
              {subtitle}
            </div>
          )}
          <div className={`module-hub-grid grid gap-x-2 gap-y-2 sm:gap-x-8 sm:gap-y-8 relative z-[1] min-w-0 ${gridCols}`} data-oid="offsvqz">
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
