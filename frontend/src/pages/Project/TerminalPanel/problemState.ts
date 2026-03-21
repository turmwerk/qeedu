import type { WorkspaceDiagnostic } from "../context";
import type { ParsedProblem } from "./problemParser";

export interface ProblemHistoryPayload {
  problems: ParsedProblem[];
}

export const mapDiagnosticsToProblems = (
  diagnostics: WorkspaceDiagnostic[],
): ParsedProblem[] =>
  diagnostics.map((diagnostic) => ({
    id: diagnostic.id,
    message: diagnostic.message,
    severity: diagnostic.severity,
    source: diagnostic.source ?? "lsp",
    filePath: diagnostic.filePath,
    line: diagnostic.startLine,
    column: diagnostic.startColumn,
    raw: diagnostic.message,
  }));

export const mergeProblems = (
  primaryProblems: ParsedProblem[],
  secondaryProblems: ParsedProblem[],
): ParsedProblem[] => {
  const merged = [...primaryProblems, ...secondaryProblems];
  return merged.filter(
    (problem, index, all) =>
      all.findIndex(
        (item) =>
          item.message === problem.message &&
          item.filePath === problem.filePath &&
          item.line === problem.line &&
          item.column === problem.column &&
          item.severity === problem.severity,
      ) === index,
  );
};
