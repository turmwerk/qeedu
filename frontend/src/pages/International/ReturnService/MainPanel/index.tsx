import React from "react";
import ChecklistBoard from "@/feature/RecordWorkspace/ChecklistBoard";
import ResourceBoard from "@/feature/RecordWorkspace/ResourceBoard";
import { returnServiceQuickActions, returnServiceRecords } from "@/pages/International/featureData";
import Button from "@/ui/Button";
import { showToast } from "@/ui/Toast";
import {
  workbenchMainPanelShellClassName,
  workbenchScrollAreaClassName,
} from "@/pages/shared/workbench";

type ReturnServiceRecord = (typeof returnServiceRecords)[number];

type Props = {
  selected: ReturnServiceRecord | null;
};

const MainPanel: React.FC<Props> = ({ selected }) => (
  <div className={workbenchMainPanelShellClassName}>
    <div className={workbenchScrollAreaClassName}>
      <div className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {[
            ["学分认定", "提交成绩单、课程大纲与认定说明。", "处理认定"],
            ["报销办理", "补齐机票、住宿和保险票据。", "提交报销"],
            ["材料归档", "整理项目证明、照片和总结材料。", "归档材料"],
            ["经验反思", "准备分享和 FAQ 经验沉淀。", "保存反思"],
          ].map(([title, desc, cta]) => (
            <div key={title} className="rounded-[24px] border border-slate-200 bg-white/70 p-5 shadow-[0_18px_40px_rgba(15,23,42,0.06)] dark:border-white/10 dark:bg-white/6">
              <div className="text-sm font-bold text-slate-900 dark:text-white">{title}</div>
              <div className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{desc}</div>
              <Button
                variant="secondary"
                size="sm"
                className="mt-4"
                onClick={() => showToast(`${cta} 已触发`)}
              >
                {cta}
              </Button>
            </div>
          ))}
        </div>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.08fr)_minmax(320px,0.92fr)]">
          <ChecklistBoard tasks={selected?.tasks ?? []} onToggle={() => {}} />
          <div className="space-y-6">
            <ResourceBoard resources={selected?.resources ?? []} />
            <div className="rounded-[28px] border border-slate-200 bg-white/70 p-5 shadow-[0_18px_44px_rgba(15,23,42,0.06)] dark:border-white/10 dark:bg-white/6">
              <div className="text-xs font-bold uppercase tracking-[0.22em] text-slate-400">Closing Actions</div>
              <div className="mt-4 grid gap-3">
                {returnServiceQuickActions.map((action) => (
                  <Button
                    key={action.id}
                    variant="secondary"
                    className="justify-start"
                    onClick={() => showToast(`${action.title} 已触发`)}
                  >
                    {action.title}
                  </Button>
                ))}
                <Button variant="primary" onClick={() => showToast("返校案例已结案")}>
                  结案
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default MainPanel;
