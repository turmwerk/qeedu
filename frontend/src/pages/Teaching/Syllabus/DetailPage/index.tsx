import React, { useEffect, useState } from "react";
import Dropdown from "@/components/Dropdown";
import {
  downloadMarkdown,
  downloadDocx,
  exportPdfViaPrint,
} from "@/utils/exportFiles";
import MarkdownView from "@/components/MarkdownView";
import MarkdownEditor from "@/components/MarkdownEditor";
import Dialog from "@/components/Dialog";

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
    <div data-oid="d:u9nn:">
      <div className="p-6 text-[#444]" data-oid="4sxypj2">
        <div
          className="bg-white px-2 py-1.5 rounded-[10px] shadow-[0_1px_6px_rgba(16,24,40,0.04)] mb-3"
          data-oid="ooya:-g"
        >
          <div
            className="flex justify-between items-center gap-2.5"
            data-oid="iut9jk:"
          >
            <input
              className="flex-1 border border-transparent bg-[#f0ebf6] rounded-xl px-3 py-2 text-[18px] font-bold text-[#4b2a85] min-h-[40px] transition-[box-shadow,border-color] focus:outline-none focus:border-[#4b2a85] focus:shadow-[0_0_0_3px_rgba(75,42,133,0.18)]"
              type="text"
              value={localTitle}
              onChange={(event) => handleTitleChange(event.target.value)}
              placeholder="未命名课程"
              data-oid="m7io34z"
            />

            <div className="flex items-center gap-3" data-oid="icl7kpu">
              <div
                className="flex flex-col items-start justify-center gap-0.5 mr-2"
                data-oid="xu1iqli"
              >
                <div
                  className="text-[12px] text-[#6b6b6b] font-semibold"
                  data-oid="h1fskpm"
                >
                  总分
                </div>
                <div
                  className="text-[22px] font-extrabold text-[#4b2a85] leading-none"
                  data-oid="yel0gv1"
                >
                  90
                </div>
              </div>
              <button
                className="bg-white border-2 border-[#7a54c4] text-[#7a54c4] px-3.5 py-1.5 rounded-[14px] cursor-pointer font-bold text-[15px] transition-[background,box-shadow,transform] hover:bg-[#f3eefb] hover:shadow-[0_8px_18px_rgba(75,42,133,0.12)] hover:-translate-y-[1px]"
                onClick={onBack}
                data-oid="loi4hgh"
              >
                返回大纲目录
              </button>
              <Dropdown
                button="导出"
                items={[
                  {
                    label: "导出 PDF",
                    onClick: () => exportPdfViaPrint(displayTitle, md),
                  },
                  {
                    label: "导出 Docx",
                    onClick: () => downloadDocx(displayTitle, md),
                  },
                  {
                    label: "导出 Markdown",
                    onClick: () => downloadMarkdown(displayTitle, md),
                  },
                ]}
                data-oid="6zbhnlb"
              />
            </div>
          </div>
        </div>
        <div
          className="grid grid-cols-[1fr_360px] gap-5 items-start max-[980px]:grid-cols-1"
          data-oid="wc6ybz5"
        >
          <div data-oid="gg1ic6e">
            <div
              className="bg-white/40 backdrop-blur-[16px] rounded-xl p-[18px] shadow-[0_8px_32px_rgba(147,51,234,0.12)] border border-white/40 min-h-[520px] h-[calc(100vh-260px)] max-h-[760px] flex flex-col"
              data-oid="nfm:-9n"
            >
              <div
                className="flex justify-between items-center font-bold mb-3"
                data-oid="ybrwo3s"
              />

              <div
                className="bg-white p-4 rounded-lg flex-1 min-h-0 overflow-auto"
                data-oid="l8gcb7j"
              >
                <MarkdownView
                  value={md}
                  onChange={setMd}
                  onFullScreen={() => setOpenFull(true)}
                  data-oid="-tf1lud"
                />
              </div>
            </div>
          </div>
          <div data-oid="s3y6gbu">
            <div
              className="bg-white/40 backdrop-blur-[16px] rounded-xl p-[18px] shadow-[0_8px_32px_rgba(147,51,234,0.12)] border border-white/40 min-h-[520px] h-[calc(100vh-260px)] max-h-[760px] flex flex-col gap-3 overflow-y-auto transition-all hover:-translate-y-[2px] hover:shadow-[0_16px_40px_rgba(147,51,234,0.2)] hover:border-purple-200"
              data-oid="giihwlj"
            >
              {/* 传入大纲id作为dialogId，保证唯一性 */}
              <Dialog
                dialogId={id || "default-outline"}
                botName="大纲助手"
                initMessage="欢迎使用大纲助手，你可以询问如何改进课程大纲。"
                data-oid="rva1_cl"
              />
            </div>
          </div>
        </div>
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
