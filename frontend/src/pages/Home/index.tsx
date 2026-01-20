import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "@/components/Button";
import {
  ReadOutlined,
  ExperimentOutlined,
  ControlOutlined,
  TeamOutlined,
} from "@ant-design/icons";

const Home: React.FC = () => {
  const navigate = useNavigate();
  const modules = [
    {
      key: "study",
      title: "助学",
      desc: "自学导航、练习计划、随问随答。",
      to: "/study",
      icon: <ReadOutlined data-oid="r9i6-at" />,
    },
    {
      key: "teaching",
      title: "助教",
      desc: "试卷生成、大纲设计、作业批改与反馈。",
      to: "/teaching",
      icon: <ExperimentOutlined data-oid="4hschjv" />,
    },
    {
      key: "research",
      title: "助研",
      desc: "科研协作、资料整理、进度跟踪。",
      to: "/research",
      icon: <TeamOutlined data-oid="ga65l.j" />,
    },
    {
      key: "management",
      title: "助管",
      desc: "班级管理、通知发布、资料归档与跟进。",
      to: "/management",
      icon: <ControlOutlined data-oid="5f1:ofq" />,
    },
  ];

  return (
    <div
      className="min-h-[calc(100vh-80px)] bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 relative overflow-hidden h-[813px]"
      data-oid="ntkw4hz"
    >
      {/* 流动光球背景 */}
      <div
        className="absolute inset-0 overflow-hidden pointer-events-none"
        data-oid="-h928nq"
      >
        <div
          className="absolute w-[600px] h-[600px] rounded-full bg-gradient-to-r from-purple-300/30 to-blue-300/30 blur-[120px] -top-48 -left-48 animate-[float_20s_ease-in-out_infinite]"
          data-oid="o4udpzj"
        />

        <div
          className="absolute w-[500px] h-[500px] rounded-full bg-gradient-to-r from-pink-300/30 to-purple-300/30 blur-[100px] top-1/4 -right-32 animate-[float_25s_ease-in-out_infinite_reverse]"
          data-oid="9wdo1px"
        />

        <div
          className="absolute w-[400px] h-[400px] rounded-full bg-gradient-to-r from-blue-300/25 to-indigo-300/25 blur-[90px] bottom-0 left-1/3 animate-[float_22s_ease-in-out_infinite]"
          data-oid="7su1hr3"
        />
      </div>
      <style data-oid="fnt_9:h">{`
        @keyframes float {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -30px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        @keyframes float {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -30px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .home-card {
          position: relative;
        }
        .home-card::after {
          content: '';
          position: absolute;
          inset: -2px;
          border-radius: 20px;
          padding: 2px;
          background: linear-gradient(135deg, rgba(147, 51, 234, 0.6), rgba(236, 72, 153, 0.6), rgba(139, 92, 246, 0.6));
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        .home-card:hover::after {
          opacity: 1;
        }
        .home-card::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 20px;
          background: radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(147, 51, 234, 0.15), rgba(236, 72, 153, 0.1), transparent 40%);
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        .home-card:hover::before {
          opacity: 1;
        }
        @keyframes homeShimmer {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          50% { transform: translate(-5%, -5%) rotate(2deg); }
        }
      `}</style>
      <div
        className="pt-4 pb-6 px-6 text-[#444] w-full relative z-10"
        data-oid="w:tm0qp"
      >
        <div
          className="home-hero bg-white/40 backdrop-blur-[32px] rounded-[32px] px-[80px] pt-[48px] pb-[44px] w-[90%] max-w-[1100px] shadow-[0_20px_60px_rgba(147,51,234,0.25),0_0_0_1px_rgba(255,255,255,0.5)_inset] border border-white/30 flex flex-col gap-7 relative overflow-hidden mx-auto"
          data-oid="oes92qw"
        >
          <h1
            className="m-0 font-black bg-[linear-gradient(135deg,#1a1a1a_0%,#4b2a85_40%,#6236ff_80%,#8b5cf6_100%)] bg-clip-text text-transparent text-center relative z-[1] text-[50px]"
            data-oid="x_3t9uw"
          >
            nju-edu-ai-system
          </h1>
          <div
            className="text-[#666] text-[16px] tracking-[3px] text-center relative z-[1]"
            data-oid="1y85vfz"
          >
            南京大学教育大模型
          </div>
          <div
            className="flex items-center gap-3 bg-white/95 backdrop-blur-[16px] rounded-full px-4 py-3 border-2 border-[rgba(98,54,255,0.15)] shadow-[0_8px_24px_rgba(98,54,255,0.15),inset_0_1px_1px_rgba(255,255,255,0.8)] relative z-[1] transition-all duration-300 hover:border-[rgba(98,54,255,0.3)] hover:shadow-[0_12px_32px_rgba(98,54,255,0.25),inset_0_1px_1px_rgba(255,255,255,0.9)] hover:-translate-y-[1px] focus-within:border-[rgba(98,54,255,0.3)] focus-within:shadow-[0_12px_32px_rgba(98,54,255,0.25),inset_0_1px_1px_rgba(255,255,255,0.9)] focus-within:-translate-y-[1px]"
            data-oid="t4r.__n"
          >
            <span
              className="w-[38px] h-[38px] rounded-full bg-[linear-gradient(135deg,rgba(98,54,255,0.15),rgba(139,92,246,0.15))] text-[#6236ff] flex items-center justify-center font-bold text-[18px] shrink-0"
              aria-hidden="true"
              data-oid="7h8u1_3"
            >
              ≡
            </span>
            <input
              className="flex-1 border-0 bg-transparent outline-none text-[15px] text-[var(--brand-text)] placeholder:text-[#999]"
              placeholder="告诉我你想完成的任务（如：试卷设计流程 / 某功能怎么用）"
              type="text"
              aria-label="任务输入"
              data-oid="7kfv7p0"
            />

            <Button
              type="button"
              className="w-[42px] h-[42px] rounded-full border-0 bg-[linear-gradient(135deg,#6236ff_0%,#8b5cf6_100%)] text-white text-[20px] flex items-center justify-center shrink-0 shadow-[0_6px_16px_rgba(98,54,255,0.35)] transition hover:scale-105 hover:shadow-[0_8px_24px_rgba(98,54,255,0.45)]"
              aria-label="发送"
              data-oid="8t-zg1d"
            >
              →
            </Button>
          </div>
          <div
            className="grid grid-cols-2 gap-6 relative z-[1]"
            data-oid="offsvqz"
          >
            {modules.map((item) => (
              <Button
                key={item.key}
                type="button"
                className="home-card border border-white/40 rounded-[20px] p-8 min-h-[140px] bg-white/30 backdrop-blur-[16px] text-left cursor-pointer shadow-[0_8px_32px_rgba(147,51,234,0.15)] transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] flex items-start gap-3.5 relative overflow-hidden hover:-translate-y-1 hover:scale-[1.02] hover:shadow-[0_16px_48px_rgba(147,51,234,0.3),0_0_0_1px_rgba(147,51,234,0.2)_inset] hover:bg-white/50"
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
                    className="shrink-0 text-[32px] w-[48px] h-[48px] rounded-xl bg-gradient-to-br from-purple-100/80 to-blue-100/80 flex items-center justify-center shadow-[0_4px_12px_rgba(147,51,234,0.2)]"
                    style={{ color: "#6236ff" }}
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

export default Home;
