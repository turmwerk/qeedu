import React, { useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import ChatDialog from "@/feature/ChatDialog";
import FeatureRecordDialog from "@/feature/FeatureRecordDialog";
import ActionDock from "@/feature/RecordWorkspace/ActionDock";
import TemplateWorkbench from "@/feature/RecordWorkspace/TemplateWorkbench";
import { useFeatureRecords } from "@/hooks/useFeatureRecords";
import { announcementGeneratorAdapter } from "@/pages/Management/featureAdapters";
import {
  announcementGeneratorPageData,
  announcementGeneratorQuickActions,
} from "@/pages/Management/featureData";
import Button from "@/ui/Button";
import ConfirmDialog from "@/ui/ConfirmDialog";
import List from "@/ui/List";
import SearchBar from "@/ui/SearchBar";
import { showToast } from "@/ui/Toast";

const AnnouncementGenerator: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { announcementId } = useParams();
  const { records, createRecord, patchRecord, duplicateRecord, removeRecord } =
    useFeatureRecords(announcementGeneratorAdapter);
  const [keyword, setKeyword] = useState("");
  const [tab, setTab] = useState<"正式通知" | "FAQ" | "短版">("正式通知");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const createOpen = location.pathname.endsWith("/new");

  const filtered = useMemo(() => {
    const lowered = keyword.trim().toLowerCase();
    if (!lowered) return records;
    return records.filter((item) =>
      [item.title, item.subtitle, item.summary, ...(item.tags ?? [])]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(lowered),
    );
  }, [keyword, records]);

  const selected = records.find((item) => item.id === announcementId) ?? filtered[0] ?? records[0] ?? null;

  const appendContent = (content: string, replace = false) => {
    if (!selected) return;
    patchRecord(selected.id, {
      content: replace ? content : `${selected.content}\n\n${content}`.trim(),
      updatedAt: Date.now(),
    });
  };

  const previewContent = useMemo(() => {
    if (!selected) return "";
    if (tab === "FAQ") return `${selected.content}\n\n## FAQ\n1. GPA 如何计算？\n2. 材料如何命名？`;
    if (tab === "短版") return `【简版提醒】${selected.title}\n请于规定时间内完成材料提交与系统填报，详情见正式通知。`;
    return selected.content;
  }, [selected, tab]);

  return (
    <div className="flex w-full min-w-0 flex-col gap-6 px-4 py-6 md:px-6 xl:px-8">
      <section className="rounded-[34px] border border-[#dbe1f3] bg-[linear-gradient(135deg,#fff7ed_0%,#fff1f2_40%,#eef2ff_100%)] p-6 shadow-[0_24px_54px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-[linear-gradient(135deg,rgba(120,53,15,0.3)_0%,rgba(49,46,129,0.2)_100%)]">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-3xl">
            <div className="text-xs font-bold uppercase tracking-[0.24em] text-slate-400">
              Announcement Editor
            </div>
            <div className="mt-3 text-3xl font-black text-slate-900 dark:text-white">
              {announcementGeneratorPageData.headline}
            </div>
            <div className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
              {announcementGeneratorPageData.description}
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => navigate("/management/announcement-generator")}>
              历史记录
            </Button>
            <Button variant="primary" onClick={() => navigate("/management/announcement-generator/new")}>
              新建通知
            </Button>
          </div>
        </div>
      </section>

      <section className="grid gap-6 2xl:grid-cols-[320px_minmax(0,1fr)_360px]">
        <div className="space-y-4">
          <div className="rounded-[28px] border border-slate-200 bg-white/90 p-5 shadow-[0_18px_40px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-white/6">
            <div className="mb-4">
              <SearchBar
                value={keyword}
                onChange={setKeyword}
                placeholder="搜索通知标题或渠道"
              />
            </div>
            <List
              items={filtered}
              keyExtractor={(item) => item.id}
              onItemClick={(item) => navigate(`/management/announcement-generator/${item.id}`)}
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
                  label: "继续",
                  onClick: (item) => navigate(`/management/announcement-generator/${item.id}`),
                },
                {
                  label: "复制",
                  onClick: (item) => {
                    const duplicated = duplicateRecord(item.id);
                    if (duplicated) {
                      navigate(`/management/announcement-generator/${duplicated.id}`);
                      showToast("已复制公告记录");
                    }
                  },
                },
                {
                  label: "删除",
                  onClick: (item) => setDeleteId(item.id),
                  className:
                    "rounded-lg border border-rose-200 bg-rose-50 px-2.5 py-1.5 text-sm font-semibold text-rose-600 hover:bg-rose-100 dark:border-rose-400/20 dark:bg-rose-500/10 dark:text-rose-200",
                },
              ]}
            />
          </div>
          <div className="rounded-[28px] border border-slate-200 bg-slate-950 p-5 text-white shadow-[0_20px_48px_rgba(15,23,42,0.24)]">
            <div className="text-xs font-bold uppercase tracking-[0.22em] text-indigo-200/80">
              Channels
            </div>
            <div className="mt-3 grid gap-3">
              {[
                ["官网", "适合完整版通知"],
                ["邮件", "适合附 FAQ 和附件说明"],
                ["公众号", "适合压缩短版"],
                ["群通知", "适合提醒截止时间"],
              ].map(([title, desc]) => (
                <button
                  key={title}
                  type="button"
                  onClick={() => showToast(`${title} 渠道已加入当前发布方案`)}
                  className="rounded-[20px] border border-white/10 bg-white/6 px-4 py-3 text-left hover:border-indigo-300/50 hover:bg-white/10"
                >
                  <div className="font-semibold">{title}</div>
                  <div className="mt-1 text-sm text-slate-300">{desc}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-5">
          {selected ? (
            <>
              <div className="rounded-[30px] border border-slate-200 bg-white/92 p-5 shadow-[0_20px_48px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-white/6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="text-xs font-bold uppercase tracking-[0.22em] text-slate-400">
                      Structured Brief
                    </div>
                    <div className="mt-2 text-2xl font-black text-slate-900 dark:text-white">
                      {selected.title}
                    </div>
                    <div className="mt-2 text-sm text-slate-500 dark:text-slate-300">
                      {selected.subtitle}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button variant="secondary" onClick={() => setTab("FAQ")}>
                      生成 FAQ
                    </Button>
                    <Button variant="secondary" onClick={() => setTab("短版")}>
                      公众号短版
                    </Button>
                    <Button
                      variant="primary"
                      onClick={() => {
                        appendContent("\n\n## 发布版\n- 已整理正式通知结构与渠道说明");
                        showToast("正式通知已生成发布版");
                      }}
                    >
                      生成正式通知
                    </Button>
                  </div>
                </div>
                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  {[
                    ["通知对象", selected.tags?.[0] ?? "未指定"],
                    ["状态", selected.status ?? "草稿"],
                    ["渠道", selected.subtitle ?? "待补充"],
                    ["最近更新", "刚刚可继续追问"],
                  ].map(([label, value]) => (
                    <div
                      key={label}
                      className="rounded-[22px] border border-slate-200 bg-slate-50 px-4 py-3 dark:border-white/10 dark:bg-slate-900/40"
                    >
                      <div className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">{label}</div>
                      <div className="mt-2 text-sm font-semibold text-slate-900 dark:text-white">{value}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[30px] border border-slate-200 bg-slate-950 p-5 text-white shadow-[0_20px_52px_rgba(15,23,42,0.24)]">
                <div className="mb-4 flex flex-wrap items-center gap-2">
                  {(["正式通知", "FAQ", "短版"] as const).map((item) => (
                    <Button
                      key={item}
                      className={`rounded-full px-4 py-2 text-sm font-semibold ${
                        tab === item
                          ? "bg-white text-slate-900"
                          : "border border-white/15 bg-white/8 text-white"
                      }`}
                      onClick={() => setTab(item)}
                    >
                      {item}
                    </Button>
                  ))}
                </div>
                <div className="rounded-[24px] border border-white/10 bg-white/6 p-5 text-sm leading-7 text-slate-100">
                  {previewContent}
                </div>
              </div>
            </>
          ) : (
            <div className="rounded-[28px] border border-dashed border-slate-300 bg-white/70 p-10 text-center text-slate-500 dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
              先创建一条通知记录。
            </div>
          )}
        </div>

        <div className="space-y-5">
          {selected ? (
            <>
              <TemplateWorkbench
                templates={selected.templates ?? []}
                onInsert={appendContent}
              />
              <ActionDock
                actions={announcementGeneratorQuickActions}
                templates={selected.templates ?? []}
                onInsert={appendContent}
              />
              <div className="rounded-[28px] border border-slate-200 bg-white/92 p-4 shadow-[0_18px_44px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-white/6">
                <ChatDialog
                  dialogId={`management-announcement-${selected.id}`}
                  botName="公告润色助手"
                  initMessage="我已经读取当前通知背景、模板和输出渠道，可以继续润色正式通知、FAQ 或移动端短版。"
                  transport={announcementGeneratorAdapter.createChatTransport(selected.title)}
                />
              </div>
            </>
          ) : null}
        </div>
      </section>

      <FeatureRecordDialog
        open={createOpen}
        title="新建通知记录"
        fields={announcementGeneratorPageData.createFields}
        onClose={() => navigate("/management/announcement-generator")}
        onSubmit={(values) => {
          const created = createRecord(values);
          navigate(`/management/announcement-generator/${created.id}`);
          showToast("已创建通知记录");
        }}
        submitText="创建并进入编辑台"
      />

      <ConfirmDialog
        open={!!deleteId}
        title="删除公告记录"
        description="删除后该通知草稿和本地对话记录会一并移除。"
        danger
        onCancel={() => setDeleteId(null)}
        onConfirm={() => {
          if (deleteId) {
            removeRecord(deleteId);
            if (announcementId === deleteId) navigate("/management/announcement-generator");
            showToast("已删除公告记录");
          }
          setDeleteId(null);
        }}
      />
    </div>
  );
};

export default AnnouncementGenerator;
