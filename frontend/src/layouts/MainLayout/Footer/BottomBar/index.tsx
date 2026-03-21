import React, { useEffect, useState } from "react";
import { GithubOutlined } from "@ant-design/icons";
import { getRepoLastCommitTime } from "@/api/providers/github";

const BottomBar: React.FC = () => {
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
    } catch {
      return isoString;
    }
  };

  return (
    <div className="w-full border-t border-gray-200/30 dark:border-white/10 py-4 px-6">
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
      <div className="mx-auto max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-3 text-gray-500 dark:text-gray-400 text-sm">
        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
          <a
            href="https://github.com/dieWehmut/nju-edu-ai-system"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors github-wrap"
            aria-label="Open GitHub repository"
          >
            <GithubOutlined style={{ fontSize: 18 }} />
            <span className="sparkle s1" />
            <span className="sparkle s2" />
            <span className="sparkle s3" />
            <span className="sparkle s4" />
            <span className="sparkle s5" />
          </a>
          <div className="flex items-center gap-1.5">
            <span>Last updated:</span>
            <span className="font-mono">{lastCommitTime ? formatDate(lastCommitTime) : "..."}</span>
          </div>
          <span className="text-gray-300 dark:text-gray-600 hidden sm:inline-block">|</span>
          <div className="font-mono">Uptime: {uptime}</div>
        </div>
        <div className="font-medium opacity-80 tracking-wide">
          © 2026 nju-edu-ai-system. All Rights Reserved.
        </div>
      </div>
    </div>
  );
};

export default BottomBar;
