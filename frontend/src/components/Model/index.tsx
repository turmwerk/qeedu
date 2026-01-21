import React, { useId } from "react";
import { createPortal } from "react-dom";
import Button from "@/components/Button";

const Model: React.FC<{
  visible: boolean;
  title?: React.ReactNode;
  onClose: () => void;
  children?: React.ReactNode;
  width?: number | string;
}> = ({ visible, title, onClose, children, width }) => {
  const id = useId().replace(/[:]/g, "");
  const widthClass = width ? `modal-width-${id}` : "";
  const widthValue = typeof width === "number" ? `${width}px` : width;
  if (!visible) return null;
  return createPortal(
    <div
      className="fixed inset-0 bg-[rgba(0,0,0,0.45)] flex items-center justify-center z-[30000]"
      onMouseDown={onClose}
      data-oid="owobl1e"
    >
      <style data-oid="id:xo_v">
        {width ? `.${widthClass} { width: ${widthValue}; }` : ""}
      </style>
      <div
        className={`w-[780px] max-w-[calc(100%-40px)] bg-white/90 backdrop-blur-[24px] rounded-xl shadow-[0_20px_60px_rgba(147,51,234,0.25)] border border-white/40 overflow-hidden ${widthClass}`}
        onMouseDown={(e) => e.stopPropagation()}
        data-oid="0pas9nr"
      >
        <div
          className="flex items-center justify-between px-5 py-4 border-b border-[#f1f1f1]"
          data-oid="rkufj.y"
        >
          <div className="font-bold text-[#2d1b4f]" data-oid="0pbqih6">
            {title}
          </div>
          <Button
            className="bg-transparent border-0 text-[20px]"
            onClick={onClose}
            data-oid="t:bcga_"
          >
            ×
          </Button>
        </div>
        <div
          className="px-5 py-[18px] max-h-[calc(90vh-72px)] overflow-auto"
          data-oid="ddf9t81"
        >
          {children}
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default Model;
