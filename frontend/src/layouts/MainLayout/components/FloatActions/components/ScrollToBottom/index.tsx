import React from "react";
import { VerticalAlignBottomOutlined } from "@ant-design/icons";
import FloatingButton from "@/components/FloatingButton";

interface ScrollToBottomProps {
  visible: boolean;
  onClick: () => void;
}

const ScrollToBottom: React.FC<ScrollToBottomProps> = ({ visible, onClick }) => {
  return (
    <FloatingButton
      onClick={onClick}
      visible={visible}
      icon={<VerticalAlignBottomOutlined style={{ fontSize: 20 }} />}
      ariaLabel="滚动到底部"
      title="滚动到底部"
      size={40}
      shape="rounded-lg"
    />
  );
};

export default ScrollToBottom;
