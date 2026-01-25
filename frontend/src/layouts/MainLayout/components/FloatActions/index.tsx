import React, { useEffect, useState } from "react";
import ScrollToTop from "./components/ScrollToTop";
import ScrollToBottom from "./components/ScrollToBottom";

const FloatActions: React.FC = () => {
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollContainer = document.querySelector('[data-oid="giq3cbp"]');
      if (!scrollContainer) return;

      const scrollTop = scrollContainer.scrollTop;
      const scrollHeight = scrollContainer.scrollHeight;
      const clientHeight = scrollContainer.clientHeight;

      // 距离顶部超过100px显示"回到顶部"
      setShowScrollToTop(scrollTop > 100);
      
      // 距离底部超过100px显示"滚动到底部"
      setShowScrollToBottom(scrollTop + clientHeight < scrollHeight - 100);
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

  const scrollToBottom = () => {
    const scrollContainer = document.querySelector('[data-oid="giq3cbp"]');
    if (scrollContainer) {
      scrollContainer.scrollTo({ top: scrollContainer.scrollHeight, behavior: "smooth" });
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-50 flex flex-col gap-1.5">
      <ScrollToBottom visible={showScrollToBottom} onClick={scrollToBottom} />
      <ScrollToTop visible={showScrollToTop} onClick={scrollToTop} />
    </div>
  );
};

export default FloatActions;
