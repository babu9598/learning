import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, ArrowUpDown } from 'lucide-react';
import { cn } from '../../utils/formatters';
import { Button } from './Button';

export interface Column<T> {
  key: string;
  header: string;
  render?: (row: T, index: number) => React.ReactNode;
  sortable?: boolean;
  className?: string;
  align?: 'left' | 'center' | 'right';
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  isLoading?: boolean;
  emptyMessage?: string;
  compact?: boolean;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    onPageChange: (page: number) => void;
  };
  onRowClick?: (row: T) => void;
  actions?: React.ReactNode;
  filterComponent?: React.ReactNode;
}

export function DataTable<T extends { _id?: string; id?: string }>({
  columns,
  data,
  isLoading = false,
  emptyMessage = 'No records found',
  compact = false,
  pagination,
  onRowClick,
  actions,
  filterComponent,
}: DataTableProps<T>) {
  return (
    <div className="space-y-4">
      {(filterComponent || actions) && (
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          <div className="flex-1">{filterComponent}</div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}

      <div className="glass-panel rounded-2xl overflow-hidden border border-cloudy-200 dark:border-slate-800 shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-900 dark:text-slate-100">
            <thead className="bg-slate-100/95 dark:bg-slate-900/95 text-[11px] uppercase tracking-wider text-slate-950 dark:text-slate-100 font-extrabold border-b-2 border-cloudy-200 dark:border-slate-800">
              <tr>
                {columns.map((col) => (
                  <th
                    key={col.key}
                    scope="col"
                    className={cn(
                      compact ? 'px-3.5 py-2.5 font-extrabold select-none' : 'px-5 py-3.5 font-extrabold select-none',
                      col.align === 'center'
                        ? 'text-center'
                        : col.align === 'right'
                        ? 'text-right'
                        : 'text-left',
                      col.className
                    )}
                  >
                    <div
                      className={cn(
                        'flex items-center gap-1.5 font-extrabold',
                        col.align === 'center'
                          ? 'justify-center'
                          : col.align === 'right'
                          ? 'justify-end'
                          : 'justify-start'
                      )}
                    >
                      {col.header}
                      {col.sortable && <ArrowUpDown className="w-3.5 h-3.5 opacity-80" />}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-cloudy-200/80 dark:divide-slate-800/80 font-medium">
              {isLoading ? (
                // Skeletons
                Array.from({ length: pagination?.limit || 5 }).map((_, rIdx) => (
                  <tr key={rIdx} className="animate-pulse">
                    {columns.map((col) => (
                      <td key={col.key} className={compact ? 'px-3.5 py-2.5' : 'px-5 py-4'}>
                        <div className="h-4 bg-cloudy-200/80 dark:bg-slate-800/80 rounded w-3/4" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : data.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="px-5 py-12 text-center text-slate-700 dark:text-slate-300 font-bold"
                  >
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <div className="w-12 h-12 rounded-2xl bg-cloudy-100 dark:bg-slate-800/60 border border-cloudy-200 dark:border-slate-700/50 flex items-center justify-center text-slate-500 font-bold">
                        📄
                      </div>
                      <p className="text-slate-800 dark:text-slate-200 text-sm font-bold">{emptyMessage}</p>
                    </div>
                  </td>
                </tr>
              ) : (
                data.map((row, rIdx) => (
                  <tr
                    key={row._id || row.id || rIdx}
                    onClick={() => onRowClick && onRowClick(row)}
                    className={cn(
                      'hover:bg-cloudy-100/80 dark:hover:bg-slate-800/50 transition-colors',
                      onRowClick && 'cursor-pointer'
                    )}
                  >
                    {columns.map((col) => (
                      <td
                        key={col.key}
                        className={cn(
                          compact
                            ? 'px-3.5 py-2 text-slate-950 dark:text-slate-100 align-middle font-medium'
                            : 'px-5 py-3.5 text-slate-950 dark:text-slate-100 align-middle font-medium',
                          col.align === 'center'
                            ? 'text-center'
                            : col.align === 'right'
                            ? 'text-right'
                            : 'text-left',
                          col.className
                        )}
                      >
                        {col.render ? col.render(row, rIdx) : (row as any)[col.key] || '—'}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Server-Side Pagination Controls */}
        {pagination && pagination.totalPages > 1 && (
          <div className="px-5 py-3.5 bg-cloudy-50 dark:bg-slate-900/80 border-t border-cloudy-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-800 dark:text-slate-300 font-semibold">
            <div>
              Showing{' '}
              <span className="font-extrabold text-slate-950 dark:text-white">
                {(pagination.page - 1) * pagination.limit + 1}
              </span>{' '}
              to{' '}
              <span className="font-extrabold text-slate-950 dark:text-white">
                {Math.min(pagination.page * pagination.limit, pagination.total)}
              </span>{' '}
              of <span className="font-extrabold text-slate-950 dark:text-white">{pagination.total}</span> entries
            </div>

            <div className="flex items-center gap-1.5">
              <Button
                variant="outline"
                size="sm"
                disabled={pagination.page <= 1}
                onClick={() => pagination.onPageChange(1)}
              >
                <ChevronsLeft className="w-3.5 h-3.5" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={pagination.page <= 1}
                onClick={() => pagination.onPageChange(pagination.page - 1)}
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </Button>

              <span className="px-3 py-1 font-bold text-slate-950 dark:text-slate-100 bg-white dark:bg-slate-800 border border-cloudy-300 dark:border-slate-700 rounded-lg shadow-sm">
                Page {pagination.page} of {pagination.totalPages}
              </span>

              <Button
                variant="outline"
                size="sm"
                disabled={pagination.page >= pagination.totalPages}
                onClick={() => pagination.onPageChange(pagination.page + 1)}
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={pagination.page >= pagination.totalPages}
                onClick={() => pagination.onPageChange(pagination.totalPages)}
              >
                <ChevronsRight className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
