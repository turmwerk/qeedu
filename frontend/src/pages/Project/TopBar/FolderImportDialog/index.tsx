import React, { useCallback, useState } from "react";
import Button from "@/ui/Button";
import Modal from "@/ui/Modal";
import { showToast } from "@/ui/Toast";
import type { FileTreeNode } from "../../EditorArea/types";
import { inferLanguage } from "../../data/languageSupport";

type DroppedFileEntry = FileSystemFileEntry;
type DroppedDirectoryEntry = FileSystemDirectoryEntry;

type DroppedEntry = DroppedFileEntry | DroppedDirectoryEntry;

interface FolderImportDialogProps {
  open: boolean;
  onClose: () => void;
  onImport: (tree: FileTreeNode) => void;
}

const sortTreeChildren = (children: FileTreeNode[]): FileTreeNode[] =>
  [...children].sort((left, right) => {
    if (left.type !== right.type) {
      return left.type === "directory" ? -1 : 1;
    }
    return left.name.localeCompare(right.name, "zh-CN");
  });

const readDroppedFile = (entry: DroppedFileEntry): Promise<File> =>
  new Promise((resolve, reject) => {
    entry.file(resolve, reject);
  });

const isDroppedEntry = (entry: FileSystemEntry | null): entry is DroppedEntry =>
  entry !== null && (entry.isFile || entry.isDirectory);

const isDroppedDirectoryEntry = (
  entry: DroppedEntry,
): entry is DroppedDirectoryEntry => entry.isDirectory;

const readDirectoryEntries = async (
  entry: DroppedDirectoryEntry,
): Promise<DroppedEntry[]> => {
  const reader = entry.createReader();
  const entries: DroppedEntry[] = [];

  const readBatch = async (): Promise<void> =>
    new Promise((resolve, reject) => {
      reader.readEntries((batch) => {
        if (batch.length === 0) {
          resolve();
          return;
        }
        entries.push(...batch.filter(isDroppedEntry));
        void readBatch().then(resolve, reject);
      }, reject);
    });

  await readBatch();
  return entries;
};

const buildNodeFromDroppedEntry = async (
  entry: DroppedEntry,
  parentPath: string,
): Promise<FileTreeNode> => {
  const path = parentPath === "/" ? `/${entry.name}` : `${parentPath}/${entry.name}`;

  if (isDroppedDirectoryEntry(entry)) {
    const entries = await readDirectoryEntries(entry);
    const children = await Promise.all(
      entries.map((child) => buildNodeFromDroppedEntry(child, path)),
    );

    return {
      id: path,
      name: entry.name,
      path,
      type: "directory",
      children: sortTreeChildren(children),
    };
  }

  const file = await readDroppedFile(entry);
  return {
    id: path,
    name: entry.name,
    path,
    type: "file",
    language: inferLanguage(entry.name),
    content: await file.text(),
  };
};

const buildTreeFromDroppedEntries = async (
  entries: DroppedEntry[],
): Promise<FileTreeNode | null> => {
  if (entries.length === 0) return null;

  const [firstEntry] = entries;
  if (entries.length === 1 && firstEntry && isDroppedDirectoryEntry(firstEntry)) {
    const rootEntries = await readDirectoryEntries(firstEntry);
    const children = await Promise.all(
      rootEntries.map((entry) => buildNodeFromDroppedEntry(entry, "/")),
    );

    return {
      id: "/",
      name: firstEntry.name || "workspace",
      path: "/",
      type: "directory",
      children: sortTreeChildren(children),
    };
  }

  const children = await Promise.all(
    entries.map((entry) => buildNodeFromDroppedEntry(entry, "/")),
  );

  return {
    id: "/",
    name: "workspace",
    path: "/",
    type: "directory",
    children: sortTreeChildren(children),
  };
};

const extractDroppedEntries = (
  event: React.DragEvent<HTMLDivElement>,
): DroppedEntry[] =>
  Array.from(event.dataTransfer.items)
    .map((item) => item.webkitGetAsEntry())
    .filter(isDroppedEntry);

const FolderImportDialog: React.FC<FolderImportDialogProps> = ({
  open,
  onClose,
  onImport,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [importing, setImporting] = useState(false);

  const handleDrop = useCallback(
    async (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      setDragActive(false);

      if (importing) return;

      const entries = extractDroppedEntries(event);
      if (entries.length === 0) {
        showToast("请直接把本地文件夹拖到弹窗中");
        return;
      }

      setImporting(true);
      try {
        const tree = await buildTreeFromDroppedEntries(entries);
        if (!tree) {
          showToast("无法读取拖入内容");
          return;
        }
        onImport(tree);
      } catch {
        showToast("读取拖入文件夹失败");
      } finally {
        setImporting(false);
      }
    },
    [importing, onImport],
  );

  return (
    <Modal
      visible={open}
      title="上传本地文件夹"
      onClose={importing ? () => undefined : onClose}
      width={560}
      opaque
    >
      <div className="flex flex-col gap-4">
        <div className="space-y-1">
          <div className="text-sm font-medium text-slate-800">
            直接把本地文件夹拖到下面区域导入工作区
          </div>
          <div className="text-xs leading-6 text-slate-500">
            这条路径不会继续调用浏览器目录选择权限，适合替代顶部菜单里的文件夹上传入口。
          </div>
        </div>

        <div
          className={`rounded-2xl border border-dashed px-6 py-10 text-center transition ${
            dragActive
              ? "border-emerald-500 bg-emerald-50"
              : "border-slate-300 bg-slate-50/80"
          } ${importing ? "cursor-progress opacity-75" : "cursor-copy"}`}
          onDragEnter={(event) => {
            event.preventDefault();
            setDragActive(true);
          }}
          onDragOver={(event) => {
            event.preventDefault();
            if (!dragActive) setDragActive(true);
          }}
          onDragLeave={(event) => {
            event.preventDefault();
            if (event.currentTarget === event.target) {
              setDragActive(false);
            }
          }}
          onDrop={(event) => {
            void handleDrop(event);
          }}
        >
          <div className="text-lg font-semibold text-slate-800">
            {importing ? "正在导入文件夹..." : "将文件夹拖拽到这里"}
          </div>
          <div className="mt-2 text-sm text-slate-500">
            支持单个文件夹，或一次拖入一组文件/文件夹作为同一工作区
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={importing}
          >
            关闭
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default FolderImportDialog;
