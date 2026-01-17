import React from 'react';
import { useNavigate } from 'react-router-dom';

type Feature = {
  key: string;
  title: string;
  desc: string;
  to: string;
  icon?: React.ReactNode;
};

type Props = {
  headline: string;
  subtitle: string;
  placeholder: string;
  features: Feature[];
};

const ModuleHub: React.FC<Props> = ({
  headline,
  subtitle,
  placeholder,
  features,
}) => {
  const navigate = useNavigate();

  return (
    <div>
      <style>{`
        .module-hero::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background:
            radial-gradient(circle at 30% 40%, rgba(147, 51, 234, 0.12) 0%, transparent 25%),
            radial-gradient(circle at 70% 60%, rgba(59, 130, 246, 0.12) 0%, transparent 25%);
          animation: moduleShimmer 8s ease-in-out infinite;
          pointer-events: none;
        }
        .module-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(90deg, #6236ff, #8b5cf6, #ec4899);
          opacity: 0;
          transition: opacity 0.35s ease;
        }
        .module-card:hover::before { opacity: 1; }
        @keyframes moduleShimmer {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          50% { transform: translate(-5%, -5%) rotate(2deg); }
        }
      `}</style>
      <div className="p-6 text-[#444]">
        <div className="module-hero bg-white/75 backdrop-blur-[24px] rounded-[28px] px-[80px] pt-10 pb-9 max-w-[1400px] mx-auto shadow-[0_20px_50px_rgba(75,42,133,0.15),inset_0_1px_1px_rgba(255,255,255,0.9)] flex flex-col gap-6 relative overflow-hidden">
          <div className="flex flex-col gap-2.5 relative z-[1]">
            <h1 className="m-0 text-[38px] leading-[1.2] font-black bg-[linear-gradient(135deg,#1a1a1a_0%,#4b2a85_40%,#6236ff_100%)] bg-clip-text text-transparent">{headline}</h1>
            <div className="text-[#666] text-[16px] tracking-[2px]">{subtitle}</div>
          </div>
          <div className="flex items-center gap-3 bg-white/95 backdrop-blur-[16px] rounded-full px-4 py-3 border-2 border-[rgba(98,54,255,0.15)] shadow-[0_8px_24px_rgba(98,54,255,0.15),inset_0_1px_1px_rgba(255,255,255,0.8)] relative z-[1] transition-all duration-300 hover:border-[rgba(98,54,255,0.3)] hover:shadow-[0_12px_32px_rgba(98,54,255,0.25),inset_0_1px_1px_rgba(255,255,255,0.9)] focus-within:border-[rgba(98,54,255,0.3)] focus-within:shadow-[0_12px_32px_rgba(98,54,255,0.25),inset_0_1px_1px_rgba(255,255,255,0.9)]">
            <span className="w-[38px] h-[38px] rounded-full bg-[linear-gradient(135deg,rgba(98,54,255,0.15),rgba(139,92,246,0.15))] text-[#6236ff] flex items-center justify-center font-bold text-[18px] shrink-0" aria-hidden="true">≡</span>
            <input
              className="flex-1 border-0 bg-transparent outline-none text-[15px] text-[var(--brand-text)] placeholder:text-[#999]"
              placeholder={placeholder}
              type="text"
              aria-label={placeholder}
            />
            <button type="button" className="w-[42px] h-[42px] rounded-full border-0 bg-[linear-gradient(135deg,#6236ff_0%,#8b5cf6_100%)] text-white text-[20px] cursor-pointer flex items-center justify-center shrink-0 shadow-[0_6px_16px_rgba(98,54,255,0.35)] transition hover:scale-105 hover:shadow-[0_8px_24px_rgba(98,54,255,0.45)]" aria-label="发送">
              →
            </button>
          </div>
          <div className="grid grid-cols-2 gap-6 relative z-[1]">
            {features.map((feature) => (
              <button
                key={feature.key}
                type="button"
                className="module-card border border-[rgba(98,54,255,0.1)] rounded-[20px] p-8 min-h-[140px] bg-white/85 backdrop-blur-[12px] text-left cursor-pointer shadow-[0_8px_24px_rgba(98,54,255,0.12),inset_0_1px_1px_rgba(255,255,255,0.8)] transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] flex items-start gap-3.5 relative overflow-hidden hover:-translate-y-1 hover:scale-[1.02] hover:shadow-[0_16px_40px_rgba(98,54,255,0.25),inset_0_1px_1px_rgba(255,255,255,0.9)] hover:border-[rgba(98,54,255,0.25)] hover:bg-white/95"
                onClick={() => navigate(feature.to)}
              >
                {feature.icon && <span className="shrink-0 text-[28px] bg-[linear-gradient(135deg,#6236ff,#8b5cf6)] bg-clip-text text-transparent flex items-center mt-0.5">{feature.icon}</span>}
                <div className="flex-1 flex flex-col gap-2.5">
                  <div className="font-extrabold text-[20px] bg-[linear-gradient(135deg,#1a1a1a,#4b2a85)] bg-clip-text text-transparent">{feature.title}</div>
                  <div className="text-[#666] text-[14px] leading-[1.6]">{feature.desc}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModuleHub;
