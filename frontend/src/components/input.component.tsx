import { InputHTMLAttributes, forwardRef, ReactNode } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  placeholder: string;
  error?: string;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
  onTrailingIconClick?: () => void;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      placeholder,
      error,
      leadingIcon,
      trailingIcon,
      onTrailingIconClick,
      id,
      ...props
    },
    ref
  ) => {
    const containerClassName = 'space-y-2';
    const inputWrapperClassName = 'relative';

    const baseInputClassName =
      'w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200';
    const labelClassName =
      'text-sm font-medium text-gray-700 flex items-center gap-2';

    const errorInputClassName = 'border-red-500 focus:ring-red-500';
    const errorTextClassName = 'text-red-500 text-sm mt-1 block';

    const inputWithLeadingIconClassName = leadingIcon ? 'pl-11' : '';
    const inputWithTrailingIconClassName = trailingIcon ? 'pr-11' : '';

    const leadingIconClassName =
      'absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400';
    const trailingIconClassName =
      'absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition duration-200';

    const trailingIconButtonClassName =
      trailingIcon && onTrailingIconClick ? 'cursor-pointer' : '';

    const finalInputClassName =
      `${baseInputClassName} ${inputWithLeadingIconClassName} ${inputWithTrailingIconClassName} ${errorInputClassName}`.trim();

    return (
      <div className={containerClassName}>
        <label htmlFor={id} className={labelClassName}>
          {leadingIcon}
          {label}
        </label>
        <div className={inputWrapperClassName}>
          <input
            ref={ref}
            id={id}
            className={finalInputClassName}
            placeholder={placeholder}
            {...props}
          />
          {leadingIcon && (
            <div className={leadingIconClassName}>{leadingIcon}</div>
          )}
          {trailingIcon && (
            <div
              className={`${trailingIconClassName} ${trailingIconButtonClassName}`}
              onClick={onTrailingIconClick}
            >
              {trailingIcon}
            </div>
          )}
        </div>
        {error && <span className={errorTextClassName}>{error}</span>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
