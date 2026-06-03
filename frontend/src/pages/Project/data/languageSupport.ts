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
  toml: "toml",
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

const buildFileNode = (parentPath: string, file: SandboxSampleFile): FileTreeNode => ({
  id: `${parentPath}/${file.name}`,
  name: file.name,
  path: `${parentPath}/${file.name}`,
  type: "file",
  language: file.language,
  content: file.content,
});

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
  children: [
    ...SANDBOX_TEST_FILES
      .filter((file) => !["main.go", "Main.java", "main.rs"].includes(file.name))
      .map((file) => buildFileNode("/test", file)),
    {
      id: "/test/go-hello",
      name: "go-hello",
      path: "/test/go-hello",
      type: "directory",
      children: [
        buildFileNode("/test/go-hello", {
          name: "go.mod",
          language: "plaintext",
          content: "module qe-edu-go-hello\n\ngo 1.22\n",
        }),
        buildFileNode("/test/go-hello", {
          name: "main.go",
          language: "go",
          content:
            'package main\n\nimport "fmt"\n\nfunc main() {\n\tfmt.Println(message())\n}\n',
        }),
        buildFileNode("/test/go-hello", {
          name: "message.go",
          language: "go",
          content:
            'package main\n\nfunc message() string {\n\treturn "Hello from Go module sandbox"\n}\n',
        }),
        buildFileNode("/test/go-hello", {
          name: "README.md",
          language: "markdown",
          content: "# Go 示例\n\n在终端中进入本目录后运行：\n\n```bash\ngo run .\n```\n",
        }),
      ],
    },
    {
      id: "/test/java-hello",
      name: "java-hello",
      path: "/test/java-hello",
      type: "directory",
      children: [
        {
          id: "/test/java-hello/src",
          name: "src",
          path: "/test/java-hello/src",
          type: "directory",
          children: [
            buildFileNode("/test/java-hello/src", {
              name: "Main.java",
              language: "java",
              content:
                'public class Main {\n    public static void main(String[] args) {\n        System.out.println(Message.text());\n    }\n}\n',
            }),
            buildFileNode("/test/java-hello/src", {
              name: "Message.java",
              language: "java",
              content:
                'public class Message {\n    public static String text() {\n        return "Hello from Java sandbox project";\n    }\n}\n',
            }),
          ],
        },
        buildFileNode("/test/java-hello", {
          name: "README.md",
          language: "markdown",
          content:
            "# Java 示例\n\n在终端中进入本目录后运行：\n\n```bash\njavac src/*.java -d out && java -cp out Main\n```\n",
        }),
      ],
    },
    {
      id: "/test/rust-hello",
      name: "rust-hello",
      path: "/test/rust-hello",
      type: "directory",
      children: [
        buildFileNode("/test/rust-hello", {
          name: "Cargo.toml",
          language: "toml",
          content:
            '[package]\nname = "qe_edu_rust_hello"\nversion = "0.1.0"\nedition = "2021"\n\n[dependencies]\n',
        }),
        {
          id: "/test/rust-hello/src",
          name: "src",
          path: "/test/rust-hello/src",
          type: "directory",
          children: [
            buildFileNode("/test/rust-hello/src", {
              name: "main.rs",
              language: "rust",
              content:
                'mod message;\n\nfn main() {\n    println!("{}", message::text());\n}\n',
            }),
            buildFileNode("/test/rust-hello/src", {
              name: "message.rs",
              language: "rust",
              content:
                "pub fn text() -> &'static str {\n    \"Hello from Rust Cargo sandbox\"\n}\n",
            }),
          ],
        },
        buildFileNode("/test/rust-hello", {
          name: "README.md",
          language: "markdown",
          content: "# Rust 示例\n\n在终端中进入本目录后运行：\n\n```bash\ncargo run\n```\n",
        }),
      ],
    },
  ],
});
