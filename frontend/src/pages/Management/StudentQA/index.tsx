import React from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import ChatDialog from "@/feature/ChatDialog";
import FeatureRecordDialog from "@/feature/FeatureRecordDialog";
import ActionDock from "@/feature/RecordWorkspace/ActionDock";
import { useFeatureRecords } from "@/hooks/useFeatureRecords";
import { studentQAAdapter } from "@/pages/Management/featureAdapters";
import { studentQAPageData, studentQAQuickActions } from "@/pages/Management/featureData";
import Button from "@/ui/Button";
import List from "@/ui/List";
import { showToast } from "@/ui/Toast";

const StudentQA: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { threadId } = useParams();
  const { records, createRecord, patchRecord } = useFeatureRecords(studentQAAdapter);
  const createOpen = location.pathname.endsWith("/new");
  const selected = records.find((record) => record.id === threadId) ?? records[0] ?? null;

  return (
    <div className="flex w-full min-w-0 flex-col gap-6 px-4 py-6 md:px-6 xl:px-8">
      <section className="rounded-[34px] border border-slate-200 bg-[linear-gradient(135deg,#f8fafc_0%,#eef2ff_45%,#ecfeff_100%)] p-6 shadow-[0_24px_54px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-[linear-gradient(135deg,rgba(30,41,59,0.95)_0%,rgba(14,116,144,0.18)_100%)]">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-3xl">
            <div className="text-xs font-bold uppercase tracking-[0.24em] text-slate-400">
              Q&A Control Room
            </div>
            <div className="mt-3 text-3xl font-black text-slate-900 dark:text-white">
              {studentQAPageData.headline}
            </div>
            <div className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
              {studentQAPageData.description}
            </div>
          </div>
          <Button
            variant="primary"
            onClick={() => navigate("/management/student-qa/threads/new")}
          >
            新建问答线程
          </Button>
        </div>
      </section>

      <section className="grid gap-6 2xl:grid-cols-[300px_minmax(0,1fr)_360px]">
        <div className="rounded-[28px] border border-slate-200 bg-white/92 p-5 shadow-[0_18px_40px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-white/6">
          <div className="mb-4 text-lg font-black text-slate-900 dark:text-white">线程列表</div>
          <List
            items={records}
            keyExtractor={(item) => item.id}
            onItemClick={(item) => navigate(`/management/student-qa/threads/${item.id}`)}
            renderItem={(item) => (
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-3">
                  <div className="text-sm font-bold text-slate-900 dark:text-white">{item.title}</div>
                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600 dark:bg-white/10 dark:text-slate-200">
                    {item.status}
                  </span>
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-300">{item.subtitle}</div>
                <div className="text-sm leading-6 text-slate-600 dark:text-slate-300">{item.summary}</div>
              </div>
            )}
            actions={[
              {
                label: "打开",
                onClick: (item) => navigate(`/management/student-qa/threads/${item.id}`),
              },
            ]}
          />
        </div>

        <div className="space-y-6">
          {selected ? (
            <>
              <div className="rounded-[28px] border border-slate-200 bg-white/92 p-5 shadow-[0_18px_44px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-white/6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="text-xs font-bold uppercase tracking-[0.22em] text-slate-400">
                      Conversation Thread
                    </div>
                    <div className="mt-2 text-2xl font-black text-slate-900 dark:text-white">
                      {selected.title}
                    </div>
                    <div className="mt-2 text-sm text-slate-500 dark:text-slate-300">{selected.subtitle}</div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="secondary"
                      onClick={() => showToast("AI 建议回复已生成")}
                    >
                      生成建议回复
                    </Button>
                    <Button
                      variant="primary"
                      onClick={() => {
                        patchRecord(selected.id, { status: "已解决", updatedAt: Date.now() });
                        showToast("线程已标记为已解决");
                      }}
                    >
                      标记已解决
                    </Button>
                  </div>
                </div>
                <div className="mt-5 space-y-4">
                  <div className="rounded-[24px] bg-slate-50 p-4 dark:bg-slate-900/40">
                    <div className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">学生提问</div>
                    <div className="mt-2 text-sm leading-7 text-slate-700 dark:text-slate-200">
                      {selected.summary}
                    </div>
                  </div>
                  <div className="rounded-[24px] border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-white/5">
                    <div className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">标准回复草稿</div>
                    <div className="mt-2 text-sm leading-7 text-slate-700 dark:text-slate-200">
                      {selected.content}
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {["发送回复", "接受 AI 建议", "保存为 FAQ"].map((label) => (
                        <Button
                          key={label}
                          variant="secondary"
                          size="sm"
                          onClick={() => showToast(`${label} 已执行`)}
                        >
                          {label}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="rounded-[28px] border border-slate-200 bg-slate-950 p-4 text-white shadow-[0_22px_52px_rgba(15,23,42,0.24)]">
                <ChatDialog
                  dialogId={`management-student-qa-${selected.id}`}
                  botName="问答协同助手"
                  initMessage="我已经读取当前问题、FAQ 树和回复草稿，可以继续生成建议回复、追问澄清或标准 FAQ。"
                  transport={studentQAAdapter.createChatTransport(selected.title)}
                />
              </div>
            </>
          ) : null}
        </div>

        <div className="space-y-6">
          <div className="rounded-[28px] border border-slate-200 bg-white/92 p-5 shadow-[0_18px_44px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-white/6">
            <div className="text-xs font-bold uppercase tracking-[0.22em] text-slate-400">FAQ Tree</div>
            <div className="mt-3 space-y-3">
              {(selected?.faqTree ?? []).map((item: any) => (
                <button
                  key={item.title}
                  type="button"
                  onClick={() => showToast(`已切换到 FAQ：${item.title}`)}
                  className={`w-full rounded-[20px] border px-4 py-3 text-left ${
                    item.active
                      ? "border-blue-300 bg-blue-50 dark:border-blue-300/30 dark:bg-blue-500/10"
                      : "border-slate-200 bg-slate-50 dark:border-white/10 dark:bg-white/5"
                  }`}
                >
                  <div className="font-semibold text-slate-900 dark:text-white">{item.title}</div>
                  <div className="mt-1 text-sm text-slate-600 dark:text-slate-300">{item.answer}</div>
                </button>
              ))}
            </div>
          </div>
          <ActionDock
            actions={studentQAQuickActions}
            templates={[]}
            onInsert={(content) => {
              if (!selected) return;
              patchRecord(selected.id, {
                content: `${selected.content}\n\n${content}`.trim(),
                updatedAt: Date.now(),
              });
              showToast("已追加到回复草稿");
            }}
          />
        </div>
      </section>

      <FeatureRecordDialog
        open={createOpen}
        title="新建问答线程"
        fields={studentQAPageData.createFields}
        onClose={() => navigate("/management/student-qa")}
        onSubmit={(values) => {
          const created = createRecord(values);
          navigate(`/management/student-qa/threads/${created.id}`);
          showToast("已创建问答线程");
        }}
      />
    </div>
  );
};

export default StudentQA;
