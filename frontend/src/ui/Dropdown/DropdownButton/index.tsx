import React from "react";
import Button from "@/ui/Button";

interface DropdownButtonProps {
  children: React.ReactNode;
  showBorder?: boolean;
  disabled?: boolean;
  active?: boolean;
  className?: string;
  onClick?: () => void;
  direction?: "up" | "down";
}

const DropdownButton: React.FC<DropdownButtonProps> = ({
  children,
  showBorder = true,
  disabled,
  active = false,
  className,
  onClick,
  direction = "down",
}) => {
  const noBorderBaseClass =
    "bg-transparent border-0 text-[var(--brand-blue)] px-2.5 py-1.5 rounded-xl font-semibold relative transition-[color] after:content-[''] after:absolute after:left-0 after:-bottom-[1px] after:h-[1.5px] after:w-0 after:bg-current after:transition-all after:duration-200 hover:text-[var(--brand-purple)] hover:after:w-full";
  const noBorderActiveClass = "!text-[var(--brand-purple)] after:!w-full";

  const defaultButtonClass = showBorder
    ? "bg-white border border-[var(--brand-border)] text-[var(--brand-blue)] px-2.5 py-1.5 rounded-xl font-semibold transition-[background,border-color,color] hover:bg-[var(--brand-accent-soft)] hover:border-[var(--brand-purple)] hover:text-[var(--brand-purple)]"
    : `${noBorderBaseClass} ${active ? noBorderActiveClass : ""}`;
  const disabledButtonClass =
    "bg-[var(--brand-accent)] text-white border-0 px-3.5 py-[7px] rounded-[16px] font-semibold text-[15px] transition-[box-shadow,background]";

  return (
    <Button
      className={`group/dropdown-trigger dropdown-trigger-btn ${
        disabled ? disabledButtonClass : defaultButtonClass
      } ${className ?? ""} ${
        !showBorder && active ? noBorderActiveClass : ""
      } ${active ? "trigger-active" : ""}`}
      aria-expanded="false"
      onClick={onClick}
      disabled={disabled}
    >
      <span className="inline-flex items-center gap-1.5 text-[14px] leading-[1.2] text-current [&_.anticon]:text-current [&_.anticon]:text-[1em] [&_.anticon>svg]:h-[1em] [&_.anticon>svg]:w-[1em]">
        {children}
        {direction === "up" && (
          <svg
            className="w-3 h-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 15l7-7 7 7"
            />
          </svg>
        )}
      </span>
    </Button>
  );
};

export default DropdownButton;
