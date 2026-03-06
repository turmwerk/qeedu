import React from "react";

type LoaderProps = {
  size?: "xs" | "sm" | "md" | "lg";
  text?: React.ReactNode;
  subtext?: React.ReactNode;
  className?: string;
  centered?: boolean;
};

const sizeMap = { xs: 18, sm: 28, md: 44, lg: 68 } as const;
const borderMap = { xs: 2, sm: 2.5, md: 3, lg: 4 } as const;

const Loader: React.FC<LoaderProps> = ({
  size = "md",
  text,
  subtext,
  className = "",
  centered = false,
}) => {
  const ariaLabel = typeof text === "string" ? text : "加载中";
  const outer = sizeMap[size];
  const inner = Math.round(outer * 0.65);
  const bw = borderMap[size];

  return (
    <div className={`loader-root${centered ? " centered" : ""} ${className}`.trim()} role="status" aria-label={ariaLabel}>
      <style>{`
        .loader-root { display: inline-flex; }
        .loader-root.centered { display: flex; width: 100%; justify-content: center; }
        .loader-shell { display: inline-flex; flex-direction: column; align-items: center; justify-content: center; gap: 0.45rem; }
        .loader-rings { position: relative; display: flex; align-items: center; justify-content: center; }
        .loader-ring { position: absolute; border-style: solid; border-radius: 50%; }
        .loader-ring.outer {
          border-color: rgba(81,214,255,0.92) rgba(81,214,255,0.92) transparent transparent;
          box-shadow: 0 0 8px rgba(81,214,255,0.22);
          animation: loaderSpinCW 1.8s linear infinite;
        }
        .loader-ring.inner {
          border-color: transparent transparent rgba(255,161,95,0.92) rgba(255,161,95,0.92);
          box-shadow: 0 0 8px rgba(255,161,95,0.18);
          animation: loaderSpinCCW 2.6s linear infinite;
        }
        .loader-text { font-size: 14px; font-weight: 600; color: var(--text-primary, #374151); }
        .loader-subtext { font-size: 12px; color: var(--text-secondary, #6b7280); }
        @keyframes loaderSpinCW  { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes loaderSpinCCW { from { transform: rotate(0deg); } to { transform: rotate(-360deg); } }
        @media (prefers-reduced-motion: reduce) { .loader-ring { animation: none !important; } }
      `}</style>
      <div className="loader-shell">
        <div className="loader-rings" style={{ width: outer, height: outer }} aria-hidden="true">
          <span className="loader-ring outer" style={{ width: outer, height: outer, borderWidth: bw }} />
          <span className="loader-ring inner" style={{ width: inner, height: inner, borderWidth: bw }} />
        </div>
        {text ? <div className="loader-text">{text}</div> : null}
        {subtext ? <div className="loader-subtext">{subtext}</div> : null}
      </div>
    </div>
  );
};

export default Loader;