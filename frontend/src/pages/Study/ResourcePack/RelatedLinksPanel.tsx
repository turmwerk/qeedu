import React from "react";
import { useNavigate } from "react-router-dom";
import {
  ShowcasePanel,
  showcasePanelClass,
} from "@/feature/ScenarioShowcase";
import Button from "@/ui/Button";
import type { SubLink } from "@/ui/Card";

export type RelatedLinkGroup = {
  title: string;
  description: string;
  links: SubLink[];
};

type Props = {
  eyebrow?: string;
  title: string;
  description: string;
  groups: RelatedLinkGroup[];
  gridCols?: string;
};

const linkButtonClass =
  "rounded-2xl border border-[#dbe1f3] bg-white px-5 py-3 text-sm font-semibold text-[#334155] dark:border-white/10 dark:bg-white/8 dark:text-white";

const RelatedLinksPanel: React.FC<Props> = ({
  eyebrow = "Related Links",
  title,
  description,
  groups,
  gridCols = "md:grid-cols-2 xl:grid-cols-3",
}) => {
  const navigate = useNavigate();
  const visibleGroups = groups.filter((group) => group.links.length > 0);

  if (!visibleGroups.length) {
    return null;
  }

  return (
    <ShowcasePanel eyebrow={eyebrow} title={title} description={description}>
      <div className={`grid gap-4 ${gridCols}`}>
        {visibleGroups.map((group) => (
          <div key={group.title} className={`${showcasePanelClass} p-5`}>
            <div className="text-[18px] font-black text-[#243246] dark:text-white">
              {group.title}
            </div>
            <div className="mt-3 text-[15px] leading-7 text-[#67748a] dark:text-[#dbe5f3]">
              {group.description}
            </div>
            <div className="mt-4 flex flex-wrap gap-3">
              {group.links.map((link, idx) => (
                <Button
                  key={`${group.title}-${link.label}-${idx}`}
                  className={linkButtonClass}
                  onClick={() => {
                    if (link.onClick) {
                      link.onClick();
                      return;
                    }
                    if (link.to) {
                      navigate(link.to);
                      return;
                    }
                    if (link.href) {
                      window.open(link.href, "_blank", "noopener,noreferrer");
                    }
                  }}
                >
                  {link.label}
                </Button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </ShowcasePanel>
  );
};

export default RelatedLinksPanel;
