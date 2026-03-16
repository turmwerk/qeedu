import React, { useEffect, useRef, useState } from "react";

interface InlineEditRowProps {
  depth: number;
  variant: "file" | "folder";
  initialValue: string;
  placeholder?: string;
  icon?: React.ReactNode;
  getIcon?: (value: string) => React.ReactNode;
  onSubmit: (value: string) => void;
  onCancel: () => void;
}

const InlineEditRow: React.FC<InlineEditRowProps> = ({
  depth,
  variant,
  initialValue,
  placeholder,
  icon,
  getIcon,
  onSubmit,
  onCancel,
}) => {
  const [value, setValue] = useState(initialValue);
  const inputRef = useRef<HTMLInputElement>(null);
  const resolvedRef = useRef(false);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    const input = inputRef.current;
    if (!input) return;
    input.focus();
    const dotIndex = variant === "file" ? initialValue.lastIndexOf(".") : -1;
    if (dotIndex > 0) {
      input.setSelectionRange(0, dotIndex);
    } else {
      input.select();
    }
  }, [initialValue, variant]);

  const finish = (nextValue: string) => {
    if (resolvedRef.current) return;
    resolvedRef.current = true;
    onSubmit(nextValue);
  };

  const cancel = () => {
    if (resolvedRef.current) return;
    resolvedRef.current = true;
    onCancel();
  };

  const paddingLeft =
    variant === "folder" ? `${depth * 12 + 4}px` : `${(depth + 1) * 12 + 4}px`;
  const guideWidth = depth * 12;

  return (
    <div
      className="relative flex items-center gap-1.5 rounded-sm py-0.5 pr-2 text-xs text-[#cccccc]"
      style={{ paddingLeft }}
    >
      {guideWidth > 0 && (
        <span
          className="pointer-events-none absolute left-0 top-0 h-full"
          style={{
            width: `${guideWidth}px`,
            backgroundImage:
              "linear-gradient(to right, rgba(255,255,255,0.12) 1px, transparent 1px)",
            backgroundSize: "12px 100%",
            backgroundPosition: "4px 0",
          }}
        />
      )}
      {variant === "folder" && (
        <span className="flex w-3 shrink-0 items-center justify-center text-[10px] text-[#858585]" />
      )}
      <span className="shrink-0 text-sm">
        {getIcon ? getIcon(value) : icon}
      </span>
      <input
        ref={inputRef}
        className="min-w-0 flex-1 rounded border border-[#3c3c3c] bg-[#1e1e1e] px-1 py-0.5 text-xs text-[#cccccc] outline-none focus:border-[#007acc]"
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            finish(value);
          } else if (e.key === "Escape") {
            e.preventDefault();
            cancel();
          }
        }}
        onBlur={() => {
          if (!value.trim()) {
            cancel();
            return;
          }
          finish(value);
        }}
      />
    </div>
  );
};

export default InlineEditRow;
