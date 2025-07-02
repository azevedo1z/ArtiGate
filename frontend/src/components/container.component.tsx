import React, { ReactNode } from 'react';

type ContainerSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  size?: ContainerSize;
  noDefaultPadding?: boolean;
  centered?: boolean;
}

const sizeClasses: Record<ContainerSize, string> = {
  sm: 'max-w-2xl',
  md: 'max-w-4xl',
  lg: 'max-w-6xl',
  xl: 'max-w-7xl',
  full: 'max-w-full',
};

const Container: React.FC<ContainerProps> = ({
  children,
  size = 'xl',
  noDefaultPadding = false,
  centered = true,
  className = '',
  ...props
}) => {
  const baseClassName = 'w-full';
  const centerAlignmentClassName = 'mx-auto';
  const paddingClassName = 'px-4 sm:px-6 lg:px-8 py-8';

  const finalClassName = [
    baseClassName,
    sizeClasses[size],
    centered && centerAlignmentClassName,
    !noDefaultPadding && paddingClassName,
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

export default Container;
