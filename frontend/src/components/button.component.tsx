import React, { ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'danger' | 'gradient';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: Variant;
  size?: Size;
  isLoading?: boolean;
  loadingText?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
}

const variantClasses: Record<Variant, string> = {
  primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
  secondary: 'bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-500',
  danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
  gradient:
    'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 focus:ring-blue-500',
};

const sizeClasses: Record<Size, string> = {
  sm: 'px-3 py-2 text-sm',
  md: 'px-4 py-3',
  lg: 'px-6 py-4 text-lg',
};

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  loadingText = 'Loading...',
  leftIcon,
  rightIcon,
  fullWidth = false,
  disabled,
  ...props
}) => {
  const baseClassName =
    'rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transform transition duration-200 hover:scale-[1.02] flex items-center justify-center gap-2';
  const widthClassName = fullWidth ? 'w-full' : '';
  const disabledClassName =
    disabled || isLoading ? 'opacity-50 cursor-not-allowed transform-none' : '';
  const loadingSpinnerClassName =
    'animate-spin rounded-full h-5 w-5 border-b-2 border-white';

  const finalClassName =
    `${baseClassName} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClassName} ${disabledClassName}`.trim();

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
          {leftIcon}
          {children}
          {rightIcon}
        </>
      )}
    </button>
  );
};

export default Button;
