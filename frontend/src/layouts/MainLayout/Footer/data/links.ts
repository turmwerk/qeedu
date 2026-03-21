import type { ComponentType } from "react";
import {
  BankOutlinedIcon,
  BookOutlinedIcon,
  CodeOutlinedIcon,
  ControlOutlinedIcon,
  ExperimentOutlinedIcon,
  FormOutlinedIcon,
  GlobalOutlinedIcon,
  HomeOutlinedIcon,
  ReadOutlinedIcon,
  SettingOutlinedIcon,
  UserOutlinedIcon,
} from "@/ui/Icon";

export type FooterLink = {
  label: string;
  href: string;
  Icon: ComponentType;
};

export type FooterLinkGroup = {
  title: string;
  links: FooterLink[];
};

export const footerLinkGroups: FooterLinkGroup[] = [
  {
    title: "官方门户",
    links: [
      { label: "南大官网", href: "https://www.nju.edu.cn/", Icon: HomeOutlinedIcon },
      { label: "本科招生网", href: "https://bkzs.nju.edu.cn/", Icon: UserOutlinedIcon },
    ],
  },
  {
    title: "教务学习",
    links: [
      { label: "选课系统", href: "https://xk.nju.edu.cn", Icon: BookOutlinedIcon },
      { label: "教务系统", href: "https://jw.nju.edu.cn/", Icon: FormOutlinedIcon },
      { label: "中国大学生慕课", href: "https://www.icourse163.org", Icon: ReadOutlinedIcon },
      { label: "SPOC官方网站", href: "https://study.nju.edu.cn", Icon: CodeOutlinedIcon },
    ],
  },
  {
    title: "学生服务",
    links: [
      { label: "第二课堂", href: "https://youth.nju.edu.cn/", Icon: ExperimentOutlinedIcon },
      { label: "五育管理", href: "https://ndwy.nju.edu.cn/", Icon: ControlOutlinedIcon },
      { label: "本科交换生系统", href: "http://elite.nju.edu.cn/exchangesystem", Icon: GlobalOutlinedIcon },
    ],
  },
  {
    title: "信息服务",
    links: [
      { label: "信息化建设中心", href: "https://itsc.nju.edu.cn", Icon: SettingOutlinedIcon },
      { label: "办事大厅", href: "https://ehall.nju.edu.cn", Icon: BankOutlinedIcon },
    ],
  },
];
