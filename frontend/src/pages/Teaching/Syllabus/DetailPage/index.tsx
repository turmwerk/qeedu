import React, { useEffect, useState } from "react";
import { SplitSiderLayout } from "@/components/MarkdownView";
import MarkdownEditor from "@/components/MarkdownEditor";
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

  useEffect(() => {
    setLocalTitle(title || "");
  }, [title]);

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
                onFullScreen={() => setOpenFull(true)}
              />
            </>
          }
          right={
            <AssistantPanel id={id} />
          }
          data-oid="wc6ybz5"
        />
        {openFull && (
          <MarkdownEditor
            value={md}
            onClose={(updated) => {
              if (updated !== null) setMd(updated);
              setOpenFull(false);
            }}
            data-oid="_sz36z2"
          />
        )}
      </div>
    </div>
  );
};

export default DetailPage;
