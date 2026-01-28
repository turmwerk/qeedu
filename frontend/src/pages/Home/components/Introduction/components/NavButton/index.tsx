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
        className="w-9 h-9 flex items-center justify-center transition transform hover:-translate-y-0.5"
        style={{ background: 'transparent', color: 'var(--nav-fg)', border: 'none', padding: 0 }}
      >
        {/* Arrow icon only: no surrounding box */}
        <svg className="nav-arrow" width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
          <path d="M12 6v10" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M19 13l-7 7-7-7" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <style>{`
        @keyframes navFloat { 0%,100%{ transform: translateY(0);} 50%{ transform: translateY(12px);} }
        .nav-float { animation: navFloat 2.2s infinite ease-in-out; }
      `}</style>
    </div>
  );
};

export default NavButton;
