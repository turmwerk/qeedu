import React from "react";
import MarkdownView from "@/feature/MarkdownView";
import { type TabItem } from "../../types";

interface MarkdownViewerProps {
  tab: TabItem;
}

const MarkdownViewer: React.FC<MarkdownViewerProps> = ({ tab }) => (
  <div className="h-full w-full overflow-y-auto bg-[#1e1e1e] p-6">
    <MarkdownView value={tab.content ?? ""} />
  </div>
);

export default MarkdownViewer;

