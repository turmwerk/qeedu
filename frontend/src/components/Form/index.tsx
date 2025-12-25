import React, { useState } from 'react';
import styles from './style.module.scss';

export interface FormField {
  name: string;
  label: React.ReactNode;
  type?: 'text' | 'textarea' | 'number';
  placeholder?: string;
  defaultValue?: any;
}

export interface FormProps {
  fields: FormField[];
  onSubmit: (values: Record<string, any>) => void;
  submitText?: React.ReactNode;
}

const Form: React.FC<FormProps> = ({ fields, onSubmit, submitText = '提交' }) => {
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
    <form className={styles.form} onSubmit={e => { e.preventDefault(); onSubmit(values); }}>
      {fields.map(f => (
        <div className={styles.field} key={f.name}>
          <label>{f.label}</label>
          {f.type === 'textarea' ? (
            <textarea
              value={values[f.name]}
              onChange={e => handleChange(f.name, e.target.value)}
              placeholder={f.placeholder}
              rows={4}
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
        <button className={styles.primary} type="submit">{submitText}</button>
      </div>
    </form>
  );
};

export default Form;
