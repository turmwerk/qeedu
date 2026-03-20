import React from "react";
import { useNavigate } from "react-router-dom";
import { RecordList, ShowcasePanel, ShowcaseTag, showcasePanelClass } from "@/feature/ScenarioShowcase";
import Button from "@/ui/Button";

const AnnouncementGenerator: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex w-full min-w-0 flex-col gap-6 px-4 py-6 md:px-6 xl:px-8">
      <section className={`${showcasePanelClass} p-6`}>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="text-[13px] font-bold uppercase tracking-[0.18em] text-[#94a3b8]">Announcement Generator</div>
            <div className="mt-2 text-[34px] font-black text-[#243246] dark:text-white">通知与公告生成助手</div>
            <div className="mt-3 max-w-3xl text-[16px] leading-8 text-[#67748a] dark:text-[#dbe5f3]">
              sample 里的公告生成原型已经落成正式入口页，支持历史通知记录、新建通知草稿和继续对话润色。
            </div>
          </div>
          <Button
            className="rounded-2xl bg-[var(--brand-blue)] px-5 py-3 text-sm font-semibold text-white"
            onClick={() => navigate("/management/announcement-generator/dialogue/orientation-notice")}
          >
            进入示例对话
          </Button>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <RecordList
          eyebrow="History"
          title="历史通知记录"
          description="保留不同通知类型、发布时间和发布渠道，便于基于旧稿继续生成。"
          actionLabel="新建通知"
          records={[
            {
              title: "2026 春季交换项目报名通知",
              meta: "国际处 · 3 月 12 日更新",
              summary: "覆盖报名资格、时间节点、材料要求和咨询方式。",
              status: "已发布",
              tags: ["国际交流", "邮件+公众号", "需附件"],
              actions: [{ label: "继续润色", primary: true }, { label: "查看详情" }],
            },
            {
              title: "研究生中期考核提醒",
              meta: "研究生院 · 3 月 08 日",
              summary: "提醒各学院在规定时点完成材料提交与系统填报。",
              status: "待终审",
              tags: ["研究生事务", "系统填报"],
              actions: [{ label: "补充说明", primary: true }, { label: "复制模板" }],
            },
          ]}
        />

        <ShowcasePanel
          eyebrow="Workflow"
          title="生成流程"
          description="先结构化输入，再由 LLM 生成多渠道版本，并保留继续追问能力。"
        >
          <div className="grid gap-4">
            {[
              ["输入要素", "通知对象、发布时间、截止节点、附件要求、渠道和语气。"],
              ["输出版本", "生成正式通知、短信摘要、公众号短版和 FAQ 补充。"],
              ["继续对话", "支持追问口吻调整、补充条件、压缩字数和增加醒目提示。"],
            ].map(([title, desc]) => (
              <div key={title} className={`${showcasePanelClass} p-5`}>
                <div className="flex items-center gap-3">
                  <div className="text-[18px] font-black text-[#243246] dark:text-white">{title}</div>
                  <ShowcaseTag>{title === "继续对话" ? "LLM" : "Step"}</ShowcaseTag>
                </div>
                <div className="mt-3 text-[15px] leading-7 text-[#67748a] dark:text-[#dbe5f3]">{desc}</div>
              </div>
            ))}
          </div>
        </ShowcasePanel>
      </div>
    </div>
  );
};

export default AnnouncementGenerator;
