import { TextareaHTMLAttributes, forwardRef } from 'react';

type TextAreaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
  error?: string;
};

const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ label, error, className = '', ...props }, ref) => {
    const labelClass = 'text-sm font-medium text-gray-700';
    const baseTextAreaClass =
      'rounded-md border p-2 min-h-[80px] resize-y bg-white text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200';
    const errorTextAreaClass = error ? 'border-red-500' : 'border-gray-300';
    const errorTextClass = 'text-xs text-red-500';

    return (
      <div className="flex flex-col gap-1">
        {label && <label className={labelClass}>{label}</label>}
        <textarea
          ref={ref}
          className={`${baseTextAreaClass} ${errorTextAreaClass} ${className}`}
          {...props}
        />
        {error && <span className={errorTextClass}>{error}</span>}
      </div>
    );
  }
);

TextArea.displayName = 'TextArea';

export default TextArea;
