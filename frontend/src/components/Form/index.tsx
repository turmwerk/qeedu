import React, { useState } from 'react';
import styles from './style.module.scss';

export interface FormField {
  name: string;
  label: React.ReactNode;
  type?: 'text' | 'textarea' | 'number' | 'select' | 'file';
  placeholder?: string;
  defaultValue?: any;
  /** 当 type === 'select' 时提供选项 */
  options?: Array<{ label: string; value: string }>;
}

export interface FormProps {
  fields: FormField[];
  onSubmit: (values: Record<string, any>) => void;
  submitText?: React.ReactNode;
  /** 可选：覆盖表单根容器 class */
  className?: string;
  /** 可选：覆盖字段容器 class */
  fieldClassName?: string;
  /** 可选：覆盖提交按钮 class */
  submitClassName?: string;
  /** 可选：提交按钮内联样式 */
  submitStyle?: React.CSSProperties;
}

const Form: React.FC<FormProps> = ({ fields, onSubmit, submitText = '提交', className, fieldClassName, submitClassName, submitStyle }) => {
  const [values, setValues] = useState(() => {
    const v: Record<string, any> = {};
    fields.forEach(f => {
      v[f.name] = f.defaultValue ?? '';
    });
    return v;
  });

  const handleChange = (name: string, value: any) => {
    setValues(v => ({ ...v, [name]: value }));
  };

  return (
    <form className={className ? `${styles.form} ${className}` : styles.form} onSubmit={e => { e.preventDefault(); onSubmit(values); }}>
      {fields.map(f => (
        <div className={fieldClassName ? `${styles.field} ${fieldClassName}` : styles.field} key={f.name}>
          <label>{f.label}</label>
          {f.type === 'textarea' ? (
            <textarea
              value={values[f.name]}
              onChange={e => handleChange(f.name, e.target.value)}
              placeholder={f.placeholder}
              rows={4}
            />
          ) : f.type === 'select' ? (
            <select
              value={values[f.name]}
              onChange={e => handleChange(f.name, e.target.value)}
            >
              {(f.options || []).map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          ) : f.type === 'file' ? (
            <input
              type="file"
              onChange={e => handleChange(f.name, e.target.files && e.target.files[0])}
            />
          ) : (
            <input
              type={f.type || 'text'}
              value={values[f.name]}
              onChange={e => handleChange(f.name, f.type === 'number' ? Number(e.target.value) : e.target.value)}
              placeholder={f.placeholder}
            />
          )}
        </div>
      ))}
      <div className={styles.actions}>
        <button className={submitClassName ? `${styles.primary} ${submitClassName}` : styles.primary} type="submit" style={submitStyle}>{submitText}</button>
      </div>
    </form>
  );
};

export default Form;
