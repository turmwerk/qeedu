import React from "react";

interface UserBubbleProps {
  text: string;
}

const UserBubble: React.FC<UserBubbleProps> = ({ text }) => {
  return (
    <div className="bg-[var(--brand-accent)] text-white px-3 py-2 rounded-xl max-w-[75%] border border-transparent hover:border-white/60 transition-[border-color]" style={{
      wordBreak: 'break-word',
      overflowWrap: 'anywhere'
    }}>
      {text}
    </div>
  );
};

export default UserBubble;
