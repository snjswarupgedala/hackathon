import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverEffect?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  onClick,
  hoverEffect = false,
}) => {
  return (
    <div
      onClick={onClick}
      className={`bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm transition-all duration-200 ${
        hoverEffect ? 'hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 cursor-pointer' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
};
