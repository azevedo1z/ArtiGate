import React, { ReactNode } from 'react';

type IconColor = 'blue' | 'purple' | 'indigo' | 'green' | 'red' | 'yellow';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  icon: ReactNode;
  title: string;
  description: string;
  iconColor?: IconColor;
}

const iconColorClasses: Record<IconColor, string> = {
  blue: 'bg-gradient-to-r from-blue-500 to-blue-600',
  purple: 'bg-gradient-to-r from-purple-500 to-purple-600',
  indigo: 'bg-gradient-to-r from-indigo-500 to-indigo-600',
  green: 'bg-gradient-to-r from-green-500 to-green-600',
  red: 'bg-gradient-to-r from-red-500 to-red-600',
  yellow: 'bg-gradient-to-r from-yellow-500 to-yellow-600',
};

const Card: React.FC<CardProps> = ({
  icon,
  title,
  description,
  iconColor = 'blue',
  className = '',
  ...props
}) => {
  const baseClassName =
    'bg-white p-6 rounded-2xl shadow-xl border border-gray-100 hover:shadow-2xl transition duration-300';
  const iconClassName = `h-12 w-12 rounded-lg flex items-center justify-center mb-4 mx-auto ${iconColorClasses[iconColor]}`;
  const titleClassName = 'text-lg font-semibold text-gray-900 mb-2';
  const descriptionClassName = 'text-gray-600 text-sm';

  const finalClassName = [baseClassName, className].filter(Boolean).join(' ');

  return (
    <div className={finalClassName} {...props}>
      <div className={iconClassName}>{icon}</div>
      <h3 className={titleClassName}>{title}</h3>
      <p className={descriptionClassName}>{description}</p>
    </div>
  );
};

export default Card;
