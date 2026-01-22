import React from "react";

interface UserBubbleProps {
  text: string;
}

const UserBubble: React.FC<UserBubbleProps> = ({ text }) => {
  return (
    <div className="bg-[var(--brand-accent)] text-white px-3 py-2 rounded-xl max-w-[90%]">
      {text}
    </div>
  );
};

export default UserBubble;
