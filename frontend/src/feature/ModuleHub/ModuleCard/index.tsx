import React from "react";
import { useNavigate } from "react-router-dom";
import Card from "@/ui/Card";
import type { SubLink } from "@/ui/Card";

type ModuleCardProps = {
  title: string;
  desc: string;
  to: string;
  icon?: React.ReactNode;
  subLinks?: SubLink[];
};

const ModuleCard: React.FC<ModuleCardProps> = ({ title, desc, to, icon, subLinks }) => {
  const navigate = useNavigate();

  return (
    <Card
      iconLayout="inline"
      icon={icon}
      title={title}
      titleLink={to}
      desc={desc}
      subLinks={subLinks}
      // Preserve ModuleCard's original padding, lift and hover-shadow values.
      className="!px-7 !py-6 hover:!-translate-y-1.5 hover:!bg-white/[0.74] dark:hover:!bg-white/[0.16] hover:!shadow-[0_14px_40px_rgba(104,86,180,0.22),inset_0_1px_0_rgba(255,255,255,0.82),inset_0_-1px_0_rgba(255,255,255,0.42)] dark:hover:!shadow-[0_18px_44px_rgba(0,0,0,0.60),inset_0_1px_0_rgba(255,255,255,0.18),inset_0_-1px_0_rgba(255,255,255,0.10)]"
      onClick={() => navigate(to)}
    />
  );
};

export default ModuleCard;
