import { InputHTMLAttributes, TextareaHTMLAttributes, SelectHTMLAttributes, ReactNode } from "react";

interface FieldWrapperProps {
  label: string;
  mrLabel?: string;
  error?: string;
  hint?: string;
  required?: boolean;
  children: ReactNode;
  className?: string;
}

function FieldWrapper({ label, mrLabel, error, hint, required, children, className = "" }: FieldWrapperProps) {
  return (
    <div className={`space-y-1.5 ${className}`}>
      <div className="flex items-baseline justify-between gap-2">
        <label className="block text-xs font-semibold uppercase tracking-wider text-[#171717]">
          {label}
          {required && <span className="text-[#ea580c] ml-1 font-bold">*</span>}
        </label>
        {mrLabel && (
          <span className="text-xs text-[#737373] devanagari font-normal">
            ({mrLabel})
          </span>
        )}
      </div>
      {children}
      {hint && !error && <p className="text-xs text-[#737373]">{hint}</p>}
      {error && <p className="text-xs text-[#ea580c] flex items-center gap-1 font-medium">{error}</p>}
    </div>
  );
}

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  mrLabel?: string;
  error?: string;
  hint?: string;
  required?: boolean;
  icon?: ReactNode;
}

export function FormInput({ label, mrLabel, error, hint, required, icon, className = "", ...props }: InputProps) {
  return (
    <FieldWrapper label={label} mrLabel={mrLabel} error={error} hint={hint} required={required}>
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-[#737373]">
            {icon}
          </div>
        )}
        <input
          className={`w-full h-9 rounded-[6px] border ${
            error ? "border-[#ea580c] bg-red-50/20" : "border-[#d8d5e6] focus:border-[#3f2f7a]"
          } bg-white text-sm text-[#171717] placeholder:text-[#737373] focus:outline-none focus:ring-1 focus:ring-black/10 transition-all ${
            icon ? "pl-9" : "px-3"
          } pr-3 ${className}`}
          {...props}
        />
      </div>
    </FieldWrapper>
  );
}

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  mrLabel?: string;
  error?: string;
  hint?: string;
  required?: boolean;
}

export function FormTextArea({ label, mrLabel, error, hint, required, className = "", ...props }: TextAreaProps) {
  return (
    <FieldWrapper label={label} mrLabel={mrLabel} error={error} hint={hint} required={required}>
      <textarea
        rows={3}
        className={`w-full px-3 py-2 rounded-[6px] border ${
          error ? "border-[#ea580c] bg-red-50/20" : "border-[#d8d5e6] focus:border-[#3f2f7a]"
        } bg-white text-sm text-[#171717] placeholder:text-[#737373] focus:outline-none focus:ring-1 focus:ring-black/10 transition-all resize-y ${className}`}
        {...props}
      />
    </FieldWrapper>
  );
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  mrLabel?: string;
  error?: string;
  hint?: string;
  required?: boolean;
  options: { value: string; label: string }[];
}

export function FormSelect({ label, mrLabel, error, hint, required, options, className = "", ...props }: SelectProps) {
  return (
    <FieldWrapper label={label} mrLabel={mrLabel} error={error} hint={hint} required={required}>
      <select
        className={`w-full h-9 px-3 rounded-[6px] border ${
          error ? "border-[#ea580c] bg-red-50/20" : "border-[#d8d5e6] focus:border-[#3f2f7a]"
        } bg-white text-sm text-[#171717] focus:outline-none focus:ring-1 focus:ring-black/10 transition-all ${className}`}
        {...props}
      >
        <option value="">Select an option</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </FieldWrapper>
  );
}

interface CardProps {
  children: ReactNode;
  className?: string;
  padded?: boolean;
  paper?: boolean;
}

export function Card({ children, className = "", padded = true, paper = false }: CardProps) {
  return (
    <div
      className={`${
        paper ? "bg-[#f6f3fb]" : "bg-white"
      } border border-[#d8d5e6] rounded-[12px] ${
        padded ? "p-4 sm:p-6" : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}

interface PageHeaderProps {
  title: string;
  mrTitle?: string;
  subtitle?: string;
  icon?: ReactNode;
}

export function PageHeader({ title, mrTitle, subtitle, icon }: PageHeaderProps) {
  return (
    <div className="mb-6">
      <div className="flex items-start gap-3.5">
        {icon && (
          <div className="w-10 h-10 bg-[#f6f3fb] border border-[#d8d5e6] rounded-[10px] flex items-center justify-center text-[#171717] flex-shrink-0">
            {icon}
          </div>
        )}
        <div className="flex-1">
          <div className="flex items-baseline gap-2 flex-wrap">
            <h1 className="text-xl sm:text-2xl font-medium tracking-tight text-[#171717]">{title}</h1>
            {mrTitle && <span className="text-xs font-normal text-[#737373] devanagari">({mrTitle})</span>}
          </div>
          {subtitle && <p className="mt-0.5 text-xs text-[#737373] font-normal">{subtitle}</p>}
        </div>
      </div>
    </div>
  );
}

interface BadgeProps {
  children: ReactNode;
  variant?: "default" | "success" | "warning" | "error" | "primary" | "pill";
  size?: "sm" | "md";
}

export function Badge({ children, variant = "default", size = "md" }: BadgeProps) {
  const variants = {
    default: "bg-[#f6f3fb] text-[#171717] border border-[#d8d5e6]",
    success: "bg-[#dcfce7] text-[#16a34a] border border-[#bbf7d0]",
    warning: "bg-amber-50 text-[#ea580c] border border-amber-200",
    error: "bg-red-50 text-[#ea580c] border border-red-200",
    primary: "bg-[#efeaf9] text-[#3f2f7a] border border-[#c9c2e3]",
    pill: "bg-[#f6f3fb] text-[#171717] border border-[#d8d5e6]",
  };
  const sizes = {
    sm: "text-[10px] px-2 py-0.5",
    md: "text-xs px-2.5 py-0.5",
  };
  return (
    <span
      className={`inline-flex items-center font-medium rounded-full ${variants[variant]} ${sizes[size]}`}
    >
      {children}
    </span>
  );
}
