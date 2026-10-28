import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { History, Search, Filter, Shield, User, Clock, FileCode } from 'lucide-react';
import api from '../api/axiosClient';
import { DataTable, Column } from '../components/common/DataTable';
import { Badge } from '../components/common/Badge';
import { AuditLogItem } from '../types';
import { formatDateTime } from '../utils/formatters';

export const AuditLogsPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [module, setModule] = useState('');

  // Fetch Audit Logs
  const { data, isLoading } = useQuery({
    queryKey: ['audit-logs', page, search, module],
    queryFn: () =>
      api
        .get('/audit-logs', {
          params: { page, limit: 12, search, module },
        })
        .then((res: any) => res),
    refetchInterval: 10000,
  });

  const columns: Column<AuditLogItem>[] = [
    {
      key: 'timestamp',
      header: 'Timestamp',
      render: (log) => (
        <span className="font-mono text-slate-500 dark:text-slate-400 text-xs">{formatDateTime(log.timestamp)}</span>
      ),
    },
    {
      key: 'admin',
      header: 'Admin Actor',
      render: (log) => (
        <div>
          <p className="font-bold text-slate-900 dark:text-white text-xs">{log.adminName}</p>
          <p className="text-[10px] text-slate-500 dark:text-slate-400">{log.adminEmail}</p>
        </div>
      ),
    },
    {
      key: 'module',
      header: 'Module & Action',
      render: (log) => (
        <div className="flex items-center gap-1.5">
          <Badge variant="brand" size="sm">
            {log.module}
          </Badge>
          <Badge variant="neutral" size="sm">
            {log.action}
          </Badge>
        </div>
      ),
    },
    {
      key: 'description',
      header: 'Event Description',
      render: (log) => (
        <p className="text-xs text-slate-700 dark:text-slate-300 max-w-md">{log.description || 'System mutation'}</p>
      ),
    },
    {
      key: 'ip',
      header: 'Client IP',
      render: (log) => (
        <span className="font-mono text-[11px] text-slate-500 dark:text-slate-400">{log.ipAddress || '127.0.0.1'}</span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            System Security & Audit Trail
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Immutable log of all administrative actions, KYC decisions, fare changes, and payout records.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="glass-panel p-4 rounded-2xl grid grid-cols-1 sm:grid-cols-2 gap-3 border border-cloudy-200 dark:border-slate-800 shadow-card">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search admin name, email, description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white dark:bg-slate-900 border border-cloudy-200 dark:border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 outline-none focus:border-brand-500 shadow-sm"
          />
        </div>

        <select
          value={module}
          onChange={(e) => setModule(e.target.value)}
          className="bg-white dark:bg-slate-900 border border-cloudy-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-slate-300 outline-none focus:border-brand-500 shadow-sm"
        >
          <option value="">All Security Modules</option>
          <option value="AUTH">AUTH</option>
          <option value="DRIVERS">DRIVERS</option>
          <option value="VEHICLES">VEHICLES</option>
          <option value="BOOKINGS">BOOKINGS</option>
          <option value="FARES">FARES</option>
          <option value="PAYOUTS">PAYOUTS</option>
          <option value="SETTINGS">SETTINGS</option>
        </select>
      </div>

      {/* Audit Logs Table */}
      <DataTable
        columns={columns}
        data={data?.data || []}
        isLoading={isLoading}
        pagination={{
          page,
          limit: 12,
          total: data?.meta?.total || 0,
          totalPages: data?.meta?.totalPages || 1,
          onPageChange: setPage,
        }}
      />
    </div>
  );
};
