import type { FormField } from "@/ui/Form";

/** 课程内容字段 */
export const contentFields: FormField[] = [
  {
    name: "goals",
    label: "课程育人目标",
    type: "textarea",
    placeholder: "简述课程育人目标",
    rows: 4,
    span: 2,
  },
  {
    name: "teachingGoals",
    label: "课程教学目标",
    type: "textarea",
    placeholder: "简述课程教学目标",
    rows: 4,
    span: 2,
  },
  {
    name: "alignmentGoals",
    label: "与培养目标契合度",
    type: "textarea",
    placeholder: "与学校本科人才培养目标的契合关系",
    rows: 3,
    span: 2,
  },
  {
    name: "intro",
    label: "课程简介",
    type: "textarea",
    placeholder: "课程简介",
    rows: 4,
    span: 2,
  },
  {
    name: "textbooks",
    label: "教材",
    type: "textarea",
    placeholder: "教材信息",
    span: 2,
  },
  {
    name: "references",
    label: "参考资料",
    type: "textarea",
    placeholder: "参考资料信息",
    span: 2,
  },
  {
    name: "grading",
    label: "成绩构成",
    type: "textarea",
    placeholder: "成绩构成说明",
    span: 2,
  },
  {
    name: "notes",
    label: "备注",
    type: "textarea",
    span: 2,
  },
];
