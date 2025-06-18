import React, { ReactNode } from 'react';

type ContainerProps = {
  children: ReactNode;
  className?: string;
};

const Container: React.FC<ContainerProps> = ({ children, className = '' }) => {
  const containerClass = `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 ${className}`;

  return <div className={containerClass}>{children}</div>;
};

export default Container;
