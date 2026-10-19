import type { InputHTMLAttributes } from "react";

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "className"> {
  label: string;
  error?: string;
  hint?: string;
  className?: string;
}

export function Input({
  label,
  error,
  hint,
  className = "",
  "aria-invalid": ariaInvalid,
  ...props
}: InputProps) {
  const isInvalid = ariaInvalid ?? Boolean(error);
  return (
    <label className={`flex w-full flex-col gap-2 font-ui ${className}`}>
      <span className="text-[11px] font-bold tracking-[0.08em] text-ink">{label}</span>
      <input
        className={`min-h-11 w-full border-2 ${
          isInvalid
            ? "border-red-600 bg-red-50/20 focus:border-red-600"
            : "border-border bg-white focus:border-cyan"
        } px-3 text-sm text-ink placeholder:text-ink/45 focus:outline-none`}
        aria-invalid={isInvalid}
        {...props}
      />
      {hint ? <span className="text-[11px] leading-5 text-ink/65">{hint}</span> : null}
      {error ? <span className="text-[11px] font-bold text-red-600">{error}</span> : null}
    </label>
  );
}
