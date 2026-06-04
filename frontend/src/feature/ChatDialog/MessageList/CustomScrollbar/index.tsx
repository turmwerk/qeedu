import React, { useEffect, useLayoutEffect, useRef, useState, useCallback } from "react";

interface Marker {
  index: number;
  topPercent: number;
  text: string;
}

interface CustomScrollbarProps {
  bodyRef: React.RefObject<HTMLDivElement | null>;
  markers: Marker[];
  onMarkerClick: (index: number) => void;
  hoveredIndex: number | null;
  setHoveredIndex: (index: number | null) => void;
}

const CustomScrollbar: React.FC<CustomScrollbarProps> = ({
  bodyRef,
  markers,
  onMarkerClick,
  hoveredIndex,
  setHoveredIndex,
}) => {
  const [thumbHeight, setThumbHeight] = useState(0);
  const [thumbTop, setThumbTop] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const dragStartY = useRef(0);
  const dragStartScrollTop = useRef(0);
  const handleMouseMoveRef = useRef<((e: MouseEvent) => void) | null>(null);
  const handleMouseUpRef = useRef<(() => void) | null>(null);

  // 更新滑块位置和高度
  const updateThumb = useCallback(() => {
    const body = bodyRef.current;
    if (!body) return;
    const { clientHeight, scrollHeight, scrollTop } = body;
    
    if (scrollHeight <= clientHeight) {
      setThumbHeight(0);
      return;
    }

    const trackHeight = trackRef.current?.clientHeight || clientHeight;
    const height = Math.max((clientHeight / scrollHeight) * trackHeight, 30);
    setThumbHeight(height);

    // 计算滑块位置
    // 最大可滚动距离
    const maxScrollTop = scrollHeight - clientHeight;
    // 最大滑块移动距离
    const maxThumbTop = trackHeight - height;

    // 当前比例
    const scrollRatio = scrollTop / maxScrollTop;
    setThumbTop(scrollRatio * maxThumbTop);

    if (markers.length > 0) {
      const visibleTopPercent = Math.min(1, Math.max(0, scrollTop / scrollHeight));
      const current = markers.reduce((selected, marker) => {
        if (marker.topPercent <= visibleTopPercent + 0.02) return marker.index;
        return selected;
      }, markers[0]?.index ?? null);
      setActiveIndex(current);
    } else {
      setActiveIndex(null);
    }
  }, [bodyRef, markers]);

  // 初始化滑块
  useLayoutEffect(() => {
    requestAnimationFrame(() => {
      updateThumb();
    });
  }, [updateThumb]);

  // 监听滚动
  useEffect(() => {
    const body = bodyRef.current;
    if (!body) return;
    
    const handleScroll = () => {
        if (!isDragging) {
            updateThumb();
        }
    };
    
    body.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", updateThumb);
    
    // 使用 ResizeObserver 监听内容高度变化
    const resizeObserver = new ResizeObserver(() => {
        updateThumb();
    });
    resizeObserver.observe(body);

    return () => {
      body.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", updateThumb);
      resizeObserver.disconnect();
    };
  }, [bodyRef, isDragging, updateThumb]);

  // 处理拖拽相关的 useCallback
  const handleMouseMove = useCallback((e: MouseEvent) => {
    const body = bodyRef.current;
    const track = trackRef.current;
    if (!body || !track) return;

    const deltaY = e.clientY - dragStartY.current;
    const { clientHeight, scrollHeight } = body;
    const maxThumbTop = track.clientHeight - thumbHeight;
    const maxScrollTop = scrollHeight - clientHeight;

    const deltaScroll = (deltaY / maxThumbTop) * maxScrollTop;
    body.scrollTop = dragStartScrollTop.current + deltaScroll;
  }, [bodyRef, thumbHeight]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    if (handleMouseMoveRef.current) {
      document.removeEventListener("mousemove", handleMouseMoveRef.current);
    }
    if (handleMouseUpRef.current) {
      document.removeEventListener("mouseup", handleMouseUpRef.current);
    }
  }, []);

  // 更新 ref
  useEffect(() => {
    handleMouseMoveRef.current = handleMouseMove;
    handleMouseUpRef.current = handleMouseUp;
  }, [handleMouseMove, handleMouseUp]);

  // 处理 userSelect 的副作用
  useEffect(() => {
    if (isDragging) {
      document.body.style.userSelect = "none";
    } else {
      document.body.style.userSelect = "";
    }
  }, [isDragging]);

  // 处理拖拽
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
    dragStartY.current = e.clientY;
    if (bodyRef.current) {
        dragStartScrollTop.current = bodyRef.current.scrollTop;
    }
    
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };
  
  // 点击轨道或滑块滚动
  const handleTrackClick = (e: React.MouseEvent) => {
      const body = bodyRef.current;
      const track = trackRef.current;
      if (!body || !track) return;
      
      const { top, height } = track.getBoundingClientRect();
      const clickY = e.clientY - top;
      const { scrollHeight, clientHeight } = body;
      
      const ratio = clickY / height;
      body.scrollTo({
          top: ratio * (scrollHeight - clientHeight),
          behavior: 'smooth'
      });
  };

  if (thumbHeight === 0 || markers.length === 0) return null;

  return (
    <div className="chat-scroll-overview group absolute right-1 top-3 bottom-3 z-20 flex w-7 justify-end pointer-events-none transition-[width] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:w-[min(72%,260px)] focus-within:w-[min(72%,260px)]">
      <style>{`
        .chat-scroll-overview-panel {
          background: rgba(42, 42, 42, 0.94);
          border: 1px solid rgba(255, 255, 255, 0.10);
          box-shadow: 0 18px 44px rgba(0, 0, 0, 0.34), inset 0 1px 0 rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(16px);
        }
        .chat-scroll-overview-list {
          scrollbar-width: thin;
          scrollbar-color: rgba(255, 255, 255, 0.22) transparent;
        }
        .chat-scroll-overview-list::-webkit-scrollbar {
          width: 6px;
        }
        .chat-scroll-overview-list::-webkit-scrollbar-thumb {
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.22);
        }
        .chat-scroll-overview-item {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          text-overflow: ellipsis;
          overflow-wrap: anywhere;
        }
      `}</style>
      <div className="chat-scroll-overview-panel pointer-events-auto relative flex h-full w-7 overflow-hidden rounded-2xl transition-[width,border-color,box-shadow] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:w-full group-focus-within:w-full">
        <div className="chat-scroll-overview-list min-w-0 flex-1 overflow-y-auto px-1.5 py-1.5 pr-5 opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus-within:opacity-100">
          {markers.map((marker) => {
            const isActive = marker.index === activeIndex || marker.index === hoveredIndex;
            const text = marker.text.trim() || "空消息";
            return (
              <button
                key={marker.index}
                type="button"
                className={`chat-scroll-overview-item mb-1 w-full rounded-2xl px-3 py-2 text-left text-[12px] font-semibold leading-5 text-white/85 outline-none transition-[background,border-color,color] hover:bg-white/10 focus-visible:bg-white/10 ${
                  isActive ? "bg-white/20 text-white" : "bg-transparent"
                }`}
                title={text}
                onMouseEnter={() => setHoveredIndex(marker.index)}
                onMouseLeave={() => setHoveredIndex(null)}
                onClick={() => onMarkerClick(marker.index)}
              >
                {text}
              </button>
            );
          })}
        </div>

        <div
          ref={trackRef}
          className="absolute inset-y-3 right-2 w-3 cursor-pointer rounded-full bg-white/10 transition-colors hover:bg-white/20"
          onClick={handleTrackClick}
        >
          <div
            className={`absolute left-1/2 w-1.5 -translate-x-1/2 rounded-full bg-white/45 transition-colors hover:bg-white/70 ${
              isDragging ? "bg-white/80" : ""
            }`}
            style={{
              height: thumbHeight,
              transform: `translate(-50%, ${thumbTop}px)`,
            }}
            onMouseDown={handleMouseDown}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      </div>
    </div>
  );
};

export default CustomScrollbar;
