import { TextareaHTMLAttributes, forwardRef } from 'react';

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  placeholder: string;
  error?: string;
}

const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ label, placeholder, error, className = '', ...props }, ref) => {
    const labelClassName = 'text-sm font-medium text-gray-700';
    const baseTextAreaClassName =
      'rounded-md border p-2 min-h-[80px] resize-y bg-white text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200';
    const borderTextAreaClassName = error
      ? 'border-red-500'
      : 'border-gray-300';
    const textErrorClassName = 'text-xs text-red-500';
    const parentDivClassName = 'flex flex-col gap-1';

    return (
      <div className={parentDivClassName}>
        <label className={labelClassName}>{label}</label>
        <textarea
          ref={ref}
          className={`${baseTextAreaClassName} ${borderTextAreaClassName} ${className}`}
          {...props}
        >
          {placeholder}
        </textarea>
        {error && <span className={textErrorClassName}>{error}</span>}
      </div>
    );
  }
);

TextArea.displayName = 'TextArea';

export default TextArea;
