import type { FormField } from "@/ui/Form";

/** 课程基本信息字段 */
export const basicInfoFields: FormField[] = [
  {
    name: "name",
    label: "课程名称",
    placeholder: "例如： 机器学习导论",
    span: 1,
  },
  {
    name: "englishName",
    label: "英文课程名",
    placeholder: "例如： Introduction to ML",
    span: 1,
  },
  {
    name: "courseId",
    label: "课程号",
    placeholder: "例如： 90111205",
    span: 1,
  },
  {
    name: "unit",
    label: "开课单位",
    placeholder: "例如： 计算机学院",
    span: 1,
  },
  {
    name: "responsible",
    label: "课程负责人",
    placeholder: "例如： 张三",
    span: 1,
  },
  {
    name: "writerName",
    label: "大纲填写人",
    placeholder: "例如： 张三",
    span: 1,
  },
];
