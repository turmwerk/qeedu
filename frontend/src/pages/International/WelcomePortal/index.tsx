import React from "react";
import Button from "@/ui/Button";
import {
  ConversationBoard,
  ShowcasePanel,
  ShowcaseTag,
  showcasePanelClass,
} from "@/feature/ScenarioShowcase";

const WelcomePortal: React.FC = () => {
  return (
    <div className="flex w-full min-w-0 flex-col gap-6 px-4 py-6 md:px-6 xl:px-8">
      <div className="text-[34px] font-black leading-tight text-[#243246] md:text-[64px] dark:text-white">
        来华留学生智能助手
      </div>

      <section className={`${showcasePanelClass} p-6`}>
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.4fr)_360px]">
          <div>
            <div className="text-[13px] font-bold uppercase tracking-[0.18em] text-[#94a3b8]">Incoming Support Workspace</div>
            <div className="mt-2 text-[28px] font-black text-[#243246] dark:text-white">
              签证、报到、住宿、校园办事与语言适应统一管理
            </div>
            <div className="mt-3 text-[16px] leading-8 text-[#67748a] dark:text-[#dbe5f3]">
              面向 incoming students 把来华前材料、arrival、宿舍入住、校园卡与选课支持、双语 FAQ 和首周适应说明放到一个连续工作台里。
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <ShowcaseTag>Visa</ShowcaseTag>
              <ShowcaseTag>Arrival</ShowcaseTag>
              <ShowcaseTag>Housing</ShowcaseTag>
              <ShowcaseTag>Language</ShowcaseTag>
            </div>
          </div>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-1">
            {[
              ["当前支持中", "8 位", "2 位处于 arrival 周"],
              ["待补 FAQ", "14 条", "住宿与就医说明缺中英双语"],
              ["本周重点", "报到注册", "需要补校园卡与选课说明"],
            ].map(([label, value, detail]) => (
              <div key={label} className={`${showcasePanelClass} p-5`}>
                <div className="text-[14px] font-bold uppercase tracking-[0.14em] text-[#94a3b8]">{label}</div>
                <div className="mt-3 text-[34px] font-black text-[#243246] dark:text-white">{value}</div>
                <div className="mt-3 text-[15px] leading-7 text-[#67748a] dark:text-[#dbe5f3]">{detail}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)]">
        <ShowcasePanel
          eyebrow="New Support Profile"
          title="新增支持档案"
          description="先输入学生背景、项目和当前阶段，随后自动生成来华支持清单与双语说明。"
        >
          <div className="grid gap-4 md:grid-cols-2">
            {[
              ["学生姓名", "Anna Lee"],
              ["国别 / 地区", "Singapore"],
              ["项目 / 院系", "Exchange Student · School of Computing"],
              ["来校学期", "2026 秋季"],
              ["当前阶段", "报到注册"],
              ["支持负责人", "国际处王老师 / Buddy 赵同学"],
            ].map(([label, value]) => (
              <div key={label}>
                <div className="mb-2 text-[15px] font-bold text-[#243246] dark:text-white">{label}</div>
                <div className={`${showcasePanelClass} px-5 py-4 text-[16px] text-[#475569] dark:text-[#dbe5f3]`}>{value}</div>
              </div>
            ))}
          </div>
          <div className="mt-5">
            <div className="mb-2 text-[15px] font-bold text-[#243246] dark:text-white">核心支持需求</div>
            <div className={`${showcasePanelClass} min-h-[150px] px-5 py-4 text-[16px] leading-8 text-[#475569] dark:text-[#dbe5f3]`}>
              学生对宿舍入住、校园卡激活、报到注册流程和中文沟通比较不熟，希望拿到一份中英双语的 arrival / onboarding 指南，并对接首周生活支持。
            </div>
          </div>
          <div className="mt-6 flex justify-end gap-3">
            <Button className="rounded-[20px] border border-[#dbe1f3] bg-white px-5 py-3 text-sm font-semibold text-[#334155]">取消</Button>
            <Button className="rounded-[20px] bg-[var(--brand-blue)] px-5 py-3 text-sm font-semibold text-white">创建支持档案</Button>
          </div>
        </ShowcasePanel>

        <ConversationBoard
          eyebrow="Incoming Copilot"
          title="来华支持对话"
          description="围绕当前学生的 arrival、报到、宿舍和语言适应问题，实时生成下一步支持方案。"
          messages={[
            {
              role: "Coordinator",
              time: "10:08 AM",
              content: "这位学生下周到校，目前最担心的是宿舍入住和报到流程。请帮我生成一份 arrival 当天和第一周的支持清单。",
            },
            {
              role: "Incoming Copilot",
              time: "10:10 AM",
              content:
                "建议把 arrival 支持拆成三个层次：到校当天的迎接与入住、第一天的报到与校园账号开通、第一周的选课/校园卡/生活适应说明。双语 FAQ 建议优先覆盖住宿、校园卡、就医和紧急联系。",
              cards: [
                { title: "Arrival 当天", description: "接机路线、宿舍入住、紧急联系人和到校报备。" },
                { title: "报到注册", description: "注册时间、地点、校园卡和账号激活方式。" },
                { title: "第一周适应", description: "课程、地图、支付、就医、buddy 联系方式。" },
              ],
            },
            {
              role: "Coordinator",
              time: "10:14 AM",
              content: "请再帮我补一个中英双语版的 onboarding 通知提纲，学生中文比较弱。",
            },
            {
              role: "Incoming Copilot",
              time: "10:15 AM",
              content:
                "可以。通知里优先保留 arrival 时间、报到地点、宿舍入住说明、校园卡开通、紧急联系人和常见 FAQ 链接。中英文建议并排给出，避免学生只读其中一版遗漏信息。",
            },
          ]}
          summaryTitle="当前支持摘要"
          summaryItems={[
            { title: "当前学生画像", description: "Singapore incoming student，报到注册阶段，宿舍与语言支持优先。" },
            { title: "当前缺口", description: "缺一份中英双语 onboarding notice，缺校园卡与选课 FAQ。" },
            { title: "优先任务", description: "arrival 当天支持、宿舍入住、校园账号开通、就医与紧急联系说明。" },
          ]}
          checklistTitle="来华支持清单"
          checklistItems={[
            { title: "核验签证与 arrival 材料", description: "确认签证、保险、护照与到校时间信息。", checked: true, status: "完成", tone: "green" },
            { title: "整理报到注册说明", description: "补齐报到地点、所需证件和校园卡开通路径。", status: "高优先", tone: "red" },
            { title: "准备宿舍与生活 FAQ", description: "覆盖入住、水电网络、地图、就医和支付。", status: "中优先", tone: "orange" },
            { title: "生成中英双语 onboarding notice", description: "面向学生发出 arrival 前提醒和首周支持说明。", status: "高优先", tone: "red" },
          ]}
        />
      </div>
    </div>
  );
};

export default WelcomePortal;
