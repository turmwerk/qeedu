import React, { useRef } from "react";
import Button from "@/ui/Button";
import { handleFileSelection, removeFileAtIndex } from "@/utils/file/upload";
import {
  getFileIconType,
  getFileIconSvgPath,
  getFileIconColor,
} from "@/utils/file/analyzer";
import { previewFileInNewTab } from "@/utils/file/preview";

interface FileRowProps {
  files: File[];
  onFilesChange: (files: File[]) => void;
  suggestedFiles?: File[];
}

const FileRow: React.FC<FileRowProps> = ({ files, onFilesChange, suggestedFiles = [] }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const attachedNames = new Set(files.map((file) => file.name));
  const visibleSuggestions = suggestedFiles.filter((file) => !attachedNames.has(file.name));

  const getExtensionBadge = (name: string) => {
    const parts = name.split(".");
    const ext = parts.length > 1 ? parts.pop()?.toLowerCase() : "";
    return (ext || "file").slice(0, 4);
  };

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = handleFileSelection(files, e.target.files);
    onFilesChange(newFiles);
    e.target.value = "";
  };

  const removeFile = (index: number) => {
    const updatedFiles = removeFileAtIndex(files, index);
    onFilesChange(updatedFiles);
  };

  const handlePreviewFile = (file: File) => {
    previewFileInNewTab(file);
  };

  const addSuggestedFile = (file: File) => {
    onFilesChange([...files, file]);
  };

  return (
    <div className="px-2.5 pt-1.5 pb-1">
      <div
        className={`flex items-center gap-1.5 flex-wrap max-h-[100px] ${
          files.length > 8 ? "overflow-y-auto" : "overflow-y-visible"
        }`}
      >
        {files.length === 0 ? (
          <Button
            variant="outline"
            size="sm"
            onClick={handleFileClick}
            className="inline-flex items-center gap-0.5 px-2.5 py-1 sticky left-0 flex-shrink-0"
          >
            <span className="text-xs leading-none">+</span>
            <span className="text-xs leading-none">添加文件</span>
          </Button>
        ) : (
          <Button
            variant="outline"
            size="sm"
            onClick={handleFileClick}
            className="!w-7 !h-7 !p-0 flex items-center justify-center sticky left-0 flex-shrink-0 !text-2xl leading-none"
          >
            +
          </Button>
        )}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileChange}
          className="hidden"
          aria-label="上传文件"
        />
        {files.map((file, index) => {
          const iconType = getFileIconType(file.name);
          const iconPath = getFileIconSvgPath(iconType);
          const iconColor = getFileIconColor(iconType);

          return (
            <div
              key={index}
              className="flex items-center gap-1.5 border border-[var(--brand-border)] rounded-xl overflow-hidden h-7 transition-[border-color,box-shadow] hover:border-[var(--brand-accent)] hover:shadow-[0_2px_8px_rgba(59,130,246,0.12)]"
            >
              <button
                type="button"
                onClick={() => handlePreviewFile(file)}
                className="flex items-center gap-1.5 px-2 py-1 hover:bg-[var(--brand-accent-soft)] transition-colors cursor-pointer"
              >
                <svg
                  className={`w-3.5 h-3.5 flex-shrink-0 ${iconColor}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d={iconPath}
                  />
                </svg>
                <span className="text-[var(--brand-text)] truncate max-w-[100px] text-xs">
                  {file.name}
                </span>
              </button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeFile(index)}
                className="!w-7 !h-7 !p-0 flex items-center justify-center text-[var(--brand-accent)] hover:!text-red-500 border-l border-[var(--brand-border)] !rounded-none flex-shrink-0 !text-2xl"
              >
                ×
              </Button>
            </div>
          );
        })}
        {visibleSuggestions.map((file) => {
          return (
            <button
              key={`suggested-${file.name}-${file.lastModified}`}
              type="button"
              onClick={() => addSuggestedFile(file)}
              className="chat-file-suggestion inline-flex h-7 items-center gap-1.5 rounded-xl border border-dashed border-[var(--brand-border)] px-2 text-xs text-[var(--brand-text)] transition-[background,border-color,color,box-shadow] hover:border-[var(--brand-accent)] hover:bg-[var(--brand-accent-soft)] hover:text-[var(--brand-text)]"
              title={`添加 ${file.name} 到上下文`}
            >
              <span className="text-sm leading-none">+</span>
              <span className="inline-flex min-w-5 items-center justify-center rounded bg-[var(--brand-accent-soft)] px-1 py-0.5 text-[9px] font-semibold uppercase leading-none text-[var(--brand-accent)]">
                {getExtensionBadge(file.name)}
              </span>
              <span className="max-w-[110px] truncate">{file.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default FileRow;
