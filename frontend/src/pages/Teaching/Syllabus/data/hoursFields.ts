import type { FormField } from "@/ui/Form";

/** 学时学分字段 */
export const hoursFields: FormField[] = [
  {
    name: "credits",
    label: "学分",
    type: "number",
    defaultValue: 3,
  },
  {
    name: "totalHours",
    label: "总学时",
    type: "number",
    defaultValue: 48,
  },
  {
    name: "theoryHours",
    label: "理论学时",
    type: "number",
    defaultValue: 32,
  },
  {
    name: "practiceHours",
    label: "实践学时",
    type: "number",
    defaultValue: 16,
  },
  {
    name: "experimentHours",
    label: "实验学时",
    type: "number",
    defaultValue: 0,
  },
  {
    name: "intensiveWeeks",
    label: "集中实践周数",
    type: "number",
    defaultValue: 0,
  },
];
