import React, { useRef, useCallback } from "react";
import ReactDOM from "react-dom";
import { Input } from "antd";
import { SearchOutlined, CloseOutlined } from "@ant-design/icons";
import type { InputRef } from "antd";

interface SearchModalProps {
  open: boolean;
  onClose: () => void;
}

const SearchModal: React.FC<SearchModalProps> = ({ open, onClose }) => {
  const inputRef = useRef<InputRef>(null);

  const panelRef = useCallback(
    (el: HTMLDivElement | null) => {
      if (el && open) {
        // animate in
        requestAnimationFrame(() => {
          el.parentElement?.classList.add("search-modal-enter");
          el.classList.add("search-modal-panel-enter");
        });
        setTimeout(() => inputRef.current?.focus(), 200);
      }
    },
    [open],
  );

  if (!open) return null;

  return ReactDOM.createPortal(
    <div
      className="search-modal-overlay fixed inset-0 z-[10000] flex items-center justify-center"
      onClick={onClose}
    >
      {/* mask */}
      <div className="absolute inset-0 bg-black/30" />
      {/* glass panel */}
      <div
        ref={panelRef}
        className="search-modal-panel relative z-10 w-[520px] max-w-[92vw] rounded-[16px] px-6 pt-5 pb-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* header */}
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-black/10">
          <span className="search-modal-title inline-flex items-center gap-2 font-semibold text-[15px]">
            <SearchOutlined />
            搜索
          </span>
          <button
            onClick={onClose}
            title="关闭"
            className="search-modal-close w-8 h-8 flex items-center justify-center rounded-full"
          >
            <CloseOutlined className="search-modal-close-icon" />
          </button>
        </div>
        {/* body */}
        <Input
          ref={inputRef}
          size="large"
          placeholder="输入即搜索"
          className="search-modal-input"
        />
      </div>
    </div>,
    document.body
  );
};

export default SearchModal;
