import React from "react";
import Button from "@/components/Button";
import Dropdown from "@/components/Dropdown";
import {
  downloadMarkdown,
  downloadDocx,
  exportPdfViaPrint,
} from "@/utils/exportFiles";

type HeaderProps = {
  title: string;
  totalScore: number;
  onTitleChange: (next: string) => void;
  onBack: () => void;
  onPreview: () => void;
  examMarkdown: string;
};

const Header: React.FC<HeaderProps> = ({
  title,
  totalScore,
  onTitleChange,
  onBack,
  onPreview,
  examMarkdown,
}) => {
  const actionButtonClass =
    "bg-white border border-[var(--brand-border)] text-[var(--brand-accent)] px-2.5 py-1.5 rounded-xl font-semibold transition-[background,border-color,box-shadow,transform] hover:bg-[var(--brand-accent-soft)] hover:border-[var(--brand-accent)] hover:shadow-[var(--brand-shadow)] hover:-translate-y-[1px]";
  return (
    <div className="bg-white px-0 py-2 shadow-[0_1px_6px_rgba(16,24,40,0.04)] flex-shrink-0 z-10">
      <div className="flex justify-between items-center gap-2.5 px-0">
        <input
          className="flex-1 border border-transparent bg-[#f0ebf6] rounded-xl px-3 py-2 text-[18px] font-bold text-[#4b2a85] min-h-[40px] focus:outline-none focus:border-[#4b2a85] focus:shadow-[0_0_0_3px_rgba(75,42,133,0.18)]"
          type="text"
          value={title}
          onChange={(event) => onTitleChange(event.target.value)}
          placeholder="未命名试卷"
        />

        <div className="flex items-center gap-3">
          <div className="flex flex-col items-start justify-center gap-0.5 mr-2">
            <div className="text-[12px] text-[#6b6b6b] font-semibold">总分</div>
            <div className="text-[22px] font-extrabold text-[#4b2a85] leading-none">
              {totalScore}
            </div>
          </div>
          <Button
            className={actionButtonClass}
            onClick={onBack}
          >
            返回试卷列表
          </Button>
          <Button
            className={actionButtonClass}
            onClick={onPreview}
          >
            试卷预览
          </Button>
          <Dropdown
            button="导出"
            buttonClassName={actionButtonClass}
            items={[
              {
                label: "导出 PDF",
                onClick: () => exportPdfViaPrint(title || "exam", examMarkdown),
              },
              {
                label: "导出 Docx",
                onClick: () => downloadDocx(title || "exam", examMarkdown),
              },
              {
                label: "导出 Markdown",
                onClick: () => downloadMarkdown(title || "exam", examMarkdown),
              },
            ]}
          />
        </div>
      </div>
    </div>
  );
};

export default Header;
