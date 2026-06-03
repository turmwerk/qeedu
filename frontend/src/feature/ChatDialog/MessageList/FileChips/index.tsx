import React from "react";
import { type DialogFileMeta } from "../index";

interface FileChipsProps {
  files: DialogFileMeta[];
  align: "start" | "end";
}

const FileChips: React.FC<FileChipsProps> = ({ files, align }) => {
  if (!files.length) return null;

  return (
    <div
      className={`flex flex-wrap gap-1.5 max-w-[90%] ${
        align === "end" ? "justify-end" : "justify-start"
      }`}
    >
      {files.map((file, fileIdx) => (
        <div
          key={fileIdx}
          className="chat-file-chip flex items-center gap-1 px-2 py-1 rounded-lg border border-[var(--brand-border)] bg-white text-xs"
        >
          <svg
            className="w-3 h-3 text-[var(--brand-accent)]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
            />
          </svg>
          <span className="text-[var(--brand-text)] truncate max-w-[120px]">
            {file.name}
          </span>
        </div>
      ))}
    </div>
  );
};

export default FileChips;
