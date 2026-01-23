import React, { useEffect, useLayoutEffect, useRef, useState, useCallback } from "react";
import type { DialogMessage } from "../../index";
import TooltipBubble from "../TooltipBubble";

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
  messages: DialogMessage[];
}

const CustomScrollbar: React.FC<CustomScrollbarProps> = ({
  bodyRef,
  markers,
  onMarkerClick,
  hoveredIndex,
  setHoveredIndex,
  messages,
}) => {
  const [thumbHeight, setThumbHeight] = useState(0);
  const [thumbTop, setThumbTop] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
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

    const height = Math.max((clientHeight / scrollHeight) * clientHeight, 30);
    setThumbHeight(height);
    
    // 计算滑块位置
    // 最大可滚动距离
    const maxScrollTop = scrollHeight - clientHeight;
    // 最大滑块移动距离
    const maxThumbTop = clientHeight - height;
    
    // 当前比例
    const scrollRatio = scrollTop / maxScrollTop;
    setThumbTop(scrollRatio * maxThumbTop);
  }, [bodyRef]);

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
    if (!body) return;

    const deltaY = e.clientY - dragStartY.current;
    const { clientHeight, scrollHeight } = body;
    const maxThumbTop = clientHeight - thumbHeight;
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

  if (thumbHeight === 0) return null;

  return (
    <div className="absolute right-1 top-3 bottom-3 w-4 z-20 pointer-events-none">
      {/* 轨道 */}
      <div 
        ref={trackRef}
        className="absolute inset-y-0 right-[6px] w-[4px] rounded-full bg-[rgba(59,130,246,0.2)] pointer-events-auto cursor-pointer hover:bg-[rgba(59,130,246,0.3)] transition-colors"
        onClick={handleTrackClick}
      />
      
      {/* 节点 */}
      <div className="absolute inset-0 pointer-events-none">
        {markers.map((marker) => (
            <div
              key={marker.index}
              className="pointer-events-auto absolute right-[4px] w-2 h-2 rounded-full bg-[rgba(59,130,246,0.35)] shadow-[0_0_0_2px_rgba(255,255,255,0.9)] cursor-pointer hover:scale-125 transition-transform z-10"
              style={{ top: `calc(${marker.topPercent * 100}% - 4px)` }}
              onMouseEnter={() => setHoveredIndex(marker.index)}
              onMouseLeave={() => setHoveredIndex(null)}
              onClick={(e) => {
                  e.stopPropagation();
                  onMarkerClick(marker.index);
              }}
            />
        ))}
      </div>

      {/* 滑块 */}
      <div
        className={`absolute right-[6px] w-[4px] rounded-full bg-[rgba(59,130,246,0.65)] cursor-pointer hover:bg-[rgba(59,130,246,0.8)] transition-colors z-20 pointer-events-auto ${isDragging ? 'bg-[rgba(59,130,246,0.9)]' : ''}`}
        style={{
            height: thumbHeight,
            transform: `translateY(${thumbTop}px)`,
        }}
        onMouseDown={handleMouseDown}
        onClick={handleTrackClick}
      />
      
      {/* Tooltip */}
      {hoveredIndex !== null && (
        <TooltipBubble
          text={messages[hoveredIndex]?.text ?? ""}
          topPercent={markers.find((m) => m.index === hoveredIndex)?.topPercent ?? 0}
        />
      )}
    </div>
  );
};

export default CustomScrollbar;
