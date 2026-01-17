import React, { useState } from 'react';

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

  const rootClass = mode === 'table'
    ? 'grid grid-cols-2 gap-px bg-[var(--brand-border)] border border-[var(--brand-border)]'
    : 'grid grid-cols-2 gap-x-5 gap-y-4';
  const itemClass = mode === 'table'
    ? 'flex flex-row bg-white items-stretch min-h-[48px]'
    : 'flex flex-col';
  const labelClass = mode === 'table'
    ? 'flex items-center w-[130px] px-4 bg-[#fafafa] text-[#333] font-medium text-sm border-r border-[var(--brand-border)] shrink-0'
    : 'block mb-1.5 text-[#333] font-semibold';
  const controlClass = mode === 'table'
    ? 'w-full border-0 rounded-none px-3.5 py-2.5 bg-transparent outline-none focus:bg-white focus:shadow-[inset_0_0_0_2px_var(--brand-accent-soft)]'
    : 'w-full px-2 py-2 rounded-lg border border-[var(--brand-border)]';

  return (
    <form className={className ? `${rootClass} ${className}` : rootClass} onSubmit={e => { e.preventDefault(); onSubmit(values); }}>
      <style>{`
        @keyframes formDotPulse {
          0%, 100% { opacity: 0.35; transform: translateY(0); }
          50% { opacity: 0.9; transform: translateY(-2px); }
        }
        .form-dot { animation: formDotPulse 1s ease-in-out infinite; }
        .form-dot.delay-1 { animation-delay: 0.15s; }
        .form-dot.delay-2 { animation-delay: 0.3s; }
      `}</style>
      {fields.map(f => (
        (() => {
          const inputId = `form-${f.name}`;
          const ariaLabel = typeof f.label === 'string' ? f.label : f.name;
          const spanClass = f.span === 2 ? 'col-span-2' : f.span === 3 ? 'col-span-3' : '';
          const itemClassName = fieldClassName ? `${itemClass} ${fieldClassName} ${spanClass}` : `${itemClass} ${spanClass}`;
          return (
        <div 
          className={itemClassName}
          key={f.name}
        >
          <label className={labelClass} htmlFor={inputId}>{f.label}</label>
          {f.render ? (
            f.render(values[f.name], (v: any) => handleChange(f.name, v))
          ) : f.type === 'textarea' ? (
            <textarea
              className={controlClass}
              id={inputId}
              aria-label={ariaLabel}
              value={values[f.name]}
              onChange={e => handleChange(f.name, e.target.value)}
              placeholder={f.placeholder}
              rows={f.rows || 4}
            />
          ) : f.type === 'select' ? (
            <select
              className={controlClass}
              id={inputId}
              aria-label={ariaLabel}
              value={values[f.name]}
              onChange={e => handleChange(f.name, e.target.value)}
            >
              {(f.options || []).map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          ) : f.type === 'file' ? (
            <div className="w-full">
              <div className="flex items-center gap-3">
                <label className="inline-flex items-center gap-1.5 bg-[#f0f7ff] text-[#0066cc] px-3 py-1.5 rounded-md cursor-pointer text-[13px] font-medium transition hover:bg-[#e0efff]">
                  <span className="text-[14px]">📂</span> 点击上传资料
                  <input
                    id={inputId}
                    type="file"
                    multiple={!!f.multiple}
                    accept={f.accept}
                    aria-label={ariaLabel}
                    className="hidden"
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
                <div className="text-[12px] text-[#999]">{f.placeholder || '支持 PDF, Word'}</div>
              </div>
              {values[f.name] && (
                <div className="mt-2 flex flex-col gap-1.5">
                  {(Array.isArray(values[f.name]) ? values[f.name] : [values[f.name]]).map((file: any, idx: number) => (
                    <div key={idx} className="text-[13px] text-[#444] bg-[var(--brand-accent-soft)] px-2 py-1.5 rounded-md border border-[rgba(75,42,133,0.04)] flex items-center justify-between gap-2">
                      <span className="overflow-hidden text-ellipsis whitespace-nowrap">{file.name}</span>
                      <span className="text-[#999] ml-2">{file.size ? (file.size / 1024).toFixed(1) + 'KB' : ''}</span>
                      <button
                        type="button"
                        className="bg-transparent border-0 text-[#999] cursor-pointer text-[16px] leading-none px-1 transition hover:text-[#ff4d4f]"
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
              <div className="flex items-center gap-3">
                <input
                  className="w-full"
                  id={inputId}
                  aria-label={ariaLabel}
                  type="range"
                  min={f.min}
                  max={f.max}
                  step={f.step}
                  value={values[f.name]}
                  onChange={e => handleChange(f.name, Number(e.target.value))}
                />
                <div className="min-w-[48px] text-center text-[#666]">{values[f.name]}</div>
              </div>
            ) : f.type === 'checkbox' ? (
              <input
                id={inputId}
                aria-label={ariaLabel}
                type="checkbox"
                checked={!!values[f.name]}
                onChange={e => handleChange(f.name, e.target.checked)}
                className="h-4 w-4"
              />
            ) : (
              <input
                className={controlClass}
                id={inputId}
                aria-label={ariaLabel}
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
          );
        })()
      ))}
      <div className="mt-3 col-span-2">
        <button
          className={submitClassName ? `bg-[var(--brand-accent)] text-white border-0 px-3.5 py-2 rounded-full cursor-pointer shadow-[var(--brand-shadow)] transition-[background,box-shadow] hover:bg-[var(--brand-accent-strong)] hover:shadow-[var(--brand-shadow)] ${submitClassName}` : 'bg-[var(--brand-accent)] text-white border-0 px-3.5 py-2 rounded-full cursor-pointer shadow-[var(--brand-shadow)] transition-[background,box-shadow] hover:bg-[var(--brand-accent-strong)] hover:shadow-[var(--brand-shadow)]'}
          type="submit"
          disabled={!!submitDisabled || !!submitLoading}
        >
          {submitLoading ? (
            <span className="inline-flex items-center gap-1.5">
              {submitLoadingText ?? submitText}
              <span className="inline-flex gap-1">
                <span className="form-dot w-[5px] h-[5px] rounded-full bg-white opacity-40" />
                <span className="form-dot delay-1 w-[5px] h-[5px] rounded-full bg-white opacity-40" />
                <span className="form-dot delay-2 w-[5px] h-[5px] rounded-full bg-white opacity-40" />
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
