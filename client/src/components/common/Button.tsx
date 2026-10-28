import React from 'react';
import { cn } from '../../utils/formatters';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost' | 'success';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  className,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  icon,
  disabled,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-bold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98]';

  const variantStyles = {
    primary:
      'bg-brand-600 hover:bg-brand-500 text-white shadow-md shadow-brand-500/20 focus:ring-brand-500 border border-brand-500/40',
    secondary:
      'bg-cloudy-100 hover:bg-cloudy-200 text-slate-900 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-100 border border-cloudy-300 dark:border-slate-700 focus:ring-slate-500 shadow-sm',
    outline:
      'border border-cloudy-300 dark:border-slate-700 hover:border-brand-500 hover:bg-cloudy-100/80 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 focus:ring-brand-500 bg-white dark:bg-slate-900 shadow-sm',
    danger:
      'bg-rose-50 hover:bg-rose-600 text-rose-700 hover:text-white dark:bg-rose-950/60 dark:hover:bg-rose-600 dark:text-rose-300 dark:hover:text-white border border-rose-200 dark:border-rose-800/80 focus:ring-rose-500 shadow-sm',
    success:
      'bg-emerald-50 hover:bg-emerald-600 text-emerald-800 hover:text-white dark:bg-emerald-950/60 dark:hover:bg-emerald-600 dark:text-emerald-300 dark:hover:text-white border border-emerald-200 dark:border-emerald-800/80 focus:ring-emerald-500 shadow-sm',
    ghost:
      'text-slate-700 hover:text-brand-600 hover:bg-cloudy-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800/60 focus:ring-brand-500',
  };

  const sizeStyles = {
    sm: 'text-xs px-3 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2.5 gap-2',
    lg: 'text-base px-5 py-3 gap-2.5',
  };

  return (
    <button
      className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      ) : icon ? (
        <span className="shrink-0">{icon}</span>
      ) : null}
      {children}
    </button>
  );
};
