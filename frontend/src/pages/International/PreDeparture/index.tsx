import React from "react";
import { ConversationBoard, showcasePanelClass, ShowcaseTag } from "@/feature/ScenarioShowcase";

const PreDeparture: React.FC = () => {
  return (
    <div className="flex w-full min-w-0 flex-col gap-6 px-4 py-6 md:px-6 xl:px-8">
      <div className="text-[34px] font-black leading-tight text-[#243246] md:text-[64px] dark:text-white">
        行前准备助手
      </div>

      <section className={`${showcasePanelClass} p-6`}>
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="text-[13px] font-bold uppercase tracking-[0.18em] text-[#94a3b8]">LLM Preparation Copilot</div>
            <div className="mt-2 text-[28px] font-black text-[#243246] dark:text-white">行前准备对话</div>
            <div className="mt-2 text-[15px] leading-7 text-[#67748a] dark:text-[#dbe5f3]">
              围绕国家、项目类型和出发时间，和大模型确认签证、保险、住宿、选课和生活准备优先级。
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <ShowcaseTag>Canada</ShowcaseTag>
            <ShowcaseTag>Exchange</ShowcaseTag>
            <ShowcaseTag tone="gray">2026 秋季</ShowcaseTag>
          </div>
        </div>
      </section>

      <ConversationBoard
        title="行前准备对话"
        messages={[
          {
            role: "Student",
            time: "10:18 AM",
            content: "我今年秋季要去加拿大做一学期交换。请帮我生成一个行前准备清单，重点包括签证、保险、机票、住宿、选课、注册、银行卡和 SIM 卡。",
          },
          {
            role: "Preparation Copilot",
            time: "10:19 AM",
            content:
              "可以。我先按控制时间敏感度和抵达后影响程度来排序。通常最先确认的是签证材料、学校提名/录取文件、保险要求和住宿，其次是机票、课程注册和本地生活准备。",
            cards: [
              { title: "第一阶段", description: "签证、学校录取/提名文件、保险要求、住宿确认。" },
              { title: "第二阶段", description: "机票预订、选课与注册、体检和疫苗材料检查。" },
              { title: "第三阶段", description: "银行卡准备、SIM 方案、到达后交通与生活事项。" },
            ],
          },
          {
            role: "Student",
            time: "10:22 AM",
            content: "我还想知道住宿和机票一般应该什么时候定比较好，还有到加拿大之后银行卡和手机卡怎么处理会更方便。",
          },
          {
            role: "Preparation Copilot",
            time: "10:23 AM",
            content:
              "通常建议在签证材料准备基本稳定、住宿方案确定度提高之后再锁定机票，以免后续日期变化带来改签成本。银行卡方面，可同时准备一张国际可用银行卡和一张到达后本地开户计划；SIM 卡则建议先准备临时漫游或机场短期卡，再根据当地资费换成长期开方案。",
            cards: [
              { title: "住宿", description: "校内宿舍优先关注截止时间；外租需留意合同起止和交通。" },
              { title: "机票", description: "在签证与住宿时间更稳定后再订，更稳妥。" },
              { title: "银行卡 / SIM", description: "先保证短期可用，再规划落地后的长期方案。" },
            ],
          },
        ]}
        checklistTitle="行前任务清单"
        checklistSubtitle="把对话中提炼出的准备事项沉淀成可勾选的 checklist。"
        checklistItems={[
          {
            title: "确认学校录取 / 提名材料",
            description: "整理 offer、提名信、护照信息和后续签证所需基础文件。",
            checked: true,
            status: "完成",
            tone: "green",
          },
          {
            title: "准备签证申请材料",
            description: "检查护照有效期、签证表格、照片、资金证明和学校文件。",
            status: "高优先",
            tone: "red",
          },
          {
            title: "确认保险要求",
            description: "查看项目是否要求校内保险，比较校内保险与自购保险方案。",
            status: "高优先",
            tone: "red",
          },
          {
            title: "处理住宿申请或租房方案",
            description: "优先确认校内宿舍申请节点，若外租需同步比较预算与交通。",
            status: "高优先",
            tone: "red",
          },
          {
            title: "了解选课与注册时间",
            description: "确认课程开放时间、候补规则和学分认定材料准备要求。",
            checked: true,
            status: "完成",
            tone: "green",
          },
          {
            title: "预估机票购买窗口",
            description: "在签证时间和住宿更明确后再锁定航班，降低改签风险。",
            status: "中优先",
            tone: "orange",
          },
        ]}
      />
    </div>
  );
};

export default PreDeparture;
