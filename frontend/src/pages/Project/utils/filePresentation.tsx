import React from "react";
import { Icon } from "@iconify/react";
import {
  DEFAULT_FILE,
  DEFAULT_FOLDER,
  DEFAULT_FOLDER_OPENED,
  DEFAULT_ROOT,
  DEFAULT_ROOT_OPENED,
  getIconForFile,
  getIconForFolder,
  getIconForOpenFolder,
} from "vscode-icons-js";

const toIconifyName = (iconFile: string): string =>
  `vscode-icons:${iconFile.replace(/\.svg$/, "").replace(/_/g, "-")}`;

const renderIcon = (iconFile: string, className = "h-4 w-4") => (
  <Icon icon={toIconifyName(iconFile)} className={className} />
);

export const getFileIcon = (name: string, className?: string): React.ReactNode => {
  const iconFile = getIconForFile(name) ?? DEFAULT_FILE;
  return renderIcon(iconFile, className);
};

export const getFolderIcon = (
  name: string,
  options?: { expanded?: boolean; isRoot?: boolean; className?: string },
): React.ReactNode => {
  const { expanded = false, isRoot = false, className } = options ?? {};
  if (isRoot) {
    return renderIcon(expanded ? DEFAULT_ROOT_OPENED : DEFAULT_ROOT, className);
  }
  const iconFile = expanded ? getIconForOpenFolder(name) : getIconForFolder(name);
  return renderIcon(iconFile || (expanded ? DEFAULT_FOLDER_OPENED : DEFAULT_FOLDER), className);
};
