import React from "react";
import {
  ConversationBoard,
  ShowcasePanel,
  ShowcaseTag,
  showcasePanelClass,
} from "@/feature/ScenarioShowcase";
import Button from "@/ui/Button";

const CulturalTrainingDetailPage: React.FC = () => {
  return (
    <div className="flex w-full min-w-0 flex-col gap-6 px-4 py-6 md:px-6 xl:px-8">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-[13px] font-bold uppercase tracking-[0.18em] text-[#94a3b8]">Cultural Training</div>
          <div className="text-[34px] font-black leading-tight text-[#243246] dark:text-white">
            赵小美 - 美国文化培训档案
          </div>
        </div>
        <div className="flex gap-3">
          <Button className="rounded-[20px] border border-[#dbe1f3] bg-white px-5 py-3 text-sm font-semibold text-[#334155]">
            安排培训
          </Button>
          <Button className="rounded-[20px] bg-[var(--brand-blue)] px-5 py-3 text-sm font-semibold text-white">
            完成评估
          </Button>
        </div>
      </div>

      <section className={`${showcasePanelClass} p-6`}>
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div>
            <div className="text-[13px] font-bold uppercase tracking-[0.18em] text-[#94a3b8]">Training Information</div>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {[
                ["学生姓名", "赵小美"],
                ["目标国家", "美国"],
                ["目标院校", "University of California, Berkeley"],
                ["项目类型", "硕士交换 · 工程学院"],
                ["培训阶段", "跨文化沟通"],
                ["培训进度", "60% 完成"],
                ["培训师", "外教Sarah Johnson"],
                ["联系方式", "xiaomei.zhao@berkeley.edu"],
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
              <ShowcaseTag tone="blue">培训中</ShowcaseTag>
              <ShowcaseTag>美国文化</ShowcaseTag>
              <ShowcaseTag tone="green">积极参与</ShowcaseTag>
            </div>
            {[
              ["培训评分", "B+", "良好的学习态度"],
              ["适应预期", "85%", "文化适应能力强"],
              ["完成时间", "2周", "预计培训完成"],
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
          eyebrow="Training Content"
          title="文化培训内容"
          description="针对目标国家的文化适应培训详情。"
        >
          <div className={`${showcasePanelClass} min-h-[200px] p-5 text-[16px] leading-8 text-[#475569] dark:text-[#dbe5f3]`}>
            <strong>美国文化适应培训计划</strong>
            <br /><br />
            <strong>已完成模块：</strong>
            <br />
            • 基础文化认知：美国社会结构和价值观
            <br />
            • 学术环境适应：美式教育体系和课堂文化
            <br />
            • 日常社交礼仪：社交距离和沟通方式
            <br /><br />
            <strong>当前学习：</strong>
            <br />
            • 跨文化沟通技巧：直接沟通vs间接沟通
            <br />
            • 冲突处理和问题解决方式
            <br /><br />
            <strong>待学习内容：</strong>
            <br />
            • 校园生活和住宿文化
            <br />
            • 法律法规和安全意识
            <br />
            • 职场文化和实习准备
          </div>
        </ShowcasePanel>

        <ConversationBoard
          eyebrow="Training Records"
          title="培训沟通记录"
          description="文化培训过程中的学习反馈和指导记录。"
          messages={[
            {
              role: "培训师Sarah",
              time: "本周一 14:00",
              content: "Xiaomei在跨文化沟通模块表现很好，对美国直接沟通文化的理解很到位。建议多练习实际场景对话。",
            },
            {
              role: "赵小美",
              time: "本周一 15:20",
              content: "谢谢Sarah老师！我觉得美国人的直接沟通方式确实和我们很不同，我会多练习的。有什么推荐的练习资源吗？",
            },
            {
              role: "培训师Sarah",
              time: "本周二 10:00",
              content: "我会给你发一些role-play的练习材料。另外，我们下次课会重点练习如何在学术讨论中表达不同观点。",
            },
            {
              role: "赵小美",
              time: "昨天 19:30",
              content: "我做了课后练习，感觉在表达disagreement时还是有些困难，担心显得不礼貌。能再给我一些指导吗？",
            },
          ]}
        />
      </div>

      <section className={`${showcasePanelClass} p-6`}>
        <div className="mb-6">
          <div className="text-[20px] font-black text-[#243246] dark:text-white">文化培训模块进度</div>
          <div className="mt-2 text-[15px] text-[#67748a] dark:text-[#dbe5f3]">各个文化适应培训模块的完成状况</div>
        </div>
        <div className="grid gap-4">
          {[
            { module: "基础文化认知", progress: 100, status: "已完成", description: "美国社会结构、价值观和基础文化常识", score: "A" },
            { module: "学术环境适应", progress: 100, status: "已完成", description: "美式教育体系、课堂参与和学术诚信", score: "B+" },
            { module: "日常社交礼仪", progress: 100, status: "已完成", description: "社交距离、问候方式和基本礼仪", score: "A-" },
            { module: "跨文化沟通", progress: 75, status: "学习中", description: "直接沟通、表达观点和文化差异处理", score: "B+" },
            { module: "冲突处理技巧", progress: 40, status: "进行中", description: "问题解决方式和冲突管理技巧", score: "-" },
            { module: "校园生活文化", progress: 0, status: "待开始", description: "住宿文化、校园活动和学生组织", score: "-" },
            { module: "法律安全意识", progress: 0, status: "待开始", description: "法律法规、安全防范和应急处理", score: "-" },
            { module: "职场文化准备", progress: 0, status: "待开始", description: "职场礼仪、实习文化和职业发展", score: "-" },
          ].map((item) => (
            <div key={item.module} className="flex items-center gap-4 rounded-[20px] border border-[#dbe1f3] bg-white/76 p-5 dark:border-white/10 dark:bg-white/6">
              <div className="flex-1">
                <div className="font-semibold text-[#243246] dark:text-white">{item.module}</div>
                <div className="mt-1 text-[14px] text-[#67748a] dark:text-[#dbe5f3]">{item.description}</div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-[13px] font-semibold text-[#94a3b8]">成绩</div>
                  <div className="text-[16px] font-black text-[#243246] dark:text-white">{item.score}</div>
                </div>
                <div className="text-right">
                  <div className="text-[20px] font-black text-[#243246] dark:text-white">{item.progress}%</div>
                  <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
                        item.progress === 100 ? 'bg-green-500' :
                        item.progress > 0 ? 'bg-blue-500' : 'bg-gray-300'
                      }`}
                      style={{ width: `${item.progress}%` }}
                    />
                  </div>
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

export default CulturalTrainingDetailPage;
