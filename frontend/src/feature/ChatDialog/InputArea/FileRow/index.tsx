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
}

const FileRow: React.FC<FileRowProps> = ({ files, onFilesChange }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = handleFileSelection(files, e.target.files);
    onFilesChange(newFiles);
  };

  const removeFile = (index: number) => {
    const updatedFiles = removeFileAtIndex(files, index);
    onFilesChange(updatedFiles);
  };

  const handlePreviewFile = (file: File) => {
    previewFileInNewTab(file);
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
      </div>
    </div>
  );
};

export default FileRow;
