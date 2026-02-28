import React, { useCallback } from "react";
import MonacoCodeEditor from "@/components/CodeEditor";
import { type TabItem } from "../../../../types";
import { useWorkspace } from "../../../../../../context";

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
    <div className="h-full w-full overflow-hidden">
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
  );
};

export default CodeEditorView;
