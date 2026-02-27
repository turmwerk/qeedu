import React, { useState, useRef } from "react";
import Button from "@/components/Button";


export interface FloatingButtonProps {
  onClick: () => void;
  visible?: boolean;
  icon: React.ReactNode;
  ariaLabel?: string;
  title?: string;
  className?: string;
  style?: React.CSSProperties;
  size?: number | string; // 支持自定义尺寸
  shape?: 'circle' | 'square' | string; // 支持自定义形状。也可以直接传入 tailwind 类名，例如 'rounded-lg' 或 'rounded-xl'
  color?: string; // 主色
  bgColor?: string; // 背景色
  borderColor?: string; // 边框色
  hoverStyle?: React.CSSProperties; // 悬浮时样式
  activeStyle?: React.CSSProperties; // 激活时样式
  hoverClassName?: string; // 悬浮时class
  activeClassName?: string; // 激活时class
}


const FloatingButton: React.FC<FloatingButtonProps> = ({
  onClick,
  visible = true,
  icon,
  ariaLabel,
  title,
  className = "",
  style = {},
  size = 36,
  shape = 'circle',
  color,
  bgColor,
  borderColor,
  hoverStyle = {},
  activeStyle = {},
  hoverClassName = '',
  activeClassName = '',
}) => {
  // 动态样式
  // 支持直接传入 tailwind 的 rounded 类，例如 'rounded-lg'
  const shapeClass =
    shape === 'circle' ? 'rounded-full' : shape === 'square' ? 'rounded' : (typeof shape === 'string' && shape.startsWith('rounded') ? shape : 'rounded-lg');
  const baseSize = typeof size === 'number' ? `${size}px` : size;
  const mergedStyle: React.CSSProperties = {
    width: baseSize,
    height: baseSize,
    color: color || undefined,
    background: bgColor || undefined,
    borderColor: borderColor || undefined,
    ...style,
  };

  // 默认样式仿照 Header 中的侧边按钮
  // 如果调用方没有传 bgColor，则使用默认白底；否则让调用方控制背景（可设为透明）
  // 当 className 含 glass-btn 时，去掉 border/bg 默认值，完全交给 CSS glass 规则
  const isGlass = className.includes('glass');
  const bgClass = isGlass ? '' : (bgColor ? '' : 'bg-white');
  const borderClass = isGlass ? '' : 'border border-[var(--brand-border)] hover:border-[var(--brand-accent)]';
  const defaultClasses = `inline-flex items-center justify-center p-0 ${borderClass} ${bgClass} text-[var(--brand-accent)] hover:bg-[var(--brand-accent-soft)] transition`;

  // hover/active 颜色通过 className 传递或外部覆盖
  // 合并 hover/active 样式
  // 通过 Tailwind/自定义className传递hover/active样式，或通过 style 传递
  // 这里仅合并基础样式，hover/active 建议通过 className 传递

  const [isHovered, setIsHovered] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [isJumping, setIsJumping] = useState(false);
  const jumpTimer = useRef<number | null>(null);

  const interactionStyle = isActive ? activeStyle : isHovered ? hoverStyle : {};
  const finalStyle: React.CSSProperties = { ...mergedStyle, ...interactionStyle };
  return (
    <Button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      title={title}
      style={finalStyle}
      onMouseEnter={() => {
        setIsHovered(true);
        // trigger a single quick jump on mouse enter
        setIsJumping(true);
        if (jumpTimer.current) {
          window.clearTimeout(jumpTimer.current);
        }
        jumpTimer.current = window.setTimeout(() => {
          setIsJumping(false);
          jumpTimer.current = null;
        }, 120);
      }}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsActive(false);
        if (jumpTimer.current) {
          window.clearTimeout(jumpTimer.current);
          jumpTimer.current = null;
        }
        setIsJumping(false);
      }}
      onMouseDown={() => setIsActive(true)}
      onMouseUp={() => setIsActive(false)}
      onBlur={() => setIsActive(false)}
      className={`${defaultClasses} ${visible ? "opacity-100" : "opacity-0 pointer-events-none"} ${shapeClass} ${className} ${hoverClassName} ${activeClassName} group`}
    >
      <span className={`inline-flex items-center justify-center leading-none transform transition-transform duration-100 ease-linear ${isJumping ? '-translate-y-1' : ''}`}>
        {icon}
      </span>
    </Button>
  );
};

export default FloatingButton;
