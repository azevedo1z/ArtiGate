import React, { ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'danger';
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
  primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 shadow-md hover:shadow-lg',
  secondary: 'bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-500',
  danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
};

const sizeClasses: Record<Size, string> = {
  sm: 'px-3 py-2 text-sm',
  md: 'px-4 py-3',
  lg: 'px-6 py-4 text-lg',
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
  ...props
}) => {
  const baseClassName =
    'rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transform transition duration-200 hover:scale-[1.02] flex items-center justify-center gap-2';
  const fullWidthClassName = 'w-full';
  const disabledClassName = 'opacity-50 cursor-not-allowed transform-none';
  const loadingSpinnerClassName =
    'animate-spin rounded-full h-5 w-5 border-b-2 border-white';

  const finalClassName = [
    baseClassName,
    variantClasses[variantClassName],
    sizeClasses[sizeClassName],
    fullWidth && fullWidthClassName,
    (disabled || isLoading) && disabledClassName,
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
          <div className={loadingSpinnerClassName}></div>
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
