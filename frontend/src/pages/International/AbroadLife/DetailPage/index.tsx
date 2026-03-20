import React from "react";
import {
  ConversationBoard,
  ShowcasePanel,
  ShowcaseTag,
  showcasePanelClass,
} from "@/feature/ScenarioShowcase";
import Button from "@/ui/Button";

const AbroadLifeDetailPage: React.FC = () => {
  return (
    <div className="flex w-full min-w-0 flex-col gap-6 px-4 py-6 md:px-6 xl:px-8">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-[13px] font-bold uppercase tracking-[0.18em] text-[#94a3b8]">Abroad Life Support</div>
          <div className="text-[34px] font-black leading-tight text-[#243246] dark:text-white">
            王小花 - 伦敦支持档案
          </div>
        </div>
        <div className="flex gap-3">
          <Button className="rounded-[20px] border border-[#dbe1f3] bg-white px-5 py-3 text-sm font-semibold text-[#334155]">
            更新信息
          </Button>
          <Button className="rounded-[20px] bg-[var(--brand-blue)] px-5 py-3 text-sm font-semibold text-white">
            紧急联系
          </Button>
        </div>
      </div>

      <section className={`${showcasePanelClass} p-6`}>
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div>
            <div className="text-[13px] font-bold uppercase tracking-[0.18em] text-[#94a3b8]">Student Information</div>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {[
                ["学生姓名", "王小花"],
                ["目标院校", "University College London"],
                ["交流项目", "硕士交换 · 计算机科学"],
                ["交流期间", "2025年9月 - 2026年6月"],
                ["当前状态", "在读中 · 第二学期"],
                ["住宿情况", "学校宿舍 · Bloomsbury"],
                ["联系方式", "xiaohua.wang@ucl.ac.uk"],
                ["紧急联系人", "王妈妈 +86 138xxxx8888"],
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
              <ShowcaseTag tone="green">学习顺利</ShowcaseTag>
              <ShowcaseTag>适应良好</ShowcaseTag>
              <ShowcaseTag tone="blue">积极参与</ShowcaseTag>
            </div>
            {[
              ["支持等级", "常规", "定期关怀跟踪"],
              ["适应程度", "85%", "生活学习适应良好"],
              ["响应时间", "24小时", "支持响应承诺"],
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
          eyebrow="Current Situation"
          title="当前状况总结"
          description="学生在海外的学习生活状况和近期关注点。"
        >
          <div className={`${showcasePanelClass} min-h-[200px] p-5 text-[16px] leading-8 text-[#475569] dark:text-[#dbe5f3]`}>
            王小花同学在UCL的交换学习进入第二学期，整体适应情况良好。学术方面表现优秀，已经融入当地学习环境。
            <br /><br />
            <strong>近期情况：</strong>
            <br />
            • 第二学期课程压力增大，正在准备期中考试
            <br />
            • 住宿方面一切正常，与室友相处融洽
            <br />
            • 积极参与学校的中国学生会活动
            <br />
            • 计划在春假期间参加欧洲文化体验活动
            <br /><br />
            <strong>关注要点：</strong>学业压力管理，保持身心健康，适当的社交活动
          </div>
        </ShowcasePanel>

        <ConversationBoard
          eyebrow="Support Records"
          title="支持沟通记录"
          description="定期关怀和问题解决的沟通历史。"
          messages={[
            {
              role: "国际处张老师",
              time: "本周一 10:00",
              content: "小花你好！第二学期开始了，课程安排怎么样？有什么需要帮助的地方吗？",
            },
            {
              role: "王小花",
              time: "本周一 11:30",
              content: "张老师好！课程比第一学期难一些，但是我会努力适应。住宿和生活方面都很好，谢谢关心！",
            },
            {
              role: "王小花",
              time: "昨天 19:20",
              content: "张老师，我想参加学校的春假欧洲文化体验项目，需要填写一些表格，可以帮我看看吗？",
            },
            {
              role: "国际处张老师",
              time: "今天 09:15",
              content: "当然可以！这是很好的体验机会。我会帮你检查表格，有任何问题随时联系我。注意安全！",
            },
          ]}
        />
      </div>

      <section className={`${showcasePanelClass} p-6`}>
        <div className="mb-6">
          <div className="text-[20px] font-black text-[#243246] dark:text-white">海外生活支持清单</div>
          <div className="mt-2 text-[15px] text-[#67748a] dark:text-[#dbe5f3]">在海外学习期间的各项支持服务状态</div>
        </div>
        <div className="grid gap-4">
          {[
            { category: "学术支持", status: "进行中", description: "定期学术进展跟踪，课程选择指导", progress: 80, color: "blue" },
            { category: "生活关怀", status: "正常", description: "住宿、饮食、日常生活问题协助", progress: 90, color: "green" },
            { category: "心理支持", status: "良好", description: "适应性心理关怀，压力疏导", progress: 85, color: "green" },
            { category: "安全保障", status: "监控中", description: "安全状况监控，紧急联系机制", progress: 95, color: "green" },
            { category: "文化体验", status: "活跃", description: "文化活动参与，社交拓展支持", progress: 75, color: "blue" },
            { category: "家校沟通", status: "定期", description: "与家长的沟通汇报，信息同步", progress: 88, color: "green" },
          ].map((item) => (
            <div key={item.category} className="flex items-center gap-4 rounded-[20px] border border-[#dbe1f3] bg-white/76 p-5 dark:border-white/10 dark:bg-white/6">
              <div className="flex-1">
                <div className="font-semibold text-[#243246] dark:text-white">{item.category}</div>
                <div className="mt-1 text-[14px] text-[#67748a] dark:text-[#dbe5f3]">{item.description}</div>
              </div>
              <div className="flex items-center gap-3">
                <div className={`rounded-[12px] px-3 py-1 text-[13px] font-semibold ${
                  item.color === 'green' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                }`}>
                  {item.status}
                </div>
                <div className="text-right">
                  <div className="text-[16px] font-black text-[#243246] dark:text-white">{item.progress}%</div>
                  <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
                        item.color === 'green' ? 'bg-green-500' : 'bg-blue-500'
                      }`}
                      style={{ width: `${item.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default AbroadLifeDetailPage;
