import React, { useState } from "react";
import Button from "@/components/Button";

export interface FormField {
  name: string;
  label: React.ReactNode;
  type?:
    | "text"
    | "password"
    | "textarea"
    | "number"
    | "select"
    | "file"
    | "range"
    | "checkbox";
  placeholder?: string;
  defaultValue?: any;
  options?: Array<{ label: string; value: string }>;
  min?: number;
  max?: number;
  step?: number;
  multiple?: boolean;
  accept?: string;
  rows?: number;
  span?: number;
  render?: (value: any, onChange: (v: any) => void) => React.ReactNode;
}

export interface FormProps {
  fields: FormField[];
  onSubmit: (values: Record<string, any>) => void;
  submitText?: React.ReactNode;
  submitLoading?: boolean;
  submitLoadingText?: React.ReactNode;
  submitDisabled?: boolean;
  className?: string;
  fieldClassName?: string;
  submitClassName?: string;
  mode?: "default" | "table";
  animateFieldsKey?: string;
}

const Form: React.FC<FormProps> = ({
  fields,
  onSubmit,
  submitText = "提交",
  submitLoading,
  submitLoadingText,
  submitDisabled,
  className,
  fieldClassName,
  submitClassName,
  mode = "default",
  animateFieldsKey,
}) => {
  const [values, setValues] = useState(() => {
    const v: Record<string, any> = {};
    fields.forEach((f) => {
      if (f.type === "checkbox") v[f.name] = f.defaultValue ?? false;
      else if (f.type === "file" && f.multiple) v[f.name] = f.defaultValue ?? [];
      else v[f.name] = f.defaultValue ?? "";
    });
    return v;
  });

  const handleChange = (name: string, value: any) => setValues((v) => ({ ...v, [name]: value }));

  const rootClass = mode === "table" ? "grid grid-cols-2 gap-px bg-[var(--brand-border)] border border-[var(--brand-border)]" : "grid grid-cols-2 gap-x-5 gap-y-4";
  const itemClass = mode === "table" ? "flex flex-row bg-white items-stretch min-h-[48px]" : "flex flex-col";
  const labelClass = mode === "table" ? "flex items-center w-[130px] px-4 bg-[#fafafa] text-[#333] font-medium text-sm border-r border-[var(--brand-border)] shrink-0" : "block mb-1.5 text-[#333] font-semibold";
  const controlClass = mode === "table" ? "w-full border-0 rounded-none px-3.5 py-2.5 bg-transparent outline-none focus:bg-white focus:shadow-[inset_0_0_0_2px_var(--brand-accent-soft)]" : "w-full px-2 py-2 rounded-lg border border-[var(--brand-border)]";

  return (
    <form
      className={className || rootClass}
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(values);
      }}
      data-oid="l:34:qo"
    >
      <style>{`
        @keyframes formDotPulse { 0%,100%{opacity:.35;transform:translateY(0)}50%{opacity:.9;transform:translateY(-2px)} }
        .form-dot{animation:formDotPulse 1s ease-in-out infinite}.form-dot.delay-1{animation-delay:.15s}.form-dot.delay-2{animation-delay:.3s}
        @keyframes slideInFromBottom { from { opacity: 0; transform: translateY(8px); } to { opacity:1; transform:translateY(0);} }
        .animate-form-enter { animation: slideInFromBottom 220ms cubic-bezier(.2,.9,.2,1) both; }
      `}</style>

      {fields.map((f) => {
        const inputId = `form-${f.name}`;
        const ariaLabel = typeof f.label === "string" ? f.label : f.name;
        const spanClass = f.span === 2 ? "col-span-2" : f.span === 3 ? "col-span-3" : "";
        const animateForField = animateFieldsKey && f.name !== "nav" && f.name !== "agree";
        const itemClassName = fieldClassName ? `${itemClass} ${fieldClassName} ${spanClass} ${animateForField ? "animate-form-enter" : ""}` : `${itemClass} ${spanClass} ${animateForField ? "animate-form-enter" : ""}`;

        return (
          <div className={itemClassName} key={f.name} data-oid="hyu7xgg">
            <label className={labelClass} htmlFor={inputId} data-oid="q6s8k:o">
              {f.label}
            </label>
            {f.render ? (
              f.render(values[f.name], (v: any) => handleChange(f.name, v))
            ) : f.type === "textarea" ? (
              <textarea className={controlClass} id={inputId} aria-label={ariaLabel} value={values[f.name]} onChange={(e) => handleChange(f.name, e.target.value)} placeholder={f.placeholder} rows={f.rows || 4} data-oid="hpptuyo" />
            ) : f.type === "select" ? (
              <select className={controlClass} id={inputId} aria-label={ariaLabel} value={values[f.name]} onChange={(e) => handleChange(f.name, e.target.value)} data-oid=":xdil-g">
                {(f.options || []).map((opt) => (
                  <option key={opt.value} value={opt.value} data-oid="f.jb3u_">
                    {opt.label}
                  </option>
                ))}
              </select>
            ) : f.type === "file" ? (
              <div className="w-full" data-oid="33fxqj.">
                <div className="flex items-center gap-3" data-oid="avc0gde">
                  <label className="inline-flex items-center gap-1.5 bg-[#f0f7ff] text-[#0066cc] px-3 py-1.5 rounded-md cursor-pointer text-[13px] font-medium transition hover:bg-[#e0efff]" data-oid="aytdcng">
                    <span className="text-[14px]" data-oid="w0frygc">📂</span> 点击上传资料
                    <input id={inputId} type="file" multiple={!!f.multiple} accept={f.accept} aria-label={ariaLabel} className="hidden" onChange={(e) => {
                      const files = e.target.files; if (!files?.length) return; if (f.multiple) { const arr = Array.from(files); const current = values[f.name] || []; handleChange(f.name, [...current, ...arr]); e.target.value = ""; } else { handleChange(f.name, files[0]); }
                    }} data-oid="tohwazg" />
                  </label>
                  <div className="text-[12px] text-[#999]" data-oid="e7l:cap">{f.placeholder || "支持 PDF, Word"}</div>
                </div>
                {values[f.name] && (
                  <div className="mt-2 flex flex-col gap-1.5" data-oid="9mo4w73">
                    {(Array.isArray(values[f.name]) ? values[f.name] : [values[f.name]]).map((file: any, idx: number) => (
                      <div key={idx} className="text-[13px] text-[#444] bg-[var(--brand-accent-soft)] px-2 py-1.5 rounded-md border border-[rgba(75,42,133,0.04)] flex items-center justify-between gap-2" data-oid="d15lwrv">
                        <span className="overflow-hidden text-ellipsis whitespace-nowrap" data-oid="fufpzwy">{file.name}</span>
                        <span className="text-[#999] ml-2" data-oid="4k64hvc">{file.size ? (file.size / 1024).toFixed(1) + "KB" : ""}</span>
                        <Button type="button" className="bg-transparent border-0 text-[#999] text-[16px] leading-none px-1 transition hover:text-[#ff4d4f]" onClick={() => { if (Array.isArray(values[f.name])) { const newFiles = values[f.name].filter((_: any, i: number) => i !== idx); handleChange(f.name, newFiles); } else { handleChange(f.name, ""); } }} data-oid="2.upi19">×</Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : f.type === "range" ? (
              <div className="flex items-center gap-3" data-oid=":-h39f7">
                <input className="w-full" id={inputId} aria-label={ariaLabel} type="range" min={f.min} max={f.max} step={f.step} value={values[f.name]} onChange={(e) => handleChange(f.name, Number(e.target.value))} data-oid="iv01ert" />
                <div className="min-w-[48px] text-center text-[#666]" data-oid="h5ovd7e">{values[f.name]}</div>
              </div>
            ) : f.type === "checkbox" ? (
              <input id={inputId} aria-label={ariaLabel} type="checkbox" checked={!!values[f.name]} onChange={(e) => handleChange(f.name, e.target.checked)} className="h-4 w-4" data-oid="-5oct:p" />
            ) : (
              <input className={controlClass} id={inputId} aria-label={ariaLabel} type={f.type === "number" ? "number" : f.type || "text"} value={values[f.name]} onChange={(e) => handleChange(f.name, f.type === "number" ? (e.target.value === "" ? "" : Number(e.target.value)) : e.target.value)} placeholder={f.placeholder} min={f.min} max={f.max} step={f.step} data-oid="4h09m-g" />
            )}
          </div>
        );
      })}

      <div className="mt-3 col-span-2 flex justify-end glass-form-submit-bar" data-oid="sfs651y">
        <Button className={submitClassName || "bg-transparent border border-transparent text-[var(--brand-blue)] px-3.5 py-2 rounded-md transition-[background,box-shadow,border-color,color] hover:border-[var(--brand-purple)] hover:text-[var(--brand-purple)] hover:bg-[rgba(109,40,217,0.06)]"} type="submit" disabled={!!submitDisabled || !!submitLoading} data-oid="74vesmy">
          {submitLoading ? (
            <span className="inline-flex items-center gap-1.5" data-oid="1cfqmxu">
              {submitLoadingText ?? submitText}
              <span className="inline-flex gap-1" data-oid="_rdnd_p">
                <span className="form-dot w-[5px] h-[5px] rounded-full bg-white opacity-40" data-oid="_zi..3i" />
                <span className="form-dot delay-1 w-[5px] h-[5px] rounded-full bg-white opacity-40" data-oid=".1j9-_-" />
                <span className="form-dot delay-2 w-[5px] h-[5px] rounded-full bg-white opacity-40" data-oid="9jq51lp" />
              </span>
            </span>
          ) : (
            submitText
          )}
        </Button>
      </div>
    </form>
  );
};

export default Form;
 