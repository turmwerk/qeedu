import React from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import ChatDialog from "@/feature/ChatDialog";
import FeatureRecordDialog from "@/feature/FeatureRecordDialog";
import ResourceBoard from "@/feature/RecordWorkspace/ResourceBoard";
import { useFeatureRecords } from "@/hooks/useFeatureRecords";
import { matchingLabAdapter } from "@/pages/International/featureAdapters";
import { matchingLabPageData, matchingLabQuickActions } from "@/pages/International/featureData";
import Button from "@/ui/Button";
import List from "@/ui/List";
import { showToast } from "@/ui/Toast";

const MatchingLab: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { analysisId } = useParams();
  const { records, createRecord } = useFeatureRecords(matchingLabAdapter);
  const createOpen = location.pathname.endsWith("/new");
  const selected = records.find((record) => record.id === analysisId) ?? records[0] ?? null;

  return (
    <div className="flex w-full min-w-0 flex-col gap-6 px-4 py-6 md:px-6 xl:px-8">
      <section className="rounded-[34px] bg-[linear-gradient(135deg,#1e1b4b_0%,#312e81_48%,#0f766e_100%)] p-6 text-white shadow-[0_24px_60px_rgba(49,46,129,0.32)]">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-3xl">
            <div className="text-xs font-bold uppercase tracking-[0.24em] text-violet-100/80">
              Decision Lab
            </div>
            <div className="mt-3 text-3xl font-black md:text-4xl">
              {matchingLabPageData.headline}
            </div>
            <div className="mt-3 text-sm leading-7 text-violet-50/90">
              {matchingLabPageData.description}
            </div>
          </div>
          <Button
            className="rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-slate-900"
            onClick={() => navigate("/international/matching-lab/analyses/new")}
          >
            新建分析
          </Button>
        </div>
      </section>

      <section className="grid gap-6 2xl:grid-cols-[320px_minmax(0,1fr)_360px]">
        <div className="rounded-[28px] border border-slate-200 bg-white/92 p-5 shadow-[0_18px_40px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-white/6">
          <div className="mb-4 text-xl font-black text-slate-900 dark:text-white">分析记录</div>
          <List
            items={records}
            keyExtractor={(item) => item.id}
            onItemClick={(item) => navigate(`/international/matching-lab/analyses/${item.id}`)}
            renderItem={(item) => (
              <div className="space-y-2">
                <div className="text-sm font-bold text-slate-900 dark:text-white">{item.title}</div>
                <div className="text-xs text-slate-500 dark:text-slate-300">{item.subtitle}</div>
                <div className="text-sm leading-6 text-slate-600 dark:text-slate-300">{item.summary}</div>
              </div>
            )}
            actions={[
              {
                label: "打开",
                onClick: (item) => navigate(`/international/matching-lab/analyses/${item.id}`),
              },
            ]}
          />
        </div>

        <div className="space-y-6">
          <div className="rounded-[28px] border border-slate-200 bg-white/92 p-5 shadow-[0_18px_44px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-white/6">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="text-xs font-bold uppercase tracking-[0.22em] text-slate-400">Profile Snapshot</div>
                <div className="mt-2 text-xl font-black text-slate-900 dark:text-white">画像与候选矩阵</div>
              </div>
              <Button variant="primary" onClick={() => showToast("已运行项目推荐")}>
                运行推荐
              </Button>
            </div>
            {selected ? (
              <div className="space-y-4">
                <div className="rounded-[22px] border border-slate-200 bg-slate-50 p-4 text-sm leading-7 text-slate-700 dark:border-white/10 dark:bg-slate-900/40 dark:text-slate-200">
                  {selected.content}
                </div>
                <div className="grid gap-3 md:grid-cols-3">
                  {(selected.recommendations ?? []).map((item: any, index: number) => (
                    <div
                      key={item.title}
                      className={`rounded-[22px] border p-4 ${
                        index === 0
                          ? "border-emerald-200 bg-emerald-50 dark:border-emerald-400/20 dark:bg-emerald-500/10"
                          : index === 1
                            ? "border-sky-200 bg-sky-50 dark:border-sky-400/20 dark:bg-sky-500/10"
                            : "border-violet-200 bg-violet-50 dark:border-violet-400/20 dark:bg-violet-500/10"
                      }`}
                    >
                      <div className="text-sm font-bold text-slate-900 dark:text-white">{item.title}</div>
                      <div className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{item.reason}</div>
                      <div className="mt-3 text-2xl font-black text-slate-900 dark:text-white">{item.score}</div>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>

          {selected ? (
            <div className="rounded-[28px] border border-slate-200 bg-slate-950 p-4 text-white shadow-[0_22px_52px_rgba(15,23,42,0.24)]">
              <ChatDialog
                dialogId={`international-matching-${selected.id}`}
                botName="决策分析助手"
                initMessage="我已经读取当前画像、候选排序和联动模块，可以继续解释优先级、补决策说明或输出导师沟通稿。"
                transport={matchingLabAdapter.createChatTransport(selected.title)}
              />
            </div>
          ) : null}
        </div>

        <div className="space-y-6">
          <div className="rounded-[28px] border border-slate-200 bg-white/92 p-5 shadow-[0_18px_44px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-white/6">
            <div className="text-xs font-bold uppercase tracking-[0.22em] text-slate-400">Decision Actions</div>
            <div className="mt-4 grid gap-3">
              {matchingLabQuickActions.map((item) => (
                <Button
                  key={item.id}
                  variant="secondary"
                  className="justify-start"
                  onClick={() => showToast(`${item.title} 已触发`)}
                >
                  {item.title}
                </Button>
              ))}
              <Button variant="primary" onClick={() => showToast("已锁定当前优先级")}>
                锁定优先级
              </Button>
            </div>
          </div>
          <ResourceBoard resources={selected?.resources ?? []} />
        </div>
      </section>

      <FeatureRecordDialog
        open={createOpen}
        title="新建匹配分析"
        fields={matchingLabPageData.createFields}
        onClose={() => navigate("/international/matching-lab")}
        onSubmit={(values) => {
          const created = createRecord(values);
          navigate(`/international/matching-lab/analyses/${created.id}`);
          showToast("已创建新的匹配分析");
        }}
      />
    </div>
  );
};

export default MatchingLab;
