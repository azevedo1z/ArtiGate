import { InputHTMLAttributes, forwardRef, ReactNode } from 'react';
import InputMask from 'react-input-mask';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  placeholder: string;
  error?: string;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
  onTrailingIconClick?: () => void;
  mask?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      placeholder,
      error = false,
      leadingIcon = null,
      trailingIcon = null,
      onTrailingIconClick,
      id,
      mask,
      ...props
    },
    ref
  ) => {
    const containerClassName = 'space-y-2';
    const wrapperClassName = 'relative';

    const baseClassName =
      'w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200';
    const labelClassName =
      'text-sm font-medium text-gray-700 flex items-center gap-2';

    const errorClassName = 'border-red-500 focus:ring-red-500';
    const textErrorClassName = 'text-red-500 text-sm mt-1 block';

    const paddingForLeadingIconClassName = 'pl-11';
    const paddingForTrailingIconClassName = 'pr-11';

    const leadingIconClassName =
      'absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400';
    const trailingIconClassName =
      'absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition duration-200';

    const trailingIconButtonClassName =
      trailingIcon && onTrailingIconClick ? 'cursor-pointer' : '';

    const finalClassName = [
      baseClassName,
      error && errorClassName,
      leadingIcon && paddingForLeadingIconClassName,
      trailingIcon && paddingForTrailingIconClassName,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div className={containerClassName}>
        <label htmlFor={id} className={labelClassName}>
          {label}
        </label>
        <div className={wrapperClassName}>
          {mask ? (
            <InputMask mask={mask} value={props.value} onChange={props.onChange}>
              {(inputProps: InputHTMLAttributes<HTMLInputElement>) => (
                <input
                  {...inputProps}
                  ref={ref}
                  id={id}
                  className={finalClassName}
                  placeholder={placeholder}
                  type={props.type}
                  disabled={props.disabled}
                  required={props.required}
                />
              )}
            </InputMask>
          ) : (
            <input
              ref={ref}
              id={id}
              className={finalClassName}
              placeholder={placeholder}
              {...props}
            />
          )}
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
        {error && <span className={textErrorClassName}>{error}</span>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
