import type { FileTreeNode } from "../EditorArea/types";

export const RUNNABLE_LANGUAGE_IDS = [
  "python",
  "javascript",
  "typescript",
  "go",
  "java",
  "c",
  "cpp",
  "rust",
  "csharp",
] as const;

const LANGUAGE_BY_EXTENSION: Record<string, string> = {
  ts: "typescript",
  tsx: "typescript",
  mts: "typescript",
  cts: "typescript",
  js: "javascript",
  jsx: "javascript",
  mjs: "javascript",
  cjs: "javascript",
  py: "python",
  go: "go",
  java: "java",
  c: "c",
  cc: "cpp",
  cp: "cpp",
  cpp: "cpp",
  cxx: "cpp",
  rs: "rust",
  cs: "csharp",
  md: "markdown",
  markdown: "markdown",
  json: "json",
  yml: "yaml",
  yaml: "yaml",
  html: "html",
  htm: "html",
  css: "css",
};

export const inferLanguage = (name: string): string => {
  const ext = name.split(".").pop()?.toLowerCase() ?? "";
  return LANGUAGE_BY_EXTENSION[ext] ?? "plaintext";
};

export const isRunnableLanguage = (language?: string | null): boolean =>
  !!language && RUNNABLE_LANGUAGE_IDS.includes(language as (typeof RUNNABLE_LANGUAGE_IDS)[number]);

interface SandboxSampleFile {
  name: string;
  language: string;
  content: string;
}

export const SANDBOX_TEST_FILES: SandboxSampleFile[] = [
  {
    name: "main.py",
    language: "python",
    content: 'print("Hello from Python sandbox")\n',
  },
  {
    name: "main.js",
    language: "javascript",
    content: 'console.log("Hello from JavaScript sandbox");\n',
  },
  {
    name: "main.ts",
    language: "typescript",
    content: 'console.log("Hello from TypeScript sandbox");\n',
  },
  {
    name: "main.go",
    language: "go",
    content:
      'package main\n\nimport "fmt"\n\nfunc main() {\n\tfmt.Println("Hello from Go sandbox")\n}\n',
  },
  {
    name: "Main.java",
    language: "java",
    content:
      'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello from Java sandbox");\n    }\n}\n',
  },
  {
    name: "main.c",
    language: "c",
    content:
      '#include <stdio.h>\n\nint main(void) {\n    printf("Hello from C sandbox\\n");\n    return 0;\n}\n',
  },
  {
    name: "main.cpp",
    language: "cpp",
    content:
      '#include <iostream>\n\nint main() {\n    std::cout << "Hello from C++ sandbox" << std::endl;\n    return 0;\n}\n',
  },
  {
    name: "main.rs",
    language: "rust",
    content: 'fn main() {\n    println!("Hello from Rust sandbox");\n}\n',
  },
  {
    name: "Program.cs",
    language: "csharp",
    content: 'System.Console.WriteLine("Hello from C# sandbox");\n',
  },
];

export const buildSandboxTestFolder = (): FileTreeNode => ({
  id: "/test",
  name: "test",
  path: "/test",
  type: "directory",
  children: SANDBOX_TEST_FILES.map((file) => ({
    id: `/test/${file.name}`,
    name: file.name,
    path: `/test/${file.name}`,
    type: "file",
    language: file.language,
    content: file.content,
  })),
});
