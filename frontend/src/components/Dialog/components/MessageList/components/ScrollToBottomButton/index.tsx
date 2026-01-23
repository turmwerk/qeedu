import React from "react";
import FloatingButton from "@/components/FloatingButton";

interface ScrollToBottomButtonProps {
  isAtBottom: boolean;
  onClick: () => void;
}

const ScrollToBottomButton: React.FC<ScrollToBottomButtonProps> = ({
  isAtBottom,
  onClick,
}) => {
  return (
    <div className="absolute right-3 bottom-2 z-10">
      <FloatingButton
        onClick={onClick}
        visible={!isAtBottom}
        ariaLabel="滚动到底部"
        title="滚动到底部"
        icon={
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 5v14m0 0l-6-6m6 6l6-6"
            />
          </svg>
        }
      />
    </div>
  );
};

export default ScrollToBottomButton;
