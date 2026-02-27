import React, { useId, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { CloseOutlined } from "@ant-design/icons";

const Modal: React.FC<{
  visible: boolean;
  title?: React.ReactNode;
  onClose: () => void;
  children?: React.ReactNode;
  width?: number | string;
  showHeader?: boolean;
  bodyClassName?: string;
}> = ({
  visible,
  title,
  onClose,
  children,
  width,
  showHeader = true,
  bodyClassName,
}) => {
  const id = useId().replace(/[:]/g, "");
  const widthClass = width ? `modal-width-${id}` : "";
  const widthValue = typeof width === "number" ? `${width}px` : width;
  
  const [isAnimating, setIsAnimating] = useState(false);
  const [shouldRender, setShouldRender] = useState(visible);

  useEffect(() => {
    if (visible) {
      setShouldRender(true);
      // 延迟添加动画类，触发进入动画
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsAnimating(true);
        });
      });
    } else {
      // 触发退出动画
      setIsAnimating(false);
      // 等待动画完成后卸载
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 300); // 与动画duration一致
      return () => clearTimeout(timer);
    }
  }, [visible]);

  if (!shouldRender) return null;
  return createPortal(
    <div
      className={`fixed inset-0 bg-[rgba(0,0,0,0.45)] flex items-center justify-center z-[30000] transition-opacity duration-300 ease-out ${
        isAnimating ? "opacity-100" : "opacity-0"
      }`}
      onMouseDown={onClose}
      data-oid="owobl1e"
    >
      <style data-oid="id:xo_v">
        {width ? `.${widthClass} { width: ${widthValue}; }` : ""}
      </style>
      <div
        className={`glass-modal-panel w-[780px] max-w-[calc(100%-40px)] rounded-xl overflow-hidden transition-all duration-300 ease-out ${widthClass} ${
          isAnimating 
            ? "opacity-100 scale-100 translate-y-0" 
            : "opacity-0 scale-95 translate-y-4"
        }`}
        onMouseDown={(e) => e.stopPropagation()}
        data-oid="0pas9nr"
      >
        {showHeader && (
          <div
            className="glass-modal-header flex items-center justify-between px-5 py-4 border-b border-black/10"
            data-oid="rkufj.y"
          >
            <div className="glass-modal-title font-bold" data-oid="0pbqih6">
              {title}
            </div>
            <button
              onClick={onClose}
              title="关闭"
              className="search-modal-close w-8 h-8 flex items-center justify-center rounded-full"
              data-oid="t:bcga_"
            >
              <CloseOutlined className="search-modal-close-icon" />
            </button>
          </div>
        )}
        <div
          className={
            bodyClassName || "px-5 py-[18px] max-h-[calc(90vh-72px)] overflow-auto"
          }
          data-oid="ddf9t81"
        >
          {children}
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default Modal;
