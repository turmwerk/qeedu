import React, { useRef } from "react";
import { handleFileSelection, removeFileAtIndex } from "@/utils/uploadFiles";

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

  return (
    <div className="flex items-center gap-2 flex-wrap max-h-[100px] overflow-y-auto">
      <button
        type="button"
        onClick={handleFileClick}
        className="sticky left-0 w-7 h-7 flex items-center justify-center rounded-md border border-dashed border-[var(--brand-border)] text-[var(--brand-accent)] text-lg hover:bg-[var(--brand-accent-soft)] transition-colors flex-shrink-0"
      >
        +
      </button>
      <input
        ref={fileInputRef}
        type="file"
        multiple
        onChange={handleFileChange}
        className="hidden"
        aria-label="上传文件"
      />
      {files.map((file, index) => (
        <div
          key={index}
          className="flex items-center gap-1.5 px-2 py-1 bg-[var(--brand-accent-soft)] rounded-md text-xs"
        >
          <svg className="w-3.5 h-3.5 text-[var(--brand-accent)] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span className="text-[var(--brand-text)] truncate max-w-[120px]">{file.name}</span>
          <button
            type="button"
            onClick={() => removeFile(index)}
            className="text-[var(--brand-accent)] hover:text-red-500 transition-colors text-base leading-none flex-shrink-0"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
};

export default FileUpload;
