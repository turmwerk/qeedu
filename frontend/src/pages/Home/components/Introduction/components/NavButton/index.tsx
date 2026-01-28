import React from "react";

interface NavButtonProps {
  onClick?: () => void;
  ariaLabel?: string;
}

const NavButton: React.FC<NavButtonProps> = ({ onClick, ariaLabel }) => {
  return (
    <div className="flex items-center justify-center nav-float">
      <button
        type="button"
        onClick={onClick || (() => {})}
        aria-label={ariaLabel || "向下导航"}
        className="w-9 h-9 flex items-center justify-center transition text-blue-600 hover:text-[#6d28d9]"
        style={{ background: 'transparent', border: 'none', padding: 0 }}
      >
        {/* Arrow icon only: slightly elongated shaft and longer tail '|' */}
        <svg className="nav-arrow" width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
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
