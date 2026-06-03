import fs from "node:fs";
import path from "node:path";
import ts from "typescript";

const rootDir = path.resolve("src");
const dictionaryPath = path.resolve("src/locales/runtimeDictionary.generated.ts");
const ignoredFiles = new Set([
  path.normalize(dictionaryPath),
  path.normalize(path.resolve("src/locales/runtime.ts")),
]);
const sourceExtensions = new Set([".ts", ".tsx", ".js", ".jsx"]);
const hanRe = /[\u4e00-\u9fff]/;

function walk(dir, files = []) {
  for (const name of fs.readdirSync(dir)) {
    const filePath = path.join(dir, name);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      if (!["node_modules", "dist", ".git"].includes(name)) walk(filePath, files);
      continue;
    }
    if (sourceExtensions.has(path.extname(name)) && !ignoredFiles.has(path.normalize(filePath))) {
      files.push(filePath);
    }
  }
  return files;
}

function normalizeLiteral(value) {
  return String(value).replace(/\s+/g, " ").trim();
}

function collectChineseLiterals() {
  const literals = [];
  const files = walk(rootDir);

  for (const filePath of files) {
    const source = fs.readFileSync(filePath, "utf8");
    const sourceFile = ts.createSourceFile(
      filePath,
      source,
      ts.ScriptTarget.Latest,
      true,
      filePath.endsWith(".tsx") || filePath.endsWith(".jsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS,
    );

    const lineOf = (position) => sourceFile.getLineAndCharacterOfPosition(position).line + 1;
    const add = (raw, node) => {
      const value = normalizeLiteral(raw);
      if (!value || !hanRe.test(value) || value.length > 260) return;
      literals.push({ value, filePath, line: lineOf(node.getStart(sourceFile)) });
    };

    function visit(node) {
      if (ts.isStringLiteralLike(node)) {
        add(node.text, node);
      } else if (node.kind === ts.SyntaxKind.JsxText) {
        add(node.getText(sourceFile), node);
      } else if (ts.isNoSubstitutionTemplateLiteral(node)) {
        add(node.text, node);
      } else if (ts.isTemplateExpression(node)) {
        add(node.head.text, node.head);
        for (const span of node.templateSpans) add(span.literal.text, span.literal);
      }
      ts.forEachChild(node, visit);
    }

    visit(sourceFile);
  }

  return literals;
}

function main() {
  const dictionarySource = fs.readFileSync(dictionaryPath, "utf8");
  const literals = collectChineseLiterals();
  const missing = literals.filter((item) => !dictionarySource.includes(`${JSON.stringify(item.value)}:`));
  const uniqueMissing = new Map();

  for (const item of missing) {
    if (!uniqueMissing.has(item.value)) uniqueMissing.set(item.value, item);
  }

  if (dictionarySource.includes("�")) {
    console.error("runtimeDictionary.generated.ts contains replacement characters.");
    process.exitCode = 1;
  }

  if (uniqueMissing.size > 0) {
    console.error(`Missing runtime dictionary entries: ${uniqueMissing.size}`);
    for (const item of uniqueMissing.values()) {
      console.error(`${path.relative(process.cwd(), item.filePath)}:${item.line}:${item.value}`);
    }
    process.exitCode = 1;
  }

  if (!process.exitCode) {
    console.log(`i18n hardcoded check passed: ${new Set(literals.map((item) => item.value)).size} unique Chinese literals covered.`);
  }
}

main();
