import React from 'react';
import { cn } from '../../utils/formatters';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'brand';
  size?: 'sm' | 'md';
  dot?: boolean;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'md',
  dot = false,
  className,
}) => {
  const variantStyles = {
    success: 'bg-emerald-50 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-500/30 font-bold',
    warning: 'bg-amber-50 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300 border border-amber-300 dark:border-amber-500/30 font-bold',
    danger: 'bg-rose-50 text-rose-800 dark:bg-rose-500/15 dark:text-rose-300 border border-rose-300 dark:border-rose-500/30 font-bold',
    info: 'bg-sky-50 text-sky-800 dark:bg-sky-500/15 dark:text-sky-300 border border-sky-300 dark:border-sky-500/30 font-bold',
    neutral: 'bg-slate-100 text-slate-800 border border-slate-300 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700 font-bold',
    brand: 'bg-brand-50 text-brand-800 dark:bg-brand-500/15 dark:text-brand-300 border border-brand-300 dark:border-brand-500/30 font-bold',
  };

  const dotColors = {
    success: 'bg-emerald-500 dark:bg-emerald-400',
    warning: 'bg-amber-500 dark:bg-amber-400',
    danger: 'bg-rose-500 dark:bg-rose-400',
    info: 'bg-sky-500 dark:bg-sky-400',
    neutral: 'bg-slate-500 dark:bg-slate-400',
    brand: 'bg-brand-500 dark:bg-brand-400',
  };

  const sizeStyles = {
    sm: 'text-xs px-2 py-0.5 font-medium rounded-md gap-1.5',
    md: 'text-xs px-2.5 py-1 font-medium rounded-lg gap-1.5',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center select-none shrink-0 tracking-wide',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
    >
      {dot && <span className={cn('w-1.5 h-1.5 rounded-full shrink-0', dotColors[variant])} />}
      {children}
    </span>
  );
};

export const StatusBadge: React.FC<{ status: string; className?: string }> = ({ status, className }) => {
  const getVariant = (st: string) => {
    switch (st?.toUpperCase()) {
      case 'ACTIVE':
      case 'APPROVED':
      case 'ONLINE':
      case 'TRIP_COMPLETED':
      case 'COMPLETED':
      case 'PAID':
      case 'RESOLVED':
      case 'VALID':
        return 'success';

      case 'PENDING':
      case 'PENDING_APPROVAL':
      case 'UNDER_REVIEW':
      case 'SEARCHING_DRIVER':
      case 'DRIVER_ASSIGNED':
      case 'DRIVER_ACCEPTED':
      case 'DRIVER_ARRIVING':
      case 'DRIVER_ARRIVED':
      case 'PROCESSING':
      case 'IN_PROGRESS':
      case 'WAITING_FOR_USER':
        return 'warning';

      case 'ON_TRIP':
      case 'TRIP_STARTED':
        return 'info';

      case 'SUSPENDED':
      case 'BLOCKED':
      case 'REJECTED':
      case 'CANCELLED':
      case 'FAILED':
      case 'EXPIRED':
      case 'DOCUMENTS_EXPIRED':
        return 'danger';

      case 'OFFLINE':
      case 'INACTIVE':
      case 'CLOSED':
      default:
        return 'neutral';
    }
  };

  const formatText = (st: string) => {
    return st ? st.replace(/_/g, ' ') : '';
  };

  return (
    <Badge variant={getVariant(status)} dot className={className}>
      {formatText(status)}
    </Badge>
  );
};
