import type { FormField } from "@/ui/Form";

/** 课程设置字段 */
export const settingsFields: FormField[] = [
  {
    name: "theoryPracticeType",
    label: "理论/实践",
    placeholder: "如：理论+实验课程",
    defaultValue: "理论+实验课程",
  },
  {
    name: "examType",
    label: "考试类型",
    type: "select",
    options: [
      { label: "闭卷", value: "闭卷" },
      { label: "开卷", value: "开卷" },
      { label: "大作业", value: "大作业" },
    ],
    defaultValue: "闭卷",
  },
  {
    name: "crossSemester",
    label: "跨学期课程",
    type: "select",
    options: [
      { label: "否", value: "否" },
      { label: "是", value: "是" },
    ],
    defaultValue: "否",
  },
  {
    name: "isEnglish",
    label: "全英文授课",
    type: "select",
    options: [
      { label: "否", value: "否" },
      { label: "是", value: "是" },
    ],
    defaultValue: "否",
  },
  {
    name: "isBilingual",
    label: "双语授课",
    type: "select",
    options: [
      { label: "否", value: "否" },
      { label: "是", value: "是" },
    ],
    defaultValue: "否",
    span: 2,
  },
];
