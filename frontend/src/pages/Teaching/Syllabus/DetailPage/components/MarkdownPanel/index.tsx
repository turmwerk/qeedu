import React from "react";
import MarkdownView from "@/components/MarkdownView";

type MarkdownPanelProps = {
  md: string;
  onChange: (next: string) => void;
  onFullScreen: () => void;
};

const MarkdownPanel: React.FC<MarkdownPanelProps> = ({
  md,
  onChange,
  onFullScreen,
}) => {
  return (
    <div className="flex-1 min-h-0 overflow-hidden p-4">
      <div className="h-full min-h-0">
        <MarkdownView value={md} onChange={onChange} onFullScreen={onFullScreen} />
      </div>
    </div>
  );
};

export default MarkdownPanel;
