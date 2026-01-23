import React from "react";

interface BotBubbleProps {
  text: string;
}

const BotBubble: React.FC<BotBubbleProps> = ({ text }) => {
  return (
    <div className="bg-[#f1f0fb] text-[#2d1b4f] px-3 py-2 rounded-xl max-w-[75%] border border-transparent hover:border-[var(--brand-accent)] transition-[border-color]" style={{
      wordBreak: 'break-word',
      overflowWrap: 'anywhere'
    }}>
      {text}
    </div>
  );
};

export default BotBubble;
