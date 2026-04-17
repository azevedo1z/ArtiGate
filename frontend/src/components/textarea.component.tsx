import { TextareaHTMLAttributes, forwardRef } from 'react';

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  placeholder: string;
  error?: string;
}

const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ label, placeholder, error, className = '', ...props }, ref) => {
    const labelClassName =
      'text-xs font-medium text-ink-600 uppercase tracking-wide';
    const baseTextAreaClassName =
      'w-full rounded-md border px-3.5 py-2.5 text-sm min-h-[96px] resize-y bg-snow text-ink-800 placeholder:text-ink-300 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-colors duration-150';
    const borderTextAreaClassName = error
      ? 'border-red-400 focus:ring-red-500/30 focus:border-red-500'
      : 'border-ink-200';
    const textErrorClassName = 'text-xs text-red-600';
    const parentDivClassName = 'grid gap-1.5';

    return (
      <div className={parentDivClassName}>
        <label className={labelClassName}>{label}</label>
        <textarea
          ref={ref}
          className={`${baseTextAreaClassName} ${borderTextAreaClassName} ${className}`}
          placeholder={placeholder}
          {...props}
        />
        {error && <span className={textErrorClassName}>{error}</span>}
      </div>
    );
  }
);

TextArea.displayName = 'TextArea';

export default TextArea;
