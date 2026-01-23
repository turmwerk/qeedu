import React from "react";

interface ScrollToBottomButtonProps {
  isAtBottom: boolean;
  onClick: () => void;
}

const ScrollToBottomButton: React.FC<ScrollToBottomButtonProps> = ({
  isAtBottom,
  onClick,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`absolute right-2 bottom-2 w-8 h-8 rounded-full border border-[var(--brand-border)] bg-white text-[var(--brand-text)] shadow-[0_8px_20px_rgba(15,23,42,0.12)] flex items-center justify-center transition-[transform,opacity] z-10 ${
        isAtBottom ? "opacity-0 pointer-events-none" : "opacity-100 hover:scale-105"
      }`}
      aria-label="滚动到底部"
      title="滚动到底部"
    >
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 5v14m0 0l-6-6m6 6l6-6"
        />
      </svg>
    </button>
  );
};

export default ScrollToBottomButton;
