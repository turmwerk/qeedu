import type { ReactNode } from "react";
import type { SubLink } from "@/ui/Card";

export type Feature = {
  key: string;
  title: string;
  desc: string;
  to?: string;
  icon?: ReactNode;
  subLinks?: SubLink[];
  details?: string[];
  badgeLabel?: string;
  footerLabel?: string;
  ctaLabel?: string;
  [extra: string]: unknown;
};
