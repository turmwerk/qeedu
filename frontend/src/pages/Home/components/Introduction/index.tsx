import React from "react";
import NavButton from "./components/NavButton";

interface IntroductionProps {
  onScrollToNext?: () => void;
}

const Introduction: React.FC<IntroductionProps> = ({ onScrollToNext }) => {
  // Header 背景色已简化：移除 blur 与发光
  return (
    <section
      className="relative w-full flex flex-col items-center justify-center min-h-[90vh] h-[90vh] bg-transparent border-b border-gray-200 overflow-hidden -mt-px z-[1]"
    >
      <div className="flex-1 flex flex-col items-center justify-center w-full h-full">
        <h1 className="text-[48px] font-black text-[#111] text-center mb-4 select-none">
          南京大学教育AI应用
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
