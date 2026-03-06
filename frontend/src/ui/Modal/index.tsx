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
  panelClassName?: string;
  opaque?: boolean;
}> = ({
  visible,
  title,
  onClose,
  children,
  width,
  showHeader = true,
  bodyClassName,
  panelClassName,
  opaque = false,
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
      <style>{`
        /* Search/glass modal close button */
        .search-modal-close {
          color: #dc2626 !important;
          background: transparent;
          border: none;
          cursor: pointer;
          transition: background 0.2s, color 0.2s;
        }
        .search-modal-close:hover {
          background: #fef2f2 !important;
          color: #b91c1c !important;
        }
        .search-modal-close-icon {
          font-size: 14px;
          transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .search-modal-close:hover .search-modal-close-icon {
          transform: rotate(180deg);
        }
        /* Form 提交栏透明玻璃背景 */
        .glass-modal-panel .glass-form-submit-bar {
          background: rgba(255, 255, 255, 0.25) !important;
          border-radius: 0 0 12px 12px;
          margin-top: 0 !important;
          padding: 10px 16px;
          -webkit-backdrop-filter: blur(12px);
          backdrop-filter: blur(12px);
        }
        /* Glass Modal 中的 Form 表格模式 */
        .glass-modal-panel form[data-oid="l:34:qo"] {
          background: rgba(0, 0, 0, 0.06) !important;
          border-color: rgba(0, 0, 0, 0.10) !important;
          border-radius: 12px !important;
          overflow: hidden;
        }
        .glass-modal-panel form[data-oid="l:34:qo"] > div[data-oid="hyu7xgg"] {
          background: rgba(255, 255, 255, 0.35) !important;
        }
        .glass-modal-panel form[data-oid="l:34:qo"] > div[data-oid="hyu7xgg"] > label[data-oid="q6s8k:o"] {
          background: rgba(255, 255, 255, 0.18) !important;
          border-right-color: rgba(0, 0, 0, 0.08) !important;
          color: #334155 !important;
        }
        .glass-modal-panel form[data-oid="l:34:qo"] input,
        .glass-modal-panel form[data-oid="l:34:qo"] textarea,
        .glass-modal-panel form[data-oid="l:34:qo"] select {
          background: transparent !important;
          color: #1e293b !important;
        }
        .glass-modal-panel form[data-oid="l:34:qo"] input::placeholder,
        .glass-modal-panel form[data-oid="l:34:qo"] textarea::placeholder {
          color: rgba(100, 116, 139, 0.6) !important;
        }
      `}</style>
      <style data-oid="id:xo_v">
        {width ? `.${widthClass} { width: ${widthValue}; }` : ""}
      </style>
      <div
        className={`glass-modal-panel w-[780px] max-w-[calc(100%-40px)] rounded-xl overflow-hidden transition-all duration-300 ease-out ${opaque ? "bg-white dark:bg-white border border-[#e5e7eb] dark:border-[#e5e7eb] shadow-[0_20px_60px_rgba(16,24,40,0.2)]" : "bg-white/[0.38] dark:bg-white/[0.52] border border-white/50 dark:border-white/[0.45] shadow-[0_20px_60px_rgba(120,90,200,0.12),inset_0_1px_0_rgba(255,255,255,0.60)] dark:shadow-[0_20px_60px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.5)] backdrop-blur-[24px]"} ${panelClassName || ""} ${widthClass} ${
          isAnimating 
            ? "opacity-100 scale-100 translate-y-0" 
            : "opacity-0 scale-95 translate-y-4"
        }`}
        onMouseDown={(e) => e.stopPropagation()}
        data-oid="0pas9nr"
      >
        {showHeader && (
          <div
            className="flex items-center justify-between px-5 py-4 border-b border-black/[0.08] dark:border-black/10"
            data-oid="rkufj.y"
          >
            <div className="font-bold text-[#2d1b4f] dark:text-[#1e293b]" data-oid="0pbqih6">
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
