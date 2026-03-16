import React, { useState } from "react";

interface CopyButtonProps {
  text: string;
}

export const CopyButton: React.FC<CopyButtonProps> = ({ text }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // fallback for environments without clipboard API
      const el = document.createElement("textarea");
      el.value = text;
      el.style.position = "fixed";
      el.style.opacity = "0";
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      title={copied ? "已复制" : "复制代码"}
      className="
        absolute top-2.5 right-2.5
        opacity-0 group-hover:opacity-100
        transition-all duration-150
        px-2.5 py-1 text-xs rounded-md
        bg-white/10 text-slate-300
        hover:bg-white/20 hover:text-white
        select-none cursor-pointer
        border border-white/10
      "
    >
      {copied ? "Copied!" : "Copy"}
    </button>
  );
};

export default CopyButton;
