import React from "react";
import {
  ConversationBoard,
  ShowcasePanel,
  ShowcaseTag,
  showcasePanelClass,
} from "@/feature/ScenarioShowcase";
import Button from "@/ui/Button";

const PreDepartureDetailPage: React.FC = () => {
  return (
    <div className="flex w-full min-w-0 flex-col gap-6 px-4 py-6 md:px-6 xl:px-8">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-[13px] font-bold uppercase tracking-[0.18em] text-[#94a3b8]">Pre-Departure Guidance</div>
          <div className="text-[34px] font-black leading-tight text-[#243246] dark:text-white">
            李思雨 - 澳洲行前准备档案
          </div>
        </div>
        <div className="flex gap-3">
          <Button className="rounded-[20px] border border-[#dbe1f3] bg-white px-5 py-3 text-sm font-semibold text-[#334155]">
            更新进度
          </Button>
          <Button className="rounded-[20px] bg-[var(--brand-blue)] px-5 py-3 text-sm font-semibold text-white">
            发送指导
          </Button>
        </div>
      </div>

      <section className={`${showcasePanelClass} p-6`}>
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div>
            <div className="text-[13px] font-bold uppercase tracking-[0.18em] text-[#94a3b8]">Student Information</div>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {[
                ["学生姓名", "李思雨"],
                ["目标院校", "University of Sydney"],
                ["交流项目", "本科交换 · 商学院"],
                ["出行时间", "2026年7月15日"],
                ["项目期间", "2026年7月 - 2026年12月"],
                ["准备阶段", "行前指导"],
                ["联系方式", "lisiyu@nju.edu.cn"],
                ["指导老师", "国际处陈老师"],
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
              <ShowcaseTag tone="orange">准备中</ShowcaseTag>
              <ShowcaseTag>澳洲项目</ShowcaseTag>
              <ShowcaseTag tone="blue">本科交换</ShowcaseTag>
            </div>
            {[
              ["准备进度", "75%", "大部分事项已完成"],
              ["出发倒计时", "45天", "距离出发还有45天"],
              ["完成度评级", "良好", "按计划顺利推进"],
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
          eyebrow="Preparation Overview"
          title="行前准备概览"
          description="出国前需要完成的重要事项和注意要点。"
        >
          <div className={`${showcasePanelClass} min-h-[200px] p-5 text-[16px] leading-8 text-[#475569] dark:text-[#dbe5f3]`}>
            李思雨同学的澳洲交换项目行前准备进展顺利，大部分重要事项已经完成或正在进行中。
            <br /><br />
            <strong>已完成事项：</strong>
            <br />
            • 签证申请和获批（学生签证 500类）
            <br />
            • 机票预订（7月14日 CA173航班）
            <br />
            • 住宿安排（校内宿舍 Darlington House）
            <br />
            • 保险购买（海外学生健康保险OSHC）
            <br /><br />
            <strong>待完成事项：</strong>
            <br />
            • 行前体检和疫苗接种
            <br />
            • 银行卡和外汇准备
            <br />
            • 行李清单确认和打包
            <br />
            • 当地接机安排确认
          </div>
        </ShowcasePanel>

        <ConversationBoard
          eyebrow="Guidance Records"
          title="指导沟通记录"
          description="行前准备过程中的指导和咨询记录。"
          messages={[
            {
              role: "国际处陈老师",
              time: "本周二 14:00",
              content: "思雨，你的签证已经下来了，恭喜！接下来我们需要安排体检，我会发给你体检中心的地址和预约方式。",
            },
            {
              role: "李思雨",
              time: "本周二 15:30",
              content: "太好了！陈老师，关于银行卡的事情，我是应该在国内办理还是到了澳洲再办呢？",
            },
            {
              role: "国际处陈老师",
              time: "本周三 09:00",
              content: "建议你先在国内办一张有境外取现功能的银行卡，带一些澳币现金。到了悉尼后再开当地银行账户。我会给你详细的银行指南。",
            },
            {
              role: "李思雨",
              time: "昨天 16:45",
              content: "陈老师，我开始准备行李了，有什么特别需要注意的吗？澳洲海关对药品有什么要求？",
            },
          ]}
        />
      </div>

      <section className={`${showcasePanelClass} p-6`}>
        <div className="mb-6">
          <div className="text-[20px] font-black text-[#243246] dark:text-white">行前准备清单</div>
          <div className="mt-2 text-[15px] text-[#67748a] dark:text-[#dbe5f3]">出国前必须完成的各项准备工作进度</div>
        </div>
        <div className="grid gap-4">
          {[
            { task: "签证申请", description: "学生签证500类申请和获批", completed: true, status: "已完成", urgency: "completed", deadline: "已完成" },
            { task: "机票预订", description: "往返机票预订和确认", completed: true, status: "已完成", urgency: "completed", deadline: "已完成" },
            { task: "住宿安排", description: "校内宿舍申请和确认", completed: true, status: "已完成", urgency: "completed", deadline: "已完成" },
            { task: "海外保险", description: "OSHC海外学生健康保险", completed: true, status: "已完成", urgency: "completed", deadline: "已完成" },
            { task: "行前体检", description: "指定医院体检和疫苗接种", completed: false, status: "进行中", urgency: "medium", deadline: "6月20日前" },
            { task: "银行准备", description: "境外银行卡和外汇兑换", completed: false, status: "待安排", urgency: "medium", deadline: "7月1日前" },
            { task: "行李准备", description: "行李清单确认和物品打包", completed: false, status: "准备中", urgency: "low", deadline: "7月10日前" },
            { task: "接机安排", description: "当地接机服务确认", completed: false, status: "待确认", urgency: "low", deadline: "7月5日前" },
          ].map((item) => (
            <div key={item.task} className="flex items-center gap-4 rounded-[20px] border border-[#dbe1f3] bg-white/76 p-5 dark:border-white/10 dark:bg-white/6">
              <input
                type="checkbox"
                checked={item.completed}
                readOnly
                className="h-5 w-5 rounded border-2"
              />
              <div className="flex-1">
                <div className="font-semibold text-[#243246] dark:text-white">{item.task}</div>
                <div className="mt-1 text-[14px] text-[#67748a] dark:text-[#dbe5f3]">{item.description}</div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-[13px] font-semibold text-[#94a3b8]">截止时间</div>
                  <div className="text-[14px] text-[#243246] dark:text-white">{item.deadline}</div>
                </div>
                <div className={`rounded-[12px] px-3 py-1 text-[13px] font-semibold ${
                  item.urgency === 'completed' ? 'bg-green-100 text-green-700' :
                  item.urgency === 'high' ? 'bg-red-100 text-red-700' :
                  item.urgency === 'medium' ? 'bg-orange-100 text-orange-700' :
                  'bg-blue-100 text-blue-700'
                }`}>
                  {item.status}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default PreDepartureDetailPage;
