import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Users,
  Car,
  CalendarCheck,
  Calendar,
  TrendingUp,
  CircleDollarSign,
  AlertTriangle,
  Compass,
  CreditCard,
  Percent,
  CheckCircle,
  Truck,
  Activity,
  ArrowUpRight,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Line,
  ComposedChart,
  PieChart,
  Pie,
  Cell,
  Legend,
  LabelList,
} from 'recharts';
import api from '../api/axiosClient';
import { StatCard } from '../components/common/StatCard';
import { Badge, StatusBadge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { formatCurrency, formatNumber, formatDateTime } from '../utils/formatters';
import { useNavigate } from 'react-router-dom';

const formatChartDate = (dateStr: string) => {
  if (!dateStr) return '';
  if (dateStr.includes(':')) return dateStr;
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const mIndex = parseInt(parts[1], 10) - 1;
    return `${parseInt(parts[2], 10)} ${months[mIndex] || ''}`;
  }
  return dateStr;
};

const CATEGORY_NAMES: Record<string, string> = {
  TAXI_SEDAN: '🚕 Sedan (Dzire / Etios)',
  TRUCK_MINI_1TON: '🚚 1-Ton Mini (Tata Ace)',
  TAXI_SUV: '🚕 Prime SUV (Innova)',
  TRUCK_HEAVY_7TON: '🚚 7-Ton Heavy Cargo',
  TRUCK_MEDIUM_3TON: '🚚 3-Ton Medium Truck',
  TAXI_MINI: '🚕 Mini Hatchback',
};

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  TRIP_COMPLETED: { label: 'Completed', color: '#10B981' },
  TRIP_STARTED: { label: 'In Transit', color: '#06B6D4' },
  DRIVER_ASSIGNED: { label: 'Driver Assigned', color: '#0284C7' },
  DRIVER_ACCEPTED: { label: 'Accepted', color: '#6366F1' },
  DRIVER_ARRIVING: { label: 'Arriving', color: '#8B5CF6' },
  DRIVER_ARRIVED: { label: 'Arrived', color: '#EC4899' },
  SEARCHING_DRIVER: { label: 'Searching Fleet', color: '#F59E0B' },
  CANCELLED: { label: 'Cancelled', color: '#EF4444' },
};

// Custom Aesthetic Tooltip for Bookings
const CustomBookingTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const taxiVal = payload.find((p: any) => p.dataKey === 'taxi')?.value || 0;
    const truckVal = payload.find((p: any) => p.dataKey === 'truck')?.value || 0;
    const total = taxiVal + truckVal;
    return (
      <div className="bg-slate-950/95 backdrop-blur-md border border-slate-700/80 rounded-xl p-3 shadow-2xl text-xs space-y-2 min-w-[170px]">
        <div className="font-bold text-slate-200 border-b border-slate-800 pb-1 flex items-center justify-between">
          <span>{formatChartDate(label)}</span>
          <span className="text-[10px] font-normal text-slate-400">Total: {total}</span>
        </div>
        <div className="space-y-1">
          <div className="flex items-center justify-between gap-3 text-sky-400">
            <span className="flex items-center gap-1.5 font-medium">
              <span className="w-2 h-2 rounded-full bg-sky-500" />
              DropTaxi:
            </span>
            <span className="font-bold">{taxiVal} trips</span>
          </div>
          <div className="flex items-center justify-between gap-3 text-amber-400">
            <span className="flex items-center gap-1.5 font-medium">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              Goods Truck:
            </span>
            <span className="font-bold">{truckVal} trips</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

// Custom Tooltip for Donut Status Breakdown
const CustomDonutTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    const statusKey = data.name;
    const count = data.value;
    const cfg = STATUS_LABELS[statusKey] || { label: statusKey, color: '#6366F1' };
    return (
      <div className="bg-slate-950/95 backdrop-blur-md border border-slate-700/80 rounded-xl px-3 py-2 shadow-2xl text-xs flex items-center gap-2">
        <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: cfg.color }} />
        <span className="font-semibold text-slate-200">{cfg.label}:</span>
        <span className="font-bold text-white">{count} trips</span>
      </div>
    );
  }
  return null;
};

