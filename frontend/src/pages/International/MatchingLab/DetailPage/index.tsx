import React from "react";
import {
  ConversationBoard,
  ShowcasePanel,
  ShowcaseTag,
  showcasePanelClass,
} from "@/feature/ScenarioShowcase";
import Button from "@/ui/Button";

const MatchingLabDetailPage: React.FC = () => {
  return (
    <div className="flex w-full min-w-0 flex-col gap-6 px-4 py-6 md:px-6 xl:px-8">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-[13px] font-bold uppercase tracking-[0.18em] text-[#94a3b8]">Project Matching</div>
          <div className="text-[34px] font-black leading-tight text-[#243246] dark:text-white">
            张明 × AI研究项目 - 匹配档案
          </div>
        </div>
        <div className="flex gap-3">
          <Button className="rounded-[20px] border border-[#dbe1f3] bg-white px-5 py-3 text-sm font-semibold text-[#334155]">
            调整匹配
          </Button>
          <Button className="rounded-[20px] bg-[var(--brand-blue)] px-5 py-3 text-sm font-semibold text-white">
            确认配对
          </Button>
        </div>
      </div>

      <section className={`${showcasePanelClass} p-6`}>
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div>
            <div className="text-[13px] font-bold uppercase tracking-[0.18em] text-[#94a3b8]">Student Profile</div>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {[
                ["学生姓名", "张明"],
                ["所在院系", "计算机科学与技术学院"],
                ["专业年级", "计算机科学与技术 大三"],
                ["项目类型", "科研训练项目"],
                ["研究方向", "人工智能 / 机器学习"],
                ["导师偏好", "李教授（AI实验室）"],
                ["时间安排", "2026春季学期 / 全时间"],
                ["联系方式", "zhangming@nju.edu.cn"],
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
              <ShowcaseTag tone="green">高匹配度</ShowcaseTag>
              <ShowcaseTag>AI方向</ShowcaseTag>
              <ShowcaseTag tone="blue">导师认可</ShowcaseTag>
            </div>
            {[
              ["匹配得分", "92分", "AI算法推荐匹配"],
              ["项目契合", "95%", "研究方向高度吻合"],
              ["时间匹配", "100%", "时间安排完全符合"],
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
          eyebrow="Project Details"
          title="匹配项目信息"
          description="学生匹配的具体项目详情和要求。"
        >
          <div className={`${showcasePanelClass} min-h-[200px] p-5 text-[16px] leading-8 text-[#475569] dark:text-[#dbe5f3]`}>
            <strong>项目名称：</strong>基于深度学习的自然语言处理系统研发
            <br /><br />
            <strong>指导教师：</strong>李教授（人工智能实验室 / 博士生导师）
            <br />
            <strong>项目周期：</strong>2026年3月 - 2026年7月（一学期）
            <br />
            <strong>工作地点：</strong>计算机楼AI实验室
            <br /><br />
            <strong>项目要求：</strong>
            <br />
            • 具备扎实的Python编程基础
            <br />
            • 熟悉机器学习相关理论知识
            <br />
            • 对自然语言处理领域有浓厚兴趣
            <br />
            • 能投入每周至少20小时进行研究工作
            <br /><br />
            <strong>项目收获：</strong>参与前沿AI研究，发表学术论文机会，推荐信支持
          </div>
        </ShowcasePanel>

        <ConversationBoard
          eyebrow="Matching History"
          title="匹配过程记录"
          description="AI匹配算法的分析过程和师生沟通记录。"
          messages={[
            {
              role: "AI匹配系统",
              time: "今天 09:00",
              content: "基于学生的研究兴趣、专业背景和时间安排，系统识别出3个高匹配度项目。当前项目匹配度最高（92分）。",
            },
            {
              role: "李教授",
              time: "今天 10:30",
              content: "查看了张明同学的简历和成绩单，专业基础扎实，对AI领域确实有深入了解。欢迎加入我们的研究团队。",
            },
            {
              role: "张明",
              time: "今天 11:15",
              content: "非常感谢李老师的认可！我对自然语言处理方向很感兴趣，之前也做过相关的课程项目，希望能在这个项目中深入学习。",
            },
            {
              role: "系统通知",
              time: "今天 11:45",
              content: "匹配确认中：等待双方最终确认。预计今天下午完成配对流程。",
            },
          ]}
        />
      </div>

      <section className={`${showcasePanelClass} p-6`}>
        <div className="mb-6">
          <div className="text-[20px] font-black text-[#243246] dark:text-white">匹配分析详情</div>
          <div className="mt-2 text-[15px] text-[#67748a] dark:text-[#dbe5f3]">AI算法对学生与项目的多维度匹配分析</div>
        </div>
        <div className="grid gap-4">
          {[
            { category: "专业背景匹配", score: 95, analysis: "计算机专业背景与AI项目需求高度匹配", color: "green" },
            { category: "技能要求匹配", score: 88, analysis: "Python和机器学习基础符合项目要求", color: "green" },
            { category: "研究兴趣契合", score: 92, analysis: "对NLP领域的浓厚兴趣与项目方向一致", color: "green" },
            { category: "时间安排匹配", score: 100, analysis: "春季学期全时间安排完美符合项目需求", color: "green" },
            { category: "导师学生适配", score: 85, analysis: "导师指导风格与学生学习方式较为匹配", color: "orange" },
            { category: "发展前景匹配", score: 90, analysis: "项目成果对学生未来发展有很大帮助", color: "green" },
          ].map((item) => (
            <div key={item.category} className="flex items-center gap-4 rounded-[20px] border border-[#dbe1f3] bg-white/76 p-5 dark:border-white/10 dark:bg-white/6">
              <div className="flex-1">
                <div className="font-semibold text-[#243246] dark:text-white">{item.category}</div>
                <div className="mt-1 text-[14px] text-[#67748a] dark:text-[#dbe5f3]">{item.analysis}</div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-[20px] font-black text-[#243246] dark:text-white">{item.score}%</div>
                  <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
                        item.color === 'green' ? 'bg-green-500' : 'bg-orange-500'
                      }`}
                      style={{ width: `${item.score}%` }}
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

export default MatchingLabDetailPage;
