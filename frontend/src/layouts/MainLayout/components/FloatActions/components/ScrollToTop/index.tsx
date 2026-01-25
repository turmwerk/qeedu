import React from "react";
import { VerticalAlignTopOutlined } from "@ant-design/icons";
import FloatingButton from "@/components/FloatingButton";

interface ScrollToTopProps {
  visible: boolean;
  onClick: () => void;
}

const ScrollToTop: React.FC<ScrollToTopProps> = ({ visible, onClick }) => {
  return (
    <FloatingButton
      onClick={onClick}
      visible={visible}
      icon={<VerticalAlignTopOutlined style={{ fontSize: 20 }} />}
      ariaLabel="滚动到顶部"
      title="回到顶部"
      size={40}
      shape="rounded-lg"
    />
  );
};

export default ScrollToTop;
