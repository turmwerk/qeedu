import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "@/ui/Button";
import type { WorkspaceResource } from "./types";

type Props = {
  resources: WorkspaceResource[];
};

const ResourceBoard: React.FC<Props> = ({ resources }) => {
  const navigate = useNavigate();

  return (
    <div className="rounded-2xl bg-white/[0.88] p-4 shadow-[0_8px_24px_rgba(15,23,42,0.08)] backdrop-blur-[24px] dark:bg-white/[0.12]">
      <div className="mb-3">
        <div className="text-[16px] font-bold text-[var(--brand-blue)] dark:text-white">
          资源与联动
        </div>
        <div className="text-sm text-[#6b7280] dark:text-[#d7e0ef]">
          沉淀高频链接、上下游模块和可复用资料。
        </div>
      </div>

      <div className="grid gap-3">
        {resources.map((resource) => (
          <div
            key={resource.id}
            className="rounded-xl border border-[#dbeafe] bg-white/70 px-3 py-3 dark:border-white/10 dark:bg-white/5"
          >
            <div className="text-xs font-semibold uppercase tracking-[0.14em] text-[#64748b] dark:text-[#cbd5e1]">
              {resource.kind}
            </div>
            <div className="mt-1 text-sm font-semibold text-[#1f2937] dark:text-white">
              {resource.title}
            </div>
            <div className="mt-1 text-sm leading-6 text-[#6b7280] dark:text-[#d7e0ef]">
              {resource.summary}
            </div>
            {(resource.to || resource.href) && (
              <div className="mt-3">
                <Button
                  className="rounded-xl border border-transparent bg-[#eff6ff] px-3 py-1.5 text-sm font-semibold text-[#2563eb] transition hover:border-[#93c5fd] hover:bg-[#dbeafe] dark:bg-white/10 dark:text-white"
                  onClick={() => {
                    if (resource.to) navigate(resource.to);
                    if (resource.href) window.open(resource.href, "_blank", "noopener,noreferrer");
                  }}
                >
                  {resource.to ? "打开模块" : "打开资源"}
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResourceBoard;

