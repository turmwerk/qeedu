import type { Question } from "./DetailPage/types";

export type ExamItem = {
  id: string;
  title: string;
  subtitle?: string;
  createdAt?: number;
};

export type Exam = {
  id: string;
  title: string;
  questions: Question[];
  createdAt?: number;
};
