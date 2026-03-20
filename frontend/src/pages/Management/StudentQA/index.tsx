import React from "react";
import { ConversationBoard } from "@/feature/ScenarioShowcase";

const StudentQA: React.FC = () => {
  return (
    <div className="flex w-full min-w-0 flex-col gap-6 px-4 py-6 md:px-6 xl:px-8">
      <ConversationBoard
        eyebrow="Student QA"
        title="学生问答助手"
        description="把高频问答沉淀成统一知识入口，减少重复解释。"
        messages={[
          {
            role: "学生",
            time: "今天 10:08",
            content: "老师，交换项目申请里成绩单是自己翻译还是学校统一出具？",
          },
          {
            role: "问答助手",
            time: "今天 10:08",
            content: "建议优先查看学院公告中的材料说明。若合作院校要求英文成绩单，通常以学校官方版本或国际处统一说明为准，不建议个人自行翻译后直接提交。",
          },
        ]}
        summaryTitle="知识结构"
        summaryItems={[
          { title: "FAQ 分类", description: "覆盖选课、学分、材料、交换、考试和毕业要求。"},
          { title: "答案来源", description: "后续可绑定学院公告、培养方案和政策文件。"},
        ]}
        checklistTitle="下一步"
        checklistItems={[
          { title: "补齐 FAQ 分类树", description: "按事务类型整理高频问题。", checked: false, status: "规划中", tone: "orange" },
          { title: "沉淀标准回复", description: "把可复用回复模板结构化保存。", checked: false, status: "待接入", tone: "blue" },
        ]}
      />
    </div>
  );
};

export default StudentQA;
