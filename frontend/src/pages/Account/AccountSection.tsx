import React from "react";

interface AccountSectionProps {
  title: string;
  subtitle: string;
  children?: React.ReactNode;
}

const AccountSection: React.FC<AccountSectionProps> = ({ title, subtitle, children }) => (
  <section className="workbench-surface rounded-lg border border-[var(--brand-border)] bg-[var(--surface-container)] p-5 shadow-[var(--brand-shadow)]">
    <div className="mb-5">
      <h1 className="text-2xl font-bold text-[var(--brand-text)]">{title}</h1>
      <p className="mt-2 text-sm text-[var(--brand-muted)]">{subtitle}</p>
    </div>
    {children}
  </section>
);

export default AccountSection;
