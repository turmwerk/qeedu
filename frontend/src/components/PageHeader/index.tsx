import React from 'react';

type Props = {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  icon?: React.ReactNode;
  children?: React.ReactNode;
};

const PageHeader: React.FC<Props> = ({ title, subtitle, icon, children }) => {
  return (
    <div className="relative flex justify-center items-center mb-5 py-1.5">
      <div className="text-center">
        {title && (
          <h2 className="text-[var(--brand-accent)] font-bold m-0 flex items-center gap-2 justify-center">
            {icon && <span className="flex items-center text-[20px] text-[var(--brand-accent)]">{icon}</span>}
            {title}
          </h2>
        )}
        {subtitle && <div className="text-[#666] mt-1.5">{subtitle}</div>}
      </div>
      <div className="absolute right-0 flex gap-2 items-center z-[2]">{children}</div>
    </div>
  );
};

export default PageHeader;
