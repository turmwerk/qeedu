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
    <div
      className="module-hub-card flex flex-col gap-3 cursor-default rounded-2xl px-7 py-6 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl"
    >
      {/* icon + title row — named group so only this row triggers color change */}
      <div className="group/title relative inline-flex items-center gap-3 pl-[34px] pb-1 cursor-pointer w-fit after:content-[''] after:absolute after:left-[34px] after:bottom-0 after:h-[2px] after:w-0 after:bg-current after:transition-all after:duration-200 hover:after:w-[calc(100%-34px)] text-blue-600 hover:text-[#6d28d9]"
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
      <div className="module-hub-card-desc text-[14px] leading-[1.6] pl-[34px]">
        {desc}
      </div>

      {/* sub-links */}
      {subLinks && subLinks.length > 0 && (
        <div className="flex flex-wrap gap-x-4 gap-y-1 pl-[34px] pt-1">
          {subLinks.map((link) => (
            <Button
              key={link.to}
              type="button"
              className="group/module-sublink module-hub-sublink relative inline-flex items-center gap-1.5 p-0 pb-1 text-[14px] font-semibold text-blue-600 bg-transparent border-0 hover:text-[#6d28d9] transition-colors duration-200 cursor-pointer select-none after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[1.5px] after:w-0 after:bg-current after:transition-all after:duration-200 hover:after:w-full"
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
  );
};

export default ModuleCard;
