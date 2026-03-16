import type { FileTreeNode } from "../EditorArea/types";

export const buildMockFileTree = (projectName: string): FileTreeNode => ({
  id: "/",
  name: projectName,
  path: "/",
  type: "directory",
  children: [
    {
      id: "/src",
      name: "src",
      path: "/src",
      type: "directory",
      children: [
        {
          id: "/src/main.py",
          name: "main.py",
          path: "/src/main.py",
          type: "file",
          language: "python",
          content:
            '# Entry point\nif __name__ == "__main__":\n    print("Hello, Code Tutor!")\n',
        },
        {
          id: "/src/solution.py",
          name: "solution.py",
          path: "/src/solution.py",
          type: "file",
          language: "python",
          content: "# Write your solution here\n\n\ndef solve():\n    pass\n",
        },
        {
          id: "/src/utils.py",
          name: "utils.py",
          path: "/src/utils.py",
          type: "file",
          language: "python",
          content: "# Utility functions\n\n\ndef helper():\n    pass\n",
        },
      ],
    },
    {
      id: "/tests",
      name: "tests",
      path: "/tests",
      type: "directory",
      children: [
        {
          id: "/tests/test_main.py",
          name: "test_main.py",
          path: "/tests/test_main.py",
          type: "file",
          language: "python",
          content: "import unittest\n\n\nclass TestSolution(unittest.TestCase):\n    def test_example(self):\n        self.assertEqual(1 + 1, 2)\n",
        },
      ],
    },
    {
      id: "/README.md",
      name: "README.md",
      path: "/README.md",
      type: "file",
      language: "markdown",
      content: `# ${projectName}\n\n> 使用 Code Tutor AI 助手辅助编程学习。\n\n## 任务目标\n\n请在 \`src/solution.py\` 中完成题目要求。\n\n## 测试方法\n\n\`\`\`bash\npython -m pytest tests/\n\`\`\`\n`,
    },
    {
      id: "/requirements.txt",
      name: "requirements.txt",
      path: "/requirements.txt",
      type: "file",
      language: "plaintext",
      content: "# Python dependencies\n",
    },
  ],
});
