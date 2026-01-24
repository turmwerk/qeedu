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
    <div
      className="relative min-h-[calc(100vh-80px)] bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 overflow-hidden"
      data-oid="jvx5jq-"
    >
      <div
        className="absolute inset-0 overflow-hidden pointer-events-none"
        data-oid="g:m0mwn"
      >
        <div
          className="modulehub-blob absolute w-[600px] h-[600px] rounded-full bg-gradient-to-r from-purple-300/30 to-blue-300/30 blur-[120px] -top-48 -left-48 animate-[float_20s_ease-in-out_infinite]"
          data-oid="r2g3xok"
        />

        <div
          className="modulehub-blob absolute w-[500px] h-[500px] rounded-full bg-gradient-to-r from-pink-300/30 to-purple-300/30 blur-[100px] top-1/4 -right-32 animate-[float_25s_ease-in-out_infinite_reverse]"
          data-oid="8uwym7x"
        />

        <div
          className="modulehub-blob absolute w-[400px] h-[400px] rounded-full bg-gradient-to-r from-blue-300/25 to-indigo-300/25 blur-[90px] bottom-0 left-1/3 animate-[float_22s_ease-in-out_infinite]"
          data-oid="7pyzf-d"
        />
      </div>
      <style data-oid="jf9g2yp">{`
        .modulehub-blob { will-change: transform; }
        @media (prefers-reduced-motion: reduce) {
          .modulehub-blob { animation: none !important; }
        }
        @keyframes float {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -30px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        @keyframes aurora {
          0% { transform: translateX(-10%) rotate(0deg); opacity: 0.6; }
          50% { transform: translateX(10%) rotate(2deg); opacity: 0.9; }
          100% { transform: translateX(-10%) rotate(0deg); opacity: 0.6; }
        }
        @keyframes shine {
          0% { transform: translateX(-120%); opacity: 0; }
          20% { opacity: 1; }
          100% { transform: translateX(120%); opacity: 0; }
        }
      `}</style>
      <div className="pt-4 pb-6 px-6 relative z-10" data-oid="rbp28vw">
        <div className="relative max-w-[1400px] mx-auto" data-oid="rof96vp">
          <div
            className="absolute -inset-6 rounded-[32px] bg-gradient-to-br from-purple-300/30 via-pink-300/20 to-blue-300/30 blur-[40px] opacity-80"
            data-oid=".ro1f_:"
          />
          <div
            className="absolute -inset-8 rounded-[36px] bg-[conic-gradient(from_90deg_at_50%_50%,rgba(99,102,241,0.18),rgba(236,72,153,0.18),rgba(139,92,246,0.18),rgba(99,102,241,0.18))] blur-[60px] opacity-70 animate-[aurora_14s_ease-in-out_infinite]"
            data-oid="bssj9tl"
          />

          <div
            className="relative bg-white/40 backdrop-blur-[32px] rounded-[28px] px-[80px] pt-10 pb-9 shadow-[0_20px_60px_rgba(147,51,234,0.25),0_0_40px_rgba(255,255,255,0.2)_inset] flex flex-col gap-6"
            data-oid="r38wtf:"
          >
            <div className="flex flex-col gap-2.5" data-oid="5i.4egr">
              <h1
                className="m-0 text-[38px] leading-[1.2] font-black bg-[linear-gradient(135deg,#1a1a1a_0%,#4b2a85_40%,#6236ff_100%)] bg-clip-text text-transparent"
                data-oid="i9hr92v"
              >
                {headline}
              </h1>
              <div
                className="text-[#666] text-[16px] tracking-[2px]"
                data-oid="b04nie."
              >
                {subtitle}
              </div>
            </div>

            <div
              className="flex items-center gap-3 bg-white/95 backdrop-blur-[16px] rounded-full px-4 py-3 border-2 border-purple-200/50 shadow-[0_8px_24px_rgba(147,51,234,0.15)] transition-all duration-300 hover:border-purple-300 focus-within:border-purple-300"
              data-oid=".sgcze_"
            >
              <span
                className="w-[38px] h-[38px] rounded-full bg-gradient-to-br from-purple-100 to-blue-100 text-purple-600 flex items-center justify-center font-bold text-[18px] shrink-0"
                data-oid="b80asiq"
              >
                ≡
              </span>
              <input
                className="flex-1 border-0 bg-transparent outline-none text-[15px] placeholder:text-gray-400"
                placeholder={placeholder}
                type="text"
                data-oid="f6wp5:v"
              />

              <Button
                type="button"
                className="w-[42px] h-[42px] rounded-full border-0 bg-gradient-to-br from-purple-600 to-blue-600 text-white text-[20px] flex items-center justify-center shrink-0 shadow-[0_6px_16px_rgba(147,51,234,0.35)] transition hover:scale-105"
                data-oid="po36joe"
              >
                →
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-6" data-oid="h-8po4_">
              {features.map((feature) => (
                <Button
                  key={feature.key}
                  type="button"
                  className="group relative overflow-hidden rounded-[20px] p-8 min-h-[140px] bg-white/30 backdrop-blur-[16px] text-left cursor-pointer shadow-[0_8px_32px_rgba(147,51,234,0.15)] transition-all duration-300 flex items-start gap-3.5 hover:-translate-y-1 hover:shadow-[0_14px_36px_rgba(99,102,241,0.22),0_0_18px_rgba(236,72,153,0.12),0_0_24px_rgba(139,92,246,0.14)] hover:bg-white/50"
                  onClick={() => navigate(feature.to)}
                  data-oid="e4tl.v3"
                >
                  <span
                    className="pointer-events-none absolute -inset-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    data-oid="color-glow"
                  >
                    <span className="absolute inset-0 rounded-[24px] bg-[radial-gradient(circle_at_20%_20%,rgba(99,102,241,0.22),transparent_65%),radial-gradient(circle_at_80%_30%,rgba(236,72,153,0.2),transparent_65%),radial-gradient(circle_at_40%_80%,rgba(139,92,246,0.18),transparent_70%)] blur-[16px]" />
                  </span>
                  <span
                    className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.65),transparent_55%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    data-oid="d2q7rxo"
                  />
                  <span
                    className="pointer-events-none absolute left-0 top-0 h-[2px] w-full bg-gradient-to-r from-transparent via-white/90 to-transparent translate-x-[-120%] opacity-0 group-hover:opacity-100 group-hover:animate-[shine_1.2s_ease-in-out]"
                    data-oid="sf5u0sr"
                  />
                  {feature.icon && (
                    <span
                      className="shrink-0 text-[32px] w-[48px] h-[48px] rounded-xl bg-gradient-to-br from-purple-100/80 to-blue-100/80 flex items-center justify-center shadow-[0_4px_12px_rgba(147,51,234,0.2)] text-purple-600"
                      data-oid="fqlu27n"
                    >
                      {feature.icon}
                    </span>
                  )}
                  <div
                    className="flex-1 flex flex-col gap-2.5"
                    data-oid="pl_givy"
                  >
                    <div
                      className="font-extrabold text-[20px] bg-[linear-gradient(135deg,#1a1a1a,#4b2a85)] bg-clip-text text-transparent"
                      data-oid="98-45rb"
                    >
                      {feature.title}
                    </div>
                    <div
                      className="text-gray-600 text-[14px] leading-[1.6]"
                      data-oid="mvgeymd"
                    >
                      {feature.desc}
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModuleHub;
