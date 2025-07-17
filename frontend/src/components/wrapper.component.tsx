import React, { ReactNode } from 'react';

interface WrapperProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  centered?: boolean;
  fullHeight?: boolean;
}

const Wrapper: React.FC<WrapperProps> = ({
  children,
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
