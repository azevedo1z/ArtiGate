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
    const containerClassName = 'space-y-1.5';
    const wrapperClassName = 'relative';

    const baseClassName =
      'w-full px-3.5 py-2.5 text-sm bg-snow text-ink-800 placeholder:text-ink-300 border border-ink-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-colors duration-150 disabled:bg-ink-50 disabled:text-ink-400';
    const labelClassName =
      'text-xs font-medium text-ink-600 uppercase tracking-wide flex items-center gap-2';

    const errorClassName =
      'border-red-400 focus:ring-red-500/30 focus:border-red-500';
    const textErrorClassName = 'text-red-600 text-xs mt-1 block';

    const paddingForLeadingIconClassName = 'pl-10';
    const paddingForTrailingIconClassName = 'pr-10';

    const leadingIconClassName =
      'absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-ink-400';
    const trailingIconClassName =
      'absolute right-3 top-1/2 transform -translate-y-1/2 text-ink-400 hover:text-ink-600 transition-colors duration-150';

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
        {label && (
          <label htmlFor={id} className={labelClassName}>
            {label}
          </label>
        )}
        <div className={wrapperClassName}>
          {mask ? (
            <InputMask
              mask={mask}
              maskChar={null}
              value={props.value}
              onChange={props.onChange}
            >
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
