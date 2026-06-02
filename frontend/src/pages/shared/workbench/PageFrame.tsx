import React from "react";
import SplitSiderLayout from "@/layouts/SplitSiderLayout";

type WorkspacePageFrameProps = {
  header: React.ReactNode;
  left: React.ReactNode;
  right: React.ReactNode;
  initialSplit?: number;
  minSplit?: number;
  maxSplit?: number;
};

const WorkspacePageFrame: React.FC<WorkspacePageFrameProps> = ({
  header,
  left,
  right,
  initialSplit = 64,
  minSplit = 48,
  maxSplit = 76,
}) => (
  <div className="workspace-page-frame flex h-full min-h-0 w-full flex-col overflow-hidden px-4 pb-4 md:px-6 xl:px-8">
    <div className="shrink-0 py-2">{header}</div>
    <SplitSiderLayout
      initialSplit={initialSplit}
      minSplit={minSplit}
      maxSplit={maxSplit}
      className="flex-1 min-h-0 min-w-0 h-full overflow-hidden"
      leftClassName="flex h-full min-h-0 min-w-0 flex-col overflow-hidden"
      rightClassName="flex h-full min-h-0 min-w-0 flex-col overflow-hidden"
      left={left}
      right={right}
    />
  </div>
);

export default WorkspacePageFrame;
