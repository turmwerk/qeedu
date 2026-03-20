import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import ChatDialog from "@/feature/ChatDialog";
import ResourceBoard from "@/feature/RecordWorkspace/ResourceBoard";
import { useFeatureRecords } from "@/hooks/useFeatureRecords";
import { paperReaderAdapter } from "@/pages/Research/featureAdapters";
import { paperReaderPageData, paperReaderQuickActions } from "@/pages/Research/featureData";
import Button from "@/ui/Button";
import { showToast } from "@/ui/Toast";

const PaperReader: React.FC = () => {
  const navigate = useNavigate();
  const { paperId } = useParams();
  const { records } = useFeatureRecords(paperReaderAdapter);
  const selected = records.find((record) => record.id === paperId) ?? records[0] ?? null;

  return (
    <div className="flex w-full min-w-0 flex-col gap-6 px-4 py-6 md:px-6 xl:px-8">
      <section className="rounded-[34px] border border-slate-200 bg-[linear-gradient(135deg,#fefce8_0%,#eff6ff_52%,#ecfeff_100%)] p-6 shadow-[0_24px_54px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-[linear-gradient(135deg,rgba(113,63,18,0.2)_0%,rgba(15,23,42,0.92)_100%)]">
        <div className="max-w-3xl">
          <div className="text-xs font-bold uppercase tracking-[0.24em] text-slate-400">
            Reading Desk
          </div>
          <div className="mt-3 text-3xl font-black text-slate-900 dark:text-white">
            {paperReaderPageData.headline}
          </div>
          <div className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
            {paperReaderPageData.description}
          </div>
        </div>
      </section>

      <section className="grid gap-6 2xl:grid-cols-[280px_minmax(0,1fr)_360px]">
        <div className="rounded-[28px] border border-slate-200 bg-white/92 p-5 shadow-[0_18px_40px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-white/6">
          <div className="text-xs font-bold uppercase tracking-[0.22em] text-slate-400">Paper Queue</div>
          <div className="mt-2 text-xl font-black text-slate-900 dark:text-white">精读队列</div>
          <div className="mt-4 space-y-3">
            {records.map((record) => (
              <button
                key={record.id}
                type="button"
                onClick={() => navigate(`/research/paper-reader/papers/${record.id}`)}
                className={`w-full rounded-[22px] border px-4 py-4 text-left transition ${
                  selected?.id === record.id
                    ? "border-slate-900 bg-slate-900 text-white dark:border-white dark:bg-white/10"
                    : "border-slate-200 bg-slate-50 hover:border-slate-300 dark:border-white/10 dark:bg-white/5"
                }`}
              >
                <div className="text-sm font-bold">{record.title}</div>
                <div className={`mt-2 text-xs ${selected?.id === record.id ? "text-slate-200" : "text-slate-500 dark:text-slate-300"}`}>
                  {record.subtitle}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          {selected ? (
            <>
              <div className="rounded-[28px] border border-slate-200 bg-white/92 p-5 shadow-[0_18px_44px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-white/6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="text-xs font-bold uppercase tracking-[0.22em] text-slate-400">
                      Structured Reading
                    </div>
                    <div className="mt-2 text-2xl font-black text-slate-900 dark:text-white">
                      {selected.title}
                    </div>
                    <div className="mt-2 text-sm text-slate-500 dark:text-slate-300">{selected.summary}</div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button variant="secondary" onClick={() => showToast("PDF 预览已打开")}>
                      PDF
                    </Button>
                    <Button variant="secondary" onClick={() => showToast("已加入比较队列")}>
                      加入比较
                    </Button>
                    <Button variant="primary" onClick={() => navigate("/research/paper-writing")}>
                      回填写作
                    </Button>
                  </div>
                </div>
                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  {(selected.notes ?? []).map((note: any) => (
                    <div
                      key={note.title}
                      className="rounded-[22px] border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-slate-900/40"
                    >
                      <div className="text-sm font-bold text-slate-900 dark:text-white">{note.title}</div>
                      <div className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{note.text}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[28px] border border-slate-200 bg-slate-950 p-4 text-white shadow-[0_22px_52px_rgba(15,23,42,0.24)]">
                <ChatDialog
                  dialogId={`research-reader-${selected.id}`}
                  botName="精读协同助手"
                  initMessage="我已经读取当前论文、结构化阅读卡和证据位置，可以继续帮你做 comparative narrative、复现清单和写作移交。"
                  transport={paperReaderAdapter.createChatTransport(selected.title)}
                />
              </div>
            </>
          ) : null}
        </div>

        <div className="space-y-6">
          <div className="rounded-[28px] border border-slate-200 bg-white/92 p-5 shadow-[0_18px_44px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-white/6">
            <div className="text-xs font-bold uppercase tracking-[0.22em] text-slate-400">Evidence Cards</div>
            <div className="mt-4 space-y-3">
              {(selected?.evidenceCards ?? []).map((item: any) => (
                <div
                  key={item.title}
                  className="rounded-[22px] border border-slate-200 bg-slate-50 px-4 py-4 dark:border-white/10 dark:bg-slate-900/40"
                >
                  <div className="text-sm font-bold text-slate-900 dark:text-white">{item.title}</div>
                  <div className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{item.summary}</div>
                </div>
              ))}
            </div>
            <div className="mt-4 grid gap-2">
              {paperReaderQuickActions.map((action) => (
                <Button
                  key={action.id}
                  variant="secondary"
                  className="justify-start"
                  onClick={() => showToast(`${action.title} 已触发`)}
                >
                  {action.title}
                </Button>
              ))}
            </div>
          </div>
          <ResourceBoard resources={selected?.resources ?? []} />
        </div>
      </section>
    </div>
  );
};

export default PaperReader;
