import React from "react";
import { useNavigate } from "react-router-dom";
import NavButton from "./NavButton";
import Button from "@/ui/Button";
import { InfoCircleOutlinedIcon, RocketOutlinedIcon } from "@/ui/Icon";

interface IntroductionProps {
  onScrollToNext?: () => void;
}

const Introduction: React.FC<IntroductionProps> = ({ onScrollToNext }) => {
  const navigate = useNavigate();

  return (
    <section
      className="relative w-full flex flex-col items-center justify-center min-h-[90vh] h-[90vh] bg-transparent overflow-hidden -mt-px z-[1]"
    >
      <div className="flex-1 flex flex-col items-center justify-center w-full h-full gap-6">
        <h1 className="text-[48px] font-black text-[var(--brand-blue)] text-center mb-2 select-none">
          南京大学教育AI应用
        </h1>
        <div className="text-[20px] text-[#666] text-center select-none">
          AI 赋能学习、教学、科研与管理
        </div>
        {/* CTA buttons */}
        <div className="flex items-center gap-3 mt-2">
          <Button
            className="glass-btn flex items-center gap-1.5 px-5 py-2 text-[15px] font-semibold rounded-xl select-none"
            onClick={() => onScrollToNext?.()}
          >
            <RocketOutlinedIcon />
            立即开始
          </Button>
          <Button
            className="glass-btn flex items-center gap-1.5 px-5 py-2 text-[15px] font-semibold rounded-xl select-none"
            onClick={() => navigate("/login")}
          >
            <InfoCircleOutlinedIcon />
            了解更多
          </Button>
        </div>
      </div>
      <div className="absolute left-1/2 -translate-x-1/2 bottom-8 z-10">
        <NavButton onClick={onScrollToNext || (() => {})} ariaLabel="向下滚动" />
      </div>
    </section>
  );
};

export default Introduction;
