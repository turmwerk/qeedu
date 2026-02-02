import React, { useState } from "react";
import SplitSiderLayout from "@/layouts/SplitSiderLayout";
import FullScreenMarkdownCanvas from "@/components/FullScreenMarkdownCanvas";
import { AssistantPanel, Header, MarkdownPanel } from "./components";

const DetailPage: React.FC<{
  md: string;
  setMd: (md: string) => void;
  onBack: () => void;
  openFull: boolean;
  setOpenFull: (v: boolean) => void;
  title?: string;
  id?: string;
  onRename?: (id: string, title: string) => void;
}> = ({ md, setMd, onBack, openFull, setOpenFull, title, id, onRename }) => {
  const [localTitle, setLocalTitle] = useState(title || "");
  const [showRaw, setShowRaw] = useState(false);

  const handleTitleChange = (next: string) => {
    setLocalTitle(next);
    if (id && onRename) onRename(id, next);
  };

  const displayTitle = localTitle || title || "未命名课程";
  return (
    <div className="h-full min-h-0 w-full" data-oid="d:u9nn:">
      <div className="p-0 text-[#444] h-full min-h-0 flex flex-col" data-oid="4sxypj2">
        <Header
          title={displayTitle}
          onTitleChange={handleTitleChange}
          onBack={onBack}
          md={md}
          showRaw={showRaw}
          onToggleRaw={() => setShowRaw((v) => !v)}
          onFullScreen={() => setOpenFull(true)}
        />
        <SplitSiderLayout
          className="p-0"
          leftClassName="flex flex-col h-full min-h-0 bg-white overflow-hidden"
          rightClassName="bg-white h-full flex flex-col min-h-0 overflow-hidden"
          left={
            <>
              <div
                className="flex justify-between items-center font-bold mb-0"
                data-oid="ybrwo3s"
              />
              <MarkdownPanel
                md={md}
                onChange={setMd}
                showRaw={showRaw}
              />
            </>
          }
          right={
            <AssistantPanel id={id} />
          }
          data-oid="wc6ybz5"
        />
        {openFull && (
          <FullScreenMarkdownCanvas
            value={md}
            onClose={(updated) => {
              if (updated !== null) setMd(updated);
              setOpenFull(false);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default DetailPage;
