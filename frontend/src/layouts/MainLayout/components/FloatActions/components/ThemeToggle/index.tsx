import React, { useEffect, useState } from "react";
import FloatingButton from "@/components/FloatingButton";
import { getStoredTheme, toggleTheme } from "@/utils/theme";

const ThemeToggle: React.FC = () => {
  const [theme, setTheme] = useState(getStoredTheme());

  useEffect(() => {
    const handler = () => setTheme(getStoredTheme());
    // keep theme state in sync if other tabs change it
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);

  const handleToggle = () => {
    const next = toggleTheme();
    setTheme(next);
  };

  const Sun = (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="leading-none">
      <path d="M12 4V2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 22v-2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4.93 4.93L3.51 3.51" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M20.49 20.49l-1.42-1.42" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 12H2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M22 12h-2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4.93 19.07l-1.42 1.42" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M20.49 3.51l-1.42 1.42" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );

  const Moon = (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="leading-none">
      <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );

  return (
    <FloatingButton
      onClick={handleToggle}
      visible={true}
      icon={theme === 'dark' ? Sun : Moon}
      ariaLabel="切换主题"
      title="切换主题"
      size={40}
      shape="rounded-lg"
      className="bg-white/0" // let CSS variables control bg
      hoverClassName=""
    />
  );
};

export default ThemeToggle;
