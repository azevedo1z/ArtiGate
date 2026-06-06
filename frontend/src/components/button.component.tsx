import React, { ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variantClassName?: Variant;
  sizeClassName?: Size;
  isLoading?: boolean;
  loadingText?: string;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
  fullWidth?: boolean;
}

const variantClasses: Record<Variant, string> = {
  primary:
    'bg-primary-500 text-snow hover:bg-primary-600 active:bg-primary-700 focus-visible:ring-primary-500',
  secondary:
    'bg-snow text-ink-700 border border-ink-200 hover:bg-ink-50 hover:border-ink-300 focus-visible:ring-ink-300',
  ghost:
    'bg-transparent text-primary-500 hover:bg-primary-50 focus-visible:ring-primary-500',
  danger:
    'bg-red-600 text-snow hover:bg-red-700 focus-visible:ring-red-500',
};

const sizeClasses: Record<Size, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2.5 text-sm',
  lg: 'px-6 py-3 text-base',
};

const Button: React.FC<ButtonProps> = ({
  children,
  variantClassName = 'primary',
  sizeClassName = 'md',
  isLoading = false,
  loadingText = 'Loading...',
  leadingIcon,
  trailingIcon,
  fullWidth = false,
  disabled = false,
  className = '',
  ...props
}) => {
  const baseClassName =
    'inline-flex items-center justify-center gap-2 rounded-md font-medium tracking-tight cursor-pointer [touch-action:manipulation] transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-offset-snow';
  const fullWidthClassName = 'w-full';
  const disabledClassName = 'opacity-50 cursor-not-allowed';
  const loadingSpinnerClassName =
    'animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent';

  const finalClassName = [
    baseClassName,
    variantClasses[variantClassName],
    sizeClasses[sizeClassName],
    fullWidth && fullWidthClassName,
    (disabled || isLoading) && disabledClassName,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      className={finalClassName}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <span className={loadingSpinnerClassName}></span>
          {loadingText}
        </>
      ) : (
        <>
          {leadingIcon}
          {children}
          {trailingIcon}
        </>
      )}
    </button>
  );
};

export default Button;
