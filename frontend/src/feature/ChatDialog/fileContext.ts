import { formatFileSize } from "@/utils/file/preview";

const MAX_FILES = 12;
const MAX_FILE_BYTES = 512 * 1024;
const MAX_FILE_CHARS = 16_000;
const MAX_CONTEXT_CHARS = 60_000;

const TEXT_EXTENSIONS = new Set([
  "bat",
  "c",
  "cc",
  "cfg",
  "cmd",
  "conf",
  "cpp",
  "cs",
  "css",
  "csv",
  "go",
  "h",
  "hpp",
  "htm",
  "html",
  "ini",
  "java",
  "js",
  "json",
  "jsx",
  "log",
  "md",
  "mts",
  "py",
  "rb",
  "rs",
  "scss",
  "sh",
  "sql",
  "svg",
  "toml",
  "ts",
  "tsx",
  "txt",
  "xml",
  "yaml",
  "yml",
]);

const LANGUAGE_BY_EXTENSION: Record<string, string> = {
  bat: "bat",
  c: "c",
  cc: "cpp",
  cmd: "bat",
  cpp: "cpp",
  cs: "csharp",
  css: "css",
  csv: "csv",
  go: "go",
  h: "c",
  hpp: "cpp",
  htm: "html",
  html: "html",
  java: "java",
  js: "javascript",
  json: "json",
  jsx: "jsx",
  md: "markdown",
  mts: "typescript",
  py: "python",
  rb: "ruby",
  rs: "rust",
  scss: "scss",
  sh: "bash",
  sql: "sql",
  svg: "xml",
  toml: "toml",
  ts: "typescript",
  tsx: "tsx",
  txt: "text",
  xml: "xml",
  yaml: "yaml",
  yml: "yaml",
};

const getExtension = (name: string) => {
  const clean = name.toLowerCase().split("?")[0];
  const parts = clean.split(".");
  return parts.length > 1 ? parts.pop() ?? "" : "";
};

const getDisplayPath = (file: File) => {
  const withPath = file as File & { webkitRelativePath?: string };
  return withPath.webkitRelativePath || file.name;
};

const isTextCandidate = (file: File) => {
  if (file.type.startsWith("text/")) return true;
  if (file.type === "application/json" || file.type === "application/xml") return true;
  return TEXT_EXTENSIONS.has(getExtension(file.name));
};

const normalizeText = (value: string) =>
  value
    .replace(/\u0000/g, "")
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .trimEnd();

const looksBinary = (value: string) => {
  if (!value) return false;
  const sample = value.slice(0, 4000);
  const replacementCount = (sample.match(/\uFFFD/g) ?? []).length;
  const controlCount = [...sample].filter((char) => {
    const code = char.charCodeAt(0);
    return code < 32 && ![9, 10, 12, 13].includes(code);
  }).length;
  return replacementCount / sample.length > 0.02 || controlCount / sample.length > 0.02;
};

const formatJsonIfPossible = (text: string) => {
  try {
    return JSON.stringify(JSON.parse(text), null, 2);
  } catch {
    return text;
  }
};

const summarizeCsv = (text: string) => {
  const rows = text.split("\n").filter(Boolean);
  if (rows.length <= 12) return text;
  const head = rows.slice(0, 8).join("\n");
  return `${head}\n\n[CSV preview truncated: ${rows.length} rows total]`;
};

const formatTextByExtension = (file: File, text: string) => {
  const ext = getExtension(file.name);
  if (ext === "json") return formatJsonIfPossible(text);
  if (ext === "csv") return summarizeCsv(text);
  return text;
};

const readTextSlice = async (file: File) => {
  const blob = file.slice(0, Math.min(file.size, MAX_FILE_BYTES));
  const buffer = await blob.arrayBuffer();
  const text = new TextDecoder("utf-8", { fatal: false }).decode(buffer);
  return normalizeText(text);
};

const getImageInfo = async (file: File) => {
  if (!file.type.startsWith("image/") || typeof createImageBitmap === "undefined") {
    return "";
  }
  try {
    const bitmap = await createImageBitmap(file);
    const info = `Image dimensions: ${bitmap.width}x${bitmap.height}`;
    bitmap.close();
    return info;
  } catch {
    return "";
  }
};

const truncate = (text: string, maxChars: number) => {
  if (text.length <= maxChars) return { text, truncated: false };
  return {
    text: text.slice(0, maxChars),
    truncated: true,
  };
};

const buildTextFileBlock = async (file: File, index: number) => {
  const rawText = await readTextSlice(file);
  if (looksBinary(rawText)) {
    return buildBinaryFileBlock(file, index, "Text decoding produced binary-like content.");
  }

  const ext = getExtension(file.name);
  const formatted = formatTextByExtension(file, rawText);
  const limited = truncate(formatted, MAX_FILE_CHARS);
  const language = LANGUAGE_BY_EXTENSION[ext] ?? "text";
  const sizeNote = file.size > MAX_FILE_BYTES ? `; read first ${formatFileSize(MAX_FILE_BYTES)}` : "";
  const truncationNote = limited.truncated ? "\n[File content truncated]" : "";

  return [
    `### File ${index}: ${getDisplayPath(file)}`,
    `Type: ${file.type || "unknown"}; size: ${formatFileSize(file.size)}${sizeNote}`,
    `Content:`,
    `\`\`\`${language}`,
    `${limited.text}${truncationNote}`,
    "```",
  ].join("\n");
};

const buildBinaryFileBlock = async (file: File, index: number, note = "Binary content is not embedded.") => {
  const imageInfo = await getImageInfo(file);
  return [
    `### File ${index}: ${getDisplayPath(file)}`,
    `Type: ${file.type || "unknown"}; size: ${formatFileSize(file.size)}`,
    imageInfo,
    `Content: [${note}]`,
  ].filter(Boolean).join("\n");
};

const buildFileBlock = async (file: File, index: number) => {
  try {
    if (isTextCandidate(file)) return buildTextFileBlock(file, index);
    return buildBinaryFileBlock(file, index);
  } catch (error) {
    return [
      `### File ${index}: ${getDisplayPath(file)}`,
      `Type: ${file.type || "unknown"}; size: ${formatFileSize(file.size)}`,
      `Content: [Unable to read file: ${String(error)}]`,
    ].join("\n");
  }
};

export const buildChatFileContext = async (files: File[]) => {
  if (files.length === 0) return "";

  const selected = files.slice(0, MAX_FILES);
  const omitted = files.length - selected.length;
  const manifest = selected.map((file, index) => {
    const kind = isTextCandidate(file) ? "text" : "binary";
    return `${index + 1}. ${getDisplayPath(file)} | ${kind} | ${file.type || "unknown"} | ${formatFileSize(file.size)}`;
  });

  const blocks = await Promise.all(selected.map((file, index) => buildFileBlock(file, index + 1)));
  const context = [
    "Attached files context.",
    "Use these files as source material. If a file is marked binary or truncated, say what information is unavailable instead of inventing it.",
    "",
    "## File manifest",
    ...manifest,
    omitted > 0 ? `... ${omitted} additional file(s) omitted by limit.` : "",
    "",
    "## File contents",
    ...blocks,
  ].filter(Boolean).join("\n");

  const limited = truncate(context, MAX_CONTEXT_CHARS);
  return limited.truncated
    ? `${limited.text}\n\n[Attached files context truncated at ${MAX_CONTEXT_CHARS} characters]`
    : limited.text;
};
