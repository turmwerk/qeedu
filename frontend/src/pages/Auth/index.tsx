import React, { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Footer from "@/layouts/MainLayout/components/Footer";

const AuthLayout: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [location.pathname]);

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 relative overflow-hidden flex items-center justify-center px-6 py-10"
      data-oid="n9saej-"
    >
      <div
        className="absolute inset-0 overflow-hidden pointer-events-none"
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
    </div>
  );
};

export default AuthLayout;
