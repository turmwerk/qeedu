import React, { useState, useEffect } from "react";
import Button from "@/ui/Button";
import Dropdown from "@/ui/Dropdown";
import {
  MenuOutlined,
  EyeOutlined,
  ExportOutlined,
  FilePdfOutlined,
  FileWordOutlined,
  FileMarkdownOutlined,
} from "@ant-design/icons";
import {
  downloadMarkdown,
  downloadDocx,
  exportPdfViaPrint,
} from "@/utils/file/export";

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
  onPreview,
  examMarkdown,
}) => {
  const [siderOpen, setSiderOpen] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail) setSiderOpen(!!detail.open);
    };
    window.addEventListener("exam-sider-state", handler);
    window.dispatchEvent(new Event("get-exam-sider-state"));
    return () => window.removeEventListener("exam-sider-state", handler);
  }, []);

  const actionButtonClass =
    "inline-flex items-center gap-1.5 bg-white dark:bg-white/10 border border-[var(--brand-border)] dark:border-white/30 text-[var(--brand-blue)] px-2.5 py-1.5 rounded-xl font-semibold transition-[background,border-color,box-shadow,transform,color] hover:bg-[var(--brand-accent-soft)] dark:hover:bg-white/18 hover:border-[var(--brand-purple)] hover:text-[var(--brand-purple)] hover:shadow-[var(--brand-shadow)] hover:-translate-y-[1px]";

  return (
    <div className="bg-transparent dark:bg-transparent px-0 py-0.5 flex-shrink-0 z-10">
      <div className="flex justify-between items-center gap-2.5 px-0">
        {!siderOpen && (
          <Button
            className="flex items-center justify-center w-9 h-9 rounded-lg bg-transparent border border-transparent text-[var(--brand-blue)] transition-[background,border-color,color] hover:text-[var(--brand-purple)] hover:bg-[var(--brand-accent-soft)] hover:border-[var(--brand-purple)]"
            onClick={() => window.dispatchEvent(new Event("toggle-exam-sider"))}
            aria-label="打开侧边栏"
          >
            <MenuOutlined />
          </Button>
        )}
        <input
          className="flex-1 min-w-0 border-0 border-b-2 border-b-[rgba(75,42,133,0.18)] dark:border-b-white/20 bg-transparent rounded-none px-1 py-1.5 text-[14px] sm:text-[18px] font-bold text-[var(--brand-blue)] dark:text-white/90 min-h-[40px] transition-[border-color] focus:outline-none focus:border-b-[var(--brand-blue)] dark:focus:border-b-white/60"
          type="text"
          value={title}
          onChange={(event) => onTitleChange(event.target.value)}
          placeholder="未命名试卷"
        />

        <div className="flex items-center gap-2 shrink-0">
          <div className="hidden sm:flex flex-col items-start justify-center gap-0.5 mr-2">
            <div className="text-[12px] text-[#6b6b6b] dark:text-white/50 font-semibold">总分</div>
            <div className="text-[22px] font-extrabold text-[#4b2a85] dark:text-white/90 leading-none">
              {totalScore}
            </div>
          </div>
          <Button
            className={actionButtonClass}
            onClick={onPreview}
          >
            <EyeOutlined />
            <span className="hidden sm:inline">试卷预览</span>
          </Button>
          <Dropdown
            button={
              <span className="inline-flex items-center gap-1.5">
                <ExportOutlined />
                <span className="hidden sm:inline">导出</span>
              </span>
            }
            buttonClassName={actionButtonClass}
            items={[
              {
                label: <span className="inline-flex items-center gap-1.5"><FilePdfOutlined /> PDF</span>,
                onClick: () => exportPdfViaPrint(title || "exam", examMarkdown),
              },
              {
                label: <span className="inline-flex items-center gap-1.5"><FileWordOutlined /> Docx</span>,
                onClick: () => downloadDocx(title || "exam", examMarkdown),
              },
              {
                label: <span className="inline-flex items-center gap-1.5"><FileMarkdownOutlined /> Markdown</span>,
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
