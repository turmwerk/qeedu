import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "@/components/Button";

type Feature = {
  key: string;
  title: string;
  desc: string;
  to: string;
  icon?: React.ReactNode;
};

type Props = {
  headline?: string;
  subtitle?: string;
  features: Feature[];
};

const ModuleHub: React.FC<Props> = ({
  headline,
  subtitle,
  features,
}) => {
  const navigate = useNavigate();
  const [hoveredTitle, setHoveredTitle] = useState<string | null>(null);

  return (
    <div
      className="min-h-[calc(100vh-80px)] bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 relative overflow-hidden h-[813px]"
      data-oid="ntkw4hz"
    >

 
      <div
        className="pt-4 pb-6 px-6 text-[#444] w-full relative z-10"
        data-oid="w:tm0qp"
      >
        <div
          className="home-hero bg-transparent rounded-md px-[60px] pt-[40px] pb-[36px] w-[90%] max-w-[1100px] shadow-none flex flex-col gap-6 relative overflow-hidden mx-auto"
          data-oid="oes92qw"
        >
          {headline && (
            <h1
              className="m-0 font-black text-[var(--header-blue)] text-center relative z-[1] text-[40px]"
              data-oid="x_3t9uw"
            >
              {headline}
            </h1>
          )}
          {subtitle && (
            <div
              className="text-[#666] text-[16px] tracking-[3px] text-center relative z-[1]"
              data-oid="1y85vfz"
            >
              {subtitle}
            </div>
          )}
          <div
            className="grid grid-cols-2 gap-6 relative z-[1]"
            data-oid="offsvqz"
          >
            {features.map((item) => (
              <Button
                key={item.key}
                type="button"
                className="home-card rounded-md p-6 min-h-[120px] bg-white text-left cursor-default shadow-none transition-all duration-200 flex items-start gap-3 relative overflow-hidden hover:scale-[1.01]"
                onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = ((e.clientX - rect.left) / rect.width) * 100;
                  const y = ((e.clientY - rect.top) / rect.height) * 100;
                  e.currentTarget.style.setProperty("--mouse-x", `${x}%`);
                  e.currentTarget.style.setProperty("--mouse-y", `${y}%`);
                }}
                data-oid="x.0suef"
              >
                {item.icon && (
                  <span
                    className={`shrink-0 text-[24px] w-[44px] h-[44px] rounded-md bg-transparent flex items-center justify-center ${hoveredTitle === item.key ? 'text-[#6d28d9]' : 'text-blue-600'}`}
                    data-oid="86:iy6x"
                  >
                    {item.icon}
                  </span>
                )}
                <div
                  className="flex-1 flex flex-col gap-2.5"
                  data-oid="zh_91:s"
                >
                  <div
                    className="font-extrabold text-[20px] text-blue-600 hover:text-[#6d28d9] cursor-pointer inline-block w-max border-b-2 border-transparent hover:border-[#6d28d9]"
                    data-oid="783nk_d"
                    onClick={() => navigate(item.to)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') navigate(item.to); }}
                    onMouseEnter={() => setHoveredTitle(item.key)}
                    onMouseLeave={() => setHoveredTitle(null)}
                  >
                    {item.title}
                  </div>
                  <div
                    className="text-[#666] text-[14px] leading-[1.6]"
                    data-oid="9x878cx"
                  >
                    {item.desc}
                  </div>
                </div>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModuleHub;
