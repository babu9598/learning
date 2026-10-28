import React from 'react';
import { cn } from '../../utils/formatters';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  className?: string;
  variant?: 'default' | 'brand' | 'accent' | 'warning' | 'info';
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  className,
  variant = 'default',
  onClick,
}) => {
  const iconGradients = {
    default: 'bg-cloudy-100 text-slate-700 border-cloudy-200 dark:bg-slate-800/80 dark:text-slate-300 dark:border-slate-700/80',
    brand: 'bg-brand-50 text-brand-600 border-brand-200 dark:bg-brand-500/10 dark:text-brand-400 dark:border-brand-500/20',
    accent: 'bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20',
    warning: 'bg-rose-50 text-rose-600 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20',
    info: 'bg-sky-50 text-sky-600 border-sky-200 dark:bg-sky-500/10 dark:text-sky-400 dark:border-sky-500/20',
  };

  return (
    <div
      onClick={onClick}
      className={cn(
        'glass-panel p-3.5 sm:p-4 rounded-xl relative overflow-hidden transition-all duration-300 group hover:border-brand-300 dark:hover:border-slate-700 hover:shadow-lg hover:shadow-brand-500/5 dark:hover:shadow-black/30',
        onClick && 'cursor-pointer hover:scale-[1.01]',
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-0.5">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">{title}</p>
          <h3 className="text-xl sm:text-2xl font-black tracking-tight text-slate-950 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
            {value}
          </h3>
          {subtitle && <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">{subtitle}</p>}
        </div>

        {icon && (
          <div
            className={cn(
              'w-7.5 h-7.5 p-1.5 rounded-lg flex items-center justify-center border shrink-0 transition-transform duration-300 group-hover:scale-105 shadow-xs [&>svg]:w-3.5 [&>svg]:h-3.5',
              iconGradients[variant]
            )}
          >
            {icon}
          </div>
        )}
      </div>

      {trend && (
        <div className="mt-2 pt-1.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center gap-1.5 text-[10.5px]">
          <span
            className={cn(
              'font-extrabold flex items-center',
              trend.isPositive ? 'text-emerald-700 dark:text-emerald-400' : 'text-rose-700 dark:text-rose-400'
            )}
          >
            {trend.isPositive ? '+' : '-'}
            {trend.value}
          </span>
          <span className="font-medium text-slate-500 dark:text-slate-400">vs previous period</span>
        </div>
      )}
    </div>
  );
};
