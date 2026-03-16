export type Question = {
  id: string;
  stem: string;
  score?: number;
  type?: string;
  options?: string[];
  knowledge?: string;
  difficulty?: string;
  cognition?: string;
  answerAnalysis?: string;
};
