import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ReactDOM from "react-dom";
import { Input } from "antd";
import { SearchOutlined, CloseOutlined } from "@ant-design/icons";
import type { InputRef } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import { globalSearchEntries, type GlobalSearchEntry } from "@/utils/search/global";
import { buildSearchText, normalizeSearchText } from "@/utils/search/text";

interface SearchModalProps {
  open: boolean;
  onClose: () => void;
}

const SearchModal: React.FC<SearchModalProps> = ({ open, onClose }) => {
  const inputRef = useRef<InputRef>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (open) {
      setQuery("");
      setActiveIndex(0);
    }
  }, [open]);

  const normalizedQuery = normalizeSearchText(query);

  const getMatchScore = useCallback(
    (entry: GlobalSearchEntry) => {
      if (!normalizedQuery) {
        return Number.POSITIVE_INFINITY;
      }

      const normalizedTitle = normalizeSearchText(entry.title);
      const normalizedScope = normalizeSearchText(entry.scope);

      if (normalizedTitle === normalizedQuery) return 0;
      if (normalizedTitle.startsWith(normalizedQuery)) return 1;
      if (normalizedTitle.includes(normalizedQuery)) return 2;
      if (normalizedScope.includes(normalizedQuery)) return 3;
      return 4;
    },
    [normalizedQuery],
  );

  const results = useMemo(() => {
    const dedupedEntries = Array.from(
      new Map(
        globalSearchEntries
          .filter((entry) => entry.to !== location.pathname)
          .map((entry) => [`${entry.title}:${entry.to}`, entry] as const),
      ).values(),
    );

    if (!normalizedQuery) {
      return dedupedEntries.slice(0, 12);
    }

    return dedupedEntries
      .filter((entry) => buildSearchText(entry).includes(normalizedQuery))
      .sort((left, right) => {
        const leftScore = getMatchScore(left);
        const rightScore = getMatchScore(right);

        if (leftScore !== rightScore) {
          return leftScore - rightScore;
        }

        if (left.kind !== right.kind) {
          return left.kind === "module" ? -1 : 1;
        }

        if (left.title.length !== right.title.length) {
          return left.title.length - right.title.length;
        }

        return left.title.localeCompare(right.title, "zh-CN");
      })
      .slice(0, 18);
  }, [getMatchScore, location.pathname, normalizedQuery]);

  useEffect(() => {
    setActiveIndex(0);
  }, [normalizedQuery]);

  const handleNavigate = useCallback(
    (to: string) => {
      navigate(to);
      onClose();
    },
    [navigate, onClose],
  );

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (results.length === 0) {
        return;
      }

      if (event.key === "ArrowDown") {
        event.preventDefault();
        setActiveIndex((current) => (current + 1) % results.length);
        return;
      }

      if (event.key === "ArrowUp") {
        event.preventDefault();
        setActiveIndex((current) =>
          current === 0 ? results.length - 1 : current - 1,
        );
        return;
      }

      if (event.key === "Enter" && results[activeIndex]) {
        event.preventDefault();
        handleNavigate(results[activeIndex].to);
      }
    },
    [activeIndex, handleNavigate, onClose, results],
  );

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
      className="search-modal-overlay fixed inset-0 z-[10000] flex items-center justify-center px-3 pb-1 sm:px-4 sm:pb-2"
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
        .search-modal-result {
          border: 1px solid transparent;
          transition: transform 0.18s ease, border-color 0.18s ease, background 0.18s ease;
        }
        .search-modal-result:hover {
          background: rgba(92, 118, 255, 0.08) !important;
          border-color: rgba(92, 118, 255, 0.18) !important;
          transform: translateY(-1px);
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
        className="search-modal-panel relative z-10 mt-[4vh] w-[1200px] max-w-[96vw] rounded-[16px] px-6 pt-5 pb-6 sm:mt-[6vh] sm:w-[1100px]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* header */}
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-black/10">
          <span className="search-modal-title inline-flex items-center gap-2 font-semibold text-[15px]">
            <SearchOutlined />
            全局搜索
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
          placeholder="搜索功能模块、页面、学院、专业或关键词"
          className="search-modal-input"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <div className="mt-4 max-h-[calc(100vh-20rem)] sm:max-h-[calc(100vh-18rem)] overflow-y-auto">
          <div className="mb-2 text-[12px] font-semibold uppercase tracking-[0.14em] text-[#6b7280]">
            {normalizedQuery ? `搜索结果 ${results.length}` : "常用入口"}
          </div>
          <div className="space-y-2">
            {results.length > 0 ? (
              results.map((item, index) => (
                <button
                  key={item.key}
                  type="button"
                  className={`search-modal-result flex w-full items-start gap-3 rounded-[14px] px-4 py-3 text-left ${
                    index === activeIndex
                      ? "border-[rgba(92,118,255,0.24)] bg-[rgba(92,118,255,0.10)]"
                      : "bg-[#f8fafc]"
                  }`}
                  onClick={() => handleNavigate(item.to)}
                  onMouseEnter={() => setActiveIndex(index)}
                >
                  <span className="mt-0.5 inline-flex rounded-full bg-[var(--brand-accent-soft)] px-2 py-0.5 text-[11px] font-semibold text-[var(--brand-blue)]">
                    {item.kind === "module" ? "模块" : "页面"}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[15px] font-semibold text-[#1f2a44]">
                      {item.title}
                    </span>
                    <span className="mt-1 block text-[13px] leading-6 text-[#667085]">
                      {item.desc}
                    </span>
                    <span className="mt-1 block text-[12px] text-[var(--brand-blue)]/80">
                      {item.scope} · {item.to}
                    </span>
                  </span>
                </button>
              ))
            ) : (
              <div className="rounded-[14px] bg-[#f8fafc] px-4 py-5 text-[14px] leading-6 text-[#667085]">
                没有找到匹配结果，换个模块名、学院名、专业名或页面关键词再试。
              </div>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default SearchModal;
