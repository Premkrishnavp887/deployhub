import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helper?: string;
  actionButton?: React.ReactNode;
}

export function Input({
  label,
  error,
  helper,
  actionButton,
  className = "",
  id,
  required,
  ...props
}: InputProps) {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label htmlFor={inputId} className="block text-xs font-medium text-slate-700">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}
      <div className="relative flex items-center">
        <input
          id={inputId}
          className={`w-full rounded-lg border bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:bg-slate-50 disabled:text-slate-500 transition-colors ${
            error ? "border-rose-300 ring-1 ring-rose-200" : "border-slate-300"
          } ${actionButton ? "pr-20" : ""} ${className}`}
          {...props}
        />
        {actionButton && (
          <div className="absolute right-1.5 flex items-center">
            {actionButton}
          </div>
        )}
      </div>
      {error && <p className="text-xs text-rose-600">{error}</p>}
      {helper && !error && <p className="text-xs text-slate-500">{helper}</p>}
    </div>
  );
}
