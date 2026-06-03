import React from "react";
import AccountSection from "./AccountSection";

interface PlaceholderProps {
  title: string;
  subtitle: string;
  items: string[];
}

const Placeholder: React.FC<PlaceholderProps> = ({ title, subtitle, items }) => (
  <AccountSection title={title} subtitle={subtitle}>
    <div className="grid gap-3 sm:grid-cols-2">
      {items.map((item) => (
        <div key={item} className="rounded-lg border border-[var(--brand-border)] bg-[var(--surface-container-low)] p-4 text-sm text-[var(--brand-text)]">
          {item}
        </div>
      ))}
    </div>
  </AccountSection>
);

export default Placeholder;
