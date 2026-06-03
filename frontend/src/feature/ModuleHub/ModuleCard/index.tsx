import React from "react";
import { useNavigate } from "react-router-dom";
import Card from "@/ui/Card";
import type { SubLink } from "@/ui/Card";

type ModuleCardProps = {
  title: string;
  desc: string;
  to: string;
  icon?: React.ReactNode;
  details?: string[];
  subLinks?: SubLink[];
  onClick?: () => void;
};

const ModuleCard: React.FC<ModuleCardProps> = ({
  title,
  desc,
  to,
  icon,
  details,
  subLinks,
  onClick,
}) => {
  const navigate = useNavigate();

  return (
    <Card
      iconLayout="inline"
      icon={icon}
      title={title}
      titleLink={to}
      desc={desc}
      details={details}
      subLinks={subLinks}
      className="module-card !px-4 !py-4 sm:!px-7 sm:!py-6 hover:!-translate-y-1.5 hover:!bg-white/[0.74] hover:!shadow-[0_14px_40px_rgba(104,86,180,0.22),inset_0_1px_0_rgba(255,255,255,0.82),inset_0_-1px_0_rgba(255,255,255,0.42)]"
      onClick={onClick ?? (() => navigate(to))}
    />
  );
};

export default ModuleCard;
