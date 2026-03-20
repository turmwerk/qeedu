import type { FormField } from "@/ui/Form";

/** 课程分类字段 */
export const categoryFields: FormField[] = [
  {
    name: "publicElectiveCategory",
    label: "通识公选类别",
    placeholder: "如：自然科学类",
  },
  {
    name: "generalEducationCategory",
    label: "通修课程类别",
    placeholder: "如：计算机基础",
  },
  {
    name: "collegeCourseCategory",
    label: "院内课程分类",
    placeholder: "如：专业核心课",
  },
  {
    name: "courseCategory",
    label: "课程类别",
    placeholder: "如：学科基础课程",
    defaultValue: "学科基础课程",
  },
  {
    name: "courseLevel",
    label: "课程层次",
    placeholder: "如：本科生",
  },
  {
    name: "courseStatus",
    label: "课程状态",
    placeholder: "如：运行中",
    defaultValue: "运行中",
  },
];
