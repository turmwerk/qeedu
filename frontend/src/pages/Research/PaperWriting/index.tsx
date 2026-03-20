import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import ChatDialog from "@/feature/ChatDialog";
import FeatureRecordDialog from "@/feature/FeatureRecordDialog";
import ActionDock from "@/feature/RecordWorkspace/ActionDock";
import ResourceBoard from "@/feature/RecordWorkspace/ResourceBoard";
import TemplateWorkbench from "@/feature/RecordWorkspace/TemplateWorkbench";
import TimelinePanel from "@/feature/RecordWorkspace/TimelinePanel";
import { useFeatureRecords } from "@/hooks/useFeatureRecords";
import { paperWritingAdapter } from "@/pages/Research/featureAdapters";
import { paperWritingPageData, paperWritingQuickActions } from "@/pages/Research/featureData";
import SplitSiderLayout from "@/layouts/SplitSiderLayout";
import Button from "@/ui/Button";
import { showToast } from "@/ui/Toast";

const PaperWriting: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { draftId } = useParams();
  const { records, createRecord, patchRecord } = useFeatureRecords(paperWritingAdapter);
  const selected = records.find((record) => record.id === draftId) ?? records[0] ?? null;
  const [editorText, setEditorText] = useState(selected?.content ?? "");

  useEffect(() => {
    setEditorText(selected?.content ?? "");
  }, [selected?.content]);

  const createOpen = location.pathname.endsWith("/new");

  const appendContent = (content: string, replace = false) => {
    if (!selected) return;
    const next = replace ? content : `${editorText}\n\n${content}`.trim();
    setEditorText(next);
    patchRecord(selected.id, { content: next, updatedAt: Date.now() });
  };

  return (
    <div className="flex w-full min-w-0 flex-col gap-6 px-4 py-6 md:px-6 xl:px-8">
      <section className="rounded-[34px] border border-slate-200 bg-[linear-gradient(135deg,#eff6ff_0%,#f5f3ff_45%,#fff7ed_100%)] p-6 shadow-[0_24px_54px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-[linear-gradient(135deg,rgba(30,64,175,0.22)_0%,rgba(15,23,42,0.92)_100%)]">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-3xl">
            <div className="text-xs font-bold uppercase tracking-[0.24em] text-slate-400">
              Writing Studio
            </div>
            <div className="mt-3 text-3xl font-black text-slate-900 dark:text-white">
              {paperWritingPageData.headline}
            </div>
            <div className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
              {paperWritingPageData.description}
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => showToast("投稿前检查已启动")}>
              投稿前检查
            </Button>
            <Button variant="primary" onClick={() => navigate("/research/paper-writing/drafts/new")}>
              新建草稿
            </Button>
          </div>
        </div>
      </section>

      <SplitSiderLayout
        initialSplit={63}
        minSplit={46}
        maxSplit={78}
        left={
          <div className="space-y-5 pr-4">
            <div className="rounded-[28px] border border-slate-200 bg-white/92 p-5 shadow-[0_18px_44px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-white/6">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="text-xs font-bold uppercase tracking-[0.22em] text-slate-400">
                    Draft Tree
                  </div>
                  <div className="mt-2 text-xl font-black text-slate-900 dark:text-white">
                    草稿与章节
                  </div>
                </div>
                <div className="flex gap-2">
                  {records.map((record) => (
                    <Button
                      key={record.id}
                      variant={selected?.id === record.id ? "primary" : "secondary"}
                      size="sm"
                      onClick={() => navigate(`/research/paper-writing/drafts/${record.id}`)}
                    >
                      {record.title}
                    </Button>
                  ))}
                </div>
              </div>
              <div className="grid gap-3 md:grid-cols-4">
                {["Abstract", "Introduction", "Related Work", "Discussion"].map((item) => (
                  <div
                    key={item}
                    className="rounded-[20px] border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 dark:border-white/10 dark:bg-slate-900/40 dark:text-slate-200"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[28px] border border-slate-200 bg-white/92 p-5 shadow-[0_18px_44px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-white/6">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <div className="text-xs font-bold uppercase tracking-[0.22em] text-slate-400">
                    Draft Editor
                  </div>
                  <div className="mt-2 text-xl font-black text-slate-900 dark:text-white">
                    正文编辑区
                  </div>
                </div>
                <Button
                  variant="secondary"
                  onClick={() => {
                    if (!selected) return;
                    patchRecord(selected.id, { content: editorText, updatedAt: Date.now() });
                    showToast("草稿已保存");
                  }}
                >
                  保存草稿
                </Button>
              </div>
              <textarea
                value={editorText}
                onChange={(event) => setEditorText(event.target.value)}
                className="min-h-[420px] w-full rounded-[24px] border border-slate-200 bg-slate-50 p-5 text-sm leading-7 text-slate-700 outline-none transition focus:border-blue-300 focus:bg-white dark:border-white/10 dark:bg-slate-900/50 dark:text-slate-100"
              />
            </div>
          </div>
        }
        right={
          <div className="space-y-5 pl-4">
            <TemplateWorkbench templates={selected?.templates ?? []} onInsert={appendContent} />
            <TimelinePanel
              milestones={selected?.milestones ?? []}
              onStatusChange={(milestoneId, status) => {
                if (!selected) return;
                patchRecord(selected.id, {
                  milestones: (selected.milestones ?? []).map((item: any) =>
                    item.id === milestoneId ? { ...item, status } : item,
                  ),
                });
              }}
            />
            <ActionDock
              actions={paperWritingQuickActions}
              templates={selected?.templates ?? []}
              onInsert={appendContent}
            />
            <ResourceBoard resources={selected?.resources ?? []} />
            {selected ? (
              <div className="rounded-[28px] border border-slate-200 bg-slate-950 p-4 text-white shadow-[0_22px_52px_rgba(15,23,42,0.24)]">
                <ChatDialog
                  dialogId={`research-writing-${selected.id}`}
                  botName="写作协同助手"
                  initMessage="我已经读取当前章节树、正文草稿、模板和里程碑，可以继续压缩摘要、组织 related work 或做投稿前终检。"
                  transport={paperWritingAdapter.createChatTransport(selected.title)}
                />
              </div>
            ) : null}
          </div>
        }
      />

      <FeatureRecordDialog
        open={createOpen}
        title="新建论文草稿"
        fields={paperWritingPageData.createFields}
        onClose={() => navigate("/research/paper-writing")}
        onSubmit={(values) => {
          const created = createRecord(values);
          navigate(`/research/paper-writing/drafts/${created.id}`);
          showToast("已创建新的论文草稿");
        }}
        submitText="创建草稿"
      />
    </div>
  );
};

export default PaperWriting;
