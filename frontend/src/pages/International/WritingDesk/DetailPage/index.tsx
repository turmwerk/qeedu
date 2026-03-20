import React from "react";
import {
  ConversationBoard,
  ShowcasePanel,
  ShowcaseTag,
  showcasePanelClass,
} from "@/feature/ScenarioShowcase";
import Button from "@/ui/Button";

const WritingDeskDetailPage: React.FC = () => {
  return (
    <div className="flex w-full min-w-0 flex-col gap-6 px-4 py-6 md:px-6 xl:px-8">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-[13px] font-bold uppercase tracking-[0.18em] text-[#94a3b8]">Academic Writing Support</div>
          <div className="text-[34px] font-black leading-tight text-[#243246] dark:text-white">
            周雨婷 - 学术写作工坊档案
          </div>
        </div>
        <div className="flex gap-3">
          <Button className="rounded-[20px] border border-[#dbe1f3] bg-white px-5 py-3 text-sm font-semibold text-[#334155]">
            安排辅导
          </Button>
          <Button className="rounded-[20px] bg-[var(--brand-blue)] px-5 py-3 text-sm font-semibold text-white">
            提交作品
          </Button>
        </div>
      </div>

      <section className={`${showcasePanelClass} p-6`}>
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div>
            <div className="text-[13px] font-bold uppercase tracking-[0.18em] text-[#94a3b8]">Writing Support Information</div>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {[
                ["学生姓名", "周雨婷"],
                ["所在院系", "文学院 · 英语系"],
                ["学术级别", "硕士研究生 · 二年级"],
                ["写作项目", "硕士学位论文"],
                ["研究领域", "比较文学与世界文学"],
                ["指导老师", "Dr. Sarah Thompson"],
                ["项目阶段", "文献综述修订"],
                ["联系方式", "yuting.zhou@nju.edu.cn"],
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
              <ShowcaseTag tone="blue">进展顺利</ShowcaseTag>
              <ShowcaseTag>硕士论文</ShowcaseTag>
              <ShowcaseTag tone="green">积极配合</ShowcaseTag>
            </div>
            {[
              ["写作评分", "B+", "良好的写作水平"],
              ["完成进度", "65%", "文献综述阶段"],
              ["指导频率", "每周1次", "定期writing session"],
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
          eyebrow="Writing Project"
          title="写作项目详情"
          description="当前学术写作项目的具体情况和进展。"
        >
          <div className={`${showcasePanelClass} min-h-[200px] p-5 text-[16px] leading-8 text-[#475569] dark:text-[#dbe5f3]`}>
            <strong>硕士学位论文项目</strong>
            <br /><br />
            <strong>论文题目：</strong>"Post-Colonial Narratives in Contemporary African Literature: A Comparative Study"
            <br /><br />
            <strong>当前进展：</strong>
            <br />
            • 文献综述初稿已完成，正在进行第二轮修订
            <br />
            • 理论框架搭建基本完成
            <br />
            • 案例分析部分正在撰写中
            <br /><br />
            <strong>写作挑战：</strong>
            <br />
            • 学术英语表达的准确性和流畅性
            <br />
            • 批判性分析的深度和逻辑性
            <br />
            • 跨文化文学比较的方法论运用
            <br /><br />
            <strong>预期目标：</strong>争取在top-tier国际期刊发表部分章节
          </div>
        </ShowcasePanel>

        <ConversationBoard
          eyebrow="Writing Sessions"
          title="写作指导记录"
          description="学术写作指导过程中的反馈和改进建议。"
          messages={[
            {
              role: "Dr. Thompson",
              time: "本周二 14:00",
              content: "雨婷，你的文献综述结构很清晰，但是在critical analysis部分还需要加强。我建议你多关注不同学者观点之间的对话和张力。",
            },
            {
              role: "周雨婷",
              time: "本周二 15:30",
              content: "谢谢老师的建议！我确实觉得在批判性分析方面还不够深入。能否推荐一些相关的methodology资源？",
            },
            {
              role: "Dr. Thompson",
              time: "本周三 10:20",
              content: "我会发给你几篇excellent literature review的范文，特别关注他们如何构建scholarly conversation。另外，下次session我们重点讨论argumentation策略。",
            },
            {
              role: "周雨婷",
              time: "昨天 16:15",
              content: "我按照您的建议重新修改了第三部分，增加了更多的critical engagement。能否在下次meeting时帮我看看？",
            },
          ]}
        />
      </div>

      <section className={`${showcasePanelClass} p-6`}>
        <div className="mb-6">
          <div className="text-[20px] font-black text-[#243246] dark:text-white">写作技能发展轨迹</div>
          <div className="mt-2 text-[15px] text-[#67748a] dark:text-[#dbe5f3]">各项学术写作技能的提升进展和评估</div>
        </div>
        <div className="grid gap-4">
          {[
            { skill: "学术英语表达", current: 75, target: 85, description: "词汇准确性和句式多样性", improvement: "+15" },
            { skill: "逻辑论证能力", current: 70, target: 80, description: "论点清晰度和论证链条", improvement: "+12" },
            { skill: "批判性分析", current: 65, target: 85, description: "深度思考和多角度分析", improvement: "+8" },
            { skill: "文献综合能力", current: 80, target: 85, description: "文献整合和观点对话", improvement: "+18" },
            { skill: "研究方法运用", current: 60, target: 75, description: "方法论选择和应用", improvement: "+5" },
            { skill: "写作结构组织", current: 85, target: 90, description: "章节安排和逻辑流程", improvement: "+20" },
          ].map((item) => (
            <div key={item.skill} className="flex items-center gap-4 rounded-[20px] border border-[#dbe1f3] bg-white/76 p-5 dark:border-white/10 dark:bg-white/6">
              <div className="flex-1">
                <div className="font-semibold text-[#243246] dark:text-white">{item.skill}</div>
                <div className="mt-1 text-[14px] text-[#67748a] dark:text-[#dbe5f3]">{item.description}</div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-[13px] font-semibold text-[#94a3b8]">当前水平</div>
                  <div className="text-[16px] font-black text-[#243246] dark:text-white">{item.current}%</div>
                </div>
                <div className="text-right">
                  <div className="text-[13px] font-semibold text-[#94a3b8]">目标水平</div>
                  <div className="text-[16px] font-black text-[#243246] dark:text-white">{item.target}%</div>
                </div>
                <div className="text-right">
                  <div className="text-[13px] font-semibold text-green-600">提升</div>
                  <div className="text-[16px] font-black text-green-600">{item.improvement}</div>
                </div>
                <div className="w-20">
                  <div className="text-[13px] text-[#94a3b8] mb-1">进度</div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[var(--brand-blue)] transition-all duration-300"
                      style={{ width: `${(item.current / item.target) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className={`${showcasePanelClass} p-6`}>
        <div className="mb-6">
          <div className="text-[20px] font-black text-[#243246] dark:text-white">写作作品提交历史</div>
          <div className="mt-2 text-[15px] text-[#67748a] dark:text-[#dbe5f3]">学术写作指导过程中的作品提交和评估记录</div>
        </div>
        <div className="grid gap-4">
          {[
            { title: "Literature Review Draft 1", submitDate: "2024-04-15", score: "C+", feedback: "结构清晰但批判性不够", status: "已修订" },
            { title: "Theoretical Framework", submitDate: "2024-05-02", score: "B", feedback: "理论运用恰当，需要更多原创观点", status: "已通过" },
            { title: "Literature Review Draft 2", submitDate: "2024-05-20", score: "B+", feedback: "显著改进，批判性分析有提升", status: "待最终修订" },
            { title: "Methodology Chapter", submitDate: "2024-06-01", score: "-", feedback: "正在撰写中", status: "写作中" },
          ].map((work) => (
            <div key={work.title} className="flex items-center gap-4 rounded-[20px] border border-[#dbe1f3] bg-white/76 p-5 dark:border-white/10 dark:bg-white/6">
              <div className="flex-1">
                <div className="font-semibold text-[#243246] dark:text-white">{work.title}</div>
                <div className="mt-1 text-[14px] text-[#67748a] dark:text-[#dbe5f3]">{work.feedback}</div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-[13px] font-semibold text-[#94a3b8]">提交时间</div>
                  <div className="text-[14px] text-[#243246] dark:text-white">{work.submitDate}</div>
                </div>
                <div className="text-right">
                  <div className="text-[13px] font-semibold text-[#94a3b8]">评分</div>
                  <div className={`text-[16px] font-black ${
                    work.score.startsWith('A') ? 'text-green-600' :
                    work.score.startsWith('B') ? 'text-blue-600' :
                    work.score.startsWith('C') ? 'text-orange-600' :
                    'text-gray-600'
                  }`}>{work.score}</div>
                </div>
                <div className={`rounded-[12px] px-3 py-1 text-[13px] font-semibold ${
                  work.status === '已通过' ? 'bg-green-100 text-green-700' :
                  work.status === '已修订' ? 'bg-blue-100 text-blue-700' :
                  work.status === '写作中' ? 'bg-orange-100 text-orange-700' :
                  'bg-gray-100 text-gray-600'
                }`}>
                  {work.status}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default WritingDeskDetailPage;
