import React, { useEffect, useState } from "react";

const BottomBar: React.FC = () => {
  const [uptime, setUptime] = useState<string>("0d 00h 00m 00s");

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

  return (
    <div className="w-full border-t border-gray-200/30 dark:border-white/10 py-4 px-6">
      <div className="mx-auto max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-3 text-gray-500 dark:text-gray-400 text-sm">
        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
          <div className="font-mono">Uptime: {uptime}</div>
        </div>
        <div className="font-medium opacity-80 tracking-wide">
          © 2026 Qeedu. All Rights Reserved.
        </div>
      </div>
    </div>
  );
};

export default BottomBar;
