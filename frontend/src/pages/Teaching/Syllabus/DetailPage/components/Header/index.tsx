import React, { useState, useEffect } from "react";
import Dropdown from "@/components/Dropdown";
import Button from "@/components/Button";
import {
  MenuOutlined,
  CodeOutlined,
  ExpandOutlined,
  ExportOutlined,
  FilePdfOutlined,
  FileWordOutlined,
  FileMarkdownOutlined,
} from "@ant-design/icons";
import {
  downloadMarkdown,
  downloadDocx,
  exportPdfViaPrint,
} from "@/utils/exportFiles";

type HeaderProps = {
  title: string;
  onTitleChange: (next: string) => void;
  onBack: () => void;
  md: string;
  showRaw: boolean;
  onToggleRaw: () => void;
  onFullScreen: () => void;
};

const Header: React.FC<HeaderProps> = ({
  title,
  onTitleChange,
  md,
  showRaw,
  onToggleRaw,
  onFullScreen,
}) => {
  const [siderOpen, setSiderOpen] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail) setSiderOpen(!!detail.open);
    };
    window.addEventListener("syllabus-sider-state", handler);
    window.dispatchEvent(new Event("get-syllabus-sider-state"));
    return () => window.removeEventListener("syllabus-sider-state", handler);
  }, []);

  const actionButtonClass =
    "inline-flex items-center gap-1.5 bg-white dark:bg-white/10 border border-[var(--brand-border)] dark:border-white/30 text-[var(--brand-blue)] px-2.5 py-1.5 rounded-xl font-semibold transition-[background,border-color,box-shadow,transform,color] hover:bg-[var(--brand-accent-soft)] dark:hover:bg-white/18 hover:border-[var(--brand-purple)] hover:text-[var(--brand-purple)] hover:shadow-[var(--brand-shadow)] hover:-translate-y-[1px]";

  return (
    <div className="bg-transparent px-0 py-0.5 flex-shrink-0 z-10">
      <div className="flex justify-between items-center gap-2.5 px-0">
        {!siderOpen && (
          <Button
            className="flex items-center justify-center w-9 h-9 rounded-lg bg-transparent border border-transparent text-[var(--brand-blue)] transition-[background,border-color,color] hover:text-[var(--brand-purple)] hover:bg-[var(--brand-accent-soft)] hover:border-[var(--brand-purple)]"
            onClick={() => window.dispatchEvent(new Event("toggle-syllabus-sider"))}
            aria-label="打开侧边栏"
          >
            <MenuOutlined />
          </Button>
        )}
        <input
          className="flex-1 min-w-0 border-0 border-b-2 border-b-[rgba(75,42,133,0.18)] bg-transparent rounded-none px-1 py-1.5 text-[14px] sm:text-[18px] font-bold text-[var(--brand-blue)] min-h-[40px] transition-[border-color] focus:outline-none focus:border-b-[var(--brand-blue)]"
          type="text"
          value={title}
          onChange={(event) => onTitleChange(event.target.value)}
          placeholder="未命名课程"
        />

        <div className="flex items-center gap-2 shrink-0">
          <Button
            className={actionButtonClass}
            onClick={onToggleRaw}
          >
            <CodeOutlined />
            <span className="hidden sm:inline">{showRaw ? "渲染 Markdown" : "显示 Markdown"}</span>
          </Button>
          <Button
            className={actionButtonClass}
            onClick={onFullScreen}
          >
            <ExpandOutlined />
            <span className="hidden sm:inline">全屏编辑</span>
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
                onClick: () => exportPdfViaPrint(title || "未命名课程", md),
              },
              {
                label: <span className="inline-flex items-center gap-1.5"><FileWordOutlined /> Docx</span>,
                onClick: () => downloadDocx(title || "未命名课程", md),
              },
              {
                label: <span className="inline-flex items-center gap-1.5"><FileMarkdownOutlined /> Markdown</span>,
                onClick: () => downloadMarkdown(title || "未命名课程", md),
              },
            ]}
          />
        </div>
      </div>
    </div>
  );
};

export default Header;
