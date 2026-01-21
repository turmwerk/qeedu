import React from "react";
import type { FormField } from "@/components/Form";

export type DifficultyValue = {
  easy: number;
  medium: number;
  hard: number;
};

type DifficultyPickerType = React.FC<{
  value: DifficultyValue | undefined;
  onChange: (v: DifficultyValue) => void;
}>;

export const getExamCreateFields = (
  DifficultyPicker: DifficultyPickerType,
): FormField[] => [
  {
    name: "name",
    label: "试卷标题",
    placeholder: "例如： 期末考试 2025",
    defaultValue: "未命名试卷",
    span: 2,
  },
  {
    name: "difficulty",
    label: "难度预设比例",
    defaultValue: { easy: 30, medium: 50, hard: 20 },
    render: (
      value: DifficultyValue | undefined,
      onChange: (v: DifficultyValue) => void,
    ) =>
      React.createElement(DifficultyPicker, { value, onChange }),
    span: 2,
  },
  {
    name: "choose_count",
    label: "选择题数量",
    type: "number",
    defaultValue: 10,
    span: 1,
  },
  {
    name: "short_count",
    label: "简答题数量",
    type: "number",
    defaultValue: 4,
    span: 1,
  },
  {
    name: "fill_count",
    label: "填空题数量",
    type: "number",
    defaultValue: 0,
    span: 1,
  },
  {
    name: "program_count",
    label: "编程题数量",
    type: "number",
    defaultValue: 0,
    span: 1,
  },
  {
    name: "essay_count",
    label: "论述题数量",
    type: "number",
    defaultValue: 0,
    span: 2,
  },
  {
    name: "content",
    label: "考察内容",
    type: "textarea",
    placeholder: "例如： 操作系统、数据库",
    rows: 6,
    span: 2,
  },
  {
    name: "materials",
    label: "相关资料",
    type: "file",
    multiple: true,
    accept: ".pdf,.docx,.pptx",
    span: 2,
  },
];
