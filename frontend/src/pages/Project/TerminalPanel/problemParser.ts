import type { RunOutput } from "../context";

export interface ParsedProblem {
  id: string;
  message: string;
  severity: "error" | "warning" | "information" | "hint";
  source: string;
  filePath: string;
  line?: number;
  column?: number;
  raw: string;
}

const ANSI_PATTERN =
  // eslint-disable-next-line no-control-regex
  /\u001b\[[0-9;]*[A-Za-z]/g;

const stripAnsi = (value: string): string => value.replace(ANSI_PATTERN, "");

const normalizeFilePath = (
  candidate: string | undefined,
  runOutput: RunOutput,
): string => {
  if (!candidate) {
    return runOutput.filePath ?? "/";
  }

  const clean = candidate
    .trim()
    .replace(/^file:\/\//, "")
    .replace(/^\/code\//, "/")
    .replace(/^\.\//, "/");

  if (!clean) return runOutput.filePath ?? "/";
  if (clean.startsWith("/")) return clean;

  if (runOutput.fileName && clean === runOutput.fileName) {
    return runOutput.filePath ?? `/${clean}`;
  }

  return `/${clean}`;
};

const createProblem = (
  runOutput: RunOutput,
  index: number,
  partial: Omit<ParsedProblem, "id" | "filePath"> & { filePath?: string },
): ParsedProblem => ({
  id: `${runOutput.timestamp}-${index}-${partial.message}`,
  filePath: normalizeFilePath(partial.filePath, runOutput),
  ...partial,
});

const parseTraceback = (
  lines: string[],
  runOutput: RunOutput,
): ParsedProblem[] => {
  let lastPath: string | undefined;
  let lastLine: number | undefined;

  for (const line of lines) {
    const match = line.match(/File "(.+?)", line (\d+)/);
    if (!match) continue;
    lastPath = match[1];
    lastLine = Number(match[2]);
  }

  const finalLine = [...lines]
    .reverse()
    .find((line) => /^[A-Za-z_][A-Za-z0-9_]*(Error|Exception):/.test(line.trim()));

  if (!finalLine) return [];

  return [
    createProblem(runOutput, 0, {
      message: finalLine.trim(),
      severity: "error",
      source: "python",
      filePath: lastPath,
      line: lastLine,
      raw: finalLine.trim(),
    }),
  ];
};

export const parseProblems = (runOutput: RunOutput | null): ParsedProblem[] => {
  if (!runOutput || runOutput.status === "running") return [];

  const raw = stripAnsi([runOutput.error, runOutput.stderr].filter(Boolean).join("\n")).trim();
  if (!raw) return [];

  const lines = raw
    .split(/\r?\n/)
    .map((line) => line.trimEnd())
    .filter(Boolean);

  const problems: ParsedProblem[] = [];
  let rustMessage: string | null = null;
  let pendingScriptLocation: { filePath?: string; line?: number; column?: number } | null = null;

  for (const line of lines) {
    const csharpMatch = line.match(/^(.+?)\((\d+),(\d+)\):\s+(error|warning)\s+([A-Z]{2}\d+):\s+(.*)$/i);
    if (csharpMatch) {
      problems.push(
        createProblem(runOutput, problems.length, {
          message: `${csharpMatch[5]}: ${csharpMatch[6]}`,
          severity: csharpMatch[4].toLowerCase() === "warning" ? "warning" : "error",
          source: "csharp",
          filePath: csharpMatch[1],
          line: Number(csharpMatch[2]),
          column: Number(csharpMatch[3]),
          raw: line,
        }),
      );
      continue;
    }

    const standardMatch = line.match(
      /^(.+?):(\d+):(?:(\d+):)?\s*(fatal error|error|warning|note):\s+(.*)$/i,
    );
    if (standardMatch) {
      problems.push(
        createProblem(runOutput, problems.length, {
          message: standardMatch[5],
          severity: standardMatch[4].toLowerCase() === "warning" ? "warning" : "error",
          source: runOutput.language ?? "compiler",
          filePath: standardMatch[1],
          line: Number(standardMatch[2]),
          column: standardMatch[3] ? Number(standardMatch[3]) : undefined,
          raw: line,
        }),
      );
      continue;
    }

    const javacMatch = line.match(/^(.+?):(\d+):\s+error:\s+(.*)$/i);
    if (javacMatch) {
      problems.push(
        createProblem(runOutput, problems.length, {
          message: javacMatch[3],
          severity: "error",
          source: "javac",
          filePath: javacMatch[1],
          line: Number(javacMatch[2]),
          raw: line,
        }),
      );
      continue;
    }

    const genericLocationMatch = line.match(/^(.+?):(\d+):(\d+):\s+(.*)$/);
    if (genericLocationMatch) {
      problems.push(
        createProblem(runOutput, problems.length, {
          message: genericLocationMatch[4],
          severity: "error",
          source: runOutput.language ?? "compiler",
          filePath: genericLocationMatch[1],
          line: Number(genericLocationMatch[2]),
          column: Number(genericLocationMatch[3]),
          raw: line,
        }),
      );
      continue;
    }

    const rustMessageMatch = line.match(/^error(?:\[[^\]]+\])?:\s+(.*)$/i);
    if (rustMessageMatch) {
      rustMessage = rustMessageMatch[1];
      continue;
    }

    const rustLocationMatch = line.match(/^\s*-->\s+(.+?):(\d+):(\d+)$/);
    if (rustLocationMatch && rustMessage) {
      problems.push(
        createProblem(runOutput, problems.length, {
          message: rustMessage,
          severity: "error",
          source: "rustc",
          filePath: rustLocationMatch[1],
          line: Number(rustLocationMatch[2]),
          column: Number(rustLocationMatch[3]),
          raw: rustMessage,
        }),
      );
      rustMessage = null;
      continue;
    }

    const scriptLocationMatch = line.match(
      /^(?:at\s+)?(?:file:\/\/)?(.+\.(?:js|jsx|ts|tsx|py)):(\d+)(?::(\d+))?$/,
    );
    if (scriptLocationMatch) {
      pendingScriptLocation = {
        filePath: scriptLocationMatch[1],
        line: Number(scriptLocationMatch[2]),
        column: scriptLocationMatch[3] ? Number(scriptLocationMatch[3]) : undefined,
      };
      continue;
    }

    const runtimeErrorMatch = line.match(/^[A-Za-z_][A-Za-z0-9_]*(Error|Exception):\s+(.+)$/);
    if (runtimeErrorMatch) {
      problems.push(
        createProblem(runOutput, problems.length, {
          message: line,
          severity: "error",
          source: runOutput.language ?? "runtime",
          filePath: pendingScriptLocation?.filePath,
          line: pendingScriptLocation?.line,
          column: pendingScriptLocation?.column,
          raw: line,
        }),
      );
      pendingScriptLocation = null;
      continue;
    }
  }

  if (problems.length > 0) {
    return problems.filter(
      (problem, index, all) =>
        all.findIndex(
          (item) =>
            item.message === problem.message &&
            item.filePath === problem.filePath &&
            item.line === problem.line &&
            item.column === problem.column,
        ) === index,
    );
  }

  const tracebackProblems = parseTraceback(lines, runOutput);
  if (tracebackProblems.length > 0) return tracebackProblems;

  const firstLine = lines.find((line) => !/^# /.test(line)) ?? raw;
  return [
    createProblem(runOutput, 0, {
      message: firstLine,
      severity: "error",
      source: runOutput.language ?? "runtime",
      raw,
    }),
  ];
};
