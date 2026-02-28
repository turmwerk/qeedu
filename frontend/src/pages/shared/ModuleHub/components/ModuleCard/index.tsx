import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "@/components/Button";

export type SubLink = {
  label: string;
  to: string;
  icon?: React.ReactNode;
};

export type ModuleCardProps = {
  title: string;
  desc: string;
  to: string;
  icon?: React.ReactNode;
  subLinks?: SubLink[];
};

const ModuleCard: React.FC<ModuleCardProps> = ({ title, desc, to, icon, subLinks }) => {
  const navigate = useNavigate();

  return (
    <>
    <div
      className="flex flex-col gap-3 cursor-default rounded-2xl px-7 py-6 transition-all duration-300 hover:-translate-y-1.5 bg-white/[0.58] dark:bg-white/10 border-0 shadow-[0_8px_30px_rgba(120,90,200,0.14),inset_0_1px_0_rgba(255,255,255,0.74),inset_0_-1px_0_rgba(255,255,255,0.34)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.46),inset_0_1px_0_rgba(255,255,255,0.14),inset_0_-1px_0_rgba(255,255,255,0.08)] hover:bg-white/[0.74] dark:hover:bg-white/[0.16] hover:shadow-[0_14px_40px_rgba(104,86,180,0.22),inset_0_1px_0_rgba(255,255,255,0.82),inset_0_-1px_0_rgba(255,255,255,0.42)] dark:hover:shadow-[0_18px_44px_rgba(0,0,0,0.60),inset_0_1px_0_rgba(255,255,255,0.18),inset_0_-1px_0_rgba(255,255,255,0.10)] backdrop-blur-[40px] backdrop-saturate-[210%]"
    >
      {/* icon + title row — named group so only this row triggers color change */}
      <div className="group/title relative inline-flex items-center gap-3 pl-[34px] pb-1 cursor-pointer w-fit after:content-[''] after:absolute after:left-[34px] after:bottom-0 after:h-[2px] after:w-0 after:bg-current after:transition-all after:duration-200 hover:after:w-[calc(100%-34px)] text-[var(--brand-blue)] hover:text-[var(--brand-purple)]"
        onClick={() => navigate(to)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") navigate(to); }}
      >
        {icon && (
          <span className="module-hub-card-icon shrink-0 text-[22px] leading-none transition-colors duration-200">
            {icon}
          </span>
        )}
        <div
          className="module-hub-card-title font-extrabold text-[22px] leading-none transition-colors duration-200"
        >
          {title}
        </div>
      </div>

      {/* description */}
      <div className="module-hub-card-desc text-[14px] leading-[1.6] pl-[34px] text-[#5a6475] dark:text-[#c1cbde]">
        {desc}
      </div>

      {/* sub-links */}
      {subLinks && subLinks.length > 0 && (
        <div className="flex flex-wrap gap-x-4 gap-y-1 pl-[34px] pt-1">
          {subLinks.map((link) => (
            <Button
              key={link.to}
              type="button"
              className="group/module-sublink module-hub-sublink relative inline-flex items-center gap-1.5 p-0 pb-1 text-[14px] font-semibold text-[var(--brand-blue)] bg-transparent border-0 hover:text-[var(--brand-purple)] transition-colors duration-200 cursor-pointer select-none after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[1.5px] after:w-0 after:bg-current after:transition-all after:duration-200 hover:after:w-full"
              onClick={(e) => { e.stopPropagation(); navigate(link.to); }}
            >
              {link.icon && link.icon}
              <span>
                {link.label}
              </span>
            </Button>
          ))}
        </div>
      )}
    </div>
    </>
  );
};

export default ModuleCard;
