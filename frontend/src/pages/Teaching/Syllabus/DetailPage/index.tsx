import React, { useEffect, useMemo, useRef, useState } from "react";
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
  const [split, setSplit] = useState(68);
  const isDragging = useRef(false);
  const wrapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setLocalTitle(title || "");
  }, [title]);

  const handleTitleChange = (next: string) => {
    setLocalTitle(next);
    if (id && onRename) onRename(id, next);
  };

  const startDrag = () => {
    isDragging.current = true;
  };

  const stopDrag = () => {
    isDragging.current = false;
  };

  const onDrag = (clientX: number) => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const rect = wrap.getBoundingClientRect();
    const next = ((clientX - rect.left) / rect.width) * 100;
    const clamped = Math.min(80, Math.max(40, next));
    setSplit(clamped);
  };

  const onMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging.current) return;
    onDrag(event.clientX);
  };

  const onTouchMove = (event: React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging.current) return;
    onDrag(event.touches[0].clientX);
  };

  const columns = useMemo(() => `${split}% 6px ${100 - split}%`, [split]);

  const displayTitle = localTitle || title || "未命名课程";
  return (
    <div className="h-full min-h-0 w-full" data-oid="d:u9nn:">
      <div className="p-0 text-[#444] h-full min-h-0 flex flex-col" data-oid="4sxypj2">
        <div
          className="bg-white px-0 py-2 shadow-[0_1px_6px_rgba(16,24,40,0.04)] flex-shrink-0 z-10"
          data-oid="ooya:-g"
        >
          <div
            className="flex justify-between items-center gap-2.5 px-0"
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
          ref={wrapRef}
          className="grid items-stretch gap-0 flex-1 min-h-0 p-0 overflow-hidden h-full"
          style={{ gridTemplateColumns: columns }}
          onMouseMove={onMouseMove}
          onMouseUp={stopDrag}
          onMouseLeave={stopDrag}
          onTouchMove={onTouchMove}
          onTouchEnd={stopDrag}
          data-oid="wc6ybz5"
        >
          <div
            className="flex flex-col h-full min-h-0 bg-white overflow-hidden"
            data-oid="nfm:-9n"
          >
            <div
              className="flex justify-between items-center font-bold mb-0"
              data-oid="ybrwo3s"
            />

            <div className="flex-1 min-h-0 overflow-hidden p-4" data-oid="l8gcb7j">
              <div className="h-full min-h-0" data-oid="as3o8_c">
                <MarkdownView
                  value={md}
                  onChange={setMd}
                  onFullScreen={() => setOpenFull(true)}
                  data-oid="-tf1lud"
                />
              </div>
            </div>
          </div>

          <div
            className="relative"
            onMouseDown={startDrag}
            onTouchStart={startDrag}
            role="separator"
            aria-label="Resize panes"
            aria-orientation="vertical"
            data-oid="g75ffu_"
          >
            <div className="absolute inset-y-6 left-1/2 -translate-x-1/2 w-[2px] rounded-full bg-purple-300/70" />
            <div className="absolute inset-0 cursor-col-resize" />
          </div>

          <div
            className="bg-white h-full flex flex-col min-h-0 overflow-hidden"
            data-oid="giihwlj"
          >
            <div className="flex-1 min-h-0 overflow-hidden p-4">
              <div className="h-full min-h-0" data-oid="bub8x6d">
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
