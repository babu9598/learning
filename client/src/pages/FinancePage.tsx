import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  CreditCard,
  DollarSign,
  TrendingUp,
  Percent,
  CheckCircle,
  Clock,
  Send,
  Search,
  ExternalLink,
} from 'lucide-react';
import api from '../api/axiosClient';
import { DataTable, Column } from '../components/common/DataTable';
import { Badge, StatusBadge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { PaymentTransaction, PayoutRecord } from '../types';
import { formatCurrency, formatDateTime, formatDate } from '../utils/formatters';

export const FinancePage: React.FC = () => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'transactions' | 'payouts' | 'commissions'>('transactions');

  // Transactions State
  const [txPage, setTxPage] = useState(1);
  const [txSearch, setTxSearch] = useState('');
  const [txStatus, setTxStatus] = useState('');

  // Payouts State
  const [payoutPage, setPayoutPage] = useState(1);
  const [selectedPayout, setSelectedPayout] = useState<PayoutRecord | null>(null);
  const [bankRef, setBankRef] = useState('');

  // 1. Fetch Transactions
  const { data: txData, isLoading: loadingTx } = useQuery({
    queryKey: ['finance-transactions', txPage, txSearch, txStatus],
    queryFn: () =>
      api
        .get('/finance/transactions', {
          params: { page: txPage, limit: 10, search: txSearch, status: txStatus },
        })
        .then((res: any) => res),
    enabled: activeTab === 'transactions',
  });

  // 2. Fetch Payouts
  const { data: payoutData, isLoading: loadingPayouts } = useQuery({
    queryKey: ['finance-payouts', payoutPage],
    queryFn: () =>
      api
        .get('/finance/payouts', {
          params: { page: payoutPage, limit: 10 },
        })
        .then((res: any) => res),
    enabled: activeTab === 'payouts',
  });

  // 3. Fetch Commission Rules
  const { data: commissionRules } = useQuery({
    queryKey: ['finance-commissions'],
    queryFn: () => api.get('/finance/commissions').then((res: any) => res.data),
    enabled: activeTab === 'commissions',
  });

  // Batch Payout Mutation
  const generateBatchMutation = useMutation({
    mutationFn: () => api.post('/finance/payouts/batch', {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['finance-payouts'] });
      alert('Payout batch generated successfully for drivers with payable balances!');
    },
  });

  // Process Payout Mutation
  const processPayoutMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      api.patch(`/finance/payouts/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['finance-payouts'] });
      setSelectedPayout(null);
      setBankRef('');
    },
  });

  const txColumns: Column<PaymentTransaction>[] = [
    {
      key: 'transactionId',
      header: 'Transaction ID',
      render: (t) => (
        <div>
          <span className="font-extrabold text-brand-700 dark:text-brand-400 font-mono text-xs">{t.transactionId}</span>
          <p className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">{formatDateTime(t.createdAt)}</p>
        </div>
      ),
    },
    {
      key: 'booking',
      header: 'Booking Ref',
      render: (t) => (
        <span className="font-extrabold text-slate-950 dark:text-white font-mono text-xs">
          {(t.booking as any)?.bookingId}
        </span>
      ),
    },
    {
      key: 'customer',
      header: 'Customer',
      render: (t) => (
        <div>
          <p className="font-extrabold text-slate-950 dark:text-white leading-tight">{t.customer?.name}</p>
          <p className="text-[11px] text-slate-700 dark:text-slate-300 font-semibold">{t.customer?.mobile}</p>
        </div>
      ),
    },
    {
      key: 'driver',
      header: 'Driver',
      render: (t) =>
        t.driver ? (
          <div>
            <p className="font-extrabold text-slate-950 dark:text-white leading-tight">{t.driver.name}</p>
            <p className="text-[11px] text-slate-700 dark:text-slate-300 font-bold font-mono">{(t.driver as any).driverId}</p>
          </div>
        ) : (
          <span className="text-slate-600 dark:text-slate-400 font-bold">—</span>
        ),
    },
    {
      key: 'amount',
      header: 'Amount Paid',
      render: (t) => <span className="font-black text-slate-950 dark:text-white text-sm">{formatCurrency(t.amount)}</span>,
    },
    {
      key: 'method',
      header: 'Payment Mode',
      render: (t) => (
        <Badge variant="neutral" size="sm">
          {t.paymentMethod}
        </Badge>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (t) => <StatusBadge status={t.status} />,
    },
  ];

  const payoutColumns: Column<PayoutRecord>[] = [
    {
      key: 'payoutId',
      header: 'Payout ID',
      render: (p) => (
        <div>
          <span className="font-extrabold text-brand-700 dark:text-brand-400 font-mono text-xs">{p.payoutId}</span>
          <p className="text-[11px] text-slate-700 dark:text-slate-300 font-semibold">
            {formatDate(p.periodStart)} - {formatDate(p.periodEnd)}
          </p>
        </div>
      ),
    },
    {
      key: 'driver',
      header: 'Driver & Bank Account',
      render: (p) => (
        <div>
          <p className="font-extrabold text-slate-950 dark:text-white leading-tight">{p.driver?.name}</p>
          <p className="text-[11px] text-slate-700 dark:text-slate-300 font-mono font-bold">
            {p.driver?.bankDetails?.upiId || p.driver?.bankDetails?.accountNumber || 'UPI / Bank'}
          </p>
        </div>
      ),
    },
    {
      key: 'gross',
      header: 'Gross Trips Fare',
      render: (p) => (
        <div>
          <p className="font-black text-slate-950 dark:text-white">{formatCurrency(p.grossEarnings)}</p>
          <p className="text-[11px] text-slate-700 dark:text-slate-300 font-bold">{p.totalTrips} completed trips</p>
        </div>
      ),
    },
    {
      key: 'commission',
      header: 'Commission Deducted',
      render: (p) => (
        <span className="font-black text-rose-700 dark:text-rose-400">
          -{formatCurrency(p.platformCommission)}
        </span>
      ),
    },
    {
      key: 'netPayable',
      header: 'Net Payable',
      render: (p) => (
        <span className="font-black text-emerald-700 dark:text-emerald-400 text-sm">
          {formatCurrency(p.netPayable)}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (p) => <StatusBadge status={p.status} />,
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      render: (p) =>
        p.status !== 'PAID' ? (
          <Button
            variant="success"
            size="sm"
            onClick={() => setSelectedPayout(p)}
            className="text-xs py-1 font-bold"
          >
            Mark as Paid
          </Button>
        ) : (
          <span className="text-[11px] text-slate-700 dark:text-slate-300 font-mono font-bold">{p.bankReferenceNumber || 'Settled'}</span>
        ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-950 dark:text-white flex items-center gap-2">
            Finance, Ledger & Driver Payouts
          </h1>
          <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mt-1">
            Real-time transaction reconciliation, automated 20% platform commission snapshots, and driver payouts.
          </p>
        </div>

        {activeTab === 'payouts' && (
          <Button
            variant="primary"
            size="sm"
            icon={<Send className="w-4 h-4" />}
            isLoading={generateBatchMutation.isPending}
            onClick={() => generateBatchMutation.mutate()}
            className="font-bold shadow-md shadow-brand-500/20"
          >
            Generate Payout Batch
          </Button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-cloudy-200 dark:border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('transactions')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${
            activeTab === 'transactions'
              ? 'bg-brand-500 text-white shadow-md shadow-brand-500/20'
              : 'text-slate-600 hover:text-slate-900 bg-cloudy-100 hover:bg-cloudy-200 dark:text-slate-400 dark:hover:text-white dark:bg-slate-800/40'
          }`}
        >
          <CreditCard className="w-4 h-4" /> Transactions Ledger
        </button>

        <button
          onClick={() => setActiveTab('payouts')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${
            activeTab === 'payouts'
              ? 'bg-brand-500 text-white shadow-md shadow-brand-500/20'
              : 'text-slate-600 hover:text-slate-900 bg-cloudy-100 hover:bg-cloudy-200 dark:text-slate-400 dark:hover:text-white dark:bg-slate-800/40'
          }`}
        >
          <DollarSign className="w-4 h-4" /> Driver Settlement Payouts
        </button>

        <button
          onClick={() => setActiveTab('commissions')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${
            activeTab === 'commissions'
              ? 'bg-brand-500 text-white shadow-md shadow-brand-500/20'
              : 'text-slate-600 hover:text-slate-900 bg-cloudy-100 hover:bg-cloudy-200 dark:text-slate-400 dark:hover:text-white dark:bg-slate-800/40'
          }`}
        >
          <Percent className="w-4 h-4" /> Commission Rules
        </button>
      </div>

      {/* Tab 1: Transactions */}
      {activeTab === 'transactions' && (
        <DataTable
          columns={txColumns}
          data={txData?.data || []}
          isLoading={loadingTx}
          pagination={{
            page: txPage,
            limit: 10,
            total: txData?.meta?.total || 0,
            totalPages: txData?.meta?.totalPages || 1,
            onPageChange: setTxPage,
          }}
        />
      )}

      {/* Tab 2: Payouts */}
      {activeTab === 'payouts' && (
        <DataTable
          columns={payoutColumns}
          data={payoutData?.data || []}
          isLoading={loadingPayouts}
          pagination={{
            page: payoutPage,
            limit: 10,
            total: payoutData?.meta?.total || 0,
            totalPages: payoutData?.meta?.totalPages || 1,
            onPageChange: setPayoutPage,
          }}
        />
      )}

      {/* Tab 3: Commission Rules */}
      {activeTab === 'commissions' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {(commissionRules || []).map((rule: any) => (
            <div key={rule._id} className="glass-panel p-5 rounded-2xl border border-cloudy-200 dark:border-slate-800 space-y-3 shadow-card">
              <div className="flex items-center justify-between">
                <Badge variant="brand" size="sm">
                  {rule.ruleType}
                </Badge>
                <Badge variant={rule.isActive ? 'success' : 'neutral'} size="sm">
                  {rule.isActive ? 'Active' : 'Disabled'}
                </Badge>
              </div>

              <div>
                <h4 className="text-xl font-bold text-slate-900 dark:text-white">
                  {rule.commissionPercentage}% Platform Commission
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {rule.description || 'Standard platform fee with 18% GST deduction'}
                </p>
              </div>

              <div className="p-3 bg-cloudy-50 dark:bg-slate-950 rounded-xl text-xs space-y-1 text-slate-700 dark:text-slate-300 border border-cloudy-200 dark:border-slate-800">
                <div className="flex justify-between">
                  <span>GST on Service Fee:</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{rule.taxOnCommission}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Fixed Fee:</span>
                  <span className="font-semibold text-slate-900 dark:text-white">₹{rule.fixedFee}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Process Payout Modal */}
      <Modal
        isOpen={!!selectedPayout}
        onClose={() => setSelectedPayout(null)}
        title={`Process Settlement: ${selectedPayout?.payoutId}`}
        size="md"
      >
        {selectedPayout && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              processPayoutMutation.mutate({
                id: selectedPayout._id,
                data: {
                  status: 'PAID',
                  paymentMode: 'UPI',
                  bankReferenceNumber: bankRef || `UPI-TXN-${Date.now()}`,
                  paidAmount: selectedPayout.netPayable,
                },
              });
            }}
            className="space-y-4 text-xs"
          >
            <div className="p-3.5 bg-cloudy-50 dark:bg-slate-950 rounded-xl border border-cloudy-200 dark:border-slate-800 space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Driver Partner:</span>
                <span className="font-bold text-slate-900 dark:text-white">{selectedPayout.driver?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Net Payable Amount:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">
                  {formatCurrency(selectedPayout.netPayable)}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 mb-1 font-semibold">
                Bank / UPI Transaction Reference Number
              </label>
              <input
                type="text"
                placeholder="e.g. UPI-REF-99881122"
                value={bankRef}
                onChange={(e) => setBankRef(e.target.value)}
                className="w-full bg-white dark:bg-slate-900 border border-cloudy-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white outline-none focus:border-brand-500 font-mono shadow-sm"
              />
            </div>

            <div className="pt-3 flex justify-end gap-3">
              <Button type="button" variant="outline" size="sm" onClick={() => setSelectedPayout(null)}>
                Cancel
              </Button>
              <Button
                type="submit"
                variant="success"
                size="sm"
                isLoading={processPayoutMutation.isPending}
              >
                Confirm Payout Settlement
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};
