import React from "react";
import {
  ConversationBoard,
  ShowcasePanel,
  ShowcaseTag,
  showcasePanelClass,
} from "@/feature/ScenarioShowcase";
import Button from "@/ui/Button";

const ProcessFlowDetailPage: React.FC = () => {
  return (
    <div className="flex w-full min-w-0 flex-col gap-6 px-4 py-6 md:px-6 xl:px-8">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-[13px] font-bold uppercase tracking-[0.18em] text-[#94a3b8]">Application Workflow</div>
          <div className="text-[34px] font-black leading-tight text-[#243246] dark:text-white">
            UBC 2026秋季交换申请
          </div>
        </div>
        <div className="flex gap-3">
          <Button className="rounded-[20px] border border-[#dbe1f3] bg-white px-5 py-3 text-sm font-semibold text-[#334155]">
            编辑流程
          </Button>
          <Button className="rounded-[20px] bg-[var(--brand-blue)] px-5 py-3 text-sm font-semibold text-white">
            更新进度
          </Button>
        </div>
      </div>

      <section className="rounded-[34px] bg-[linear-gradient(135deg,#5f67f4_0%,#6b7bff_48%,#7f88ff_100%)] px-8 py-8 text-white shadow-[0_24px_60px_rgba(87,102,241,0.28)]">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.6fr)_360px]">
          <div>
            <div className="text-[13px] font-bold uppercase tracking-[0.2em] text-white/82">Application Progress</div>
            <div className="mt-3 text-[30px] font-black leading-tight">
              University of British Columbia · 计算机科学交换
            </div>
            <div className="mt-4 text-[17px] leading-8 text-white/88">
              2026年秋季学期交换项目申请，当前处于院系审批阶段。需要在3月28日前完成院系审批提交，4月18日校内申请截止。
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <ShowcaseTag tone="gray">Canada</ShowcaseTag>
              <ShowcaseTag tone="gray">Exchange Program</ShowcaseTag>
              <ShowcaseTag tone="gray">计算机科学</ShowcaseTag>
            </div>
          </div>
          <div className="grid gap-3">
            {[
              ["申请进度", "65%", "7 / 12 项已完成"],
              ["剩余天数", "12天", "距离校内截止"],
              ["紧急任务", "3项", "院系审批待提交"],
              ["风险等级", "中等", "时间相对充裕"],
            ].map(([label, value, detail]) => (
              <div key={label} className="rounded-[24px] bg-white/20 p-5 backdrop-blur-sm">
                <div className="text-[13px] font-bold uppercase tracking-[0.14em] text-white/80">{label}</div>
                <div className="mt-3 text-[24px] font-black text-white">{value}</div>
                <div className="mt-2 text-[14px] leading-6 text-white/80">{detail}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)]">
        <ShowcasePanel
          eyebrow="Application Details"
          title="申请项目信息"
          description="目标项目的详细信息和要求。"
        >
          <div className="grid gap-4">
            {[
              ["目标学校", "University of British Columbia"],
              ["项目类型", "一学期交换项目"],
              ["申请学院", "Faculty of Science"],
              ["专业领域", "Computer Science"],
              ["学期安排", "2026年9月 - 2026年12月"],
              ["学费情况", "学费互免（住宿生活费自理）"],
              ["语言要求", "托福90+ / 雅思6.5+"],
              ["GPA要求", "3.3以上"],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between">
                <div className="text-[15px] font-semibold text-[#94a3b8]">{label}:</div>
                <div className="text-[15px] text-[#243246] dark:text-white">{value}</div>
              </div>
            ))}
          </div>
        </ShowcasePanel>

        <ConversationBoard
          eyebrow="Process Assistant"
          title="申请进度对话"
          description="与申请助手讨论当前进度和优先任务。"
          messages={[
            {
              role: "你",
              time: "今天 10:18",
              content: "我这周要优先推进什么？我担心 03/28 的院系审批会来不及。",
            },
            {
              role: "申请助手",
              time: "今天 10:19",
              content: "建议按顺序处理：1）今天先完成审批表初稿；2）明天确认课程计划与学分转换；3）后天提交院系审批并同步推荐信老师。",
            },
            {
              role: "你",
              time: "今天 10:21",
              content: "那推荐信和成绩单上传怎么安排更稳妥？",
            },
            {
              role: "申请助手",
              time: "今天 10:22",
              content: "推荐信今天发出邀请，最晚 04/02 前确认；成绩单先检查盖章版本与清晰度，04/05 前完成上传。你可以先在右侧 checklist 勾选已完成项。",
            },
          ]}
        />
      </div>

      <section className={`${showcasePanelClass} p-6`}>
        <div className="mb-6">
          <div className="text-[20px] font-black text-[#243246] dark:text-white">申请流程时间线</div>
          <div className="mt-2 text-[15px] text-[#67748a] dark:text-[#dbe5f3]">关键时间节点和完成状态</div>
        </div>
        <div className="grid gap-4 md:grid-cols-4">
          {[
            { date: "03/22", title: "校内报名开放", status: "已完成", completed: true },
            { date: "03/28", title: "院系审批提交", status: "进行中", completed: false, urgent: true },
            { date: "04/05", title: "推荐信与成绩单补齐", status: "待开始", completed: false },
            { date: "04/18", title: "校内申请截止", status: "关键节点", completed: false },
          ].map((item) => (
            <div key={item.date} className={`rounded-[24px] border p-5 ${
              item.completed
                ? 'border-green-200 bg-green-50'
                : item.urgent
                  ? 'border-red-200 bg-red-50'
                  : 'border-[#dbe1f3] bg-white/76'
            } dark:border-white/10 dark:bg-white/6`}>
              <div className={`text-[24px] font-black ${
                item.completed
                  ? 'text-green-600'
                  : item.urgent
                    ? 'text-red-600'
                    : 'text-[#5672ff]'
              }`}>{item.date}</div>
              <div className="mt-3 text-[18px] font-black text-[#243246] dark:text-white">{item.title}</div>
              <div className="mt-2 text-[14px] text-[#67748a] dark:text-[#dbe5f3]">{item.status}</div>
              {item.completed && (
                <div className="mt-3 text-[12px] font-semibold text-green-600">✓ 已完成</div>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className={`${showcasePanelClass} p-6`}>
        <div className="mb-6">
          <div className="text-[20px] font-black text-[#243246] dark:text-white">个人化任务清单</div>
          <div className="mt-2 text-[15px] text-[#67748a] dark:text-[#dbe5f3]">围绕当前项目自动生成，支持逐项勾选与补充说明</div>
        </div>
        <div className="grid gap-4">
          {[
            {
              title: "确认目标项目与申请学期",
              description: "已选定 UBC 2026 秋季交换，并完成基本项目阅读。",
              checked: true,
              status: "完成",
              tone: "green",
            },
            {
              title: "提交院系审批表",
              description: "需附课程计划、学分转换设想，并在 03/28 前完成提交。",
              checked: false,
              status: "高优先",
              tone: "red",
            },
            {
              title: "联系推荐信老师",
              description: "至少确认 1 位推荐人，并准备英文说明材料。",
              checked: false,
              status: "中优先",
              tone: "orange",
            },
            {
              title: "准备语言成绩单",
              description: "托福成绩已满足要求，可直接上传系统。",
              checked: true,
              status: "完成",
              tone: "green",
            },
            {
              title: "上传中英文成绩单",
              description: "需确认盖章版本与 PDF 清晰度，避免补件。",
              checked: false,
              status: "中优先",
              tone: "orange",
            },
            {
              title: "准备个人陈述",
              description: "结合项目特色撰写个人陈述，突出学术动机。",
              checked: false,
              status: "待开始",
              tone: "gray",
            },
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
                item.tone === 'red' ? 'bg-red-100 text-red-700' :
                item.tone === 'orange' ? 'bg-orange-100 text-orange-700' :
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

export default ProcessFlowDetailPage;
