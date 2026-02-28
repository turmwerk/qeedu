import React from "react";
import { RightOutlined } from "@ant-design/icons";

interface BreadcrumbProps {
  path: string; // e.g. "/src/main.py"
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ path }) => {
  const parts = path.replace(/^\//, "").split("/").filter(Boolean);
  return (
    <div className="flex h-6 shrink-0 select-none items-center gap-0.5 border-b border-[#2d2d2d] bg-[#1e1e1e] px-3 text-[11px] text-[#9d9d9d]">
      {parts.map((part, i) => (
        <React.Fragment key={i}>
          {i > 0 && <RightOutlined className="text-[9px] opacity-50" />}
          <span
            className={`cursor-pointer rounded px-1 py-0.5 transition-colors hover:bg-white/10 ${
              i === parts.length - 1 ? "text-[#cccccc]" : ""
            }`}
          >
            {part}
          </span>
        </React.Fragment>
      ))}
    </div>
  );
};

export default Breadcrumb;
