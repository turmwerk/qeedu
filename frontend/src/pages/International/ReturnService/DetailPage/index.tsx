import React from "react";
import {
  ConversationBoard,
  ShowcasePanel,
  ShowcaseTag,
  showcasePanelClass,
} from "@/feature/ScenarioShowcase";
import Button from "@/ui/Button";

const ReturnServiceDetailPage: React.FC = () => {
  return (
    <div className="flex w-full min-w-0 flex-col gap-6 px-4 py-6 md:px-6 xl:px-8">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-[13px] font-bold uppercase tracking-[0.18em] text-[#94a3b8]">Return Service</div>
          <div className="text-[34px] font-black leading-tight text-[#243246] dark:text-white">
            陈大伟 - 回国服务档案
          </div>
        </div>
        <div className="flex gap-3">
          <Button className="rounded-[20px] border border-[#dbe1f3] bg-white px-5 py-3 text-sm font-semibold text-[#334155]">
            安排服务
          </Button>
          <Button className="rounded-[20px] bg-[var(--brand-blue)] px-5 py-3 text-sm font-semibold text-white">
            完成跟踪
          </Button>
        </div>
      </div>

      <section className={`${showcasePanelClass} p-6`}>
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div>
            <div className="text-[13px] font-bold uppercase tracking-[0.18em] text-[#94a3b8]">Return Information</div>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {[
                ["学生姓名", "陈大伟"],
                ["交流院校", "MIT - 机械工程系"],
                ["交流项目", "博士联合培养"],
                ["交流期间", "2023年9月 - 2025年8月"],
                ["回国时间", "2025年8月20日"],
                ["当前状态", "学位认证中"],
                ["服务阶段", "后续跟踪"],
                ["联系方式", "dawei.chen@nju.edu.cn"],
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
              <ShowcaseTag tone="green">回国顺利</ShowcaseTag>
              <ShowcaseTag>MIT博士</ShowcaseTag>
              <ShowcaseTag tone="blue">学位认证</ShowcaseTag>
            </div>
            {[
              ["服务完成度", "80%", "大部分事项已处理"],
              ["适应状况", "良好", "回国适应顺利"],
              ["跟踪期限", "6个月", "持续服务跟踪"],
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
          eyebrow="Service Summary"
          title="回国服务概况"
          description="学生回国后的各项服务和适应情况总结。"
        >
          <div className={`${showcasePanelClass} min-h-[200px] p-5 text-[16px] leading-8 text-[#475569] dark:text-[#dbe5f3]`}>
            陈大伟同学在MIT完成了为期两年的博士联合培养项目，于2025年8月顺利回国。目前正在进行学位认证和相关手续办理。
            <br /><br />
            <strong>已完成服务：</strong>
            <br />
            • 回国接机和初步安置
            <br />
            • 学分转换和成绩单认证指导
            <br />
            • 银行账户和保险等生活事务处理
            <br />
            • 学术成果整理和论文发表支持
            <br /><br />
            <strong>进行中事项：</strong>
            <br />
            • 海外学位认证申请
            <br />
            • 就业推荐和career counseling
            <br />
            • 校友网络对接
            <br /><br />
            <strong>关注要点：</strong>学术成果转化，职业发展规划，校友联络维护
          </div>
        </ShowcasePanel>

        <ConversationBoard
          eyebrow="Service Records"
          title="服务沟通记录"
          description="回国后续服务过程中的沟通和支持记录。"
          messages={[
            {
              role: "国际处老师",
              time: "本周二 14:30",
              content: "大伟，学位认证的材料我们已经帮你整理好了，明天可以去教育部留学服务中心递交。记得带上所有原件。",
            },
            {
              role: "陈大伟",
              time: "本周二 16:00",
              content: "谢谢老师！我明天就去办理。另外，关于在MIT期间的研究成果，我想问问如何更好地在国内进行转化？",
            },
            {
              role: "国际处老师",
              time: "本周三 10:20",
              content: "这个很好！我已经联系了技术转移办公室的专家，下周可以安排一次专门的咨询会议，讨论你的研究成果产业化可能性。",
            },
            {
              role: "陈大伟",
              time: "昨天 15:45",
              content: "太好了！我也在考虑是继续学术道路还是进入产业界。能否也安排一些career planning的指导？",
            },
          ]}
        />
      </div>

      <section className={`${showcasePanelClass} p-6`}>
        <div className="mb-6">
          <div className="text-[20px] font-black text-[#243246] dark:text-white">回国服务清单</div>
          <div className="mt-2 text-[15px] text-[#67748a] dark:text-[#dbe5f3]">学生回国后各项服务事项的完成状况</div>
        </div>
        <div className="grid gap-4">
          {[
            { service: "回国接机", status: "已完成", description: "机场接机和初步安置服务", priority: "高", completed: true },
            { service: "住宿安排", status: "已完成", description: "临时住宿和后续住房安排", priority: "高", completed: true },
            { service: "银行业务", status: "已完成", description: "银行账户激活和资金管理", priority: "中", completed: true },
            { service: "学分认证", status: "已完成", description: "海外学分转换和成绩单认证", priority: "高", completed: true },
            { service: "学位认证", status: "进行中", description: "教育部留学服务中心学位认证", priority: "高", completed: false },
            { service: "就业指导", status: "进行中", description: "职业规划咨询和就业推荐", priority: "中", completed: false },
            { service: "成果转化", status: "安排中", description: "学术成果产业化咨询", priority: "中", completed: false },
            { service: "校友对接", status: "待安排", description: "校友网络建立和维护", priority: "低", completed: false },
          ].map((item) => (
            <div key={item.service} className="flex items-center gap-4 rounded-[20px] border border-[#dbe1f3] bg-white/76 p-5 dark:border-white/10 dark:bg-white/6">
              <input
                type="checkbox"
                checked={item.completed}
                readOnly
                className="h-5 w-5 rounded border-2"
              />
              <div className="flex-1">
                <div className="font-semibold text-[#243246] dark:text-white">{item.service}</div>
                <div className="mt-1 text-[14px] text-[#67748a] dark:text-[#dbe5f3]">{item.description}</div>
              </div>
              <div className="flex items-center gap-3">
                <div className={`rounded-[8px] px-2 py-1 text-[12px] font-semibold ${
                  item.priority === '高' ? 'bg-red-100 text-red-700' :
                  item.priority === '中' ? 'bg-orange-100 text-orange-700' :
                  'bg-gray-100 text-gray-600'
                }`}>
                  {item.priority}优先级
                </div>
                <div className={`rounded-[12px] px-3 py-1 text-[13px] font-semibold ${
                  item.status === '已完成' ? 'bg-green-100 text-green-700' :
                  item.status.includes('中') ? 'bg-blue-100 text-blue-700' :
                  'bg-gray-100 text-gray-600'
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

export default ReturnServiceDetailPage;
