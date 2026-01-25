import React, { useEffect, useState } from "react";
import ScrollToTop from "./components/ScrollToTop";
import FloatingButton from "@/components/FloatingButton";
import { SettingOutlined } from "@ant-design/icons";

const FloatActions: React.FC = () => {
  const [showScrollToTop, setShowScrollToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollContainer = document.querySelector('[data-oid="giq3cbp"]');
      if (!scrollContainer) return;

      const scrollTop = scrollContainer.scrollTop;

      // 距离顶部超过100px显示"回到顶部"
      setShowScrollToTop(scrollTop > 100);
    };

    const scrollContainer = document.querySelector('[data-oid="giq3cbp"]');
    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", handleScroll);
      handleScroll(); // 初始化状态
    }

    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  const scrollToTop = () => {
    const scrollContainer = document.querySelector('[data-oid="giq3cbp"]');
    if (scrollContainer) {
      scrollContainer.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // removed scrollToBottom (not needed)

  return (
    <div className="fixed bottom-8 right-8 z-50 flex flex-col gap-1.5">
      <FloatingButton
        onClick={() => {}}
        visible={showScrollToTop} // 页面在顶部（scrollTop <= 100）时隐藏
        icon={<SettingOutlined className="animate-[spin_2s_linear_infinite] group-hover:animate-none" style={{ fontSize: 20 }} />}
        ariaLabel="设置"
        title="设置"
        size={40}
        shape="rounded-lg"
        className=""
      />
      <ScrollToTop visible={showScrollToTop} onClick={scrollToTop} />
    </div>
  );
};

export default FloatActions;
