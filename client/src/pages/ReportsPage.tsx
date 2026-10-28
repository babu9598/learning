import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  FileBarChart,
  Download,
  FileSpreadsheet,
  FileText,
  Calendar,
  DollarSign,
  UserCheck,
  Truck,
  CalendarCheck,
  CheckCircle2,
  XCircle,
  Navigation,
  Users,
  TrendingUp,
  X,
} from 'lucide-react';
import api from '../api/axiosClient';
import { Button } from '../components/common/Button';
import { StatusBadge } from '../components/common/Badge';
import { exportToCsv, exportToPdf } from '../utils/exportUtils';
import { formatCurrency, formatDate, formatDateTime } from '../utils/formatters';

const getSummaryIcon = (key: string) => {
  const k = key.toLowerCase();
  if (k.includes('booking')) return <CalendarCheck className="w-4 h-4 text-brand-700 dark:text-brand-400" />;
  if (k.includes('complete')) return <CheckCircle2 className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />;
  if (k.includes('cancel')) return <XCircle className="w-4 h-4 text-rose-700 dark:text-rose-400" />;
  if (k.includes('fare') || k.includes('rev') || k.includes('comm') || k.includes('earn') || k.includes('pay') || k.includes('tax'))
    return <DollarSign className="w-4 h-4 text-amber-700 dark:text-amber-400" />;
  if (k.includes('dist')) return <Navigation className="w-4 h-4 text-sky-700 dark:text-sky-400" />;
  if (k.includes('driver')) return <UserCheck className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />;
  if (k.includes('vehicle') || k.includes('truck') || k.includes('taxi')) return <Truck className="w-4 h-4 text-blue-700 dark:text-blue-400" />;
  if (k.includes('user') || k.includes('customer')) return <Users className="w-4 h-4 text-purple-700 dark:text-purple-400" />;
  return <TrendingUp className="w-4 h-4 text-brand-700 dark:text-brand-400" />;
};

