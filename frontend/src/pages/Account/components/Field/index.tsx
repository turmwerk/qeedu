import React from "react";

interface FieldProps {
  label: string;
  value?: React.ReactNode;
  hint?: React.ReactNode;
}

const Field: React.FC<FieldProps> = ({ label, value, hint }) => (
  <div className="account-field">
    <div className="account-field__label">{label}</div>
    <div className="account-field__value">{value || "未设置"}</div>
    {hint && <div className="account-field__hint">{hint}</div>}
  </div>
);

export default Field;
