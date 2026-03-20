import React from "react";
import {
  ConversationBoard,
  ShowcasePanel,
  ShowcaseTag,
  showcasePanelClass,
} from "@/feature/ScenarioShowcase";
import Button from "@/ui/Button";

const WelcomePortalDetailPage: React.FC = () => {
  return (
    <div className="flex w-full min-w-0 flex-col gap-6 px-4 py-6 md:px-6 xl:px-8">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-[13px] font-bold uppercase tracking-[0.18em] text-[#94a3b8]">Student Support Case</div>
          <div className="text-[34px] font-black leading-tight text-[#243246] dark:text-white">
            Anna Lee - 来华支持档案
          </div>
        </div>
        <div className="flex gap-3">
          <Button className="rounded-[20px] border border-[#dbe1f3] bg-white px-5 py-3 text-sm font-semibold text-[#334155]">
            编辑档案
          </Button>
          <Button className="rounded-[20px] bg-[var(--brand-blue)] px-5 py-3 text-sm font-semibold text-white">
            更新状态
          </Button>
        </div>
      </div>

      <section className={`${showcasePanelClass} p-6`}>
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div>
            <div className="text-[13px] font-bold uppercase tracking-[0.18em] text-[#94a3b8]">Student Information</div>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {[
                ["学生姓名", "Anna Lee"],
                ["国别 / 地区", "Singapore"],
                ["项目 / 院系", "Exchange Student · School of Computing"],
                ["来校学期", "2026 秋季"],
                ["当前阶段", "报到注册"],
                ["支持负责人", "国际处王老师 / Buddy 赵同学"],
                ["到校时间", "2026年8月25日"],
                ["联系方式", "anna.lee@nus.edu.sg"],
              ].map(([label, value]) => (
                <div key={label}>
                  <div className="mb-2 text-[15px] font-bold text-[#243246] dark:text-white">{label}</div>
                  <div className={`${showcasePanelClass} px-4 py-3 text-[15px] text-[#475569] dark:text-[#dbe5f3]`}>
                    {value}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="grid gap-3">
            <div className="flex flex-wrap gap-2">
              <ShowcaseTag tone="green">已到校</ShowcaseTag>
              <ShowcaseTag>报到进行中</ShowcaseTag>
              <ShowcaseTag tone="orange">住宿待确认</ShowcaseTag>
            </div>
            {[
              ["支持进度", "75%", "8 / 12 项已完成"],
              ["紧急程度", "中等", "住宿问题需关注"],
              ["完成时间", "预计3天", "报到注册阶段"],
            ].map(([label, value, detail]) => (
              <div key={label} className={`${showcasePanelClass} p-5`}>
                <div className="text-[14px] font-bold uppercase tracking-[0.14em] text-[#94a3b8]">{label}</div>
                <div className="mt-3 text-[24px] font-black text-[#243246] dark:text-white">{value}</div>
                <div className="mt-2 text-[14px] leading-6 text-[#67748a] dark:text-[#dbe5f3]">{detail}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)]">
        <ShowcasePanel
          eyebrow="Support Requirements"
          title="核心支持需求"
          description="学生当前面临的主要问题和支持重点。"
        >
          <div className={`${showcasePanelClass} min-h-[200px] p-5 text-[16px] leading-8 text-[#475569] dark:text-[#dbe5f3]`}>
            学生对宿舍入住、校园卡激活、报到注册流程比较不熟，特别是中文沟通存在困难。已经到校，但宿舍分配还在确认中。
            希望拿到一份中英双语的 arrival / onboarding 指南，并对接首周生活支持。
            <br /><br />
            <strong>紧急事项：</strong>
            <br />
            • 住宿临时安排（今晚住宿问题）
            <br />
            • 校园卡激活（明天上午）
            <br />
            • 报到注册指导（本周内完成）
          </div>
        </ShowcasePanel>

        <ConversationBoard
          eyebrow="Support History"
          title="支持沟通记录"
          description="与学生和相关部门的沟通历史。"
          messages={[
            {
              role: "国际处王老师",
              time: "今天 09:30",
              content: "Anna 同学已经到校，但宿舍还在分配中。我已经联系住宿办公室加急处理，预计今天下午有结果。",
            },
            {
              role: "Buddy 赵同学",
              time: "今天 10:15",
              content: "我带Anna去了食堂和图书馆，她对校园布局基本了解了。主要担心的是宿舍和校园卡问题，中文沟通确实有些困难。",
            },
            {
              role: "Anna Lee",
              time: "今天 11:00",
              content: "Thank you for all the help! I'm still waiting for housing assignment. Could you help me get the campus card activated tomorrow morning?",
            },
            {
              role: "国际处王老师",
              time: "今天 11:30",
              content: "好的，明天上午9点我带你去办理校园卡。住宿方面今天下午应该就有消息了，我会及时通知你。",
            },
          ]}
        />
      </div>

      <section className={`${showcasePanelClass} p-6`}>
        <div className="mb-6">
          <div className="text-[20px] font-black text-[#243246] dark:text-white">支持任务清单</div>
          <div className="mt-2 text-[15px] text-[#67748a] dark:text-[#dbe5f3]">当前阶段的具体支持任务和完成状态</div>
        </div>
        <div className="grid gap-4">
          {[
            { title: "机场接机", description: "安排接机服务，确保安全到校", checked: true, status: "完成", tone: "green" },
            { title: "临时住宿安排", description: "协调宿舍分配，提供临时住宿方案", checked: false, status: "处理中", tone: "orange" },
            { title: "报到注册指导", description: "协助完成报到手续和相关注册流程", checked: false, status: "进行中", tone: "orange" },
            { title: "校园卡激活", description: "预约并协助办理校园卡激活", checked: false, status: "明天", tone: "blue" },
            { title: "银行卡办理", description: "指导银行开户和生活支付设置", checked: false, status: "待安排", tone: "gray" },
            { title: "中英双语指南", description: "提供校园生活和办事流程双语说明", checked: true, status: "已提供", tone: "green" },
          ].map((item) => (
            <div key={item.title} className="flex items-center gap-4 rounded-[20px] border border-[#dbe1f3] bg-white/76 p-5 dark:border-white/10 dark:bg-white/6">
              <input
                type="checkbox"
                checked={item.checked}
                readOnly
                className="h-5 w-5 rounded border-2"
              />
              <div className="flex-1">
                <div className="font-semibold text-[#243246] dark:text-white">{item.title}</div>
                <div className="mt-1 text-[14px] text-[#67748a] dark:text-[#dbe5f3]">{item.description}</div>
              </div>
              <div className={`rounded-[12px] px-3 py-1 text-[13px] font-semibold ${
                item.tone === 'green' ? 'bg-green-100 text-green-700' :
                item.tone === 'orange' ? 'bg-orange-100 text-orange-700' :
                item.tone === 'blue' ? 'bg-blue-100 text-blue-700' :
                'bg-gray-100 text-gray-600'
              }`}>
                {item.status}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default WelcomePortalDetailPage;
