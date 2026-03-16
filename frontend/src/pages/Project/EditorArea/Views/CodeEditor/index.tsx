import React, { useCallback } from "react";
import MonacoCodeEditor from "@/feature/CodeEditor";
import { type TabItem } from "../../types";
import { useWorkspace } from "../../../context";

interface CodeEditorViewProps {
  tab: TabItem;
}

const CodeEditorView: React.FC<CodeEditorViewProps> = ({ tab }) => {
  const { updateTabContent } = useWorkspace();

  const handleChange = useCallback(
    (val: string) => {
      updateTabContent(tab.id, val);
    },
    [tab.id, updateTabContent],
  );

  return (
    <div className="flex h-full w-full flex-col overflow-hidden">
      <div className="min-h-0 flex-1">
        <MonacoCodeEditor
          value={tab.content ?? ""}
          onChange={handleChange}
          language={tab.language ?? "plaintext"}
          height="100%"
          showHeader={false}
          minimap={false}
          className="!rounded-none !border-none !shadow-none"
        />
      </div>
    </div>
  );
};

export default CodeEditorView;
