import React from "react";
import Button from "@/components/Button";

interface NavButtonProps {
  onClick?: () => void;
  ariaLabel?: string;
}

const NavButton: React.FC<NavButtonProps> = ({ onClick, ariaLabel }) => {
  return (
    <div className="flex items-center justify-center nav-float">
      <Button
        type="button"
        onClick={onClick || (() => {})}
        aria-label={ariaLabel || "向下导航"}
        className="w-12 h-12 rounded-full bg-transparent border border-transparent flex items-center justify-center shadow-sm transition transform hover:-translate-y-0.5 text-[#374141]"
      >
        <svg width="28" height="28" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
          <path d="M11 13L17 19L23 13" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </Button>
      <style>{`
        @keyframes navFloat { 0%,100%{ transform: translateY(0);} 50%{ transform: translateY(12px);} }
        .nav-float { animation: navFloat 2.2s infinite ease-in-out; }
      `}</style>
    </div>
  );
};

export default NavButton;
