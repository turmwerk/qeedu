import React from "react";
import { useParams } from "react-router-dom";
import { ConversationBoard, ShowcasePanel, ShowcaseTag, showcasePanelClass } from "@/feature/ScenarioShowcase";

const AnnouncementDialoguePage: React.FC = () => {
  const { id } = useParams();

  return (
    <div className="flex w-full min-w-0 flex-col gap-6 px-4 py-6 md:px-6 xl:px-8">
      <section className={`${showcasePanelClass} p-6`}>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="text-[13px] font-bold uppercase tracking-[0.18em] text-[#94a3b8]">Announcement Dialogue</div>
            <div className="mt-2 text-[34px] font-black text-[#243246] dark:text-white">通知对话工作台</div>
            <div className="mt-3 text-[16px] leading-8 text-[#67748a] dark:text-[#dbe5f3]">
              当前会话：{id ?? "demo"}。这里承接公告生成 sample 中的对话详情页，继续做润色、补充 FAQ 和输出多渠道版本。
            </div>
          </div>
          <ShowcaseTag tone="green">正式详情页</ShowcaseTag>
        </div>
      </section>

      <ConversationBoard
        eyebrow="Generator"
        title="通知生成对话"
        description="围绕同一份通知，连续追问口吻、结构、附件说明和简版文案。"
        messages={[
          {
            role: "老师",
            time: "今天 14:20",
            content: "请帮我生成一份关于 2026 春季交换项目报名的正式通知，覆盖报名条件、时间节点、材料要求和咨询方式。",
          },
          {
            role: "公告助手",
            time: "今天 14:21",
            content: "我已经生成了正式通知初稿，并拆出了报名对象、材料清单、流程时间轴和联系方式四部分。建议再补 1 段 FAQ，解释 GPA 与语言成绩口径。",
            cards: [
              { title: "正式通知", description: "适合学院官网、通知群和邮件正文。" },
              { title: "短信摘要", description: "压缩成 100 字以内的提醒文案。" },
              { title: "FAQ 补充", description: "把资格边界和附件说明提前说清楚。" },
            ],
          },
        ]}
        summaryTitle="当前输出"
        summaryItems={[
          { title: "通知对象", description: "2023 级和 2024 级本科生，重点面向交换申请学生。" },
          { title: "关键节点", description: "4 月 8 日提交学院材料，4 月 12 日完成系统填报。" },
          { title: "建议补充", description: "增加 GPA 口径、语言成绩有效期和咨询邮箱。 " },
        ]}
        checklistTitle="待确认项"
        checklistItems={[
          { title: "确认附件名称", description: "统一报名表、成绩单和证明材料命名。", checked: true, status: "已确认", tone: "green" },
          { title: "补充 FAQ", description: "明确 GPA、语言成绩和材料格式问题。", checked: false, status: "待补充", tone: "orange" },
          { title: "生成公众号短版", description: "压缩为适合移动端阅读的版本。", checked: false, status: "待生成", tone: "blue" },
        ]}
        promptTabs={["正式通知", "FAQ", "公众号短版"]}
        promptText="请在不改变政策口径的前提下，把正式通知改得更清晰，并增加面向学生的 FAQ。"
      />

      <ShowcasePanel eyebrow="Preview" title="当前通知预览" description="供后续挂接导出、发送和版本对比。">
        <div className={`${showcasePanelClass} p-5 text-[15px] leading-8 text-[#475569] dark:text-[#dbe5f3]`}>
          <strong>关于启动 2026 年春季交换项目报名工作的通知</strong>
          <br />
          各位同学：
          <br />
          现启动 2026 年春季交换项目报名工作，请有意向的同学按照学院要求完成资格自查、材料准备和系统填报。本通知已结构化整理报名对象、材料清单、时间节点和咨询方式，后续可继续在此基础上生成 FAQ 与多渠道短版。
        </div>
      </ShowcasePanel>
    </div>
  );
};

export default AnnouncementDialoguePage;
