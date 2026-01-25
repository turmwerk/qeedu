import React from "react";
import NavButton from "./components/NavButton";

interface IntroductionProps {
  onScrollToNext?: () => void;
}

const Introduction: React.FC<IntroductionProps> = ({ onScrollToNext }) => {
  // Header 背景色：bg-white/40 backdrop-blur-[32px] shadow-[0_20px_60px_rgba(147,51,234,0.2),0_0_0_1px_rgba(255,255,255,0.5)_inset] border-b border-white/30
  return (
    <section
      className="relative w-full flex flex-col items-center justify-center min-h-[90vh] h-[90vh] bg-white/40 backdrop-blur-[32px] shadow-[0_20px_60px_rgba(147,51,234,0.2),0_0_0_1px_rgba(255,255,255,0.5)_inset] border-b border-white/30 overflow-hidden -mt-px z-[1]"
    >
      <div className="flex-1 flex flex-col items-center justify-center w-full h-full">
        <h1 className="text-[48px] font-black bg-[linear-gradient(135deg,#1a1a1a_0%,#4b2a85_40%,#6236ff_80%,#8b5cf6_100%)] bg-clip-text text-transparent text-center mb-4 select-none">
          南京大学教育大模型
        </h1>
        <div className="text-[20px] text-[#666] text-center mb-8 select-none">
          让 AI 赋能学习、教学、科研与管理
        </div>
      </div>
      <div className="absolute left-1/2 -translate-x-1/2 bottom-8 z-10">
        <NavButton onClick={onScrollToNext || (() => {})} ariaLabel="向下滚动" />
      </div>
    </section>
  );
};

export default Introduction;
