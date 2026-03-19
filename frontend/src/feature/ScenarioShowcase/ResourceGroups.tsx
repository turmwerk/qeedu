import React from "react";
import Button from "@/ui/Button";
import { ArrowRightOutlinedIcon } from "@/ui/Icon";
import { ShowcasePanel, ShowcaseTag, showcasePanelClass } from "./shared";
import type { ShowcaseTile } from "./types";

const ResourceGroups: React.FC<{
  title: string;
  description?: string;
  groups: Array<{
    title: string;
    description?: string;
    cards: ShowcaseTile[];
  }>;
}> = ({ title, description, groups }) => (
  <ShowcasePanel eyebrow="Resource Groups" title={title} description={description}>
    <div className="space-y-8">
      {groups.map((group) => (
        <div key={group.title}>
          <div className="text-[13px] font-bold uppercase tracking-[0.18em] text-[#94a3b8]">Resource Group</div>
          <div className="mt-2 text-[28px] font-black text-[#243246] dark:text-white">{group.title}</div>
          {group.description ? (
            <div className="mt-2 text-[15px] leading-7 text-[#67748a] dark:text-[#dbe5f3]">{group.description}</div>
          ) : null}
          <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {group.cards.map((card) => (
              <div key={card.title} className={`${showcasePanelClass} p-5`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex h-14 w-14 items-center justify-center rounded-[20px] border border-[#d9e4ff] bg-[#e9f0ff] text-[24px] text-[var(--brand-blue)]">
                    {card.icon}
                  </div>
                  {card.badge ? <ShowcaseTag tone="gray">{card.badge}</ShowcaseTag> : null}
                </div>
                <div className="mt-5 text-[20px] font-black text-[#243246] dark:text-white">{card.title}</div>
                <div className="mt-3 text-[15px] leading-7 text-[#67748a] dark:text-[#dbe5f3]">{card.description}</div>
                <Button className="mt-6 inline-flex items-center gap-2 px-0 py-0 text-[16px] font-bold text-[#5672ff]">
                  查看资源
                  <ArrowRightOutlinedIcon />
                </Button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  </ShowcasePanel>
);

export default ResourceGroups;