// Custom Tooltip for Revenue vs Commission
const CustomRevenueTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const gross = payload.find((p: any) => p.dataKey === 'gross')?.value || 0;
    const comm = payload.find((p: any) => p.dataKey === 'commission')?.value || 0;
    return (
      <div className="bg-slate-950/95 backdrop-blur-md border border-slate-700/80 rounded-xl p-3 shadow-2xl text-xs space-y-2 min-w-[180px]">
        <div className="font-bold text-slate-200 border-b border-slate-800 pb-1">
          {formatChartDate(label)}
        </div>
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-sky-400">
            <span className="flex items-center gap-1.5 font-medium">
              <span className="w-2 h-2 rounded-full bg-sky-500" />
              Total Revenue:
            </span>
            <span className="font-bold">{formatCurrency(gross)}</span>
          </div>
          <div className="flex items-center justify-between text-emerald-400">
            <span className="flex items-center gap-1.5 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              Commission (20%):
            </span>
            <span className="font-bold">{formatCurrency(comm)}</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

// Custom Label Renderer for Category Wise Horizontal Bar Chart
const renderCustomCategoryBarLabel = (props: any) => {
  const { x, y, width, height, value } = props;
  if (value === undefined || value === null) return null;
  return (
    <text
      x={x + width + 8}
      y={y + height / 2 + 4}
      className="fill-slate-900 dark:fill-slate-100 text-[11px] font-bold"
      textAnchor="start"
    >
      {formatCurrency(value)}
    </text>
  );
};

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  type DashboardPeriod = 'today' | 'this_week' | 'this_month' | 'custom';
  const [period, setPeriod] = useState<DashboardPeriod>('today');
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

  // 1. Fetch KPIs with period filter
  const { data: kpiData, isLoading: loadingKpis } = useQuery({
    queryKey: ['dashboard-kpis', period, customStartDate, customEndDate],
    queryFn: () =>
      api.get(`/dashboard/kpis?period=${period}&startDate=${customStartDate}&endDate=${customEndDate}`)
        .then((res: any) => res.data.kpis),
    refetchInterval: 10000,
  });

  // 2. Fetch Booking Analytics with period filter
  const { data: bookingCharts } = useQuery({
    queryKey: ['dashboard-bookings-analytics', period, customStartDate, customEndDate],
    queryFn: () =>
      api.get(`/dashboard/bookings-analytics?timeframe=${period}&startDate=${customStartDate}&endDate=${customEndDate}`)
        .then((res: any) => res.data),
  });

  // 3. Fetch Revenue Analytics with period filter
  const { data: revenueCharts } = useQuery({
    queryKey: ['dashboard-revenue-analytics', period, customStartDate, customEndDate],
    queryFn: () =>
      api
        .get(`/dashboard/revenue-analytics?timeframe=${period}&startDate=${customStartDate}&endDate=${customEndDate}`)
        .then((res: any) => res.data),
  });

  // 4. Fetch Status Distribution with period filter
  const { data: statusDistribution } = useQuery({
    queryKey: ['dashboard-status-distribution', period, customStartDate, customEndDate],
    queryFn: () =>
      api
        .get(`/dashboard/status-distribution?period=${period}&startDate=${customStartDate}&endDate=${customEndDate}`)
        .then((res: any) => res.data),
  });

  // 5. Fetch Vehicle Category Usage with period filter
  const { data: vehicleUsage } = useQuery({
    queryKey: ['dashboard-vehicle-usage', period, customStartDate, customEndDate],
    queryFn: () =>
      api
        .get(`/dashboard/vehicle-usage?period=${period}&startDate=${customStartDate}&endDate=${customEndDate}`)
        .then((res: any) => res.data),
  });

  // 6. Fetch Recent Live Bookings with period filter
  const { data: recentBookings, isLoading: loadingBookings } = useQuery({
    queryKey: ['dashboard-recent-bookings', period, customStartDate, customEndDate],
    queryFn: () =>
      api
        .get(`/bookings?limit=10&period=${period}&startDate=${customStartDate}&endDate=${customEndDate}`)
        .then((res: any) => res.data),
    refetchInterval: 8000,
  });

  const bookingsList: any[] = Array.isArray(recentBookings)
    ? recentBookings
    : Array.isArray((recentBookings as any)?.data)
      ? (recentBookings as any).data
      : [];

  const totalStatusCount = (statusDistribution || []).reduce((acc: number, cur: any) => acc + (cur.count || 0), 0);

  const formattedVehicleUsage = (vehicleUsage || []).map((v: any) => ({
    ...v,
    displayName: CATEGORY_NAMES[v.category] || v.category,
    revenue: v.revenue || 0,
  }));

  const totalCategoryRevenue = formattedVehicleUsage.reduce((acc: number, v: any) => acc + (v.revenue || 0), 0);
  const totalPeriodRevenue = (revenueCharts || []).reduce((acc: number, c: any) => acc + (c.gross || 0), 0);
  const totalPeriodCommission = (revenueCharts || []).reduce((acc: number, c: any) => acc + (c.commission || 0), 0);

  const periodLabel =
    period === 'today'
      ? "Today's"
      : period === 'this_week'
        ? "This Week's"
        : period === 'this_month'
          ? "This Month's"
          : "Period";

  const bookingsHeaderTitle =
    period === 'today'
      ? "Today's Dispatched Bookings"
      : period === 'this_week'
        ? "This Week's Dispatched Bookings"
        : period === 'this_month'
          ? "This Month's Dispatched Bookings"
          : "Dispatched Bookings (Custom Range)";

  const bookingsHeaderSubtitle =
    period === 'today'
      ? "Live transportation requests and state progression for today"
      : period === 'this_week'
        ? "Transportation requests and state progression for this week"
        : period === 'this_month'
          ? "Transportation requests and state progression for this month"
          : `Transportation requests from ${customStartDate} to ${customEndDate}`;

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Top Banner & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-950 dark:text-white">
            Dashboard
          </h1>
        </div>

        {/* Global Overall Dashboard Filter & Actions */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="inline-flex items-center bg-white dark:bg-slate-900 p-1 rounded-xl border border-cloudy-200 dark:border-slate-800 shadow-sm text-xs font-bold">
            <button
              onClick={() => { setPeriod('today'); setShowCustomPicker(false); }}
              className={`px-3 py-1.5 rounded-lg transition-all ${period === 'today'
                ? 'bg-[#0F4471] text-white shadow-sm font-black'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
            >
              Today
            </button>
            <button
              onClick={() => { setPeriod('this_week'); setShowCustomPicker(false); }}
              className={`px-3 py-1.5 rounded-lg transition-all ${period === 'this_week'
                ? 'bg-[#0F4471] text-white shadow-sm font-black'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
            >
              This Week
            </button>
            <button
              onClick={() => { setPeriod('this_month'); setShowCustomPicker(false); }}
              className={`px-3 py-1.5 rounded-lg transition-all ${period === 'this_month'
                ? 'bg-[#0F4471] text-white shadow-sm font-black'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
            >
              This Month
            </button>

            {/* Custom Button with attached popover */}
            <div className="relative">
              <button
                onClick={() => {
                  setPeriod('custom');
                  setShowCustomPicker((prev) => !prev);
                }}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${period === 'custom'
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
                    <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200">Custom Date Range</span>
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
                    onClick={() => setShowCustomPicker(false)}
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

      {/* Primary KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title={`${periodLabel} Revenue`}
          value={formatCurrency(kpiData?.todayRevenue || 0)}
          subtitle={`Commission: ${formatCurrency(kpiData?.todayPlatformCommission || 0)}`}
          icon={<CircleDollarSign className="w-5 h-5" />}
          variant="brand"
          onClick={() => navigate('/admin/finance')}
        />

        <StatCard
          title={`${periodLabel} Bookings`}
          value={formatNumber(kpiData?.todayBookings || 0)}
          subtitle={`${kpiData?.ongoingTrips || 0} ongoing • ${kpiData?.completedTrips || 0} completed`}
          icon={<CalendarCheck className="w-5 h-5" />}
          variant="info"
          onClick={() => navigate('/admin/bookings')}
        />

        <StatCard
          title="Active Drivers"
          value={`${kpiData?.onlineDrivers || 0} / ${kpiData?.totalDrivers || 0}`}
          subtitle="Online & on-trip fleet availability"
          icon={<Car className="w-5 h-5" />}
          variant="accent"
          onClick={() => navigate('/admin/drivers')}
        />

        <StatCard
          title="Pending Payouts"
          value={formatCurrency(kpiData?.pendingPayoutsAmount || 0)}
          subtitle={`${kpiData?.pendingPayoutsCount || 0} drivers pending settlement`}
          icon={<CreditCard className="w-5 h-5" />}
          variant="warning"
          onClick={() => navigate('/admin/finance')}
        />
      </div>

      {/* Secondary Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="glass-panel p-3.5 rounded-xl border border-cloudy-200 dark:border-slate-800 shadow-sm">
          <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300">Total Customers</p>
          <p className="text-xl font-black text-slate-950 dark:text-white mt-0.5">{formatNumber(kpiData?.totalCustomers || 0)}</p>
        </div>
        <div className="glass-panel p-3.5 rounded-xl border border-cloudy-200 dark:border-slate-800 shadow-sm">
          <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300">Total Fleet Vehicles</p>
          <p className="text-xl font-black text-slate-950 dark:text-white mt-0.5">{kpiData?.totalVehicles || 0}</p>
        </div>
        <div className="glass-panel p-3.5 rounded-xl border border-cloudy-200 dark:border-slate-800 shadow-sm">
          <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300">Ongoing Trips</p>
          <p className="text-xl font-black text-brand-700 dark:text-brand-300 mt-0.5">{kpiData?.ongoingTrips || 0}</p>
        </div>
        <div className="glass-panel p-3.5 rounded-xl border border-cloudy-200 dark:border-slate-800 shadow-sm">
          <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300">{periodLabel} Revenue</p>
          <p className="text-xl font-black text-slate-950 dark:text-white mt-0.5">{formatCurrency(kpiData?.todayRevenue || 0)}</p>
        </div>
        <div className="glass-panel p-3.5 rounded-xl border border-cloudy-200 dark:border-slate-800 shadow-sm">
          <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300">{periodLabel} Commission</p>
          <p className="text-xl font-black text-brand-700 dark:text-brand-400 mt-0.5">{formatCurrency(kpiData?.todayPlatformCommission || 0)}</p>
        </div>
        <div className="glass-panel p-3.5 rounded-xl border border-cloudy-200 dark:border-slate-800 shadow-sm">
          <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300">{periodLabel} Driver Share</p>
          <p className="text-xl font-black text-sky-700 dark:text-sky-300 mt-0.5">{formatCurrency(kpiData?.todayDriverEarnings || 0)}</p>
        </div>
      </div>

      {/* Interactive Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bookings Trend Chart (2 cols) */}
        <div className="glass-panel p-5 rounded-2xl lg:col-span-2 space-y-4 border border-cloudy-200 dark:border-slate-800 shadow-card">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-slate-950 dark:text-white">Booking Analytics</h3>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={bookingCharts || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.15)" vertical={false} />
                <XAxis dataKey="date" stroke="#64748b" fontSize={11} tickFormatter={formatChartDate} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip content={<CustomBookingTooltip />} />
                <Bar dataKey="taxi" name="DropTaxi Rides" fill="#0284c7" radius={[4, 4, 0, 0]} />
                <Bar dataKey="truck" name="Goods Trucks" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status Breakdown Donut with Center Label (1 col) */}
        <div className="glass-panel p-5 rounded-2xl space-y-3 border border-cloudy-200 dark:border-slate-800 shadow-card flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Trip Lifecycle Status</h3>
              <span className="text-[10px] font-semibold text-slate-400">Total {totalStatusCount}</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">Live distribution across booking pipeline</p>
          </div>

          <div className="h-56 w-full relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusDistribution || []}
                  dataKey="count"
                  nameKey="status"
                  cx="50%"
                  cy="50%"
                  innerRadius={62}
                  outerRadius={92}
                  paddingAngle={3}
                  cornerRadius={4}
                >
                  {(statusDistribution || []).map((entry: any, index: number) => {
                    const cfg = STATUS_LABELS[entry.status] || { color: '#6366F1' };
                    return <Cell key={`cell-${index}`} fill={cfg.color} stroke="transparent" />;
                  })}
                </Pie>
                <Tooltip content={<CustomDonutTooltip />} />
              </PieChart>
            </ResponsiveContainer>

            {/* Centered Donut Stat Counter */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {totalStatusCount}
              </span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Total Trips
              </span>
            </div>
          </div>

          {/* Quick Status Legend Badges */}
          <div className="grid grid-cols-2 gap-1.5 pt-1 border-t border-cloudy-200/80 dark:border-slate-800/80 text-[11px]">
            {totalStatusCount === 0 ? (
              <div className="col-span-2 text-center text-xs text-slate-400 py-2">
                0 trips recorded for this period
              </div>
            ) : (
              (statusDistribution || []).slice(0, 4).map((item: any) => {
                const cfg = STATUS_LABELS[item.status] || { label: item.status, color: '#6366F1' };
                const percent = totalStatusCount > 0 ? Math.round((item.count / totalStatusCount) * 100) : 0;
                return (
                  <div key={item.status} className="flex items-center justify-between p-1.5 rounded-lg bg-cloudy-50 dark:bg-slate-900/60">
                    <div className="flex items-center gap-1.5 truncate">
                      <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: cfg.color }} />
                      <span className="truncate text-slate-700 dark:text-slate-300 font-medium">{cfg.label}</span>
                    </div>
                    <span className="font-bold text-slate-900 dark:text-white shrink-0">{percent}%</span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Revenue & Vehicle Category Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue & Commission Analytics Card - Smooth Area */}
        <div className="glass-panel p-5 rounded-2xl space-y-4 border border-cloudy-200 dark:border-slate-800 shadow-card">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Revenue vs Commission</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Total gross revenue and 20% platform commission trajectory</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-sky-50 text-sky-800 dark:bg-sky-950/80 dark:text-sky-300 border border-sky-200 dark:border-sky-800">
                Revenue: {formatCurrency(totalPeriodRevenue)}
              </span>
              <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                Commission: {formatCurrency(totalPeriodCommission)}
              </span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueCharts || []}>
                <defs>
                  <linearGradient id="revAreaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0F4471" stopOpacity={0.65} />
                    <stop offset="95%" stopColor="#0284c7" stopOpacity={0.05} />
                  </linearGradient>
                  <linearGradient id="commAreaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={0.65} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.15)" vertical={false} />
                <XAxis dataKey="date" stroke="#64748b" fontSize={11} tickFormatter={formatChartDate} />
                <YAxis stroke="#64748b" fontSize={11} tickFormatter={(v) => `₹${v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}`} />
                <Tooltip content={<CustomRevenueTooltip />} />
                <Area
                  type="monotone"
                  dataKey="gross"
                  name="Total Revenue"
                  stroke="#0F4471"
                  strokeWidth={2.5}
                  fill="url(#revAreaGrad)"
                  dot={{ r: 3, fill: '#0F4471' }}
                  activeDot={{ r: 6 }}
                />
                <Area
                  type="monotone"
                  dataKey="commission"
                  name="Commission (20%)"
                  stroke="#10b981"
                  strokeWidth={2.5}
                  fill="url(#commAreaGrad)"
                  dot={{ r: 3, fill: '#10b981' }}
                  activeDot={{ r: 6 }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Wise Revenue Amount - With Visible Amounts */}
        <div className="glass-panel p-5 rounded-2xl space-y-4 border border-cloudy-200 dark:border-slate-800 shadow-card">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Category Wise</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Category wise revenue and billing amount</p>
            </div>
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
              Total: {formatCurrency(totalCategoryRevenue)}
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={formattedVehicleUsage}
                layout="vertical"
                margin={{ top: 5, right: 90, left: 10, bottom: 5 }}
              >
                <defs>
                  <linearGradient id="vehCategoryGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#0F4471" stopOpacity={0.85} />
                    <stop offset="100%" stopColor="#38bdf8" stopOpacity={0.95} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.15)" horizontal={false} />
                <XAxis
                  type="number"
                  stroke="#64748b"
                  fontSize={11}
                  tickFormatter={(val) => `₹${val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val}`}
                />
                <YAxis dataKey="displayName" type="category" stroke="#64748b" fontSize={11} width={155} tickLine={false} />
                <Tooltip
                  formatter={(val: any) => [formatCurrency(val), 'Total Amount']}
                  contentStyle={{ backgroundColor: '#020617', borderColor: '#334155', borderRadius: '12px', fontSize: '12px', color: '#f8fafc' }}
                />
                <Bar dataKey="revenue" name="Total Amount (₹)" fill="url(#vehCategoryGrad)" radius={[0, 6, 6, 0]}>
                  <LabelList
                    dataKey="revenue"
                    position="right"
                    content={renderCustomCategoryBarLabel}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Live Recent Bookings Feed - Filter-wise */}
      <div className="glass-panel p-5 rounded-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">{bookingsHeaderTitle}</h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300 border border-brand-200 dark:border-brand-800">
                {bookingsList.length} Bookings
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">{bookingsHeaderSubtitle}</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => navigate('/admin/bookings')}>
            View All Bookings
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
            <thead className="bg-cloudy-100/90 dark:bg-slate-900 text-slate-600 dark:text-slate-400 uppercase tracking-wider font-semibold border-b border-cloudy-200 dark:border-slate-800">
              <tr>
                <th className="px-4 py-3">Booking ID</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Service</th>
                <th className="px-4 py-3">Pickup & Drop</th>
                <th className="px-4 py-3">Fare</th>
                <th className="px-4 py-3">Assigned Driver</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cloudy-200/60 dark:divide-slate-800/60 font-normal">
              {loadingBookings ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-xs text-slate-500">
                    Loading dispatched bookings...
                  </td>
                </tr>
              ) : bookingsList.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-xs text-slate-500 dark:text-slate-400">
                    No dispatched bookings found for {period === 'today' ? 'today' : period === 'this_week' ? 'this week' : period === 'this_month' ? 'this month' : 'the selected date range'}.
                  </td>
                </tr>
              ) : (
                bookingsList.map((b: any) => (
                  <tr key={b._id} className="hover:bg-cloudy-100/60 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="px-4 py-3 font-semibold text-brand-600 dark:text-brand-400">{b.bookingId}</td>
                    <td className="px-4 py-3 font-medium text-slate-900 dark:text-white">{b.customer?.name}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded bg-cloudy-100 dark:bg-slate-800 border border-cloudy-200 dark:border-slate-700 font-bold text-[10px] text-slate-700 dark:text-slate-300">
                        {b.serviceType === 'DROP_TAXI' ? '🚕 DROP TAXI' : '🚚 GOODS TRUCK'}
                      </span>
                    </td>
                    <td className="px-4 py-3 max-w-xs truncate text-slate-500 dark:text-slate-400">
                      <span className="text-slate-800 dark:text-slate-200">{b.pickupLocation?.address}</span> →{' '}
                      <span className="text-slate-800 dark:text-slate-200">{b.dropLocation?.address}</span>
                    </td>
                    <td className="px-4 py-3 font-bold text-slate-900 dark:text-white">
                      {formatCurrency(b.fareBreakdown?.finalFare)}
                    </td>
                    <td className="px-4 py-3">
                      {b.driver ? (
                        <span className="text-slate-800 dark:text-slate-200 font-medium">{b.driver.name}</span>
                      ) : (
                        <span className="text-amber-600 dark:text-amber-400 italic">Searching...</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={b.status} />
                    </td>
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
