import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, id, ...props }, ref) => (
    <div style={{ marginBottom: '1rem' }}>
      {label && (
        <label
          htmlFor={id}
          style={{ display: 'block', marginBottom: '0.5rem' }}
        >
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={id}
        {...props}
        style={{
          padding: '0.5rem',
          border: error ? '1px solid red' : '1px solid #ccc',
          borderRadius: '4px',
          width: '100%',
          boxSizing: 'border-box',
        }}
      />
      {error && (
        <span style={{ color: 'red', fontSize: '0.875rem' }}>{error}</span>
      )}
    </div>
  )
);

Input.displayName = 'Input';

export default Input;