export const ReportsPage: React.FC = () => {
  const [reportType, setReportType] = useState<'bookings' | 'revenue' | 'drivers' | 'vehicles'>('bookings');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Fetch Report Data
  const { data: reportData, isLoading } = useQuery({
    queryKey: ['reports', reportType, startDate, endDate],
    queryFn: () =>
      api
        .get(`/reports/${reportType}`, {
          params: { startDate: startDate || undefined, endDate: endDate || undefined },
        })
        .then((res: any) => res.data),
  });

  const handleExportCsv = () => {
    if (!reportData?.rows || !reportData.rows.length) {
      alert('No data available to export');
      return;
    }
    exportToCsv(`${reportType}_report`, reportData.rows);
  };

  const handleExportPdf = () => {
    if (!reportData?.rows || !reportData.rows.length) {
      alert('No data available to export');
      return;
    }

    if (reportType === 'bookings') {
      const cols = ['Booking ID', 'Date', 'Customer', 'Service', 'Fare', 'Commission', 'Status'];
      const rows = reportData.rows.map((r: any) => [
        r.bookingId,
        formatDate(r.date),
        r.customerName,
        r.serviceType,
        `₹${r.finalFare}`,
        `₹${r.platformCommission}`,
        r.status,
      ]);
      exportToPdf('DropTaxi & Goods Truck - Bookings Report', cols, rows, 'bookings_report');
    } else if (reportType === 'revenue') {
      const cols = ['Booking ID', 'Date', 'Service', 'Subtotal', 'Discount', 'GST Tax', 'Final Fare', 'Commission'];
      const rows = reportData.rows.map((r: any) => [
        r.bookingId,
        formatDate(r.date),
        r.serviceType,
        `₹${r.subtotal}`,
        `₹${r.discount}`,
        `₹${r.tax}`,
        `₹${r.finalFare}`,
        `₹${r.platformCommission}`,
      ]);
      exportToPdf('DropTaxi & Goods Truck - Financial Revenue Report', cols, rows, 'revenue_report');
    } else {
      handleExportCsv();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-950 dark:text-white flex items-center gap-2">
            Reports & Business Intelligence
          </h1>
          <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mt-1">
            Export comprehensive trip logs, tax audits, commission breakdowns, and driver summaries.
          </p>
        </div>

        {/* Export Buttons */}
        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            icon={<FileSpreadsheet className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />}
            onClick={handleExportCsv}
            className="font-bold border-cloudy-300"
          >
            Export CSV
          </Button>

          <Button
            variant="primary"
            size="sm"
            icon={<FileText className="w-3.5 h-3.5" />}
            onClick={handleExportPdf}
            className="font-bold shadow-md shadow-brand-500/20"
          >
            Export PDF
          </Button>
        </div>
      </div>

      {/* 1. Report Summary Stats Cards (Positioned on Top with Gentle Icons) */}
      {reportData?.summary && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
          {Object.entries(reportData.summary).map(([key, val]: any) => (
            <div
              key={key}
              className="glass-panel p-4 rounded-2xl border border-cloudy-200 dark:border-slate-800 shadow-card flex items-center justify-between gap-3 hover:border-brand-300 dark:hover:border-slate-700 transition-all group"
            >
              <div className="space-y-1">
                <span className="text-[10px] text-slate-700 dark:text-slate-300 font-extrabold uppercase block tracking-wider">
                  {key.replace(/([A-Z])/g, ' $1')}
                </span>
                <span className="text-xl sm:text-2xl font-black text-slate-950 dark:text-white block">
                  {typeof val === 'number' &&
                  (key.toLowerCase().includes('revenue') ||
                    key.toLowerCase().includes('gross') ||
                    key.toLowerCase().includes('fare') ||
                    key.toLowerCase().includes('commission') ||
                    key.toLowerCase().includes('payout'))
                    ? formatCurrency(val)
                    : val}
                </span>
              </div>
              <div className="w-8 h-8 rounded-xl bg-cloudy-100 dark:bg-slate-800 border border-cloudy-300 dark:border-slate-700 flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                {getSummaryIcon(key)}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 2. Navigation Tabs & Unified Date Filter Strip */}
      <div className="glass-panel p-4 rounded-2xl border border-cloudy-200 dark:border-slate-800 shadow-card space-y-4">
        {/* Report Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-b border-cloudy-200 dark:border-slate-800 pb-3">
          <button
            onClick={() => setReportType('bookings')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
              reportType === 'bookings'
                ? 'bg-brand-600 text-white shadow-sm'
                : 'text-slate-800 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white bg-white dark:bg-slate-800 border border-cloudy-300 dark:border-transparent'
            }`}
          >
            <FileBarChart className="w-4 h-4" /> Bookings Report
          </button>

          <button
            onClick={() => setReportType('revenue')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
              reportType === 'revenue'
                ? 'bg-brand-600 text-white shadow-sm'
                : 'text-slate-800 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white bg-white dark:bg-slate-800 border border-cloudy-300 dark:border-transparent'
            }`}
          >
            <DollarSign className="w-4 h-4" /> Revenue & Taxes Audit
          </button>

          <button
            onClick={() => setReportType('drivers')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
              reportType === 'drivers'
                ? 'bg-brand-600 text-white shadow-sm'
                : 'text-slate-800 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white bg-white dark:bg-slate-800 border border-cloudy-300 dark:border-transparent'
            }`}
          >
            <UserCheck className="w-4 h-4" /> Driver Performance
          </button>

          <button
            onClick={() => setReportType('vehicles')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
              reportType === 'vehicles'
                ? 'bg-brand-600 text-white shadow-sm'
                : 'text-slate-800 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white bg-white dark:bg-slate-800 border border-cloudy-300 dark:border-transparent'
            }`}
          >
            <Truck className="w-4 h-4" /> Fleet Utilization
          </button>
        </div>

        {/* Single Clean Date Range Strip */}
        <div className="flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-slate-800 dark:text-slate-200 font-bold">From Date:</span>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="bg-white dark:bg-slate-900 border border-cloudy-300 dark:border-slate-700 rounded-xl px-3 py-1.5 text-slate-950 dark:text-white font-bold outline-none focus:border-brand-500 shadow-sm"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-slate-800 dark:text-slate-200 font-bold">To Date:</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="bg-white dark:bg-slate-900 border border-cloudy-300 dark:border-slate-700 rounded-xl px-3 py-1.5 text-slate-950 dark:text-white font-bold outline-none focus:border-brand-500 shadow-sm"
              />
            </div>

            {(startDate || endDate) && (
              <button
                type="button"
                onClick={() => {
                  setStartDate('');
                  setEndDate('');
                }}
                className="px-2.5 py-1 rounded-lg text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 hover:bg-rose-600 hover:text-white font-bold transition-all text-xs"
              >
                Clear Dates
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 3. Dynamic Report Table */}
      <div className="glass-panel rounded-2xl overflow-hidden border border-cloudy-200 dark:border-slate-800 shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-800 dark:text-slate-200">
            <thead className="bg-slate-100/95 dark:bg-slate-900/95 text-slate-950 dark:text-slate-100 uppercase tracking-wider font-extrabold text-[11px] border-b-2 border-cloudy-300 dark:border-slate-800">
              <tr>
                {reportData?.rows?.[0] &&
                  Object.keys(reportData.rows[0]).map((col) => (
                    <th key={col} className="px-5 py-3.5">
                      {col.replace(/([A-Z])/g, ' $1')}
                    </th>
                  ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-cloudy-200/80 dark:divide-slate-800/80 font-medium">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-700 dark:text-slate-300 font-bold">
                    Generating report data...
                  </td>
                </tr>
              ) : (reportData?.rows || []).length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-700 dark:text-slate-300 font-bold">
                    No records found for the selected date range.
                  </td>
                </tr>
              ) : (
                (reportData?.rows || []).map((row: any, rIdx: number) => (
                  <tr key={rIdx} className="hover:bg-cloudy-100/80 dark:hover:bg-slate-800/50 transition-colors">
                    {Object.entries(row).map(([k, v]: any, cIdx: number) => (
                      <td key={cIdx} className="px-5 py-3.5 align-middle text-slate-950 dark:text-slate-100 font-semibold">
                        {k.toLowerCase().includes('date') ? (
                          formatDate(v)
                        ) : typeof v === 'number' &&
                          (k.toLowerCase().includes('fare') ||
                            k.toLowerCase().includes('revenue') ||
                            k.toLowerCase().includes('commission') ||
                            k.toLowerCase().includes('earning') ||
                            k.toLowerCase().includes('balance') ||
                            k.toLowerCase().includes('tax')) ? (
                          <span className="font-extrabold">{formatCurrency(v)}</span>
                        ) : k === 'status' ? (
                          <StatusBadge status={v} className="text-[10px] py-0.5" />
                        ) : (
                          v?.toString() || '—'
                        )}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
