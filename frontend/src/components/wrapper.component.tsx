import React, { ReactNode } from 'react';

type Variant = 'default' | 'gradient' | 'solid';

interface WrapperProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  variant?: Variant;
  centered?: boolean;
  fullHeight?: boolean;
}

const variantClasses: Record<Variant, string> = {
  default: 'bg-gray-50',
  gradient: 'bg-gradient-to-br from-blue-50 via-white to-purple-50',
  solid: 'bg-white',
};

const Wrapper: React.FC<WrapperProps> = ({
  children,
  variant = 'default',
  centered = true,
  fullHeight = true,
  className = '',
  ...props
}) => {
  const baseClassName = 'w-full';
  const heightClassName = 'min-h-screen';
  const centerClassName = 'flex items-center justify-center';

  const finalClassName = [
    baseClassName,
    fullHeight && heightClassName,
    centered && centerClassName,
    variantClasses[variant],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={finalClassName} {...props}>
      {children}
    </div>
  );
};

export default Wrapper;
