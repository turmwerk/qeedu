import React from "react";

interface AccountSectionProps {
  title: string;
  subtitle: string;
  children?: React.ReactNode;
  actions?: React.ReactNode;
}

const AccountSection: React.FC<AccountSectionProps> = ({ title, subtitle, actions, children }) => (
  <section className="account-section">
    <div className="account-section__header">
      <div>
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>
      {actions && <div className="account-section__actions">{actions}</div>}
    </div>
    {children}
  </section>
);

export default AccountSection;
