import React from "react";
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
          className="home-hero bg-transparent rounded-md px-[60px] pt-[40px] pb-[36px] w-[90%] max-w-[1100px] shadow-none border border-gray-200 flex flex-col gap-6 relative overflow-hidden mx-auto"
          data-oid="oes92qw"
        >
          {headline && (
            <h1
              className="m-0 font-black text-[#111] text-center relative z-[1] text-[40px]"
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
                className="home-card border border-gray-200 rounded-md p-6 min-h-[120px] bg-white text-left cursor-pointer shadow-none transition-all duration-200 flex items-start gap-3 relative overflow-hidden hover:-translate-y-0.5 hover:scale-[1.01]"
                onClick={() => navigate(item.to)}
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
                    className="shrink-0 text-[24px] w-[44px] h-[44px] rounded-md bg-gray-100 flex items-center justify-center text-gray-700"
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
                    className="font-extrabold text-[20px] bg-[linear-gradient(135deg,#1a1a1a,#4b2a85)] bg-clip-text text-transparent"
                    data-oid="783nk_d"
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
