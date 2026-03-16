import React, { useRef, useState } from "react";

interface NavButtonProps {
  onClick?: () => void;
  ariaLabel?: string;
}

const NavButton: React.FC<NavButtonProps> = ({ onClick, ariaLabel }) => {
  const [isJumping, setIsJumping] = useState(false);
  const jumpTimer = useRef<number | null>(null);

  return (
    <div className="flex items-center justify-center nav-float">
      <button
        type="button"
        onClick={onClick || (() => {})}
        aria-label={ariaLabel || "向下导航"}
        className="w-10 h-10 flex items-center justify-center transition text-[var(--brand-blue)] hover:text-[var(--brand-purple)] bg-transparent border-none p-0"
        onMouseEnter={() => {
          setIsJumping(true);
          if (jumpTimer.current) {
            window.clearTimeout(jumpTimer.current);
          }
          jumpTimer.current = window.setTimeout(() => {
            setIsJumping(false);
            jumpTimer.current = null;
          }, 120);
        }}
        onMouseLeave={() => {
          if (jumpTimer.current) {
            window.clearTimeout(jumpTimer.current);
            jumpTimer.current = null;
          }
          setIsJumping(false);
        }}
      >
        {/* Arrow icon only: slightly elongated shaft and longer tail '|' */}
        <svg className={`nav-arrow transform transition-transform duration-100 ease-linear ${isJumping ? "-translate-y-1" : ""}`} width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M12 4v14" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M19 15l-7 7-7-7" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <style>{`
        @keyframes navFloat { 0%,100%{ transform: translateY(0);} 50%{ transform: translateY(12px);} }
        .nav-float { animation: navFloat 2.2s infinite ease-in-out; }
        .nav-float:hover { animation-play-state: paused; }
      `}</style>
    </div>
  );
};

export default NavButton;
