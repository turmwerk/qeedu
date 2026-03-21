import type { FileTreeNode } from "../EditorArea/types";
import { buildSandboxTestFolder } from "./languageSupport";

export const buildMockFileTree = (projectName: string): FileTreeNode => ({
  id: "/",
  name: projectName || "在线IDE",
  path: "/",
  type: "directory",
  children: [
    {
      id: "/README.md",
      name: "README.md",
      path: "/README.md",
      type: "file",
      language: "markdown",
      content: `# ${projectName || "在线IDE"}

欢迎来到在线 IDE。

- 左侧文件树可以浏览和管理项目文件
- 根目录的 \`test/\` 提供了多语言示例文件
- 打开示例文件后可以直接运行或继续编辑
`,
    },
    buildSandboxTestFolder(),
  ],
});
