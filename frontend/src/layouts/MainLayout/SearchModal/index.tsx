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
      <style>{`
        /* Search Modal 面板样式 */
        .search-modal-panel {
          background: rgba(255, 255, 255, 0.96) !important;
          border: 1px solid rgba(180, 190, 210, 0.5) !important;
          box-shadow: 0 16px 48px rgba(0,0,0,0.38), inset 0 1px 0 #fff !important;
          border-radius: 16px;
        }
        .search-modal-title {
          color: var(--brand-blue) !important;
        }
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
        .search-modal-input.ant-input {
          background: #fff !important;
          color: #1f2a44 !important;
          border-color: rgba(59, 91, 219, 0.28) !important;
        }
        .search-modal-input.ant-input::placeholder {
          color: rgba(59, 91, 219, 0.45) !important;
        }
        .search-modal-input.ant-input:focus,
        .search-modal-input.ant-input-focused {
          border-color: var(--brand-purple) !important;
          box-shadow: 0 0 0 2px rgba(109, 40, 217, 0.18) !important;
        }
        /* Search Modal enter animation */
        .search-modal-overlay {
          opacity: 0;
          animation: searchModalFadeIn 0.25s ease forwards;
        }
        .search-modal-panel {
          opacity: 0;
          transform: scale(0.92) translateY(20px);
          animation: searchModalSlideIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) 0.05s forwards;
        }
        @keyframes searchModalFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes searchModalSlideIn {
          from { opacity: 0; transform: scale(0.92) translateY(20px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
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
