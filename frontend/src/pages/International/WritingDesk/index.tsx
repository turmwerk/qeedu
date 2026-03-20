import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import ChatDialog from "@/feature/ChatDialog";
import FeatureRecordDialog from "@/feature/FeatureRecordDialog";
import TemplateWorkbench from "@/feature/RecordWorkspace/TemplateWorkbench";
import { useFeatureRecords } from "@/hooks/useFeatureRecords";
import { writingDeskAdapter } from "@/pages/International/featureAdapters";
import { writingDeskPageData, writingDeskQuickActions } from "@/pages/International/featureData";
import Button from "@/ui/Button";
import { showToast } from "@/ui/Toast";

const WritingDesk: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { draftId } = useParams();
  const { records, createRecord, patchRecord } = useFeatureRecords(writingDeskAdapter);
  const selected = records.find((record) => record.id === draftId) ?? records[0] ?? null;
  const createOpen = location.pathname.endsWith("/new");
  const [draftText, setDraftText] = useState(selected?.content ?? "");

  useEffect(() => {
    setDraftText(selected?.content ?? "");
  }, [selected?.content]);

  const appendContent = (content: string, replace = false) => {
    if (!selected) return;
    const next = replace ? content : `${draftText}\n\n${content}`.trim();
    setDraftText(next);
    patchRecord(selected.id, { content: next, updatedAt: Date.now() });
  };

  return (
    <div className="flex w-full min-w-0 flex-col gap-6 px-4 py-6 md:px-6 xl:px-8">
      <section className="rounded-[34px] border border-slate-200 bg-[linear-gradient(135deg,#fff7ed_0%,#eff6ff_52%,#f5f3ff_100%)] p-6 shadow-[0_24px_54px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-[linear-gradient(135deg,rgba(124,45,18,0.22)_0%,rgba(30,41,59,0.92)_100%)]">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-3xl">
            <div className="text-xs font-bold uppercase tracking-[0.24em] text-slate-400">Communication Desk</div>
            <div className="mt-3 text-3xl font-black text-slate-900 dark:text-white">{writingDeskPageData.headline}</div>
            <div className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">{writingDeskPageData.description}</div>
          </div>
          <Button variant="primary" onClick={() => navigate("/international/writing-desk/drafts/new")}>
            新建沟通草稿
          </Button>
        </div>
      </section>

      <section className="grid gap-6 2xl:grid-cols-[280px_minmax(0,1fr)_360px]">
        <div className="rounded-[28px] border border-slate-200 bg-white/92 p-5 shadow-[0_18px_40px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-white/6">
          <div className="text-xs font-bold uppercase tracking-[0.22em] text-slate-400">History Rail</div>
          <div className="mt-4 space-y-3">
            {records.map((record) => (
              <button
                key={record.id}
                type="button"
                onClick={() => navigate(`/international/writing-desk/drafts/${record.id}`)}
                className={`w-full rounded-[22px] border px-4 py-4 text-left ${
                  selected?.id === record.id
                    ? "border-slate-900 bg-slate-900 text-white dark:border-white dark:bg-white/10"
                    : "border-slate-200 bg-slate-50 dark:border-white/10 dark:bg-white/5"
                }`}
              >
                <div className="text-sm font-bold">{record.title}</div>
                <div className={`mt-2 text-xs ${selected?.id === record.id ? "text-slate-200" : "text-slate-500 dark:text-slate-300"}`}>{record.subtitle}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-[28px] border border-slate-200 bg-white/92 p-5 shadow-[0_18px_44px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-white/6">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="text-xs font-bold uppercase tracking-[0.22em] text-slate-400">Draft Preview</div>
                <div className="mt-2 text-xl font-black text-slate-900 dark:text-white">
                  {selected?.title ?? "暂无草稿"}
                </div>
              </div>
              <div className="flex gap-2">
                {writingDeskQuickActions.map((item) => (
                  <Button
                    key={item.id}
                    variant="secondary"
                    size="sm"
                    onClick={() => showToast(`${item.title} 已触发`)}
                  >
                    {item.title}
                  </Button>
                ))}
                <Button
                  variant="primary"
                  onClick={() => {
                    if (!selected) return;
                    patchRecord(selected.id, { content: draftText, updatedAt: Date.now() });
                    showToast("草稿已保存");
                  }}
                >
                  保存草稿
                </Button>
              </div>
            </div>
            <textarea
              value={draftText}
              onChange={(event) => setDraftText(event.target.value)}
              className="min-h-[420px] w-full rounded-[24px] border border-slate-200 bg-slate-50 p-5 text-sm leading-7 text-slate-700 outline-none transition focus:border-blue-300 focus:bg-white dark:border-white/10 dark:bg-slate-900/50 dark:text-slate-100"
            />
          </div>
        </div>

        <div className="space-y-6">
          <TemplateWorkbench templates={selected?.templates ?? []} onInsert={appendContent} />
          {selected ? (
            <div className="rounded-[28px] border border-slate-200 bg-slate-950 p-4 text-white shadow-[0_22px_52px_rgba(15,23,42,0.24)]">
              <ChatDialog
                dialogId={`international-writing-${selected.id}`}
                botName="双语写作助手"
                initMessage="我已经读取当前沟通场景、双语草稿和模板，可以继续润色 opening、生成中英对照或补发送前检查。"
                transport={writingDeskAdapter.createChatTransport(selected.title)}
              />
            </div>
          ) : null}
        </div>
      </section>

      <FeatureRecordDialog
        open={createOpen}
        title="新建沟通草稿"
        fields={writingDeskPageData.createFields}
        onClose={() => navigate("/international/writing-desk")}
        onSubmit={(values) => {
          const created = createRecord(values);
          navigate(`/international/writing-desk/drafts/${created.id}`);
          showToast("已创建新的沟通草稿");
        }}
      />
    </div>
  );
};

export default WritingDesk;
