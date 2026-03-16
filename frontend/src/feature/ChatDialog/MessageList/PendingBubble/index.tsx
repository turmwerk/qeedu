import React from "react";

const PendingBubble: React.FC = () => {
  return (
    <div className="dialog-pending self-start bg-[#f1f0fb] text-[#2d1b4f] px-3 py-2 rounded-xl flex gap-1.5">
      <span className="dialog-dot w-1.5 h-1.5 rounded-full bg-[#6b4da6] inline-block" />
      <span className="dialog-dot delay-1 w-1.5 h-1.5 rounded-full bg-[#6b4da6] inline-block" />
      <span className="dialog-dot delay-2 w-1.5 h-1.5 rounded-full bg-[#6b4da6] inline-block" />
    </div>
  );
};

export default PendingBubble;
