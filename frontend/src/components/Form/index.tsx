import React, { useState } from 'react';
import styles from './style.module.scss';

export interface FormField {
  name: string;
  label: React.ReactNode;
  type?: 'text' | 'password' | 'textarea' | 'number' | 'select' | 'file' | 'range' | 'checkbox';
  placeholder?: string;
  defaultValue?: any;
  /** 当 type === 'select' 时提供选项 */
  options?: Array<{ label: string; value: string }>;
  /** 最小值（用于 number/range） */
  min?: number;
  /** 最大值（用于 number/range） */
  max?: number;
  /** 步长（用于 number/range） */
  step?: number;
  /** 文件是否允许多选（用于 file） */
  multiple?: boolean;
  /** 文件 accept 属性（用于 file） */
  accept?: string;
  /** textarea 行数 */
  rows?: number;
  /** 在 Grid 布局中占据的列数 (默认为 1) */
  span?: number;
  /** 自定义渲染函数，覆盖默认渲染 */
  render?: (value: any, onChange: (v: any) => void) => React.ReactNode;
}

export interface FormProps {
  fields: FormField[];
  onSubmit: (values: Record<string, any>) => void;
  submitText?: React.ReactNode;
  /** 提交中状态 */
  submitLoading?: boolean;
  /** 提交中展示文案 */
  submitLoadingText?: React.ReactNode;
  /** 禁用提交按钮 */
  submitDisabled?: boolean;
  /** 可选：覆盖表单根容器 class */
  className?: string;
  /** 可选：覆盖字段容器 class */
  fieldClassName?: string;
  /** 可选：覆盖提交按钮 class */
  submitClassName?: string;
  /** 可选：提交按钮内联样式 */
  submitStyle?: React.CSSProperties;
  /** 表单模式：default=默认垂直堆叠, table=类似Excel的格网布局 */
  mode?: 'default' | 'table';
}

const Form: React.FC<FormProps> = ({
  fields,
  onSubmit,
  submitText = '提交',
  submitLoading,
  submitLoadingText,
  submitDisabled,
  className,
  fieldClassName,
  submitClassName,
  submitStyle,
  mode = 'default',
}) => {
  const [values, setValues] = useState(() => {
    const v: Record<string, any> = {};
    fields.forEach(f => {
      if (f.type === 'checkbox') v[f.name] = f.defaultValue ?? false;
      else if (f.type === 'file' && f.multiple) v[f.name] = f.defaultValue ?? [];
      else v[f.name] = f.defaultValue ?? '';
    });
    return v;
  });

  const handleChange = (name: string, value: any) => {
    setValues(v => ({ ...v, [name]: value }));
  };

  const rootClass = mode === 'table' ? styles.tableForm : styles.form;
  const itemClass = mode === 'table' ? styles.tableField : styles.field;

  return (
    <form className={className ? `${rootClass} ${className}` : rootClass} onSubmit={e => { e.preventDefault(); onSubmit(values); }}>
      {fields.map(f => (
        <div 
          className={fieldClassName ? `${itemClass} ${fieldClassName}` : itemClass} 
          key={f.name}
          style={f.span ? { gridColumn: `span ${f.span}` } : undefined}
        >
          <label>{f.label}</label>
          {f.render ? (
            f.render(values[f.name], (v: any) => handleChange(f.name, v))
          ) : f.type === 'textarea' ? (
            <textarea
              value={values[f.name]}
              onChange={e => handleChange(f.name, e.target.value)}
              placeholder={f.placeholder}
              rows={f.rows || 4}
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
            <div className={styles.fileWrap}>
              <div className={styles.fileButtonWrap}>
                <label className={styles.fileButton}>
                  <span className={styles.fileIcon}>📂</span> 点击上传资料
                  <input
                    type="file"
                    multiple={!!f.multiple}
                    accept={f.accept}
                    onChange={e => {
                      const files = e.target.files;
                      if (!files?.length) return;
                      // if (!files) return handleChange(f.name, f.multiple ? [] : null);
                      if (f.multiple) {
                        const arr = Array.from(files);
                        const current = values[f.name] || [];
                        handleChange(f.name, [...current, ...arr]);
                        e.target.value = '';
                      } else {
                        handleChange(f.name, files[0]);
                      }
                    }}
                  />
                </label>
                <div className={styles.fileHint}>{f.placeholder || '支持 PDF, Word'}</div>
              </div>
              {values[f.name] && (
                <div className={styles.fileList}>
                  {(Array.isArray(values[f.name]) ? values[f.name] : [values[f.name]]).map((file: any, idx: number) => (
                    <div key={idx} className={styles.fileItem}>
                      <span className={styles.fileName}>{file.name}</span>
                      <span className={styles.fileSize}>{file.size ? (file.size / 1024).toFixed(1) + 'KB' : ''}</span>
                      <button
                        type="button"
                        className={styles.fileRemove}
                        onClick={() => {
                          if (Array.isArray(values[f.name])) {
                            const newFiles = values[f.name].filter((_: any, i: number) => i !== idx);
                            handleChange(f.name, newFiles);
                          } else {
                            handleChange(f.name, '');
                          }
                        }}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            f.type === 'range' ? (
              <div className={styles.rangeWrap}>
                <input
                  type="range"
                  min={f.min}
                  max={f.max}
                  step={f.step}
                  value={values[f.name]}
                  onChange={e => handleChange(f.name, Number(e.target.value))}
                />
                <div className={styles.rangeValue}>{values[f.name]}</div>
              </div>
            ) : f.type === 'checkbox' ? (
              <input
                type="checkbox"
                checked={!!values[f.name]}
                onChange={e => handleChange(f.name, e.target.checked)}
              />
            ) : (
              <input
                type={f.type === 'number' ? 'number' : (f.type || 'text')}
                value={values[f.name]}
                onChange={e => handleChange(f.name, f.type === 'number' ? (e.target.value === '' ? '' : Number(e.target.value)) : e.target.value)}
                placeholder={f.placeholder}
                min={f.min}
                max={f.max}
                step={f.step}
              />
            )
          )}
        </div>
      ))}
      <div className={styles.actions} style={{ gridColumn: '1 / -1' }}>
        <button
          className={submitClassName ? `${styles.primary} ${submitClassName}` : styles.primary}
          type="submit"
          style={submitStyle}
          disabled={!!submitDisabled || !!submitLoading}
          aria-busy={!!submitLoading}
        >
          {submitLoading ? (
            <span className={styles.loadingText}>
              {submitLoadingText ?? submitText}
              <span className={styles.loadingDots}>
                <span />
                <span />
                <span />
              </span>
            </span>
          ) : (
            submitText
          )}
        </button>
      </div>
    </form>
  );
};

export default Form;
