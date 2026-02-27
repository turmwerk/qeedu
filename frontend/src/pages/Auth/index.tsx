import React, { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Footer from "@/layouts/MainLayout/components/Footer";
import FloatActions from "@/layouts/MainLayout/components/FloatActions";
import SnowLayer from "@/components/SnowLayer";
import StarsLayer from "@/components/StarsLayer";
import { getStoredTheme } from "@/utils/theme";
const AuthLayout: React.FC = () => {
  const location = useLocation();
  const isDark = getStoredTheme() === 'dark';

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [location.pathname]);

  return (
    <div
      className="auth-layout min-h-screen bg-[var(--brand-bg)] relative overflow-hidden flex items-center justify-center px-6 py-10"
      data-oid="n9saej-"
    >
      {/* 全屏雪花特效 */}
      <SnowLayer />
      {/* 深色主题独立星点背景 */}
      {isDark && <StarsLayer />}
      <div
        className="absolute inset-0 overflow-hidden pointer-events-none auth-decor"
        data-oid=".fza9ll"
      >
        <div
          className="absolute w-[600px] h-[600px] rounded-full bg-gradient-to-r from-purple-300/30 to-blue-300/30 blur-[120px] -top-48 -left-48 animate-[float_20s_ease-in-out_infinite]"
          data-oid="8i9qm59"
        />

        <div
          className="absolute w-[500px] h-[500px] rounded-full bg-gradient-to-r from-pink-300/30 to-purple-300/30 blur-[100px] top-1/4 -right-32 animate-[float_25s_ease-in-out_infinite_reverse]"
          data-oid="hf-_bb1"
        />

        <div
          className="absolute w-[400px] h-[400px] rounded-full bg-gradient-to-r from-blue-300/25 to-indigo-300/25 blur-[90px] bottom-0 left-1/3 animate-[float_22s_ease-in-out_infinite]"
          data-oid="ax:ih-t"
        />
      </div>
      <style data-oid="kh1-tpl">{`
        @keyframes float {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -30px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
      `}</style>
      <div
        className="relative z-10 w-full flex items-center justify-center"
        data-oid="_djr8t1"
      >
        <Outlet data-oid="v5m5e:5" />
      </div>
      <div className="absolute bottom-0 w-full z-20">
        <Footer />
      </div>
      <FloatActions />
    </div>
  );
};

export default AuthLayout;
