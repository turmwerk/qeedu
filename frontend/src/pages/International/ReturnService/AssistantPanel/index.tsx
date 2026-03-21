import React from "react";
import { returnServiceRecords } from "@/pages/International/featureData";
import { WorkspaceAssistantPanel } from "@/pages/shared/workbench";

type ReturnServiceRecord = (typeof returnServiceRecords)[number];

type Props = {
  selected: ReturnServiceRecord | null;
  transport?: React.ComponentProps<typeof WorkspaceAssistantPanel>["transport"];
};

const AssistantPanel: React.FC<Props> = ({ selected, transport }) =>
  selected ? (
    <WorkspaceAssistantPanel
      dialogId={`international-return-${selected.id}`}
      botName="返校收尾助手"
      initMessage="我已经读取当前返校案例、待办与归档资源，可以继续生成 closing 清单、经验 FAQ 或分享提纲。"
      transport={transport}
    />
  ) : (
    <WorkspaceAssistantPanel
      dialogId="international-return-empty"
      botName="返校收尾助手"
      initMessage="选择一条返校案例后，我可以继续帮你整理 closing 清单和经验沉淀。"
    />
  );

export default AssistantPanel;
