import React, { useEffect, useState } from "react";

const PendingBubble: React.FC = () => {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const start = Date.now();
    const timer = setInterval(() => {
      setElapsed(((Date.now() - start) / 1000));
    }, 100);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="chat-pending-bubble dialog-pending self-start bg-[#f1f0fb] text-[#6b4da6] px-3 py-2 rounded-xl flex items-center gap-2 text-sm">
      <span className="inline-flex gap-1">
        <span className="dialog-dot w-1.5 h-1.5 rounded-full bg-[#6b4da6] inline-block" />
        <span className="dialog-dot delay-1 w-1.5 h-1.5 rounded-full bg-[#6b4da6] inline-block" />
        <span className="dialog-dot delay-2 w-1.5 h-1.5 rounded-full bg-[#6b4da6] inline-block" />
      </span>
      <span className="text-xs text-[#8b6fc0] tabular-nums">
        思考中 {elapsed.toFixed(1)}s
      </span>
    </div>
  );
};

export default PendingBubble;
