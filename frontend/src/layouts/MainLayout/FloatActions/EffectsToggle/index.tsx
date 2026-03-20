import React, { useEffect, useState } from "react";
import FloatingButton from "@/layouts/MainLayout/FloatingButton";
import { getEffectsEnabled, toggleEffects } from "@/utils/effects/controller";

const EffectsToggle: React.FC = () => {
  const [enabled, setEnabled] = useState(getEffectsEnabled());

  useEffect(() => {
    const handler = () => setEnabled(getEffectsEnabled());
    // keep effects state in sync if other tabs change it
    window.addEventListener('storage', handler);
    window.addEventListener('effects-change', handler);
    return () => {
      window.removeEventListener('storage', handler);
      window.removeEventListener('effects-change', handler);
    };
  }, []);

  const handleToggle = () => {
    const next = toggleEffects();
    setEnabled(next);
  };

  const EffectsIcon = (
    <div className="animate-[gentleRotate_8s_ease-in-out_infinite] group-hover:animate-[hoverRotateFloat_2s_ease-in-out_infinite]">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="leading-none">
        <path d="M12 2v20M12 2l-3 3M12 2l3 3M12 22l-3-3M12 22l3-3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M3.34 7l17.32 10M3.34 7l1 3.5M3.34 7l3.5 1M20.66 17l-1-3.5M20.66 17l-3.5-1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M3.34 17l17.32-10M3.34 17l3.5-1M3.34 17l1-3.5M20.66 7l-3.5 1M20.66 7l-1 3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );

  const EffectsOffIcon = (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="leading-none">
      <path d="M12 2v20M12 2l-3 3M12 2l3 3M12 22l-3-3M12 22l3-3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" opacity="0.4" />
      <path d="M3.34 7l17.32 10M3.34 7l1 3.5M3.34 7l3.5 1M20.66 17l-1-3.5M20.66 17l-3.5-1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" opacity="0.4" />
      <path d="M3.34 17l17.32-10M3.34 17l3.5-1M3.34 17l1-3.5M20.66 7l-3.5 1M20.66 7l-1 3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" opacity="0.4" />
      <path d="M4 4l16 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );

  return (
    <div className="group relative">
      <style>{`
        @keyframes gentleRotate {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-5deg); }
          75% { transform: rotate(5deg); }
        }
        @keyframes hoverRotateFloat {
          0%, 100% { transform: translateY(-2px) rotate(0deg); }
          25% { transform: translateY(-3px) rotate(-8deg); }
          50% { transform: translateY(-2px) rotate(0deg); }
          75% { transform: translateY(-3px) rotate(8deg); }
        }
        @keyframes snowfall {
          0% { opacity: 0; transform: translateY(0) scale(0.8) rotate(0deg); }
          10% { opacity: 0.6; }
          50% { opacity: 0.3; transform: translateY(12px) scale(0.6) rotate(180deg); }
          100% { opacity: 0; transform: translateY(25px) scale(0.4) rotate(360deg); }
        }
        @keyframes shimmer {
          0%, 100% { opacity: 0; transform: rotate(0deg); }
          50% { opacity: 0.3; transform: rotate(180deg); }
        }
      `}</style>

      <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[60px] w-[60px] -translate-x-1/2 -translate-y-1/2">
        <span className="absolute inset-[-2px] -z-10 rounded-[10px] bg-[linear-gradient(45deg,transparent_40%,rgba(147,197,253,0.1)_50%,transparent_60%)] opacity-0 animate-[shimmer_6s_ease-in-out_infinite]" />
        <span className="absolute left-[20%] top-[10%] h-[3px] w-[3px] rounded-full bg-current opacity-0 animate-[snowfall_3.5s_ease-in-out_infinite] group-hover:animate-[snowfall_2.5s_ease-in-out_infinite]" />
        <span className="absolute left-[80%] top-[20%] h-[3px] w-[3px] rounded-full bg-current opacity-0 [animation-delay:0.8s] animate-[snowfall_4s_ease-in-out_infinite] group-hover:animate-[snowfall_2.5s_ease-in-out_infinite] group-hover:[animation-delay:0.8s]" />
        <span className="absolute left-[10%] top-[60%] h-[3px] w-[3px] rounded-full bg-current opacity-0 [animation-delay:1.5s] animate-[snowfall_3.8s_ease-in-out_infinite] group-hover:animate-[snowfall_2.5s_ease-in-out_infinite] group-hover:[animation-delay:1.5s]" />
        <span className="absolute left-[85%] top-[70%] h-[3px] w-[3px] rounded-full bg-current opacity-0 [animation-delay:2.2s] animate-[snowfall_4.2s_ease-in-out_infinite] group-hover:animate-[snowfall_2.5s_ease-in-out_infinite] group-hover:[animation-delay:2.2s]" />
        <span className="absolute left-1/2 top-[40%] h-[3px] w-[3px] -translate-x-1/2 rounded-full bg-current opacity-0 [animation-delay:0.5s] animate-[snowfall_3.6s_ease-in-out_infinite] group-hover:animate-[snowfall_2.5s_ease-in-out_infinite] group-hover:[animation-delay:0.5s]" />
        <span className="absolute left-[60%] top-[15%] h-[3px] w-[3px] rounded-full bg-current opacity-0 [animation-delay:1.8s] animate-[snowfall_4.5s_ease-in-out_infinite] group-hover:animate-[snowfall_2.5s_ease-in-out_infinite] group-hover:[animation-delay:1.8s]" />
      </div>

      <FloatingButton
        onClick={handleToggle}
        visible={true}
        icon={enabled ? EffectsIcon : EffectsOffIcon}
        ariaLabel={enabled ? "关闭特效" : "开启特效"}
        title={enabled ? "关闭特效" : "开启特效"}
        size={32}
        shape="rounded-lg"
        className="glass-btn sm:!w-[40px] sm:!h-[40px]"
        hoverClassName=""
      />
    </div>
  );
};

export default EffectsToggle;
