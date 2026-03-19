import type { ReactNode } from "react";

export type ShowcaseStat = {
  label: string;
  value: string;
  detail?: string;
};

export type ShowcaseRecord = {
  title: string;
  meta: string;
  summary?: string;
  status?: string;
  tags?: string[];
  actions?: Array<{
    label: string;
    primary?: boolean;
  }>;
};

export type ShowcaseConversationCard = {
  title: string;
  description: string;
};

export type ShowcaseMessage = {
  role: string;
  time: string;
  content: string;
  cards?: ShowcaseConversationCard[];
};

export type ShowcaseSummaryItem = {
  title: string;
  description: string;
};

export type ShowcaseChecklistItem = {
  title: string;
  description: string;
  status?: string;
  tone?: "blue" | "green" | "orange" | "red";
  checked?: boolean;
};

export type ShowcaseFilterGroup = {
  title: string;
  values: string[];
};

export type ShowcaseResult = {
  title: string;
  meta: string;
  tags: string[];
  summary: string;
  badge?: string;
};

export type ShowcaseTile = {
  title: string;
  description: string;
  badge?: string;
  icon?: ReactNode;
};
