import React from "react";

interface StatusCardProps {
  label: string;
  value: React.ReactNode;
  detail?: React.ReactNode;
}

const StatusCard: React.FC<StatusCardProps> = ({ label, value, detail }) => (
  <div className="account-status-card">
    <div className="account-status-card__label">{label}</div>
    <div className="account-status-card__value">{value}</div>
    {detail && <div className="account-status-card__detail">{detail}</div>}
  </div>
);

export default StatusCard;
