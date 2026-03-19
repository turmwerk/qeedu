import React from "react";
import {
  ConversationBoard,
  ShowcaseStatGrid,
  showcasePanelClass,
} from "@/feature/ScenarioShowcase";

const ProcessFlow: React.FC = () => {
  return (
    <div className="flex w-full min-w-0 flex-col gap-6 px-4 py-6 md:px-6 xl:px-8">
      <div className="text-[34px] font-black leading-tight text-[#243246] md:text-[64px] dark:text-white">
        申请流程助手
      </div>

      <section className="rounded-[34px] bg-[linear-gradient(135deg,#5f67f4_0%,#6b7bff_48%,#7f88ff_100%)] px-8 py-8 text-white shadow-[0_24px_60px_rgba(87,102,241,0.28)]">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.6fr)_460px]">
          <div>
            <div className="text-[13px] font-bold uppercase tracking-[0.2em] text-white/82">Application Workflow</div>
            <div className="mt-3 text-[30px] font-black leading-tight md:text-[44px]">
              围绕具体项目自动生成个人化 checklist 和申请时间线
            </div>
            <div className="mt-4 text-[17px] leading-8 text-white/88">
              围绕报名、院系审批、推荐信、成绩单、语言成绩、签证等环节形成一套可执行的申请流程，并自动提醒报名截止、补件截止、提名时间等关键节点。
            </div>
          </div>
          <ShowcaseStatGrid
            compact
            stats={[
              { label: "当前待办事项", value: "18" },
              { label: "临近提醒", value: "4" },
              { label: "已完成项目", value: "7 / 18" },
              { label: "最近申请截止", value: "04/18" },
            ]}
          />
        </div>
      </section>

      <ConversationBoard
        eyebrow="Timeline & Checklist"
        title="申请流程对话"
        description="和大模型讨论当前进度、材料优先级和截止风险，实时生成下一步建议。"
        messages={[
          {
            role: "你",
            time: "10:18 AM",
            content: "我这周要优先推进什么？我担心 03/28 的院系审批会来不及。",
          },
          {
            role: "LLM 助手",
            time: "10:19 AM",
            content:
              "建议按顺序处理：1）今天先完成审批表初稿；2）明天确认课程计划与学分转换；3）后天提交院系审批并同步推荐信老师。",
          },
          {
            role: "你",
            time: "10:21 AM",
            content: "那推荐信和成绩单上传怎么安排更稳妥？",
          },
          {
            role: "LLM 助手",
            time: "10:22 AM",
            content:
              "推荐信今天发出邀请，最晚 04/02 前确认；成绩单先检查盖章版本与清晰度，04/05 前完成上传。你可以先在右侧 checklist 勾选已完成项。",
          },
        ]}
        checklistTitle="个人化 checklist"
        checklistSubtitle="围绕当前项目自动生成，支持逐项勾选与补充说明。"
        checklistItems={[
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
            status: "高优先",
            tone: "red",
          },
          {
            title: "联系推荐信老师",
            description: "至少确认 1 位推荐人，并准备英文说明材料。",
            status: "中优先",
            tone: "orange",
          },
          {
            title: "准备语言成绩单",
            description: "托福成绩已满足低要求，可直接上传系统。",
            checked: true,
            status: "完成",
            tone: "green",
          },
          {
            title: "上传中英文成绩单",
            description: "需确认盖章版本与 PDF 清晰度，避免补件。",
            status: "中优先",
            tone: "orange",
          },
        ]}
        promptTabs={["自动附加当前时间线", "自动附加未完成任务", "生成 3 日行动计划"]}
        promptText="请基于我当前未完成任务，给我一个按天拆分的三日执行计划，并标注每项风险点。"
      />

      <section className={`${showcasePanelClass} p-6`}>
        <div className="grid gap-4 md:grid-cols-4">
          {[
            ["03/22", "校内报名开放", "已开始"],
            ["03/28", "院系审批提交", "临近"],
            ["04/05", "推荐信与成绩单补齐", "进行中"],
            ["04/18", "校内申请截止", "关键"],
          ].map(([date, title, status]) => (
            <div key={date} className="rounded-[24px] border border-[#dbe1f3] bg-white/76 p-5 dark:border-white/10 dark:bg-white/6">
              <div className="text-[24px] font-black text-[#5672ff]">{date}</div>
              <div className="mt-3 text-[20px] font-black text-[#243246] dark:text-white">{title}</div>
              <div className="mt-3 text-[15px] text-[#67748a] dark:text-[#dbe5f3]">{status}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ProcessFlow;
