import React from "react";
import Button from "@/ui/Button";
import {
  ConversationBoard,
  RecordList,
  ShowcasePanel,
  ShowcaseTag,
  showcasePanelClass,
} from "@/feature/ScenarioShowcase";

const WritingDesk: React.FC = () => {
  return (
    <div className="flex w-full min-w-0 flex-col gap-6 px-4 py-6 md:px-6 xl:px-8">
      <div className="text-[34px] font-black leading-tight text-[#243246] md:text-[64px] dark:text-white">
        多语言沟通与邮件助手
      </div>

      <section className={`${showcasePanelClass} p-6`}>
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-[20px] bg-[#6177ff] text-[26px] font-black text-white">邮</div>
            <div>
              <div className="text-[18px] font-black text-[#243246] dark:text-white">多语言沟通与邮件助手</div>
              <div className="text-[15px] text-[#67748a] dark:text-[#dbe5f3]">History records first, then create or continue an LLM writing conversation</div>
            </div>
          </div>
          <div className="flex gap-3">
            <Button className="rounded-[20px] border border-[#dbe1f3] bg-white px-5 py-3 text-sm font-semibold text-[#334155]">我的模板</Button>
            <Button className="rounded-[20px] bg-[var(--brand-blue)] px-5 py-3 text-sm font-semibold text-white">新增对话</Button>
          </div>
        </div>

        <div className="mt-6 grid gap-4 rounded-[30px] bg-[linear-gradient(135deg,#5f67f4_0%,#6b7bff_48%,#7f88ff_100%)] p-6 text-white lg:grid-cols-[minmax(0,1.5fr)_320px]">
          <div>
            <div className="text-[13px] font-bold uppercase tracking-[0.2em] text-white/82">Communication & Email</div>
            <div className="mt-3 text-[34px] font-black leading-tight">
              先看历史沟通记录，再继续写作或新建一条新的 LLM 对话
            </div>
            <div className="mt-4 text-[17px] leading-8 text-white/88">
              面向学生、国际处老师和海外合作方，支持中英双语邮件、通知、FAQ、面试提醒和礼仪提示等场景。你可以继续历史写作会话，也可以通过表单新建一条对话，指定写作对象、语言、场景和核心需求后进入大模型写作界面。
            </div>
          </div>
          <div className="space-y-4">
            <div className="rounded-[24px] border border-white/20 bg-white/10 p-5">
              <div className="text-[28px] font-black">History</div>
              <div className="mt-2 text-[16px] leading-8 text-white/84">沉淀不同沟通对象、语言和场景下的历史记录。</div>
            </div>
            <div className="rounded-[24px] border border-white/20 bg-white/10 p-5">
              <div className="text-[28px] font-black">New Conversation</div>
              <div className="mt-2 text-[16px] leading-8 text-white/84">通过表单先定义写作场景，再进入新的 LLM 对话写作流程。</div>
            </div>
          </div>
        </div>
      </section>

      <RecordList
        eyebrow="History Records"
        title="历史沟通记录"
        description="点击继续写作，回到某一条历史对话；也可以删除不再需要的旧记录。"
        actionLabel="新增对话"
        records={[
          {
            title: "导师联系邮件 · UBC 访学咨询",
            meta: "创建于 2026/03/17 · 最近更新 18 分钟前",
            status: "进行中",
            tags: ["中英双语", "导师联系", "学生 → 海外老师"],
            actions: [{ label: "继续写作", primary: true }, { label: "查看摘要" }, { label: "删除" }],
          },
          {
            title: "住宿沟通邮件 · 宿舍延长申请",
            meta: "创建于 2026/03/15 · 最近更新 1 天前",
            status: "已完成",
            tags: ["英文", "住宿沟通", "学生 → Housing Office"],
            actions: [{ label: "继续写作", primary: true }, { label: "查看摘要" }, { label: "删除" }],
          },
          {
            title: "签证说明信 · 材料补充说明",
            meta: "创建于 2026/03/12 · 最近更新 3 天前",
            status: "已归档",
            tags: ["英文", "签证说明", "学生 → Visa Office"],
            actions: [{ label: "继续写作", primary: true }, { label: "查看摘要" }, { label: "删除" }],
          },
        ]}
      />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
        <ShowcasePanel
          eyebrow="New Conversation"
          title="新增对话"
          description="先填写场景、对象、语言和核心需求，确认后直接进入新的 LLM 写作对话。"
        >
          <div className="grid gap-4 md:grid-cols-2">
            {[
              ["写作场景", "导师联系邮件"],
              ["沟通对象", "海外导师 / 合作方老师"],
              ["输出语言", "中英双语"],
              ["语气风格", "正式礼貌"],
            ].map(([label, value]) => (
              <div key={label}>
                <div className="mb-2 text-[15px] font-bold text-[#243246] dark:text-white">{label}</div>
                <div className={`${showcasePanelClass} px-5 py-4 text-[16px] text-[#475569] dark:text-[#dbe5f3]`}>{value}</div>
              </div>
            ))}
          </div>
          <div className="mt-5">
            <div className="mb-2 text-[15px] font-bold text-[#243246] dark:text-white">核心需求</div>
            <div className={`${showcasePanelClass} min-h-[170px] px-5 py-4 text-[16px] leading-8 text-[#475569] dark:text-[#dbe5f3]`}>
              我想联系一位海外导师，说明自己是在交换 / 访学项目背景下联系，希望表达研究兴趣和进一步沟通的意愿。请帮我生成英文主稿和中文对照。
            </div>
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            <ShowcaseTag>双语输出</ShowcaseTag>
            <ShowcaseTag>礼仪提示</ShowcaseTag>
            <ShowcaseTag tone="gray">可生成 FAQ</ShowcaseTag>
          </div>
          <div className="mt-6 flex justify-end gap-3">
            <Button className="rounded-[20px] border border-[#dbe1f3] bg-white px-5 py-3 text-sm font-semibold text-[#334155]">取消</Button>
            <Button className="rounded-[20px] bg-[var(--brand-blue)] px-5 py-3 text-sm font-semibold text-white">确认并开始对话</Button>
          </div>
        </ShowcasePanel>

        <ConversationBoard
          eyebrow="LLM Writing Copilot"
          title="新对话 · 导师联系邮件（双语）"
          description="已根据刚刚填写的表单创建新的写作对话，现在开始生成邮件草稿内容。"
          messages={[
            {
              role: "Student",
              time: "10:08 AM",
              content: "请帮我写一封发给 UBC 老师的英文套磁邮件，语气礼貌一点，重点说我的研究兴趣是 HCI 和 AI，也希望附一个中文对照版本。",
            },
            {
              role: "Writing Copilot",
              time: "10:09 AM",
              content:
                "我给你生成一版英文主稿 + 中文对照，同时会控制语气偏正式、简洁，避免过度冒昧。接下来还可以继续帮你压缩自我介绍、突出研究匹配度，或者改成更适合海外导师阅读的版本。",
              cards: [
                { title: "写作目标", description: "导师联系邮件，英文主稿、中文对照，礼貌而专业。" },
                { title: "当前重点", description: "研究兴趣匹配、简洁自我介绍、表达访学或交流意向。" },
                { title: "可继续操作", description: "压缩篇幅、强化礼貌度、加附件说明、生成标题。" },
              ],
            },
            {
              role: "Student",
              time: "10:12 AM",
              content: "帮我把 opening 再礼貌一点，同时别显得太长。我还想加一句说明我是在交换/访学项目背景下联系这位老师。",
            },
            {
              role: "Writing Copilot",
              time: "10:13 AM",
              content:
                "可以。我会把 opening 改成更自然的学术联系语气，同时简化背景说明，把‘交换 / 访学项目背景’放在前半段，这样导师更容易迅速理解你的来意。",
              cards: [
                { title: "修改方向", description: "更礼貌、更简洁、更清楚地解释联系动机。" },
                { title: "语言控制", description: "避免太强的请求感，改为表达兴趣与希望进一步沟通。" },
                { title: "下一步", description: "继续生成 refined draft，或补邮件标题与结尾署名。" },
              ],
            },
          ]}
          summaryTitle="当前写作摘要"
          summaryItems={[
            { title: "写作场景", description: "导师联系邮件，目标是初次建立联系并表达访学意向。" },
            { title: "沟通对象", description: "海外导师 / 合作方老师，需要学术正式和礼貌语气。" },
            { title: "输出偏好", description: "英文主稿 + 中文对照，方便学生审定后核对措辞。" },
            { title: "下一步建议", description: "继续要求 LLM 生成邮件标题、附件说明和更简洁的 closing。" },
          ]}
          promptTabs={["中英双语", "邮件", "FAQ", "通知", "面试提醒"]}
          promptText="继续帮我润色这封导师联系邮件。请给我更礼貌一点的 opening，保留交流 / 访学背景说明，同时输出英文主稿和中文对照。"
          promptSuffix="历史场景已附加"
        />
      </div>
    </div>
  );
};

export default WritingDesk;
