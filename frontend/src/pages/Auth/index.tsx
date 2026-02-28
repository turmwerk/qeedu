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
      {/* Auth 页面主题样式 */}
      <style>{`
        /* Auth layout 背景 (light) */
        .auth-layout {
          background:
            radial-gradient(44rem 34rem at 18% 28%, rgba(255, 150, 190, 0.52) 0%, rgba(255, 150, 190, 0) 68%),
            radial-gradient(38rem 30rem at 82% 72%, rgba(195, 130, 255, 0.45) 0%, rgba(195, 130, 255, 0) 66%),
            radial-gradient(32rem 26rem at 62% 8%, rgba(255, 210, 230, 0.5) 0%, rgba(255, 210, 230, 0) 64%),
            radial-gradient(28rem 22rem at 5% 80%, rgba(180, 155, 255, 0.38) 0%, rgba(180, 155, 255, 0) 60%),
            linear-gradient(135deg, #fce4f0 0%, #f3d6ff 45%, #dce4ff 100%) !important;
          background-color: #fce4f0 !important;
        }
        [data-theme="dark"] .auth-layout {
          background:
            radial-gradient(70rem 55rem at 10% 20%, rgba(90, 60, 200, 0.30) 0%, rgba(90, 60, 200, 0) 65%),
            radial-gradient(55rem 45rem at 85% 75%, rgba(30, 80, 180, 0.22) 0%, rgba(30, 80, 180, 0) 62%),
            linear-gradient(180deg, #152236 0%, #1a2d48 100%) !important;
          background-color: #152236 !important;
        }
        /* Auth 面板 – 毛玻璃 (light) */
        .auth-panel {
          background: rgba(255, 255, 255, 0.60) !important;
          border: 0 none transparent !important;
          box-shadow:
            0 12px 38px rgba(120, 90, 200, 0.16),
            inset 0 1px 0 rgba(255, 255, 255, 0.78),
            inset 0 -1px 0 rgba(255, 255, 255, 0.36) !important;
          -webkit-backdrop-filter: blur(44px) saturate(215%);
          backdrop-filter: blur(44px) saturate(215%);
        }
        [data-theme="dark"] .auth-panel {
          background: rgba(255, 255, 255, 0.11) !important;
          box-shadow:
            0 12px 38px rgba(0, 0, 0, 0.52),
            inset 0 1px 0 rgba(255, 255, 255, 0.16),
            inset 0 -1px 0 rgba(255, 255, 255, 0.08) !important;
        }
        /* Auth 提交按钮 dark 样式 */
        [data-theme="dark"] .auth-panel button[type="submit"] {
          background-color: var(--auth-btn-bg) !important;
          color: var(--auth-btn-text) !important;
          border: none !important;
          box-shadow: 0 6px 16px rgba(30, 64, 175, 0.35) !important;
        }
        [data-theme="dark"] .auth-panel button[type="submit"]:hover {
          background-color: var(--auth-btn-hover) !important;
        }
        [data-theme="dark"] .auth-panel button[type="submit"]:disabled {
          opacity: 0.7;
        }
        /* Tab 下划线 dark 可见 */
        [data-theme="dark"] .auth-panel .tab-underline {
          background-color: var(--brand-accent) !important;
        }
        [data-theme="dark"] .auth-eye-tooltip {
          background: #ffffff !important;
          color: #0f172a !important;
          border: 1px solid #ffffff !important;
          font-weight: 500;
          opacity: 1 !important;
          -webkit-backdrop-filter: none !important;
          backdrop-filter: none !important;
        }
        [data-theme="dark"] .auth-eye-tooltip-arrow {
          border-top-color: #ffffff !important;
          opacity: 1 !important;
        }
        /* Auth 输入框：autofill 保持圆角与背景一致，避免方形覆盖 */
        .auth-panel .auth-field-input {
          border-radius: inherit;
        }
        .auth-panel .auth-field-input:-webkit-autofill,
        .auth-panel .auth-field-input:-webkit-autofill:hover,
        .auth-panel .auth-field-input:-webkit-autofill:focus,
        .auth-panel .auth-field-input:-webkit-autofill:active {
          -webkit-text-fill-color: var(--brand-text) !important;
          transition: background-color 9999s ease-out 0s;
          -webkit-box-shadow: 0 0 0 1000px #ffffff inset !important;
          box-shadow: 0 0 0 1000px #ffffff inset !important;
          border-radius: inherit !important;
          background-clip: padding-box !important;
        }
        [data-theme="dark"] .auth-panel .auth-field-input:-webkit-autofill,
        [data-theme="dark"] .auth-panel .auth-field-input:-webkit-autofill:hover,
        [data-theme="dark"] .auth-panel .auth-field-input:-webkit-autofill:focus,
        [data-theme="dark"] .auth-panel .auth-field-input:-webkit-autofill:active {
          -webkit-text-fill-color: #f8fafc !important;
          -webkit-box-shadow: 0 0 0 1000px rgba(255, 255, 255, 0.12) inset !important;
          box-shadow: 0 0 0 1000px rgba(255, 255, 255, 0.12) inset !important;
        }
      `}</style>
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
