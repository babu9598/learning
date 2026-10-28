import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Calendar,
  CalendarCheck,
  Search,
  Filter,
  MapPin,
  Clock,
  User,
  Car,
  CreditCard,
  CheckCircle,
  XCircle,
  AlertCircle,
  Package,
  ArrowRight,
  Sparkles,
  Calculator,
  ShieldCheck,
  Check,
} from 'lucide-react';
import api from '../api/axiosClient';
import { DataTable, Column } from '../components/common/DataTable';
import { Badge, StatusBadge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { Drawer } from '../components/common/Drawer';
import { Booking } from '../types';
import { formatCurrency, formatDateTime } from '../utils/formatters';

export const BookingsPage: React.FC = () => {
  const queryClient = useQueryClient();

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [serviceType, setServiceType] = useState('');
  const [scopeFilter, setScopeFilter] = useState('');
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);

  type BookingPeriod = 'today' | 'this_week' | 'this_month' | 'all' | 'custom';
  const [period, setPeriod] = useState<BookingPeriod>('today');

  const getTodayDateStr = () => {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };

  const getPastDateStr = (daysAgo: number) => {
    const d = new Date();
    d.setDate(d.getDate() - daysAgo);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };

  const [customStartDate, setCustomStartDate] = useState<string>(() => getPastDateStr(7));
  const [customEndDate, setCustomEndDate] = useState<string>(() => getTodayDateStr());
  const [showCustomPicker, setShowCustomPicker] = useState<boolean>(false);

  // Fetch Bookings with Date Filter
  const { data, isLoading } = useQuery({
    queryKey: ['bookings', page, search, status, serviceType, scopeFilter, period, customStartDate, customEndDate],
    queryFn: () =>
      api
        .get('/bookings', {
          params: {
            page,
            limit: 10,
            search,
            status,
            serviceType,
            period,
            startDate: customStartDate,
            endDate: customEndDate,
          },
        })
        .then((res: any) => res),
    refetchInterval: 8000,
  });

  // Fetch Selected Booking Detail
  const { data: bookingDetail } = useQuery({
    queryKey: ['booking-detail', selectedBookingId],
    queryFn: () => api.get(`/bookings/${selectedBookingId}`).then((res: any) => res.data),
    enabled: !!selectedBookingId,
  });

  // Update Status Mutation (Admin cancellation)
  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status, reason }: { id: string; status: string; reason?: string }) =>
      api.patch(`/bookings/${id}/status`, { status, cancellationReason: reason }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      queryClient.invalidateQueries({ queryKey: ['booking-detail', selectedBookingId] });
    },
  });

  const columns: Column<Booking>[] = [
    {
      key: 'bookingId',
      header: 'Booking ID',
      className: 'whitespace-nowrap min-w-[140px]',
      render: (b) => (
        <div className="whitespace-nowrap">
          <span className="font-extrabold text-[#0F4471] dark:text-sky-400 font-mono text-xs block whitespace-nowrap">
            {b.bookingId}
          </span>
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 whitespace-nowrap block">
            {formatDateTime(b.createdAt)}
          </span>
        </div>
      ),
    },
    {
      key: 'customer',
      header: 'Customer',
      className: 'whitespace-nowrap min-w-[160px]',
      render: (b) => (
        <div className="whitespace-nowrap">
          <p className="font-bold text-slate-900 dark:text-white leading-tight whitespace-nowrap">
            {b.customer?.name || 'Walk-in Customer'}
          </p>
          <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 whitespace-nowrap">
            {b.customer?.mobile || '—'}
          </p>
        </div>
      ),
    },
    {
      key: 'serviceType',
      header: 'Service',
      className: 'whitespace-nowrap min-w-[170px]',
      render: (b) => (
        <div className="flex items-center gap-1.5 whitespace-nowrap">
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-extrabold shrink-0 whitespace-nowrap ${
              b.serviceType === 'DROP_TAXI'
                ? 'bg-sky-50 text-sky-700 dark:bg-sky-950/70 dark:text-sky-300 border border-sky-200 dark:border-sky-800'
                : 'bg-amber-50 text-amber-700 dark:bg-amber-950/70 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
            }`}
          >
            {b.serviceType === 'DROP_TAXI' ? '🚕 DropTaxi' : '🚚 Goods Truck'}
          </span>
          <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide whitespace-nowrap">
            {b.vehicleCategory ? b.vehicleCategory.replace(/_/g, ' ') : '—'}
          </span>
        </div>
      ),
    },
    {
      key: 'route',
      header: 'Pickup & Drop',
      className: 'min-w-[240px] max-w-[280px]',
      render: (b) => (
        <div className="space-y-1 text-xs">
          <div className="flex items-start gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 mt-1 shrink-0" />
            <span className="text-slate-900 dark:text-slate-100 font-medium truncate" title={b.pickupLocation?.address}>
              {b.pickupLocation?.address || '—'}
            </span>
          </div>
          <div className="flex items-start gap-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-500 mt-1 shrink-0" />
            <span className="text-slate-700 dark:text-slate-300 font-medium truncate" title={b.dropLocation?.address}>
              {b.dropLocation?.address || '—'}
            </span>
          </div>
          <div className="text-[10px] font-semibold text-slate-400 pl-3.5 whitespace-nowrap">
            {b.distanceKm} km • {b.tripScope === 'INTER_STATION' ? 'Inter-Station' : 'Outstation'}
          </div>
        </div>
      ),
    },
    {
      key: 'driver',
      header: 'Driver',
      className: 'whitespace-nowrap min-w-[150px]',
      render: (b) =>
        b.driver ? (
          <div className="whitespace-nowrap">
            <p className="font-bold text-slate-900 dark:text-white leading-tight whitespace-nowrap">{b.driver.name}</p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium whitespace-nowrap">
              {(b.driver as any).mobile || (b.driver as any).driverId || 'Assigned'}
            </p>
          </div>
        ) : (
          <span className="text-[11px] text-amber-700 dark:text-amber-400 font-medium bg-amber-50 dark:bg-amber-950/50 px-2 py-0.5 rounded border border-amber-200 dark:border-amber-900 inline-flex items-center gap-1 whitespace-nowrap">
            Searching...
          </span>
        ),
    },
    {
      key: 'fare',
      header: 'Fare',
      className: 'whitespace-nowrap min-w-[100px]',
      render: (b) => (
        <div className="whitespace-nowrap">
          <p className="font-extrabold text-slate-950 dark:text-white text-sm whitespace-nowrap">
            {formatCurrency(b.fareBreakdown?.finalFare || 0)}
          </p>
          <span
            className={`inline-block text-[10px] font-bold px-1.5 py-0.2 rounded whitespace-nowrap ${
              b.paymentStatus === 'COMPLETED'
                ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60'
                : 'text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60'
            }`}
          >
            {b.paymentStatus === 'COMPLETED' ? 'Paid' : 'Pending'}
          </span>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Trip Status',
      className: 'whitespace-nowrap min-w-[130px]',
      render: (b) => (
        <div className="whitespace-nowrap">
          <StatusBadge status={b.status} />
        </div>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      className: 'whitespace-nowrap min-w-[90px]',
      render: (b) => (
        <div className="flex items-center justify-end" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            onClick={() => setSelectedBookingId(b._id)}
            className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-[#0F4471] hover:text-white text-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-[#0F4471] dark:hover:text-white border border-slate-200 dark:border-slate-700 transition-colors font-bold text-xs flex items-center gap-1 cursor-pointer"
          >
            <span>Inspect</span>
            <ArrowRight className="w-3.5 h-3.5 shrink-0" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-950 dark:text-white">
            Booking and Trips
          </h1>
        </div>

        {/* Global Date Filter Bar */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="inline-flex items-center bg-white dark:bg-slate-900 p-1 rounded-xl border border-cloudy-200 dark:border-slate-800 shadow-sm text-xs font-bold">
            <button
              onClick={() => {
                setPeriod('today');
                setShowCustomPicker(false);
                setPage(1);
              }}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                period === 'today'
                  ? 'bg-[#0F4471] text-white shadow-sm font-black'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Today
            </button>
            <button
              onClick={() => {
                setPeriod('this_week');
                setShowCustomPicker(false);
                setPage(1);
              }}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                period === 'this_week'
                  ? 'bg-[#0F4471] text-white shadow-sm font-black'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              This Week
            </button>
            <button
              onClick={() => {
                setPeriod('this_month');
                setShowCustomPicker(false);
                setPage(1);
              }}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                period === 'this_month'
                  ? 'bg-[#0F4471] text-white shadow-sm font-black'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              This Month
            </button>
            <button
              onClick={() => {
                setPeriod('all');
                setShowCustomPicker(false);
                setPage(1);
              }}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                period === 'all'
                  ? 'bg-[#0F4471] text-white shadow-sm font-black'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              All Time
            </button>

            {/* Custom Button with attached popover */}
            <div className="relative">
              <button
                onClick={() => {
                  setPeriod('custom');
                  setShowCustomPicker((prev) => !prev);
                  setPage(1);
                }}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                  period === 'custom'
                    ? 'bg-[#0F4471] text-white shadow-sm font-black'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                Custom
              </button>

              {/* Floating Date Picker right nearby Custom button */}
              {period === 'custom' && showCustomPicker && (
                <div className="absolute right-0 top-full mt-2 z-50 bg-white dark:bg-slate-900 rounded-xl p-3 shadow-2xl border border-cloudy-200 dark:border-slate-800 flex flex-col gap-2 min-w-[240px] animate-in fade-in zoom-in-95">
                  <div className="flex items-center justify-between pb-1 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200">
                      Custom Date Range
                    </span>
                    <button
                      onClick={() => setShowCustomPicker(false)}
                      className="text-slate-400 hover:text-slate-600 dark:hover:text-white text-xs font-bold p-0.5"
                    >
                      ✕
                    </button>
                  </div>
                  <div className="space-y-1.5">
                    <div>
                      <span className="text-[10px] font-bold text-slate-500 uppercase block">Start Date</span>
                      <input
                        type="date"
                        value={customStartDate}
                        onChange={(e) => setCustomStartDate(e.target.value)}
                        className="w-full mt-0.5 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-[#0F4471]"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-500 uppercase block">End Date</span>
                      <input
                        type="date"
                        value={customEndDate}
                        onChange={(e) => setCustomEndDate(e.target.value)}
                        className="w-full mt-0.5 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-[#0F4471]"
                      />
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setShowCustomPicker(false);
                      setPage(1);
                    }}
                    className="w-full mt-1 py-1.5 rounded-lg bg-[#0F4471] hover:bg-[#0c375c] text-white text-xs font-bold transition-colors shadow-xs"
                  >
                    Apply Range
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Filters Strip */}
      <div className="glass-panel p-3.5 rounded-2xl flex flex-wrap items-center gap-3 border border-cloudy-200 dark:border-slate-800 shadow-card">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search booking ID, customer, address..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full bg-white dark:bg-slate-900 border border-cloudy-200 dark:border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs font-semibold text-slate-900 dark:text-white placeholder-slate-400 outline-none focus:ring-1 focus:ring-[#0F4471] shadow-xs"
          />
        </div>

        <select
          value={serviceType}
          onChange={(e) => {
            setServiceType(e.target.value);
            setPage(1);
          }}
          className="bg-white dark:bg-slate-900 border border-cloudy-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 dark:text-slate-100 outline-none focus:ring-1 focus:ring-[#0F4471] shadow-xs"
        >
          <option value="">All Services (Taxi & Truck)</option>
          <option value="DROP_TAXI">🚕 DropTaxi Only</option>
          <option value="GOODS_TRUCK">🚚 Goods Truck Only</option>
        </select>

        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setPage(1);
          }}
          className="bg-white dark:bg-slate-900 border border-cloudy-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 dark:text-slate-100 outline-none focus:ring-1 focus:ring-[#0F4471] shadow-xs"
        >
          <option value="">All Trip Statuses</option>
          <option value="SEARCHING_DRIVER">Searching Driver</option>
          <option value="DRIVER_ASSIGNED">Driver Assigned</option>
          <option value="TRIP_STARTED">In Transit (Live)</option>
          <option value="TRIP_COMPLETED">Completed</option>
          <option value="CANCELLED">Cancelled</option>
        </select>

        <div className="text-xs font-bold text-slate-500 ml-auto flex items-center gap-1.5 px-2">
          <span>Total:</span>
          <span className="text-slate-900 dark:text-white font-extrabold">
            {data?.meta?.total ?? (data?.data?.length || 0)}
          </span>
          <span>trips</span>
        </div>
      </div>

      {/* Bookings Data Table */}
      <DataTable
        columns={columns}
        data={data?.data || []}
        isLoading={isLoading}
        pagination={{
          page,
          limit: 10,
          total: data?.meta?.total || 0,
          totalPages: data?.meta?.totalPages || 1,
          onPageChange: setPage,
        }}
        onRowClick={(b) => setSelectedBookingId(b._id)}
      />

      {/* Booking Detail Drawer */}
      <Drawer
        isOpen={!!selectedBookingId}
        onClose={() => setSelectedBookingId(null)}
        title={`Booking ${bookingDetail?.booking?.bookingId || ''}`}
        subtitle={`Placed on ${formatDateTime(bookingDetail?.booking?.createdAt)}`}
        size="lg"
      >
        {bookingDetail?.booking && (
          <div className="space-y-6 text-xs">
            {/* Status & Quick Transition Controls */}
            <div className="p-4 bg-cloudy-50 dark:bg-slate-950 rounded-2xl border border-cloudy-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-slate-800 dark:text-slate-200 text-[11px] font-extrabold uppercase block tracking-wider">
                  Current Trip Status
                </span>
                <div className="flex items-center gap-2 mt-1">
                  <StatusBadge status={bookingDetail.booking.status} />
                  <Badge
                    variant={bookingDetail.booking.tripScope === 'INTER_STATION' ? 'info' : 'warning'}
                    size="sm"
                  >
                    {bookingDetail.booking.tripScope === 'INTER_STATION' ? '🏙️ Inter-Station' : '🛣️ Outstation'}
                  </Badge>
                </div>
              </div>

              {/* Status Update Buttons */}
              <div className="flex items-center gap-2">
                {bookingDetail.booking.status === 'DRIVER_ASSIGNED' && (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() =>
                      updateStatusMutation.mutate({
                        id: bookingDetail.booking._id,
                        status: 'TRIP_STARTED',
                      })
                    }
                  >
                    Start Trip
                  </Button>
                )}

                {bookingDetail.booking.status === 'TRIP_STARTED' && (
                  <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 px-2.5 py-1.5 rounded-lg inline-flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block" />
                    Trip In-Progress • Driver completes in App
                  </span>
                )}

                {['REQUESTED', 'SEARCHING_DRIVER', 'DRIVER_ASSIGNED'].includes(
                  bookingDetail.booking.status
                ) && (
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => {
                      const reason = prompt('Enter cancellation reason:') || 'Cancelled by Admin';
                      updateStatusMutation.mutate({
                        id: bookingDetail.booking._id,
                        status: 'CANCELLED',
                        reason,
                      });
                    }}
                  >
                    Cancel Booking
                  </Button>
                )}
              </div>
            </div>

            {/* Route Addresses */}
            <div className="p-4 bg-cloudy-50 dark:bg-slate-950 rounded-2xl border border-cloudy-200 dark:border-slate-800 space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 flex items-center justify-center font-black text-xs shrink-0">
                  A
                </div>
                <div>
                  <p className="font-extrabold text-slate-950 dark:text-white">Pickup Location</p>
                  <p className="text-slate-800 dark:text-slate-200 font-semibold mt-0.5">{bookingDetail.booking.pickupLocation?.address}</p>
                </div>
              </div>

              <div className="border-l-2 border-dashed border-cloudy-300 dark:border-slate-700 ml-3 h-4" />

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-rose-500/20 text-rose-800 dark:text-rose-300 flex items-center justify-center font-black text-xs shrink-0">
                  B
                </div>
                <div>
                  <p className="font-extrabold text-slate-950 dark:text-white">Drop Destination</p>
                  <p className="text-slate-800 dark:text-slate-200 font-semibold mt-0.5">{bookingDetail.booking.dropLocation?.address}</p>
                </div>
              </div>

              <div className="pt-2 border-t border-cloudy-200 dark:border-slate-800 flex items-center justify-between text-slate-800 dark:text-slate-200 text-xs font-semibold">
                <span>Distance: <strong className="text-slate-950 dark:text-white font-extrabold">{bookingDetail.booking.distanceKm} km</strong></span>
                <span>Estimated Duration: <strong className="text-slate-950 dark:text-white font-extrabold">{bookingDetail.booking.estimatedDurationMins} mins</strong></span>
              </div>
            </div>

            {/* Fare Breakdown Receipt */}
            <div className="p-4 bg-cloudy-50 dark:bg-slate-950 rounded-2xl border border-cloudy-200 dark:border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 dark:text-slate-200 flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-brand-600 dark:text-brand-400" /> Backend Fare Breakdown & Tolls
                </h4>
                <Badge variant="success" size="sm">
                  ✓ Dynamic Price Locked (Google Maps API)
                </Badge>
              </div>

              <div className="space-y-1.5 pt-2 text-slate-800 dark:text-slate-200 text-xs font-semibold">
                <div className="flex justify-between">
                  <span>Base Fare</span>
                  <span className="font-bold text-slate-950 dark:text-white">{formatCurrency(bookingDetail.booking.fareBreakdown?.baseFare)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Distance Fare</span>
                  <span className="font-bold text-slate-950 dark:text-white">{formatCurrency(bookingDetail.booking.fareBreakdown?.distanceFare)}</span>
                </div>
                <div className="flex justify-between">
                  <span>FASTag Highway Toll</span>
                  <span className="font-bold text-slate-950 dark:text-white">
                    {formatCurrency(bookingDetail.booking.fareBreakdown?.tollFee || 0)}
                    <span className="text-[10px] text-sky-600 dark:text-sky-400 font-semibold ml-1.5">
                      (Google Maps Dynamic)
                    </span>
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Driver Bata Allowance</span>
                  {bookingDetail.booking.tripScope === 'INTER_STATION' ? (
                    <span className="text-emerald-700 dark:text-emerald-400 font-bold">
                      ₹0 (No Bata for Inter-Station)
                    </span>
                  ) : (
                    <span className="font-bold text-amber-700 dark:text-amber-400">
                      {formatCurrency(bookingDetail.booking.fareBreakdown?.driverBata || 0)}
                    </span>
                  )}
                </div>
                {bookingDetail.booking.fareBreakdown?.discount > 0 && (
                  <div className="flex justify-between text-emerald-800 dark:text-emerald-300 font-bold">
                    <span>Coupon Discount</span>
                    <span>-{formatCurrency(bookingDetail.booking.fareBreakdown?.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>GST Platform Tax (5%)</span>
                  <span className="font-bold text-slate-950 dark:text-white">{formatCurrency(bookingDetail.booking.fareBreakdown?.tax)}</span>
                </div>
                <div className="pt-2 border-t-2 border-cloudy-200 dark:border-slate-800 flex justify-between font-black text-sm text-slate-950 dark:text-white">
                  <span>Final Calculated Price</span>
                  <span className="text-brand-700 dark:text-brand-400 font-black">
                    {formatCurrency(bookingDetail.booking.fareBreakdown?.finalFare)}
                  </span>
                </div>
              </div>
            </div>

            {/* Platform Commission & Driver Split */}
            {bookingDetail.booking.commissionDetails && (
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-cloudy-50 dark:bg-slate-950 rounded-xl border border-cloudy-200 dark:border-slate-800">
                  <span className="text-[10px] text-slate-700 dark:text-slate-400 uppercase font-extrabold block">
                    Platform Commission (20%)
                  </span>
                  <span className="text-sm font-black text-brand-700 dark:text-brand-400">
                    {formatCurrency(bookingDetail.booking.commissionDetails.platformCommission)}
                  </span>
                </div>
                <div className="p-3 bg-cloudy-50 dark:bg-slate-950 rounded-xl border border-cloudy-200 dark:border-slate-800">
                  <span className="text-[10px] text-slate-700 dark:text-slate-400 uppercase font-extrabold block">
                    Driver Net Earning
                  </span>
                  <span className="text-sm font-black text-sky-700 dark:text-sky-300">
                    {formatCurrency(bookingDetail.booking.commissionDetails.driverEarnings)}
                  </span>
                </div>
              </div>
            )}

            {/* Trip Timeline Progression */}
            <div className="space-y-3">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 dark:text-slate-200">
                Detailed Trip Timeline
              </h4>
              <div className="space-y-2 border-l-2 border-cloudy-300 dark:border-slate-800 ml-2 pl-4">
                {(bookingDetail.booking.timeline || []).map((step: any, sIdx: number) => (
                  <div key={sIdx} className="relative">
                    <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-brand-500 ring-4 ring-white dark:ring-slate-950" />
                    <p className="font-extrabold text-slate-950 dark:text-white text-xs">{step.status.replace(/_/g, ' ')}</p>
                    <p className="text-[11px] font-medium text-slate-700 dark:text-slate-300">{step.note || 'Status updated'}</p>
                    <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400">{formatDateTime(step.timestamp)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
};
