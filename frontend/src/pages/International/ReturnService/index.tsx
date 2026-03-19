import React from "react";
import {
  RecordList,
  ShowcasePanel,
  ShowcaseTag,
  showcasePanelClass,
} from "@/feature/ScenarioShowcase";

const ReturnService: React.FC = () => {
  return (
    <div className="flex w-full min-w-0 flex-col gap-6 px-4 py-6 md:px-6 xl:px-8">
      <div className="text-[34px] font-black leading-tight text-[#243246] md:text-[64px] dark:text-white">
        回国与成果沉淀
      </div>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.3fr)_360px]">
        <ShowcasePanel
          eyebrow="Return Overview"
          title="返校后的关键事项与经验回流"
          description="把学分认定、成绩转换、报销归档、项目复盘和经验分享统一安排，避免返校后只忙手续不沉淀经验。"
        >
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {[
              ["学分认定", "3 项待确认"],
              ["材料归档", "8 份需上传"],
              ["报销办理", "2 单处理中"],
              ["经验回流", "1 场分享待准备"],
            ].map(([label, value]) => (
              <div key={label} className={`${showcasePanelClass} p-5`}>
                <div className="text-[14px] font-bold uppercase tracking-[0.14em] text-[#94a3b8]">{label}</div>
                <div className="mt-3 text-[28px] font-black text-[#243246] dark:text-white">{value}</div>
              </div>
            ))}
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            <ShowcaseTag>Credit Transfer</ShowcaseTag>
            <ShowcaseTag>Archive</ShowcaseTag>
            <ShowcaseTag>Sharing</ShowcaseTag>
            <ShowcaseTag>Review</ShowcaseTag>
          </div>
        </ShowcasePanel>
        <div className={`${showcasePanelClass} p-6`}>
          <div className="text-[13px] font-bold uppercase tracking-[0.18em] text-[#94a3b8]">Next Step</div>
          <div className="mt-2 text-[24px] font-black text-[#243246] dark:text-white">返校一周内优先完成</div>
          <div className="mt-4 space-y-4">
            {[
              "确认成绩单、课程大纲与学分认定流程",
              "整理报销发票、交流证明与票据扫描件",
              "沉淀课程评价、城市建议和踩坑经验",
            ].map((item) => (
              <div key={item} className="rounded-[22px] border border-[#dbe1f3] bg-white/76 px-4 py-4 text-[15px] font-medium text-[#475569] dark:border-white/10 dark:bg-white/6 dark:text-[#dbe5f3]">
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <RecordList
        eyebrow="History Records"
        title="返校事项记录"
        description="按事项记录学分认定、报销归档和经验回流，便于持续补充。"
        actionLabel="新增事项"
        records={[
          {
            title: "UBC 交换学分认定办理",
            meta: "2026 春季学期 · 成绩单、课程大纲、替代课程说明",
            status: "进行中",
            tags: ["学分认定", "CS", "院系审批"],
            actions: [{ label: "继续处理", primary: true }, { label: "查看清单" }, { label: "删除" }],
          },
          {
            title: "交流费用报销归档",
            meta: "机票、保险、住宿票据整理中",
            status: "待提交",
            tags: ["报销办理", "票据归档"],
            actions: [{ label: "继续处理", primary: true }, { label: "查看清单" }, { label: "删除" }],
          },
          {
            title: "返校分享与经验 FAQ",
            meta: "面向下一届交换学生的经验沉淀",
            status: "待准备",
            tags: ["经验回流", "FAQ", "项目复盘"],
            actions: [{ label: "继续处理", primary: true }, { label: "查看清单" }, { label: "删除" }],
          },
        ]}
      />
    </div>
  );
};

export default ReturnService;
