import type { ComponentType } from "react";
import type { Feature } from "@/feature/ModuleHub/types";
import {
  ExclamationCircleOutlinedIcon,
  SafetyOutlinedIcon,
} from "@/ui/Icon";

export type SafetyCardItem = Feature & {
  iconComponent: ComponentType<any>;
  badgeLabel: string;
  linkLabel: string;
  url: string;
};

export const SAFETY_CARDS: SafetyCardItem[] = [
  {
    key: "local-law",
    title: "当地法律须知",
    desc: "围绕签证身份、租房合同、交通规则、酒精与年龄限制等基础法律事项做提醒。",
    icon: null,
    iconComponent: SafetyOutlinedIcon,
    badgeLabel: "Law",
    linkLabel: "查看出行前法律须知",
    url: "https://travel.state.gov/content/travel/en/international-travel/before-you-go.html",
  },
  {
    key: "daily-safety",
    title: "安全事项",
    desc: "覆盖夜间出行、证件保管、财产安全和常见诈骗场景。",
    icon: null,
    iconComponent: ExclamationCircleOutlinedIcon,
    badgeLabel: "Safety",
    linkLabel: "查看安全建议",
    url: "https://travel.state.gov/content/travel/en/international-travel/safety-and-security.html",
  },
  {
    key: "emergency-contact",
    title: "应急联系方式",
    desc: "整理报警、急救、校内安保、领馆与学校支持入口，便于突发情况快速处理。",
    icon: null,
    iconComponent: ExclamationCircleOutlinedIcon,
    badgeLabel: "Emergency",
    linkLabel: "查看应急联络入口",
    url: "https://www.usembassy.gov/",
  },
];
