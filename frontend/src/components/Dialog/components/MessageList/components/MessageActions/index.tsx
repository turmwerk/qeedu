import React from "react";
import FloatingButton from "@/components/FloatingButton";
import Dropdown, { type DropdownItem } from "@/components/Dropdown";

export interface MessageActionsProps {
  onEdit: () => void;
  onSave?: () => void;
  onRetry: () => void;
  onDelete: () => void;
  onCopyText: () => void;
  onCopyMarkdown: () => void;
  editMode?: boolean;
  editButtonColor?: string;
  editButtonHoverBg?: string;
  editButtonHoverShadow?: string;
  retryButtonColor?: string;
  retryButtonHoverBg?: string;
  retryButtonHoverShadow?: string;
  menuButtonColor?: string;
  menuButtonHoverBg?: string;
  menuButtonHoverShadow?: string;
}

const MessageActions: React.FC<MessageActionsProps> = ({
  onEdit,
  onSave,
  onRetry,
  onDelete,
  onCopyText,
  onCopyMarkdown,
  editMode = false,
  editButtonColor = "#f97316",
  editButtonHoverBg = "#fff7ed",
  editButtonHoverShadow = "0_6px_14px_rgba(249,115,22,0.18)",
  retryButtonColor = "#10b981",
  retryButtonHoverBg = "#ecfdf5",
  retryButtonHoverShadow = "0_6px_14px_rgba(16,185,129,0.18)",
  menuButtonColor = "#0ea5e9",
  menuButtonHoverBg = "#e0f2fe",
  menuButtonHoverShadow = "0_6px_14px_rgba(14,165,233,0.18)",
}) => {
  const deleteIcon = (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 6h18M8 6V4a1 1 0 011-1h6a1 1 0 011 1v2m-8 4v8m4-8v8m4-8v8M6 6l1 14a2 2 0 002 2h6a2 2 0 002-2l1-14"
      />
    </svg>
  );

  const copyIcon = (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M8 8V6a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2h-2M8 8h6a2 2 0 012 2v8a2 2 0 01-2 2H8a2 2 0 01-2-2v-8a2 2 0 012-2z"
      />
    </svg>
  );

  const markdownIcon = (
    <span className="inline-flex items-center justify-center w-4 h-4 rounded border border-current text-[9px] font-bold">
      MD
    </span>
  );

  const dropdownItems: DropdownItem[] = [
    {
      label: (
        <span className="flex items-center gap-2">
          {copyIcon}
          <span>Copy as text</span>
        </span>
      ),
      onClick: onCopyText,
    },
    {
      label: (
        <span className="flex items-center gap-2">
          {markdownIcon}
          <span>Copy as markdown</span>
        </span>
      ),
      onClick: onCopyMarkdown,
    },
    {
      label: (
        <span className="flex items-center gap-2 text-[#b91c1c]">
          {deleteIcon}
          <span>Delete</span>
        </span>
      ),
      onClick: onDelete,
    },
  ];

  const isEditing = editMode && !!onSave;

  // Helper to ensure valid CSS variable values (replace underscores with spaces for shadows)
  const formatShadow = (val: string) => val.replace(/_/g, " ");

  const buttonStyle = {
    "--edit-color": editButtonColor,
    "--edit-hover-bg": editButtonHoverBg,
    "--edit-hover-shadow": formatShadow(editButtonHoverShadow),
    "--retry-color": retryButtonColor,
    "--retry-hover-bg": retryButtonHoverBg,
    "--retry-hover-shadow": formatShadow(retryButtonHoverShadow),
    "--menu-color": menuButtonColor,
    "--menu-hover-bg": menuButtonHoverBg,
    "--menu-hover-shadow": formatShadow(menuButtonHoverShadow),
  } as React.CSSProperties;

  return (
    <div className="flex items-center gap-[2px]" style={buttonStyle}>
      <FloatingButton
        onClick={isEditing ? onSave! : onEdit}
        visible={true}
        ariaLabel={isEditing ? "保存" : "编辑"}
        title={isEditing ? "保存" : "编辑"}
        className="border-[var(--edit-color)] text-[var(--edit-color)] hover:bg-[var(--edit-hover-bg)] hover:shadow-[var(--edit-hover-shadow)]"
        icon={
          isEditing ? (
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          ) : (
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          )
        }
      />
      <FloatingButton
        onClick={onRetry}
        visible={true}
        ariaLabel="重试"
        title="重试"
        className="border-[var(--retry-color)] text-[var(--retry-color)] hover:bg-[var(--retry-hover-bg)] hover:shadow-[var(--retry-hover-shadow)]"
        icon={
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
        }
      />
      <Dropdown
        items={dropdownItems}
        direction="down"
        showSelected={false}
        showCheck={false}
        buttonClassName="inline-flex items-center justify-center w-8 h-8 p-0 rounded-full border border-[var(--menu-color)] bg-white text-[var(--menu-color)] shadow-[0_2px_8px_rgba(15,23,42,0.12)] transition-[transform,box-shadow,background,border-color] hover:bg-[var(--menu-hover-bg)] hover:shadow-[var(--menu-hover-shadow)] active:scale-95"
        button={
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
            />
          </svg>
        }
      />
    </div>
  );
};

export default MessageActions;
