import React from "react";
import {
  ConversationBoard,
  ShowcaseTag,
  showcasePanelClass,
} from "@/feature/ScenarioShowcase";

const AbroadLife: React.FC = () => {
  return (
    <div className="flex w-full min-w-0 flex-col gap-6 px-4 py-6 md:px-6 xl:px-8">
      <div className="text-[34px] font-black leading-tight text-[#243246] md:text-[64px] dark:text-white">
        在外期间支持
      </div>

      <section className={`${showcasePanelClass} p-6`}>
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
          <div>
            <div className="text-[13px] font-bold uppercase tracking-[0.18em] text-[#94a3b8]">Abroad Support</div>
            <div className="mt-2 text-[28px] font-black text-[#243246] dark:text-white">课程、住宿、签证续办与应急事务的在外支持中心</div>
            <div className="mt-3 text-[16px] leading-8 text-[#67748a] dark:text-[#dbe5f3]">
              在海外期间，把选课调整、学分确认、宿舍续租、签证延长、就医和紧急事务放在统一工作台里，不再靠碎片聊天记录补漏。
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <ShowcaseTag>Course</ShowcaseTag>
              <ShowcaseTag>Housing</ShowcaseTag>
              <ShowcaseTag>Visa</ShowcaseTag>
              <ShowcaseTag>Emergency</ShowcaseTag>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {[
              ["当前支持事项", "12 项"],
              ["待处理续签", "2 项"],
              ["课程调整中", "4 门"],
              ["应急联系人", "已同步"],
            ].map(([label, value]) => (
              <div key={label} className={`${showcasePanelClass} p-5`}>
                <div className="text-[14px] font-bold uppercase tracking-[0.14em] text-[#94a3b8]">{label}</div>
                <div className="mt-3 text-[32px] font-black text-[#243246] dark:text-white">{value}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ConversationBoard
        eyebrow="Abroad Copilot"
        title="在外支持对话"
        description="围绕课程调整、住宿续约、签证与应急场景生成处理建议。"
        messages={[
          {
            role: "Student",
            time: "10:18 AM",
            content: "我想换掉一门课，但担心回国后学分不好认定；另外宿舍合同下个月到期，我还不确定要不要续住。",
          },
          {
            role: "Support Copilot",
            time: "10:20 AM",
            content:
              "建议把课程替换和学分认定前置确认绑定处理，同时把宿舍续住与后续签证/地址登记要求一起核查。优先顺序是：先确认课程替代可行性，再决定住宿是否续住。",
              cards: [
                { title: "课程替换", description: "先拿到课程 syllabus，与院系确认学分对接方式。" },
                { title: "住宿续住", description: "确认续租期限、费用变化和搬出时限。" },
                { title: "签证 / 地址", description: "若换住址，及时同步学校和当地登记要求。" },
              ],
            },
          {
            role: "Student",
            time: "10:23 AM",
            content: "如果遇到证件遗失或者夜间突发情况，我应该先联系谁？",
          },
          {
            role: "Support Copilot",
            time: "10:24 AM",
            content:
              "建议保留三层联系人：当地紧急服务、学校国际处/安保、同住同学或 buddy。证件遗失要先冻结相关卡证，再同步学校与领馆流程；夜间突发情况优先保证人身安全和位置共享。",
            },
        ]}
        summaryTitle="当前在外摘要"
        summaryItems={[
          { title: "核心场景", description: "课程调整、宿舍续住、签证延长、证件与夜间应急。" },
          { title: "当前建议", description: "先确认学分认定与课程替换，再决定住宿续签。" },
          { title: "风险提醒", description: "变更住址与课程后，注意同步学校和签证相关信息。" },
        ]}
        checklistTitle="在外期间待办"
        checklistItems={[
          { title: "确认课程替换方案", description: "收集 syllabus 并向院系确认认定路径。", status: "高优先", tone: "red" },
          { title: "比较宿舍续住与外租方案", description: "同步预算、交通与合同起止。", status: "中优先", tone: "orange" },
          { title: "核查签证 / 地址更新要求", description: "若搬家或课程负荷变化，确认是否需要额外材料。", status: "中优先", tone: "orange" },
          { title: "更新紧急联系人卡", description: "保留报警、安保、国际处、领馆和 buddy 联系方式。", checked: true, status: "完成", tone: "green" },
        ]}
      />
    </div>
  );
};

export default AbroadLife;
