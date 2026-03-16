import React, { useEffect, useState } from "react";
import { GithubOutlined } from "@ant-design/icons";
import { getRepoLastCommitTime } from "@/api/providers/github";

const Footer: React.FC = () => {
  const [lastCommitTime, setLastCommitTime] = useState<string | null>(null);
  const [uptime, setUptime] = useState<string>("0d 00h 00m 00s");

  useEffect(() => {
    const fetchTime = async () => {
      const time = await getRepoLastCommitTime();
      setLastCommitTime(time);
    };
    fetchTime();
  }, []);

  // 初始时间：2025-12-24 21:00 北京时间 == 2025-12-24T13:00:00Z
  const initialUTC = Date.UTC(2025, 11, 24, 13, 0, 0);

  const formatUptime = (ms: number) => {
    if (ms <= 0) return "0d 00h 00m 00s";
    let s = Math.floor(ms / 1000);
    const days = Math.floor(s / 86400);
    s -= days * 86400;
    const hours = Math.floor(s / 3600);
    s -= hours * 3600;
    const minutes = Math.floor(s / 60);
    const seconds = s % 60;
    const pad2 = (n: number) => n.toString().padStart(2, "0");
    return `${days}d ${pad2(hours)}h ${pad2(minutes)}m ${pad2(seconds)}s`;
  };

  useEffect(() => {
    const update = () => {
      const now = Date.now();
      const diff = Math.max(0, now - initialUTC);
      setUptime(formatUptime(diff));
    };
    update();
    const t = setInterval(update, 1000);
    return () => clearInterval(t);
  }, []);

  const formatDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      const pad = (n: number) => n.toString().padStart(2, "0");
      const yyyy = date.getFullYear();
      const mm = pad(date.getMonth() + 1);
      const dd = pad(date.getDate());
      const hh = pad(date.getHours());
      const min = pad(date.getMinutes());
      return `${yyyy}-${mm}-${dd} ${hh}:${min}`;
    } catch (e) {
      return isoString;
    }
  };

  return (
    <footer className="w-full pt-6 pb-2 mt-auto z-10 relative">
      <div className="flex flex-col items-center justify-center space-y-0 text-gray-500 text-sm">
        <style>{` 
          .github-wrap{position:relative;display:inline-block}
          .github-wrap .sparkle{position:absolute;width:6px;height:6px;border-radius:999px;background:linear-gradient(90deg,#ffd166,#ff6b6b);opacity:0;transform:translate(0,0) scale(0.6)}
          .github-wrap .sparkle.s1{--dx:-14px;--dy:-18px;--delay:0s}
          .github-wrap .sparkle.s2{--dx:10px;--dy:-16px;--delay:0.12s}
          .github-wrap .sparkle.s3{--dx:18px;--dy:2px;--delay:0.24s}
          .github-wrap .sparkle.s4{--dx:8px;--dy:18px;--delay:0.36s}
          .github-wrap .sparkle.s5{--dx:-10px;--dy:10px;--delay:0.48s}
          .github-wrap:hover .sparkle{animation:sparkle 900ms cubic-bezier(.22,.9,.34,1) var(--delay) infinite}
          @keyframes sparkle{0%{opacity:0;transform:translate(0,0) scale(.6)}20%{opacity:1;transform:translate(calc(var(--dx)/4),calc(var(--dy)/4)) scale(1)}100%{opacity:0;transform:translate(var(--dx),var(--dy)) scale(1.2)}}
        `}</style>
        <div className="flex flex-col sm:flex-row items-center gap-0 text-center sm:text-left">
          <div className="flex items-center gap-1">
            <a
              href="https://github.com/dieWehmut/nju-edu-ai-system"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-700 transition-colors github-wrap"
              aria-label="Open GitHub repository"
            >
              <GithubOutlined style={{ fontSize: 18 }} />
              <span className="sparkle s1" style={{ ['--dx' as any]: '-14px', ['--dy' as any]: '-18px', ['--delay' as any]: '0s' }} />
              <span className="sparkle s2" style={{ ['--dx' as any]: '10px', ['--dy' as any]: '-16px', ['--delay' as any]: '0.12s' }} />
              <span className="sparkle s3" style={{ ['--dx' as any]: '18px', ['--dy' as any]: '2px', ['--delay' as any]: '0.24s' }} />
              <span className="sparkle s4" style={{ ['--dx' as any]: '8px', ['--dy' as any]: '18px', ['--delay' as any]: '0.36s' }} />
              <span className="sparkle s5" style={{ ['--dx' as any]: '-10px', ['--dy' as any]: '10px', ['--delay' as any]: '0.48s' }} />
            </a>
            <div className="flex items-center gap-1">
              <span>Last updated:</span>
              <span className="font-mono">{lastCommitTime ? formatDate(lastCommitTime) : "加载中..."}</span>
            </div>
          </div>
          <span className="text-gray-300 hidden sm:inline-block">|</span>
          <div className="font-mono">Uptime:{uptime}</div>
        </div>
        <div className="font-medium opacity-80 tracking-wide">
          © 2026 nju-edu-ai-system.All Rights Reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
