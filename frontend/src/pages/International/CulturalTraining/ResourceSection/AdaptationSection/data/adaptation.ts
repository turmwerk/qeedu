import type { ComponentType } from "react";
import type { Feature } from "@/feature/ModuleHub/types";
import {
  EnvironmentOutlinedIcon,
  GlobalOutlinedIcon,
  TeamOutlinedIcon,
} from "@/ui/Icon";

export type AdaptationCardItem = Feature & {
  iconComponent: ComponentType<any>;
  badgeLabel: string;
  linkLabel: string;
  url: string;
};

export const ADAPTATION_CARDS: AdaptationCardItem[] = [
  {
    key: "cultural-adaptation",
    title: "跨文化适应",
    desc: "帮助学生理解沟通差异、社交边界、文化误解和在外适应的常见阶段。",
    icon: null,
    iconComponent: GlobalOutlinedIcon,
    badgeLabel: "Culture",
    linkLabel: "查看文化适应指南",
    url: "https://www.bu.edu/isso/travel-abroad/cultural-adjustment/",
  },
  {
    key: "life-faq",
    title: "生活场景 FAQ",
    desc: "整理住宿、购物、就医、银行、手机卡等在外生活中最常见的问题。",
    icon: null,
    iconComponent: EnvironmentOutlinedIcon,
    badgeLabel: "FAQ",
    linkLabel: "查看生活支持说明",
    url: "https://students.ubc.ca/about-student-services",
  },
  {
    key: "support-entry",
    title: "校内外支持入口",
    desc: "包括国际处、院系 coordinator、学生服务中心等支持渠道和联络方式。",
    icon: null,
    iconComponent: TeamOutlinedIcon,
    badgeLabel: "Support",
    linkLabel: "查看支持资源",
    url: "https://students.ubc.ca/health",
  },
];
