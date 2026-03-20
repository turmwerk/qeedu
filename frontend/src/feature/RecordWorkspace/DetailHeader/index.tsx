import React, { useEffect, useState } from "react";
import {
  CodeOutlined,
  ExpandOutlined,
  ExportOutlined,
  FileMarkdownOutlined,
  FilePdfOutlined,
  FileWordOutlined,
  MenuOutlined,
} from "@ant-design/icons";
import Button from "@/ui/Button";
import Dropdown from "@/ui/Dropdown";
import {
  downloadDocx,
  downloadMarkdown,
  exportPdfViaPrint,
} from "@/utils/file/export";
import type { WorkspaceConfig, WorkspaceRecord } from "../types";

type Props = {
  config: WorkspaceConfig;
  record: WorkspaceRecord;
  content: string;
  showRaw: boolean;
  onToggleRaw: () => void;
  onFullScreen: () => void;
  onTitleChange: (next: string) => void;
};

const actionButtonClass =
  "inline-flex items-center gap-1.5 bg-white dark:bg-white/10 border border-[var(--brand-border)] dark:border-white/30 text-[var(--brand-blue)] px-2.5 py-1.5 rounded-xl font-semibold transition-[background,border-color,box-shadow,transform,color] hover:bg-[var(--brand-accent-soft)] dark:hover:bg-white/18 hover:border-[var(--brand-purple)] hover:text-[var(--brand-purple)] hover:shadow-[var(--brand-shadow)] hover:-translate-y-[1px]";

const WorkspaceDetailHeader: React.FC<Props> = ({
  config,
  record,
  content,
  showRaw,
  onToggleRaw,
  onFullScreen,
  onTitleChange,
}) => {
  const [siderOpen, setSiderOpen] = useState(false);

  useEffect(() => {
    const handler = (event: Event) => {
      const detail = (event as CustomEvent<{ open?: boolean }>).detail;
      if (detail) setSiderOpen(!!detail.open);
    };
    window.addEventListener(config.events.siderState, handler as EventListener);
    window.dispatchEvent(new Event(config.events.getSiderState));
    return () => {
      window.removeEventListener(config.events.siderState, handler as EventListener);
    };
  }, [config.events.getSiderState, config.events.siderState]);

  return (
    <div className="bg-transparent px-0 py-0.5 flex-shrink-0 z-10">
      <div className="flex justify-between items-center gap-2.5 px-0">
        {!siderOpen && (
          <Button
            className="flex items-center justify-center w-9 h-9 rounded-lg bg-transparent border border-transparent text-[var(--brand-blue)] transition-[background,border-color,color] hover:text-[var(--brand-purple)] hover:bg-[var(--brand-accent-soft)] hover:border-[var(--brand-purple)]"
            onClick={() => window.dispatchEvent(new Event(config.events.toggleSider))}
            aria-label="打开侧边栏"
          >
            <MenuOutlined />
          </Button>
        )}
        <input
          className="flex-1 min-w-0 border-0 border-b-2 border-b-[rgba(75,42,133,0.18)] dark:border-b-white/20 bg-transparent rounded-none px-1 py-1.5 text-[14px] sm:text-[18px] font-bold text-[var(--brand-blue)] dark:text-white/90 min-h-[40px] transition-[border-color] focus:outline-none focus:border-b-[var(--brand-blue)] dark:focus:border-b-white/60"
          type="text"
          value={record.title}
          onChange={(event) => onTitleChange(event.target.value)}
          placeholder={`未命名${config.title}`}
        />

        <div className="flex items-center gap-2 shrink-0">
          {record.status && (
            <div className="hidden sm:flex flex-col items-start justify-center gap-0.5 mr-2">
              <div className="text-[12px] text-[#6b6b6b] dark:text-white/50 font-semibold">当前状态</div>
              <div className="text-[15px] font-extrabold text-[#4b2a85] dark:text-white/90 leading-none">
                {record.status}
              </div>
            </div>
          )}
          <Button className={actionButtonClass} onClick={onToggleRaw}>
            <CodeOutlined />
            <span className="hidden sm:inline">
              {showRaw ? "渲染 Markdown" : "显示 Markdown"}
            </span>
          </Button>
          <Button className={actionButtonClass} onClick={onFullScreen}>
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
                label: (
                  <span className="inline-flex items-center gap-1.5">
                    <FilePdfOutlined />
                    PDF
                  </span>
                ),
                onClick: () => exportPdfViaPrint(record.title || config.title, content),
              },
              {
                label: (
                  <span className="inline-flex items-center gap-1.5">
                    <FileWordOutlined />
                    Docx
                  </span>
                ),
                onClick: () => downloadDocx(record.title || config.title, content),
              },
              {
                label: (
                  <span className="inline-flex items-center gap-1.5">
                    <FileMarkdownOutlined />
                    Markdown
                  </span>
                ),
                onClick: () => downloadMarkdown(record.title || config.title, content),
              },
            ]}
          />
        </div>
      </div>
    </div>
  );
};

export default WorkspaceDetailHeader;