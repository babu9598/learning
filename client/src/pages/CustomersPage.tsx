import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Users,
  Search,
  Ban,
  CheckCircle,
  Wallet,
  Star,
  Calendar,
  Mail,
  Phone,
  ArrowRight,
  UserCheck,
  CreditCard,
  MapPin,
  Clock,
  ShieldCheck,
  ShieldAlert,
} from 'lucide-react';
import api from '../api/axiosClient';
import { DataTable, Column } from '../components/common/DataTable';
import { Badge, StatusBadge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { Drawer } from '../components/common/Drawer';
import { Customer } from '../types';
import { formatCurrency, formatDate } from '../utils/formatters';

export const CustomersPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);

  // Fetch Customers
  const { data, isLoading } = useQuery({
    queryKey: ['customers', page, search, status],
    queryFn: () =>
      api
        .get('/customers', {
          params: { page, limit: 10, search, status },
        })
        .then((res: any) => res),
    refetchInterval: 10000,
  });

  // Fetch Customer Details
  const { data: customerDetails, isLoading: loadingDetails } = useQuery({
    queryKey: ['customer-detail', selectedCustomerId],
    queryFn: () => api.get(`/customers/${selectedCustomerId}`).then((res: any) => res.data),
    enabled: !!selectedCustomerId,
  });

  // Block/Unblock Mutation
  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      api.patch(`/customers/${id}/status`, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      queryClient.invalidateQueries({ queryKey: ['customer-detail', selectedCustomerId] });
    },
  });

  // Derived KPI counts
  const customersList = data?.data || [];
  const totalCustomers = data?.meta?.total || customersList.length;
  const activeCount = customersList.filter((c: any) => c.status === 'ACTIVE').length;
  const blockedCount = customersList.filter((c: any) => c.status === 'BLOCKED').length;
  const totalWalletSum = customersList.reduce((acc: number, c: any) => acc + (c.walletBalance || 0), 0);

  const columns: Column<Customer>[] = [
    {
      key: 'name',
      header: 'Customer',
      className: 'whitespace-nowrap min-w-[180px]',
      render: (c) => (
        <div className="flex items-center gap-2.5 whitespace-nowrap">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-brand-600 to-indigo-600 text-white font-black text-[11px] flex items-center justify-center shrink-0 shadow-xs ring-1 ring-brand-500/30">
            {c.name ? c.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="whitespace-nowrap">
            <span className="font-extrabold text-slate-950 dark:text-white text-xs block leading-tight">
              {c.name}
            </span>
            <span className="text-[10px] text-brand-700 dark:text-brand-400 font-bold font-mono block leading-tight">
              {c.customerId}
            </span>
          </div>
        </div>
      ),
    },
    {
      key: 'contact',
      header: 'Contact Info',
      className: 'whitespace-nowrap min-w-[210px]',
      render: (c) => (
        <div className="whitespace-nowrap flex items-center gap-2 text-xs">
          <span className="font-bold text-slate-900 dark:text-slate-100">{c.mobile}</span>
          <span className="text-slate-400">•</span>
          <span className="text-slate-600 dark:text-slate-400 font-medium text-[11px]">{c.email}</span>
        </div>
      ),
    },
    {
      key: 'trips',
      header: 'Trips & Spent',
      className: 'whitespace-nowrap min-w-[170px]',
      render: (c) => (
        <div className="flex items-center gap-1.5 whitespace-nowrap">
          <span className="font-extrabold text-xs text-slate-950 dark:text-white">{c.totalTrips} Trips</span>
          <span className="text-slate-400">•</span>
          <span className="text-xs font-extrabold text-emerald-700 dark:text-emerald-400">
            {formatCurrency(c.totalSpent)}
          </span>
        </div>
      ),
    },
    {
      key: 'wallet',
      header: 'In-App Wallet',
      className: 'whitespace-nowrap min-w-[120px]',
      render: (c) => (
        <span className="font-mono font-extrabold text-xs px-2 py-0.5 rounded-lg bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800 whitespace-nowrap inline-flex items-center gap-1">
          <Wallet className="w-3 h-3 shrink-0" />
          {formatCurrency(c.walletBalance)}
        </span>
      ),
    },
    {
      key: 'rating',
      header: 'Rating',
      className: 'whitespace-nowrap min-w-[80px]',
      render: (c) => (
        <div className="flex items-center gap-1 font-extrabold text-xs text-slate-900 dark:text-slate-100 whitespace-nowrap">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 shrink-0" />
          <span>{Number(c.rating || 5.0).toFixed(1)}</span>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      className: 'whitespace-nowrap min-w-[100px]',
      render: (c) => (
        <div className="whitespace-nowrap">
          <StatusBadge status={c.status} />
        </div>
      ),
    },
    {
      key: 'registeredDate',
      header: 'Joined',
      className: 'whitespace-nowrap min-w-[110px]',
      render: (c) => (
        <span className="text-[11px] text-slate-600 dark:text-slate-400 font-bold whitespace-nowrap">
          {formatDate(c.registeredDate || c.createdAt)}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      className: 'whitespace-nowrap min-w-[160px]',
      render: (c) => (
        <div className="flex items-center justify-end gap-1.5 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            onClick={() => setSelectedCustomerId(c._id)}
            className="px-2.5 py-1 rounded-lg bg-brand-50 hover:bg-brand-600 text-brand-800 hover:text-white dark:bg-brand-950/60 dark:hover:bg-brand-600 dark:text-brand-300 dark:hover:text-white border border-brand-200 dark:border-brand-800 transition-all font-bold text-[11px] flex items-center gap-1 shadow-sm active:scale-95 cursor-pointer"
            title="View Customer Profile"
          >
            <span>Profile</span>
            <ArrowRight className="w-3 h-3 shrink-0" />
          </button>
          <button
            type="button"
            onClick={() => {
              const action = c.status === 'ACTIVE' ? 'Block' : 'Unblock';
              if (confirm(`${action} customer ${c.name}?`)) {
                statusMutation.mutate({
                  id: c._id,
                  status: c.status === 'ACTIVE' ? 'BLOCKED' : 'ACTIVE',
                });
              }
            }}
            className={`px-2.5 py-1 rounded-lg border transition-all font-bold text-[11px] flex items-center gap-1 shadow-sm active:scale-95 cursor-pointer ${
              c.status === 'ACTIVE'
                ? 'bg-rose-50 hover:bg-rose-600 text-rose-700 hover:text-white dark:bg-rose-950/60 dark:hover:bg-rose-600 dark:text-rose-300 dark:hover:text-white border border-rose-200 dark:border-rose-800'
                : 'bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white dark:bg-emerald-950/60 dark:hover:bg-emerald-600 dark:text-emerald-300 dark:hover:text-white border border-emerald-200 dark:border-emerald-800'
            }`}
            title={c.status === 'ACTIVE' ? 'Block Customer' : 'Unblock Customer'}
          >
            {c.status === 'ACTIVE' ? (
              <>
                <Ban className="w-3 h-3 shrink-0" />
                <span>Block</span>
              </>
            ) : (
              <>
                <CheckCircle className="w-3 h-3 shrink-0" />
                <span>Unblock</span>
              </>
            )}
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-5">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-950 dark:text-white flex items-center gap-2">
            Customer Management
          </h1>
        </div>
      </div>

      {/* KPI Summary Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="glass-panel p-3.5 rounded-2xl border border-cloudy-200 dark:border-slate-800 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-brand-50 dark:bg-brand-950/60 border border-brand-200 dark:border-brand-800/80 flex items-center justify-center text-brand-600 dark:text-brand-400 shrink-0">
            <Users className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
              Registered
            </span>
            <span className="text-base font-black text-slate-950 dark:text-white font-mono leading-tight">
              {totalCustomers}
            </span>
          </div>
        </div>

        <div className="glass-panel p-3.5 rounded-2xl border border-cloudy-200 dark:border-slate-800 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/80 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
            <UserCheck className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
              Active Users
            </span>
            <span className="text-base font-black text-emerald-700 dark:text-emerald-400 font-mono leading-tight">
              {activeCount}
            </span>
          </div>
        </div>

        <div className="glass-panel p-3.5 rounded-2xl border border-cloudy-200 dark:border-slate-800 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800/80 flex items-center justify-center text-rose-600 dark:text-rose-400 shrink-0">
            <Ban className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
              Blocked Accounts
            </span>
            <span className="text-base font-black text-rose-700 dark:text-rose-400 font-mono leading-tight">
              {blockedCount}
            </span>
          </div>
        </div>

        <div className="glass-panel p-3.5 rounded-2xl border border-cloudy-200 dark:border-slate-800 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800/80 flex items-center justify-center text-sky-600 dark:text-sky-400 shrink-0">
            <Wallet className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
              Wallet Float
            </span>
            <span className="text-base font-black text-sky-700 dark:text-sky-400 font-mono leading-tight">
              {formatCurrency(totalWalletSum)}
            </span>
          </div>
        </div>
      </div>

      {/* Filters Strip */}
      <div className="glass-panel p-3.5 rounded-2xl grid grid-cols-1 sm:grid-cols-3 gap-3 border border-cloudy-200 dark:border-slate-800 shadow-card">
        <div className="relative sm:col-span-2">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
          <input
            type="text"
            placeholder="Search customer by name, mobile, email, or customer ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white dark:bg-slate-900 border border-cloudy-300 dark:border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs font-bold text-slate-950 dark:text-white placeholder-slate-500 outline-none focus:border-brand-500 shadow-sm"
          />
        </div>

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="bg-white dark:bg-slate-900 border border-cloudy-300 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 dark:text-slate-100 outline-none focus:border-brand-500 shadow-sm"
        >
          <option value="">All Account Statuses</option>
          <option value="ACTIVE">Active Users Only</option>
          <option value="BLOCKED">Blocked Users Only</option>
        </select>
      </div>

      {/* Customers Compact Data Table */}
      <DataTable
        columns={columns}
        data={data?.data || []}
        isLoading={isLoading}
        compact={true}
        onRowClick={(c) => setSelectedCustomerId(c._id)}
        pagination={{
          page,
          limit: 10,
          total: data?.meta?.total || 0,
          totalPages: data?.meta?.totalPages || 1,
          onPageChange: setPage,
        }}
      />

      {/* Customer Profile & Trip History Drawer */}
      <Drawer
        isOpen={!!selectedCustomerId}
        onClose={() => setSelectedCustomerId(null)}
        title={customerDetails?.customer?.name || 'Customer Profile'}
        subtitle={customerDetails?.customer ? `Member since ${formatDate(customerDetails.customer.registeredDate || customerDetails.customer.createdAt)}` : ''}
        size="lg"
      >
        {loadingDetails ? (
          <div className="py-12 text-center text-xs text-slate-500">Loading customer account history...</div>
        ) : customerDetails?.customer ? (
          <div className="space-y-5 text-xs">
            {/* Header info profile card */}
            <div className="p-4 bg-slate-50 dark:bg-slate-900/80 rounded-2xl border border-cloudy-200 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-600 text-white font-black text-sm flex items-center justify-center shrink-0 shadow-md ring-2 ring-brand-500/30">
                  {customerDetails.customer.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-black text-slate-950 dark:text-white">
                      {customerDetails.customer.name}
                    </h4>
                    <StatusBadge status={customerDetails.customer.status} />
                  </div>
                  <p className="text-[11px] text-brand-700 dark:text-brand-400 font-mono font-bold mt-0.5">
                    {customerDetails.customer.customerId}
                  </p>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 font-medium mt-0.5">
                    {customerDetails.customer.mobile} • {customerDetails.customer.email}
                  </p>
                </div>
              </div>

              <Button
                variant={customerDetails.customer.status === 'ACTIVE' ? 'danger' : 'success'}
                size="sm"
                icon={
                  customerDetails.customer.status === 'ACTIVE' ? (
                    <Ban className="w-3.5 h-3.5" />
                  ) : (
                    <CheckCircle className="w-3.5 h-3.5" />
                  )
                }
                onClick={() => {
                  const targetStatus = customerDetails.customer.status === 'ACTIVE' ? 'BLOCKED' : 'ACTIVE';
                  statusMutation.mutate({
                    id: customerDetails.customer._id,
                    status: targetStatus,
                  });
                }}
                className="font-bold shrink-0"
              >
                {customerDetails.customer.status === 'ACTIVE' ? 'Block Account' : 'Unblock Account'}
              </Button>
            </div>

            {/* Quick Metrics 4-Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-cloudy-200 dark:border-slate-800">
                <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 block">
                  Wallet Balance
                </span>
                <span className="text-sm font-black text-sky-600 dark:text-sky-400 font-mono mt-0.5 block">
                  {formatCurrency(customerDetails.customer.walletBalance)}
                </span>
              </div>
              <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-cloudy-200 dark:border-slate-800">
                <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 block">
                  Total Bookings
                </span>
                <span className="text-sm font-black text-slate-950 dark:text-white font-mono mt-0.5 block">
                  {customerDetails.customer.totalTrips} Trips
                </span>
              </div>
              <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-cloudy-200 dark:border-slate-800">
                <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 block">
                  Lifetime Spend
                </span>
                <span className="text-sm font-black text-emerald-600 dark:text-emerald-400 font-mono mt-0.5 block">
                  {formatCurrency(customerDetails.customer.totalSpent)}
                </span>
              </div>
              <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-cloudy-200 dark:border-slate-800">
                <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 block">
                  Passenger Rating
                </span>
                <span className="text-sm font-black text-amber-500 font-mono mt-0.5 flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  {Number(customerDetails.customer.rating || 5.0).toFixed(1)}
                </span>
              </div>
            </div>

            {/* Recent Trips History */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-300">
                  Recent Bookings History
                </h4>
                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">
                  {customerDetails.bookings?.length || 0} Records
                </span>
              </div>

              {(!customerDetails.bookings || customerDetails.bookings.length === 0) ? (
                <div className="p-6 rounded-xl bg-slate-50 dark:bg-slate-900 text-center text-slate-500 border border-cloudy-200 dark:border-slate-800">
                  <p className="font-bold">No previous booking history found for this passenger.</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
                  {customerDetails.bookings.map((b: any) => (
                    <div
                      key={b._id}
                      className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-cloudy-200 dark:border-slate-800 flex items-center justify-between gap-3 hover:border-brand-500/50 transition-colors"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-black text-xs text-slate-950 dark:text-white">
                            {b.bookingId}
                          </span>
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                            {b.serviceType === 'DROP_TAXI' ? '🚕 Drop Taxi' : '🚚 Goods Truck'}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 dark:text-slate-400 font-medium truncate mt-1">
                          {b.pickupLocation?.address} → {b.dropLocation?.address}
                        </p>
                      </div>

                      <div className="text-right shrink-0">
                        <p className="font-mono font-black text-xs text-slate-950 dark:text-white">
                          {formatCurrency(b.fareBreakdown?.finalFare || b.estimatedFare)}
                        </p>
                        <div className="mt-0.5">
                          <StatusBadge status={b.status} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : null}
      </Drawer>
    </div>
  );
};
