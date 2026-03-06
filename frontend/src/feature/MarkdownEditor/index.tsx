import React from "react";
import CodeEditor from "@/feature/CodeEditor";

type MarkdownEditorProps = React.ComponentProps<typeof CodeEditor>;

const MarkdownEditor: React.FC<MarkdownEditorProps> = (props) => {
  return <CodeEditor {...props} language="markdown" />;
};

export default MarkdownEditor;
