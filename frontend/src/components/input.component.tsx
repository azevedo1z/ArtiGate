import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  placeholder: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, placeholder, error, id, ...props }, ref) => {
    const parentDivClassName = 'mb-4';
    const baseClassName =
      'p-2 border rounded w-full box-border focus:outline-none focus:ring-2 focus:ring-blue-500';
    const labelClassName = 'block mb-2 font-medium text-gray-700';
    const borderClassName = error ? 'border-red-500' : 'border-gray-300';
    const textErrorClassName = 'text-red-500 text-sm mt-1 block';

    return (
      <div className={parentDivClassName}>
        <label htmlFor={id} className={labelClassName}>
          {label}
        </label>
        <input
          ref={ref}
          id={id}
          className={`${baseClassName} ${borderClassName}`}
          {...props}
        />
        {error && <span className={textErrorClassName}>{error}</span>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
