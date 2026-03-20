import React from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import ChatDialog from "@/feature/ChatDialog";
import FeatureRecordDialog from "@/feature/FeatureRecordDialog";
import ActionDock from "@/feature/RecordWorkspace/ActionDock";
import ResourceBoard from "@/feature/RecordWorkspace/ResourceBoard";
import { useFeatureRecords } from "@/hooks/useFeatureRecords";
import { materialsCenterAdapter } from "@/pages/Management/featureAdapters";
import {
  materialsCenterPageData,
  materialsCenterQuickActions,
} from "@/pages/Management/featureData";
import Button from "@/ui/Button";
import List from "@/ui/List";
import { showToast } from "@/ui/Toast";

const MaterialsCenter: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { collectionId } = useParams();
  const { records, createRecord, patchRecord } = useFeatureRecords(materialsCenterAdapter);
  const createOpen = location.pathname.endsWith(`/collections/new`);
  const selected = records.find((record) => record.id === collectionId) ?? records[0] ?? null;

  return (
    <div className="flex w-full min-w-0 flex-col gap-6 px-4 py-6 md:px-6 xl:px-8">
      <section className="rounded-[34px] border border-slate-200 bg-[linear-gradient(135deg,#ecfeff_0%,#eff6ff_50%,#f8fafc_100%)] p-6 shadow-[0_24px_54px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-[linear-gradient(135deg,rgba(8,47,73,0.45)_0%,rgba(15,23,42,0.88)_100%)]">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-3xl">
            <div className="text-xs font-bold uppercase tracking-[0.24em] text-slate-400">
              Materials Ops
            </div>
            <div className="mt-3 text-3xl font-black text-slate-900 dark:text-white">
              {materialsCenterPageData.headline}
            </div>
            <div className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
              {materialsCenterPageData.description}
            </div>
          </div>
          <Button
            variant="primary"
            onClick={() => navigate("/management/materials-center/collections/new")}
          >
            新建材料集合
          </Button>
        </div>
      </section>

      <section className="grid gap-6 2xl:grid-cols-[280px_minmax(0,1fr)_340px]">
        <div className="rounded-[28px] border border-slate-200 bg-white/92 p-5 shadow-[0_18px_40px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-white/6">
          <div className="mb-4 text-lg font-black text-slate-900 dark:text-white">材料集合树</div>
          <List
            items={records}
            keyExtractor={(item) => item.id}
            onItemClick={(item) => navigate(`/management/materials-center/collections/${item.id}`)}
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
                onClick: (item) => navigate(`/management/materials-center/collections/${item.id}`),
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
                      Review Table
                    </div>
                    <div className="mt-2 text-2xl font-black text-slate-900 dark:text-white">
                      {selected.title}
                    </div>
                    <div className="mt-2 text-sm text-slate-500 dark:text-slate-300">
                      {selected.subtitle}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="secondary"
                      onClick={() => showToast("模板已下载")}
                    >
                      下载模板
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => {
                        patchRecord(selected.id, { status: "待补件", updatedAt: Date.now() });
                        showToast("已更新为待补件");
                      }}
                    >
                      更新审核状态
                    </Button>
                    <Button variant="primary" onClick={() => showToast("缺件清单已导出")}>
                      导出缺件清单
                    </Button>
                  </div>
                </div>
                <div className="mt-5 overflow-hidden rounded-[24px] border border-slate-200 dark:border-white/10">
                  <div className="grid grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr] bg-slate-100 px-4 py-3 text-xs font-bold uppercase tracking-[0.18em] text-slate-500 dark:bg-slate-900/50 dark:text-slate-300">
                    <span>材料项</span>
                    <span>状态</span>
                    <span>补件情况</span>
                    <span>动作</span>
                  </div>
                  {[
                    ["成绩单", "已收齐", "无需补件", "预览"],
                    ["语言成绩", "审核中", "等待核验", "核验"],
                    ["课程计划", "缺失", "需补件", "提醒"],
                    ["签字页", "缺失", "需补件", "提醒"],
                  ].map(([title, status, issue, action]) => (
                    <div
                      key={title}
                      className="grid grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr] items-center border-t border-slate-200 bg-white px-4 py-4 text-sm dark:border-white/10 dark:bg-white/5"
                    >
                      <span className="font-semibold text-slate-900 dark:text-white">{title}</span>
                      <span className="text-slate-600 dark:text-slate-300">{status}</span>
                      <span className="text-slate-600 dark:text-slate-300">{issue}</span>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => showToast(`${title} 已执行 ${action}`)}
                      >
                        {action}
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
                <ResourceBoard resources={selected.resources ?? []} />
                <div className="rounded-[28px] border border-slate-200 bg-slate-950 p-4 text-white shadow-[0_22px_52px_rgba(15,23,42,0.24)]">
                  <ChatDialog
                    dialogId={`management-materials-${selected.id}`}
                    botName="材料审核助手"
                    initMessage="我已经读取当前材料集合、审核状态和模板资源，可以继续生成补件说明、审核摘要或批量提醒。"
                    transport={materialsCenterAdapter.createChatTransport(selected.title)}
                  />
                </div>
              </div>
            </>
          ) : null}
        </div>

        <div className="space-y-6">
          <ActionDock
            actions={materialsCenterQuickActions}
            templates={[]}
            onInsert={(content) => {
              if (!selected) return;
              patchRecord(selected.id, {
                content: `${selected.content}\n\n${content}`.trim(),
                updatedAt: Date.now(),
              });
              showToast("已把动作写入当前集合记录");
            }}
          />
          <div className="rounded-[28px] border border-slate-200 bg-white/92 p-5 shadow-[0_18px_44px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-white/6">
            <div className="text-xs font-bold uppercase tracking-[0.22em] text-slate-400">
              Upload & Preview
            </div>
            <div className="mt-2 text-xl font-black text-slate-900 dark:text-white">
              上传与预览
            </div>
            <div className="mt-4 grid gap-3">
              {[
                "上传学生材料包",
                "预览报名表 PDF",
                "批量导出审核摘要",
              ].map((label) => (
                <Button
                  key={label}
                  variant="secondary"
                  className="justify-start"
                  onClick={() => showToast(`${label} 功能已触发`)}
                >
                  {label}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <FeatureRecordDialog
        open={createOpen}
        title="新建材料集合"
        fields={materialsCenterPageData.createFields}
        onClose={() => navigate("/management/materials-center")}
        onSubmit={(values) => {
          const created = createRecord(values);
          navigate(`/management/materials-center/collections/${created.id}`);
          showToast("已创建材料集合");
        }}
        submitText="创建集合"
      />
    </div>
  );
};

export default MaterialsCenter;
