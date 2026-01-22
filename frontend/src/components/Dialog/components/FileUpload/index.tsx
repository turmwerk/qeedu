import React, { useRef } from "react";
import Button from "@/components/Button";
import { handleFileSelection, removeFileAtIndex } from "@/utils/uploadFiles";
import { getFileIconType, getFileIconSvgPath, getFileIconColor } from "@/utils/fileTypeAnalyzer";
import { previewFileInNewTab } from "@/utils/filePreview";

interface FileUploadProps {
  files: File[];
  onFilesChange: (files: File[]) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ files, onFilesChange }) => {
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
    <div className="flex items-center gap-2 flex-wrap max-h-[100px] overflow-y-auto">
      <Button
        variant="outline"
        size="sm"
        onClick={handleFileClick}
        className="!w-7 !h-7 !p-0 flex items-center justify-center sticky left-0 flex-shrink-0"
      >
        +
      </Button>
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
            className="flex items-center gap-1.5 border border-[var(--brand-border)] rounded-md overflow-hidden h-7"
          >
            <button
              type="button"
              onClick={() => handlePreviewFile(file)}
              className="flex items-center gap-1.5 px-2 py-1 hover:bg-[var(--brand-accent-soft)] transition-colors cursor-pointer"
            >
              <svg className={`w-3.5 h-3.5 flex-shrink-0 ${iconColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={iconPath} />
              </svg>
              <span className="text-[var(--brand-text)] truncate max-w-[100px] text-xs">{file.name}</span>
            </button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => removeFile(index)}
              className="!w-7 !h-7 !p-0 flex items-center justify-center text-[var(--brand-accent)] hover:!text-red-500 border-l border-[var(--brand-border)] !rounded-none flex-shrink-0"
            >
              ×
            </Button>
          </div>
        );
      })}
    </div>
  );
};

export default FileUpload;
