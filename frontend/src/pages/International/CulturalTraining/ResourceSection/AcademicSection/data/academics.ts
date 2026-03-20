import type { ComponentType } from "react";
import type { Feature } from "@/feature/ModuleHub/types";
import {
  BookOutlinedIcon,
  MailOutlinedIcon,
  TeamOutlinedIcon,
} from "@/ui/Icon";

export type AcademicCardItem = Feature & {
  iconComponent: ComponentType<any>;
  badgeLabel: string;
  linkLabel: string;
  url: string;
};

export const ACADEMIC_CARDS: AcademicCardItem[] = [
  {
    key: "academic-etiquette",
    title: "学术礼仪",
    desc: "帮助学生理解课堂发言、office hour、与导师沟通时的基本礼仪和边界。",
    icon: null,
    iconComponent: BookOutlinedIcon,
    badgeLabel: "Guide",
    linkLabel: "查看礼仪说明",
    url: "https://owl.purdue.edu/owl/general_writing/academic_writing/index.html",
  },
  {
    key: "classroom-participation",
    title: "课堂参与方式",
    desc: "介绍讨论课、presentation、提问习惯和课堂互动中常见的文化差异。",
    icon: null,
    iconComponent: TeamOutlinedIcon,
    badgeLabel: "Classroom",
    linkLabel: "查看课堂参与建议",
    url: "https://cft.vanderbilt.edu/guides-sub-pages/active-learning/",
  },
  {
    key: "email-phrasing",
    title: "邮件措辞",
    desc: "整理教授、行政老师、住宿办公室等场景下常见的邮件表达方式。",
    icon: null,
    iconComponent: MailOutlinedIcon,
    badgeLabel: "Email",
    linkLabel: "查看邮件模板",
    url: "https://writingcenter.unc.edu/tips-and-tools/effective-e-mail-communication/",
  },
  {
    key: "academic-integrity",
    title: "学术诚信规范",
    desc: "覆盖引用、合作边界、抄袭参考与 AI 使用提醒，减少学术风险。",
    icon: null,
    iconComponent: BookOutlinedIcon,
    badgeLabel: "Integrity",
    linkLabel: "查看诚信规范",
    url: "https://www.plagiarism.org/",
  },
];
