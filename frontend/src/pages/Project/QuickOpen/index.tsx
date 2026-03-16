import React, { useEffect, useMemo, useRef, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { useWorkspace } from "../context";
import { type FileTreeNode } from "../EditorArea/types";
import { getFileIcon } from "../utils/filePresentation";

const collectFiles = (node: FileTreeNode): FileTreeNode[] => {
  if (node.type === "file") return [node];
  if (!node.children) return [];
  return node.children.flatMap((child) => collectFiles(child));
};

const QuickOpen: React.FC = () => {
  const { fileTree, openFileTab, quickOpenOpen, setQuickOpenOpen } = useWorkspace();
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const files = useMemo(() => collectFiles(fileTree), [fileTree]);
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return files;
    return files.filter((file) =>
      `${file.name} ${file.path}`.toLowerCase().includes(q),
    );
  }, [files, query]);

  useHotkeys(
    "esc",
    (event) => {
      event.preventDefault();
      setQuickOpenOpen(false);
    },
    { enabled: quickOpenOpen },
    [setQuickOpenOpen],
  );

  useEffect(() => {
    if (!quickOpenOpen) return;
    setQuery("");
    requestAnimationFrame(() => inputRef.current?.focus());
  }, [quickOpenOpen]);

  if (!quickOpenOpen) return null;

  const handleOpen = (node: FileTreeNode) => {
    openFileTab(node);
    setQuickOpenOpen(false);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (filtered.length > 0) {
      handleOpen(filtered[0]);
    }
  };

  return (
    <div className="absolute inset-0 z-50">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={() => setQuickOpenOpen(false)}
      />
      <div className="absolute left-1/2 top-16 w-full max-w-xl -translate-x-1/2">
        <form
          onSubmit={handleSubmit}
          className="overflow-hidden rounded border border-[#3c3c3c] bg-[#1e1e1e] shadow-xl"
        >
          <input
            ref={inputRef}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="输入文件名或路径"
            className="w-full border-b border-[#2d2d2d] bg-[#1e1e1e] px-3 py-2 text-sm text-[#cccccc] outline-none"
          />
          <div className="max-h-64 overflow-y-auto">
            {filtered.length === 0 ? (
              <div className="px-3 py-3 text-xs text-[#8b8b8b]">未找到匹配文件</div>
            ) : (
              filtered.slice(0, 50).map((file) => (
                <button
                  key={file.path}
                  type="button"
                  onClick={() => handleOpen(file)}
                  className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-xs text-[#cccccc] hover:bg-white/10"
                >
                  <span className="text-sm">{getFileIcon(file.name, "h-3.5 w-3.5")}</span>
                  <span className="truncate">{file.path.replace(/^\//, "")}</span>
                </button>
              ))
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default QuickOpen;
