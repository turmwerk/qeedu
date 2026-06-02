import React from "react";
import Dropdown, { type DropdownItem } from "@/ui/Dropdown";
import Button from "@/ui/Button";

interface ControlRowProps {
  modeItems: DropdownItem[];
  aiItems: DropdownItem[];
  onSend: () => void;
  onStop: () => void;
  pending: boolean;
  disabled: boolean;
}

const ControlRow: React.FC<ControlRowProps> = ({
  modeItems,
  aiItems,
  onSend,
  onStop,
  pending,
  disabled,
}) => {
  return (
    <div className="flex items-center justify-between px-2.5 py-1.5 gap-2 flex-wrap min-h-[40px]">
      <div className="flex items-center gap-2 relative z-[250] flex-shrink-0">
        <Dropdown
          items={modeItems}
          direction="up"
          showSelected={true}
          showCheck={true}
          buttonClassName="chat-control-button bg-white border border-[var(--brand-border)] text-[var(--brand-text)] px-2.5 py-1 rounded-xl text-sm font-medium transition-[background,border-color,box-shadow] hover:bg-[var(--brand-accent-soft)] hover:border-[var(--brand-accent)] hover:shadow-[0_4px_12px_rgba(59,130,246,0.15)] whitespace-nowrap"
        />
        <Dropdown
          items={aiItems}
          direction="up"
          showSelected={true}
          showCheck={true}
          buttonClassName="chat-control-button chat-model-select-button max-w-[190px] overflow-hidden bg-white border border-[var(--brand-border)] text-[var(--brand-text)] px-2.5 py-1 rounded-xl text-sm font-medium transition-[background,border-color,box-shadow] hover:bg-[var(--brand-accent-soft)] hover:border-[var(--brand-accent)] hover:shadow-[0_4px_12px_rgba(59,130,246,0.15)] whitespace-nowrap sm:max-w-[230px]"
        />
      </div>

      <Button
        variant="primary"
        size="sm"
        onClick={pending ? onStop : onSend}
        disabled={pending ? false : disabled}
        className="!w-9 !h-9 !p-0 flex items-center justify-center flex-shrink-0"
        aria-label={pending ? "停止输出" : "发送"}
      >
        {pending ? (
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <rect x="7" y="7" width="10" height="10" rx="2" strokeWidth="2" />
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
