import React from "react";

type PageShellProps = {
  children: React.ReactNode;
  contentClassName?: string;
};

const PageShell: React.FC<PageShellProps> = ({ children, contentClassName }) => {
  const contentClass = contentClassName ?? "pt-3 pb-6 px-6";
  return (
    <div
      className="relative h-[calc(100vh-80px)] min-h-0 flex flex-col bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 overflow-hidden"
      data-oid="syllabus-shell"
    >
      <div
        className="absolute inset-0 overflow-hidden pointer-events-none"
        data-oid="syllabus-shell-bg"
      >
        <div
          className="absolute w-[600px] h-[600px] rounded-full bg-gradient-to-r from-purple-300/30 to-blue-300/30 blur-[120px] -top-48 -left-48 animate-[float_20s_ease-in-out_infinite]"
        />

        <div
          className="absolute w-[500px] h-[500px] rounded-full bg-gradient-to-r from-pink-300/30 to-purple-300/30 blur-[100px] top-1/4 -right-32 animate-[float_25s_ease-in-out_infinite_reverse]"
        />

        <div
          className="absolute w-[400px] h-[400px] rounded-full bg-gradient-to-r from-blue-300/25 to-indigo-300/25 blur-[90px] bottom-0 left-1/3 animate-[float_22s_ease-in-out_infinite]"
        />
      </div>
      <style>{`
        @keyframes float {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -30px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
      `}</style>
      <div className={`relative z-10 flex-1 min-h-0 ${contentClass}`}>
        {children}
      </div>
    </div>
  );
};

export default PageShell;
