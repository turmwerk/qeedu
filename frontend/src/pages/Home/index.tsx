import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ReadOutlined, ExperimentOutlined, ControlOutlined, TeamOutlined } from '@ant-design/icons';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const modules = [
    {
      key: 'study',
      title: '助学',
      desc: '自学导航、练习计划、随问随答。',
      to: '/study',
      icon: <ReadOutlined />,
    },
    {
      key: 'teaching',
      title: '助教',
      desc: '试卷生成、大纲设计、作业批改与反馈。',
      to: '/teaching',
      icon: <ExperimentOutlined />,
    },
    {
      key: 'research',
      title: '助研',
      desc: '科研协作、资料整理、进度跟踪。',
      to: '/research',
      icon: <TeamOutlined />,
    },
    {
      key: 'management',
      title: '助管',
      desc: '班级管理、通知发布、资料归档与跟进。',
      to: '/management',
      icon: <ControlOutlined />,
    },
  ];

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-[radial-gradient(circle_at_20%_30%,rgba(147,51,234,0.12)_0%,transparent_50%),radial-gradient(circle_at_80%_70%,rgba(59,130,246,0.12)_0%,transparent_50%),radial-gradient(circle_at_50%_50%,rgba(236,72,153,0.08)_0%,transparent_50%)]">
      <style>{`
        .home-hero::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background:
            radial-gradient(circle at 30% 40%, rgba(147, 51, 234, 0.15) 0%, transparent 25%),
            radial-gradient(circle at 70% 60%, rgba(59, 130, 246, 0.15) 0%, transparent 25%);
          animation: homeShimmer 8s ease-in-out infinite;
          pointer-events: none;
        }
        .home-card::before {
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
        .home-card:hover::before { opacity: 1; }
        @keyframes homeShimmer {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          50% { transform: translate(-5%, -5%) rotate(2deg); }
        }
      `}</style>
      <div className="p-6 text-[#444] w-full">
        <div className="home-hero bg-white/75 backdrop-blur-[24px] rounded-[32px] px-[80px] pt-[48px] pb-[44px] w-[90%] max-w-[1100px] shadow-[0_20px_50px_rgba(75,42,133,0.15),inset_0_1px_1px_rgba(255,255,255,0.9),0_0_0_1px_rgba(75,42,133,0.08)] flex flex-col gap-7 relative overflow-hidden mx-auto">
          <h1 className="m-0 text-[42px] leading-[1.2] font-black bg-[linear-gradient(135deg,#1a1a1a_0%,#4b2a85_40%,#6236ff_80%,#8b5cf6_100%)] bg-clip-text text-transparent text-center relative z-[1]">nju-edu-ai-system</h1>
          <div className="text-[#666] text-[16px] tracking-[3px] text-center relative z-[1]">南京大学教育大模型</div>
          <div className="flex items-center gap-3 bg-white/95 backdrop-blur-[16px] rounded-full px-4 py-3 border-2 border-[rgba(98,54,255,0.15)] shadow-[0_8px_24px_rgba(98,54,255,0.15),inset_0_1px_1px_rgba(255,255,255,0.8)] relative z-[1] transition-all duration-300 hover:border-[rgba(98,54,255,0.3)] hover:shadow-[0_12px_32px_rgba(98,54,255,0.25),inset_0_1px_1px_rgba(255,255,255,0.9)] hover:-translate-y-[1px] focus-within:border-[rgba(98,54,255,0.3)] focus-within:shadow-[0_12px_32px_rgba(98,54,255,0.25),inset_0_1px_1px_rgba(255,255,255,0.9)] focus-within:-translate-y-[1px]">
            <span className="w-[38px] h-[38px] rounded-full bg-[linear-gradient(135deg,rgba(98,54,255,0.15),rgba(139,92,246,0.15))] text-[#6236ff] flex items-center justify-center font-bold text-[18px] shrink-0" aria-hidden="true">≡</span>
            <input
              className="flex-1 border-0 bg-transparent outline-none text-[15px] text-[var(--brand-text)] placeholder:text-[#999]"
              placeholder="告诉我你想完成的任务（如：试卷设计流程 / 某功能怎么用）"
              type="text"
              aria-label="任务输入"
            />
            <button type="button" className="w-[42px] h-[42px] rounded-full border-0 bg-[linear-gradient(135deg,#6236ff_0%,#8b5cf6_100%)] text-white text-[20px] cursor-pointer flex items-center justify-center shrink-0 shadow-[0_6px_16px_rgba(98,54,255,0.35)] transition hover:scale-105 hover:shadow-[0_8px_24px_rgba(98,54,255,0.45)]" aria-label="发送">
              →
            </button>
          </div>
          <div className="grid grid-cols-2 gap-6 relative z-[1]">
            {modules.map((item) => (
              <button
                key={item.key}
                type="button"
                className="home-card border border-[rgba(98,54,255,0.1)] rounded-[20px] p-8 min-h-[140px] bg-white/85 backdrop-blur-[12px] text-left cursor-pointer shadow-[0_8px_24px_rgba(98,54,255,0.12),inset_0_1px_1px_rgba(255,255,255,0.8)] transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] flex items-start gap-3.5 relative overflow-hidden hover:-translate-y-1 hover:scale-[1.02] hover:shadow-[0_16px_40px_rgba(98,54,255,0.25),inset_0_1px_1px_rgba(255,255,255,0.9)] hover:border-[rgba(98,54,255,0.25)] hover:bg-white/95"
                onClick={() => navigate(item.to)}
              >
                {item.icon && <span className="shrink-0 text-[28px] bg-[linear-gradient(135deg,#6236ff,#8b5cf6)] bg-clip-text text-transparent flex items-center mt-0.5">{item.icon}</span>}
                <div className="flex-1 flex flex-col gap-2.5">
                  <div className="font-extrabold text-[20px] bg-[linear-gradient(135deg,#1a1a1a,#4b2a85)] bg-clip-text text-transparent">{item.title}</div>
                  <div className="text-[#666] text-[14px] leading-[1.6]">{item.desc}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
