import React from "react";
import Button from "@/components/Button";

interface FloatingButtonProps {
  onClick: () => void;
  visible?: boolean;
  icon: React.ReactNode;
  ariaLabel?: string;
  title?: string;
  className?: string;
}

const FloatingButton: React.FC<FloatingButtonProps> = ({
  onClick,
  visible = true,
  icon,
  ariaLabel,
  title,
  className = "",
}) => {
  return (
    <Button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      title={title}
      className={`inline-flex items-center justify-center w-8 h-8 p-0 rounded-full border border-[var(--brand-accent)] bg-white text-[var(--brand-accent)] shadow-[0_2px_8px_rgba(15,23,42,0.12)] transition-[transform,box-shadow,background,border-color,opacity] hover:bg-[var(--brand-accent-soft)] hover:shadow-[0_6px_14px_rgba(15,23,42,0.18)] active:scale-95 ${
        visible ? "opacity-100" : "opacity-0 pointer-events-none"
      } ${className}`}
    >
      <span className="inline-flex items-center justify-center leading-none">
        {icon}
      </span>
    </Button>
  );
};

export default FloatingButton;
