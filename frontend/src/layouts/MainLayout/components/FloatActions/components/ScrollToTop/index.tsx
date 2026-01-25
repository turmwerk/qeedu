import React from "react";
import FloatingButton from "@/components/FloatingButton";

interface ScrollToTopProps {
  visible: boolean;
  onClick: () => void;
}

const ScrollToTop: React.FC<ScrollToTopProps> = ({ visible, onClick }) => {
  const ArrowUp = (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="leading-none"
    >
      <path d="M12 19V7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M19 10L12 3L5 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );

  return (
    <FloatingButton
      onClick={onClick}
      visible={visible}
      icon={ArrowUp}
      ariaLabel="滚动到顶部"
      title="回到顶部"
      size={40}
      shape="rounded-lg"
    />
  );
};

export default ScrollToTop;
