import React, { useMemo, useState } from "react";
import SplitSiderLayout from "@/layouts/SplitSiderLayout";
import FullScreenMarkdownCanvas from "@/feature/FullScreenMarkdownCanvas";
import MarkdownEditor from "@/feature/MarkdownEditor";
import MarkdownView from "@/feature/MarkdownView";
import Dialog from "@/feature/ChatDialog";
import PageHeader from "@/ui/PageHeader";
import ActionDock from "./ActionDock";
import ChecklistBoard from "./ChecklistBoard";
import OverviewMetrics from "./OverviewMetrics";
import ResourceBoard from "./ResourceBoard";
import TemplateWorkbench from "./TemplateWorkbench";
import TimelinePanel from "./TimelinePanel";
import type {
  WorkspaceConfig,
  WorkspaceMetric,
  WorkspaceMilestone,
  WorkspaceMilestoneStatus,
  WorkspaceQuickAction,
  WorkspaceRecord,
  WorkspaceResource,
  WorkspaceTask,
  WorkspaceTemplate,
} from "./types";
import { getWorkspaceDialogId } from "./storage";
import WorkspaceDetailHeader from "./DetailHeader";

type Props = {
  config: WorkspaceConfig;
  record: WorkspaceRecord;
  onPatchRecord: (patch: Partial<WorkspaceRecord>) => void;
};

const panelClassName =
  "rounded-xl bg-white/[0.88] dark:bg-white/[0.28] border-0 dark:border dark:border-white/[0.28] shadow-[0_8px_30px_rgba(120,90,200,0.14),inset_0_1px_0_rgba(255,255,255,0.74),inset_0_-1px_0_rgba(255,255,255,0.34)] dark:shadow-[0_10px_32px_rgba(0,0,0,0.42),inset_0_1px_0_rgba(255,255,255,0.22),inset_0_-1px_0_rgba(255,255,255,0.12)] backdrop-blur-[40px] backdrop-saturate-[210%]";

