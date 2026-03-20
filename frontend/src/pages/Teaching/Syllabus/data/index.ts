import type { FormField } from "@/ui/Form";
import { basicInfoFields } from "./basicInfoFields";
import { categoryFields } from "./categoryFields";
import { contentFields } from "./contentFields";
import { hoursFields } from "./hoursFields";
import { settingsFields } from "./settingsFields";

/** 教学大纲创建表单所有字段 */
export const syllabusCreateFields: FormField[] = [
  ...basicInfoFields,
  ...categoryFields,
  ...hoursFields,
  ...settingsFields,
  ...contentFields,
];

// 分模块导出
export { basicInfoFields } from "./basicInfoFields";
export { categoryFields } from "./categoryFields";
export { contentFields } from "./contentFields";
export { hoursFields } from "./hoursFields";
export { settingsFields } from "./settingsFields";
