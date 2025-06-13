import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, id, ...props }, ref) => {
    const labelClass = 'block mb-2 font-medium text-gray-700';
    const baseInputClass =
      'p-2 border rounded w-full box-border focus:outline-none focus:ring-2 focus:ring-blue-500';
    const errorInputClass = error ? 'border-red-500' : 'border-gray-300';
    const errorTextClass = 'text-red-500 text-sm mt-1 block';

    return (
      <div className="mb-4">
        {label && (
          <label htmlFor={id} className={labelClass}>
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          {...props}
          className={`${baseInputClass} ${errorInputClass}`}
        />
        {error && <span className={errorTextClass}>{error}</span>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
