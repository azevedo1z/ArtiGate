import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, id, ...props }, ref) => (
    <div className="mb-4">
      {label && (
        <label htmlFor={id} className="block mb-2 font-medium text-gray-700">
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={id}
        {...props}
        className={`p-2 border rounded w-full box-border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          error ? 'border-red-500' : 'border-gray-300'
        }`}
      />
      {error && (
        <span className="text-red-500 text-sm mt-1 block">{error}</span>
      )}
    </div>
  )
);

Input.displayName = 'Input';
