import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  placeholder: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, placeholder, error, id, ...props }, ref) => {
    const baseStyle =
      'p-2 border rounded w-full box-border focus:outline-none focus:ring-2 focus:ring-blue-500';
    const labelStyle = 'block mb-2 font-medium text-gray-700';
    const borderStyle = error ? 'border-red-500' : 'border-gray-300';
    const errorTextStyle = 'text-red-500 text-sm mt-1 block';

    return (
      <div className="mb-4">
        <label htmlFor={id} className={labelStyle}>
          {label}
        </label>
        <input
          ref={ref}
          id={id}
          {...props}
          className={`${baseStyle} ${borderStyle}`}
        />
        {error && <span className={errorTextStyle}>{error}</span>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
