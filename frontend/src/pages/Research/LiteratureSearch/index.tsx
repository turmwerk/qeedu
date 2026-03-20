import React from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import ChatDialog from "@/feature/ChatDialog";
import FeatureRecordDialog from "@/feature/FeatureRecordDialog";
import ActionDock from "@/feature/RecordWorkspace/ActionDock";
import ResourceBoard from "@/feature/RecordWorkspace/ResourceBoard";
import { useFeatureRecords } from "@/hooks/useFeatureRecords";
import { literatureSearchAdapter } from "@/pages/Research/featureAdapters";
import {
  literatureSearchPageData,
  literatureSearchQuickActions,
} from "@/pages/Research/featureData";
import Button from "@/ui/Button";
import List from "@/ui/List";
import { showToast } from "@/ui/Toast";

const LiteratureSearch: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { queryId } = useParams();
  const { records, createRecord, patchRecord } = useFeatureRecords(literatureSearchAdapter);
  const createOpen = location.pathname.endsWith("/new");
  const selected = records.find((record) => record.id === queryId) ?? records[0] ?? null;

  return (
    <div className="flex w-full min-w-0 flex-col gap-6 px-4 py-6 md:px-6 xl:px-8">
      <section className="rounded-[34px] bg-[linear-gradient(135deg,#020617_0%,#1e3a8a_48%,#0f766e_100%)] p-6 text-white shadow-[0_24px_60px_rgba(15,23,42,0.28)]">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-3xl">
            <div className="text-xs font-bold uppercase tracking-[0.24em] text-cyan-100/80">
              Retrieval Lab
            </div>
            <div className="mt-3 text-3xl font-black md:text-5xl">
              {literatureSearchPageData.headline}
            </div>
            <div className="mt-3 text-sm leading-7 text-slate-200">
              {literatureSearchPageData.description}
            </div>
          </div>
          <Button
            className="rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-slate-900"
            onClick={() => navigate("/research/literature-search/queries/new")}
          >
            新建检索查询
          </Button>
        </div>
      </section>

      <section className="grid gap-6 2xl:grid-cols-[320px_minmax(0,1fr)_360px]">
        <div className="space-y-5">
          <div className="rounded-[28px] border border-slate-200 bg-white/92 p-5 shadow-[0_18px_40px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-white/6">
            <div className="text-xs font-bold uppercase tracking-[0.22em] text-slate-400">
              Query Rail
            </div>
            <div className="mt-2 text-xl font-black text-slate-900 dark:text-white">查询列表</div>
            <div className="mt-4">
              <List
                items={records}
                keyExtractor={(item) => item.id}
                onItemClick={(item) => navigate(`/research/literature-search/queries/${item.id}`)}
                renderItem={(item) => (
                  <div className="space-y-2">
                    <div className="text-sm font-bold text-slate-900 dark:text-white">{item.title}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-300">{item.subtitle}</div>
                    <div className="text-sm text-slate-600 dark:text-slate-300">{item.summary}</div>
                  </div>
                )}
                actions={[
                  {
                    label: "打开",
                    onClick: (item) => navigate(`/research/literature-search/queries/${item.id}`),
                  },
                ]}
              />
            </div>
          </div>

          <div className="rounded-[28px] border border-slate-200 bg-slate-950 p-5 text-white shadow-[0_20px_48px_rgba(15,23,42,0.24)]">
            <div className="text-xs font-bold uppercase tracking-[0.22em] text-emerald-200/80">
              Query Builder
            </div>
            <div className="mt-3 rounded-[24px] border border-white/10 bg-white/6 p-4 text-sm leading-7 text-slate-100">
              {selected?.content ?? 'TS=("generative AI") AND (creative workflow)'}
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {(selected?.filters ?? []).map((filter: string) => (
                <span
                  key={filter}
                  className="rounded-full border border-white/10 bg-white/8 px-3 py-1 text-xs font-semibold text-slate-100"
                >
                  {filter}
                </span>
              ))}
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button variant="secondary" onClick={() => showToast("已执行检索")}>
                运行检索
              </Button>
              <Button variant="secondary" onClick={() => showToast("已生成主题聚类")}>
                主题聚类
              </Button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-[28px] border border-slate-200 bg-white/92 p-5 shadow-[0_18px_44px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-white/6">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="text-xs font-bold uppercase tracking-[0.22em] text-slate-400">
                  Saved Basket
                </div>
                <div className="mt-2 text-xl font-black text-slate-900 dark:text-white">
                  候选论文与移交动作
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="secondary" onClick={() => showToast("引用已导出为 BibTeX")}>
                  导出引用
                </Button>
                <Button variant="primary" onClick={() => navigate("/research/paper-reader")}>
                  移交精读
                </Button>
              </div>
            </div>
            <div className="grid gap-3">
              {(selected?.savedPapers ?? []).map((paper: any) => (
                <div
                  key={paper.id}
                  className="rounded-[22px] border border-slate-200 bg-slate-50 px-4 py-4 dark:border-white/10 dark:bg-slate-900/40"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="text-sm font-bold text-slate-900 dark:text-white">{paper.title}</div>
                      <div className="mt-1 text-xs text-slate-500 dark:text-slate-300">{paper.meta}</div>
                    </div>
                    <span className="rounded-full bg-blue-100 px-2.5 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-500/15 dark:text-blue-200">
                      {paper.status}
                    </span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {["保存论文", "写筛选理由", "加入比较"].map((label) => (
                      <Button
                        key={label}
                        variant="secondary"
                        size="sm"
                        onClick={() => showToast(`${paper.title}：${label}`)}
                      >
                        {label}
                      </Button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {selected ? (
            <div className="rounded-[28px] border border-slate-200 bg-white/92 p-4 shadow-[0_18px_44px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-white/6">
              <ChatDialog
                dialogId={`research-literature-${selected.id}`}
                botName="检索综述助手"
                initMessage="我已经读取当前检索式、筛选条件和候选论文，可以继续帮你缩小范围、总结主题簇或输出筛选理由。"
                transport={literatureSearchAdapter.createChatTransport(selected.title)}
              />
            </div>
          ) : null}
        </div>

        <div className="space-y-6">
          <ActionDock
            actions={literatureSearchQuickActions}
            templates={[]}
            onInsert={(content) => {
              if (!selected) return;
              patchRecord(selected.id, {
                content: `${selected.content}\n\n${content}`.trim(),
                updatedAt: Date.now(),
              });
              showToast("已写入当前查询记录");
            }}
          />
          <ResourceBoard resources={selected?.resources ?? []} />
        </div>
      </section>

      <FeatureRecordDialog
        open={createOpen}
        title="新建检索查询"
        fields={literatureSearchPageData.createFields}
        onClose={() => navigate("/research/literature-search")}
        onSubmit={(values) => {
          const created = createRecord(values);
          navigate(`/research/literature-search/queries/${created.id}`);
          showToast("已创建检索查询");
        }}
      />
    </div>
  );
};

export default LiteratureSearch;
