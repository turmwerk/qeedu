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
    <div className="flex items-center gap-2 flex-wrap">
      <button
        type="button"
        onClick={handleFileClick}
        className="px-3 py-1.5 rounded-lg border border-dashed border-[var(--brand-border)] text-[var(--brand-accent)] text-sm hover:bg-[var(--brand-accent-soft)] transition-colors"
      >
        📎添加文件
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
          className="flex items-center gap-2 px-2.5 py-1 bg-[var(--brand-accent-soft)] rounded-lg text-sm"
        >
          <span className="text-[var(--brand-text)]">{file.name}</span>
          <button
            type="button"
            onClick={() => removeFile(index)}
            className="text-[var(--brand-accent)] hover:text-red-500 transition-colors"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
};

export default FileUpload;
