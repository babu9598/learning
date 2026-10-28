import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Tag, Plus, Trash2, Calendar, TrendingUp, DollarSign, CheckCircle } from 'lucide-react';
import api from '../api/axiosClient';
import { DataTable, Column } from '../components/common/DataTable';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { Coupon } from '../types';
import { formatCurrency, formatDate } from '../utils/formatters';

export const CouponsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [isAddOpen, setIsAddOpen] = useState(false);

  // Form State
  const [code, setCode] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [discountType, setDiscountType] = useState<'PERCENTAGE' | 'FLAT'>('PERCENTAGE');
  const [discountValue, setDiscountValue] = useState(20);
  const [maxDiscountAmount, setMaxDiscountAmount] = useState(200);
  const [minBookingAmount, setMinBookingAmount] = useState(400);
  const [usageLimit, setUsageLimit] = useState(1000);

  // Fetch Coupons
  const { data: coupons, isLoading } = useQuery({
    queryKey: ['coupons'],
    queryFn: () => api.get('/coupons').then((res: any) => res.data),
  });

  // Create Coupon Mutation
  const createMutation = useMutation({
    mutationFn: (data: any) => api.post('/coupons', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coupons'] });
      setIsAddOpen(false);
      setCode('');
      setTitle('');
    },
  });

  // Delete Coupon Mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/coupons/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coupons'] });
    },
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 30);

    createMutation.mutate({
      code: code.toUpperCase(),
      title,
      description,
      discountType,
      discountValue: Number(discountValue),
      maxDiscountAmount: Number(maxDiscountAmount),
      minBookingAmount: Number(minBookingAmount),
      usageLimit: Number(usageLimit),
      startDate,
      endDate,
      isActive: true,
    });
  };

  const columns: Column<Coupon>[] = [
    {
      key: 'code',
      header: 'Coupon Code & Title',
      render: (c) => (
        <div>
          <span className="font-mono font-black bg-brand-50 dark:bg-brand-950 text-brand-800 dark:text-brand-300 px-2 py-0.5 rounded border border-brand-300 dark:border-brand-800 text-xs shadow-sm">
            {c.code}
          </span>
          <p className="font-extrabold text-slate-950 dark:text-white mt-1.5">{c.title}</p>
          <p className="text-[11px] text-slate-700 dark:text-slate-300 font-medium truncate max-w-xs">{c.description}</p>
        </div>
      ),
    },
    {
      key: 'discount',
      header: 'Discount Value',
      render: (c) => (
        <div>
          <span className="font-black text-brand-700 dark:text-brand-400 text-sm">
            {c.discountType === 'PERCENTAGE' ? `${c.discountValue}% OFF` : `₹${c.discountValue} FLAT`}
          </span>
          <p className="text-[11px] text-slate-800 dark:text-slate-200 font-bold">Max ₹{c.maxDiscountAmount}</p>
          <p className="text-[10px] text-slate-700 dark:text-slate-300 font-semibold">Min booking ₹{c.minBookingAmount}</p>
        </div>
      ),
    },
    {
      key: 'usage',
      header: 'Redemptions',
      render: (c) => (
        <div>
          <p className="font-extrabold text-slate-950 dark:text-white">
            {c.currentUses || 0} <span className="text-slate-700 dark:text-slate-300 font-bold">/ {c.usageLimit}</span>
          </p>
          <div className="w-24 bg-cloudy-200 dark:bg-slate-800 rounded-full h-1.5 mt-1 overflow-hidden">
            <div
              className="bg-brand-500 h-1.5 rounded-full"
              style={{ width: `${Math.min(100, ((c.currentUses || 0) / (c.usageLimit || 1)) * 100)}%` }}
            />
          </div>
        </div>
      ),
    },
    {
      key: 'validity',
      header: 'Validity Period',
      render: (c) => (
        <div className="text-xs">
          <p className="text-slate-950 dark:text-white font-bold">{formatDate(c.startDate)}</p>
          <p className="text-slate-700 dark:text-slate-300 text-[11px] font-semibold">to {formatDate(c.endDate)}</p>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (c) => (
        <Badge variant={c.isActive ? 'success' : 'neutral'} size="sm">
          {c.isActive ? 'ACTIVE' : 'INACTIVE'}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      render: (c) => (
        <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            onClick={() => {
              if (confirm(`Delete coupon ${c.code}?`)) {
                deleteMutation.mutate(c._id);
              }
            }}
            className="px-2.5 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-600 text-rose-700 hover:text-white dark:bg-rose-950/60 dark:hover:bg-rose-600 dark:text-rose-300 dark:hover:text-white border border-rose-200 dark:border-rose-800/80 transition-all font-bold text-xs flex items-center gap-1.5 shadow-sm active:scale-95 cursor-pointer"
            title="Delete Coupon"
          >
            <Trash2 className="w-3.5 h-3.5 shrink-0" />
            <span>Delete</span>
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-950 dark:text-white flex items-center gap-2">
            Promotional Coupons & Marketing Codes
          </h1>
          <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mt-1">
            Create percentage discounts and flat promotional credits for rider acquisition.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          icon={<Plus className="w-4 h-4" />}
          onClick={() => setIsAddOpen(true)}
          className="font-bold shadow-md shadow-brand-500/20"
        >
          Create Promo Code
        </Button>
      </div>

      {/* Coupons Data Table */}
      <DataTable columns={columns} data={coupons || []} isLoading={isLoading} />

      {/* Create Coupon Modal */}
      <Modal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="Create Promotional Coupon"
        size="md"
      >
        <form onSubmit={handleCreate} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 dark:text-slate-300 mb-1 font-semibold">Coupon Code</label>
              <input
                type="text"
                placeholder="e.g. MONSOON30"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
                className="w-full bg-white dark:bg-slate-900 border border-cloudy-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white outline-none focus:border-brand-500 uppercase font-mono shadow-sm"
              />
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 mb-1 font-semibold">Coupon Title</label>
              <input
                type="text"
                placeholder="e.g. 30% Monsoon Discount"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full bg-white dark:bg-slate-900 border border-cloudy-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white outline-none focus:border-brand-500 shadow-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-700 dark:text-slate-300 mb-1 font-semibold">Description</label>
            <input
              type="text"
              placeholder="e.g. Valid on all intercity sedan and mini truck trips"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-white dark:bg-slate-900 border border-cloudy-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white outline-none focus:border-brand-500 shadow-sm"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-700 dark:text-slate-300 mb-1 font-semibold">Discount Type</label>
              <select
                value={discountType}
                onChange={(e: any) => setDiscountType(e.target.value)}
                className="w-full bg-white dark:bg-slate-900 border border-cloudy-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white outline-none focus:border-brand-500 shadow-sm"
              >
                <option value="PERCENTAGE">Percentage (%)</option>
                <option value="FLAT">Flat Amount (₹)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 mb-1 font-semibold">Discount Value</label>
              <input
                type="number"
                value={discountValue}
                onChange={(e) => setDiscountValue(Number(e.target.value))}
                required
                min={1}
                className="w-full bg-white dark:bg-slate-900 border border-cloudy-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white outline-none focus:border-brand-500 shadow-sm"
              />
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 mb-1 font-semibold">Max Discount (₹)</label>
              <input
                type="number"
                value={maxDiscountAmount}
                onChange={(e) => setMaxDiscountAmount(Number(e.target.value))}
                required
                min={1}
                className="w-full bg-white dark:bg-slate-900 border border-cloudy-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white outline-none focus:border-brand-500 shadow-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 dark:text-slate-300 mb-1 font-semibold">Min Booking Amount (₹)</label>
              <input
                type="number"
                value={minBookingAmount}
                onChange={(e) => setMinBookingAmount(Number(e.target.value))}
                required
                min={0}
                className="w-full bg-white dark:bg-slate-900 border border-cloudy-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white outline-none focus:border-brand-500 shadow-sm"
              />
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 mb-1 font-semibold">Total Usage Cap</label>
              <input
                type="number"
                value={usageLimit}
                onChange={(e) => setUsageLimit(Number(e.target.value))}
                required
                min={1}
                className="w-full bg-white dark:bg-slate-900 border border-cloudy-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white outline-none focus:border-brand-500 shadow-sm"
              />
            </div>
          </div>

          <div className="pt-3 flex justify-end gap-3">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsAddOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" isLoading={createMutation.isPending}>
              Create Coupon
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