const WorkspaceDetailPage: React.FC<Props> = ({
  config,
  record,
  onPatchRecord,
}) => {
  const [showRaw, setShowRaw] = useState(false);
  const [openFull, setOpenFull] = useState(false);

  const metricCards = useMemo<WorkspaceMetric[]>(() => {
    if (record.metrics?.length) return record.metrics;
    return [
      {
        label: "最近更新",
        value: new Date(record.updatedAt || record.createdAt).toLocaleString(),
      },
      {
        label: "创建时间",
        value: new Date(record.createdAt).toLocaleDateString(),
      },
    ];
  }, [record.createdAt, record.metrics, record.updatedAt]);

  const tasks = useMemo<WorkspaceTask[]>(() => {
    if (record.tasks?.length) return record.tasks;
    return (record.nextSteps ?? []).map((step, index) => ({
      id: `task-${index + 1}`,
      title: step,
      detail: "由模块默认步骤生成，可在这里持续维护进度。",
      done: false,
      priority: index === 0 ? "high" : index === 1 ? "medium" : "low",
    }));
  }, [record.nextSteps, record.tasks]);

  const milestones = useMemo<WorkspaceMilestone[]>(() => {
    if (record.milestones?.length) return record.milestones;
    const baseDates = [record.createdAt, record.updatedAt, Date.now()];
    return [
      {
        id: "m-1",
        title: "信息收集与目标确认",
        summary: "完成初始信息录入与关键目标界定。",
        date: new Date(baseDates[0]).toLocaleDateString(),
        status: "done",
      },
      {
        id: "m-2",
        title: "执行材料或主体内容",
        summary: "推进核心内容，形成可复查版本。",
        date: new Date(baseDates[1]).toLocaleDateString(),
        status: "doing",
      },
      {
        id: "m-3",
        title: "复核与交付",
        summary: "检查风险项、格式与上下游交付要求。",
        date: new Date(baseDates[2]).toLocaleDateString(),
        status: "todo",
      },
    ];
  }, [record.createdAt, record.milestones, record.updatedAt]);

  const resources = useMemo<WorkspaceResource[]>(() => {
    if (record.resources?.length) return record.resources;
    const referenceResources =
      record.references?.map((item, index) => ({
        id: `reference-${index}`,
        title: item.value,
        kind: item.label,
        summary: `${item.label} 已沉淀到当前工作台，可继续在正文中补充细节。`,
      })) ?? [];
    const relatedResources =
      config.relatedLinks?.map((item, index) => ({
        id: `related-${index}`,
        title: item.label,
        kind: "关联模块",
        summary: `打开 ${item.label} 继续推进上下游任务。`,
        to: item.to,
      })) ?? [];
    return [...referenceResources, ...relatedResources];
  }, [config.relatedLinks, record.references, record.resources]);

  const templates = useMemo<WorkspaceTemplate[]>(() => {
    if (record.templates?.length) return record.templates;
    return [
      {
        id: "template-brief",
        title: "执行摘要模板",
        summary: "适合快速补一个上级或协作者可读的概要。",
        content: `## 执行摘要\n- 目标：\n- 当前进度：\n- 风险点：\n- 下一步：\n`,
      },
      {
        id: "template-check",
        title: "复核清单模板",
        summary: "适合进入交付前最后检查阶段。",
        content: `## 复核清单\n- [ ] 关键信息已核对\n- [ ] 格式与命名符合要求\n- [ ] 上下游联系人已同步\n- [ ] 风险项已记录\n`,
      },
    ];
  }, [record.templates]);

  const quickActions = useMemo<WorkspaceQuickAction[]>(() => {
    if (record.quickActions?.length) return record.quickActions;
    return config.assistantPrompts.map((prompt, index) => ({
      id: `action-${index + 1}`,
      title: `动作 ${index + 1}`,
      description: prompt,
      prompt,
      action: index === 0 ? "append_prompt" : index === 1 ? "append_template" : "copy_prompt",
      templateId: index === 1 ? templates[0]?.id : undefined,
    }));
  }, [config.assistantPrompts, record.quickActions, templates]);

  const handleInsertContent = (content: string, replace = false) => {
    onPatchRecord({
      content: replace ? content : `${record.content}${content}`,
    });
  };

  const handleToggleTask = (taskId: string) => {
    onPatchRecord({
      tasks: tasks.map((task) =>
        task.id === taskId ? { ...task, done: !task.done } : task,
      ),
    });
  };

  const handleMilestoneStatusChange = (
    milestoneId: string,
    status: WorkspaceMilestoneStatus,
  ) => {
    onPatchRecord({
      milestones: milestones.map((milestone) =>
        milestone.id === milestoneId ? { ...milestone, status } : milestone,
      ),
    });
  };

  return (
    <div className="h-full min-h-0 w-full">
      <div className="p-0 text-[#444] h-full min-h-0 flex flex-col">
        <WorkspaceDetailHeader
          config={config}
          record={record}
          content={record.content}
          showRaw={showRaw}
          onToggleRaw={() => setShowRaw((value) => !value)}
          onFullScreen={() => setOpenFull(true)}
          onTitleChange={(title) => onPatchRecord({ title })}
        />

        <SplitSiderLayout
          className="p-0"
          leftClassName="flex flex-col h-full min-h-0 overflow-hidden"
          rightClassName="h-full flex flex-col min-h-0 overflow-hidden"
          left={
            <div className="flex h-full min-h-0 flex-col gap-3">
              <div className={`${panelClassName} p-4`}>
                <div className="grid gap-4 xl:grid-cols-[1.4fr,1fr]">
                  <div>
                    <PageHeader
                      title="任务概览"
                      subtitle={record.subtitle || config.description}
                    />
                    <p className="m-0 text-[14px] leading-6 text-[#516073] dark:text-[#d9e4f4]">
                      {record.summary || "可在下方 Markdown 区域补充详细内容。"}
                    </p>
                    {record.tags && record.tags.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {record.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full bg-[#eef2ff] px-2.5 py-1 text-[12px] font-semibold text-[#4338ca] dark:bg-white/16 dark:text-white"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="space-y-3">
                    <ActionDock
                      actions={quickActions.slice(0, 2)}
                      templates={templates}
                      onInsert={handleInsertContent}
                    />
                  </div>
                </div>
              </div>

              <OverviewMetrics metrics={metricCards} />

              <div className="grid gap-3 xl:grid-cols-[1.25fr,0.95fr]">
                <ChecklistBoard tasks={tasks} onToggle={handleToggleTask} />
                <TimelinePanel
                  milestones={milestones}
                  onStatusChange={handleMilestoneStatusChange}
                />
              </div>

              <div className={`${panelClassName} flex-1 min-h-0 overflow-hidden p-4`}>
                <PageHeader
                  title="正文工作区"
                  subtitle="Markdown 编辑、预览与 AI 内容拼装都在这里完成。"
                />
                <div className="flex-1 min-h-0 overflow-hidden relative">
                  <div
                    className={`absolute inset-0 transition-all duration-300 ease-out ${
                      showRaw
                        ? "opacity-100 translate-x-0"
                        : "opacity-0 -translate-x-4 pointer-events-none"
                    }`}
                  >
                    <MarkdownEditor
                      value={record.content}
                      onChange={(content) => onPatchRecord({ content })}
                      minimap={false}
                      showHeader={false}
                      className="h-full w-full rounded-md border border-[var(--brand-border)]"
                    />
                  </div>
                  <div
                    className={`absolute inset-0 transition-all duration-300 ease-out ${
                      !showRaw && record.content
                        ? "opacity-100 translate-x-0"
                        : "opacity-0 translate-x-4 pointer-events-none"
                    }`}
                  >
                    <div className="h-full overflow-auto pr-2">
                      <MarkdownView value={record.content} />
                    </div>
                  </div>
                  <div
                    className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${
                      !showRaw && !record.content
                        ? "opacity-100"
                        : "opacity-0 pointer-events-none"
                    }`}
                  >
                    <div className="text-slate-400">空白工作台</div>
                  </div>
                </div>
              </div>

              <TemplateWorkbench templates={templates} onInsert={handleInsertContent} />
            </div>
          }
          right={
            <div className="flex h-full min-h-0 flex-col gap-3">
              <ActionDock
                actions={quickActions}
                templates={templates}
                onInsert={handleInsertContent}
              />

              <ResourceBoard resources={resources} />

              <div className={`${panelClassName} p-4`}>
                <PageHeader title="关键提示" />
                <div className="space-y-2">
                  {(record.highlights && record.highlights.length > 0
                    ? record.highlights
                    : config.assistantPrompts
                  ).map((item) => (
                    <div
                      key={item}
                      className="rounded-xl bg-[#f8fafc] px-3 py-2 text-sm leading-6 text-[#546274] dark:bg-white/10 dark:text-[#dce6f5]"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              <div className={`${panelClassName} flex-1 min-h-0 overflow-hidden p-4`}>
                <div className="mb-3 flex flex-wrap gap-2">
                  {config.assistantPrompts.map((item) => (
                    <span
                      key={item}
                      className="rounded-full bg-[#ecfeff] px-2.5 py-1 text-[12px] font-semibold text-[#0f766e] dark:bg-white/10 dark:text-[#bef264]"
                    >
                      {item}
                    </span>
                  ))}
                </div>
                <div className="h-[calc(100%-3rem)] min-h-0">
                  <Dialog
                    key={getWorkspaceDialogId(config, record.id)}
                    dialogId={getWorkspaceDialogId(config, record.id)}
                    botName={config.botName}
                    initMessage={config.botIntro}
                  />
                </div>
              </div>
            </div>
          }
        />

        {openFull && (
          <FullScreenMarkdownCanvas
            value={record.content}
            onSave={(content) => onPatchRecord({ content })}
            onClose={() => setOpenFull(false)}
            siderEvents={config.events}
          />
        )}
      </div>
    </div>
  );
};

export default WorkspaceDetailPage;
