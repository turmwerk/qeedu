import React from "react";
import Dropdown, { type DropdownItem } from "@/components/Dropdown";
import Button from "@/components/Button";

interface ControlRowProps {
  modeItems: DropdownItem[];
  aiItems: DropdownItem[];
  onSend: () => void;
  pending: boolean;
  disabled: boolean;
}

const ControlRow: React.FC<ControlRowProps> = ({
  modeItems,
  aiItems,
  onSend,
  pending,
  disabled,
}) => {
  return (
    <div className="flex items-center justify-between px-2.5 py-1.5">
      <div className="flex items-center gap-2 relative z-[250]">
        <Dropdown
          items={modeItems}
          direction="up"
          showSelected={true}
          showCheck={true}
          buttonClassName="bg-white border border-[var(--brand-border)] text-[var(--brand-text)] px-2.5 py-1 rounded-xl text-sm font-medium transition-[background,border-color,box-shadow] hover:bg-[var(--brand-accent-soft)] hover:border-[var(--brand-accent)] hover:shadow-[0_4px_12px_rgba(59,130,246,0.15)]"
        />
        <Dropdown
          items={aiItems}
          direction="up"
          showSelected={true}
          showCheck={true}
          buttonClassName="bg-white border border-[var(--brand-border)] text-[var(--brand-text)] px-2.5 py-1 rounded-xl text-sm font-medium transition-[background,border-color,box-shadow] hover:bg-[var(--brand-accent-soft)] hover:border-[var(--brand-accent)] hover:shadow-[0_4px_12px_rgba(59,130,246,0.15)]"
        />
      </div>

      <Button
        variant="primary"
        size="sm"
        onClick={onSend}
        disabled={disabled}
        className="!w-9 !h-9 !p-0 flex items-center justify-center"
      >
        {pending ? (
          <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
            />
          </svg>
        )}
      </Button>
    </div>
  );
};

export default ControlRow;
