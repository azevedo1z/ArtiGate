import React, { ReactNode } from 'react';

type IconTone = 'primary' | 'accent' | 'ink';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  icon: ReactNode;
  title: string;
  description: string;
  iconTone?: IconTone;
}

const iconToneClasses: Record<IconTone, string> = {
  primary: 'bg-primary-50 text-primary-600',
  accent: 'bg-accent-50 text-accent-600',
  ink: 'bg-ink-50 text-ink-700',
};

const Card: React.FC<CardProps> = ({
  icon,
  title,
  description,
  iconTone = 'primary',
  className = '',
  ...props
}) => {
  const baseClassName =
    'bg-snow p-6 rounded-lg border border-ink-100 hover:border-primary-200 transition-colors duration-150';
  const iconClassName = `h-10 w-10 rounded-md flex items-center justify-center mb-4 ${iconToneClasses[iconTone]}`;
  const titleClassName =
    'text-base font-semibold text-ink-800 mb-1.5 tracking-tight';
  const descriptionClassName = 'text-ink-500 text-sm leading-relaxed';

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
