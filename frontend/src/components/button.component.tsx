import React from 'react';

type Variant = 'primary' | 'secondary' | 'danger';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: Variant;
}

const variantClasses: Record<Variant, string> = {
  primary: 'bg-blue-600 text-white hover:bg-blue-700',
  secondary: 'bg-gray-300 text-black hover:bg-gray-400',
  danger: 'bg-red-600 text-white hover:bg-red-700',
};

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  ...props
}) => {
  const baseClassName =
    'rounded px-4 py-2 font-semibold transition focus:outline-none';

  return (
    <button {...props} className={`${baseClassName} ${variantClasses[variant]}`}>
      {children}
    </button>
  );
};

export default Button;
