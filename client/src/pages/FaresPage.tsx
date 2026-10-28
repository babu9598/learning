import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  CircleDollarSign,
  Zap,
  Plus,
  Edit2,
  Check,
  Calculator,
  Search,
  MapPin,
  Car,
  Truck,
  Trash2,
  ArrowRight,
  Sparkles,
  LayoutGrid,
  Table as TableIcon,
  Shield,
  Layers,
  Clock,
  Percent,
  Wallet,
  Radio,
  Award,
  AlertCircle,
  X,
  Calendar,
  ChevronRight,
  UserX,
  Timer,
  Compass,
} from 'lucide-react';
import api from '../api/axiosClient';
import { DataTable, Column } from '../components/common/DataTable';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { FareRule, SurgeRule, TripScope, IIncentiveTier } from '../types';
import { formatCurrency } from '../utils/formatters';

export const FaresPage: React.FC = () => {
  const queryClient = useQueryClient();

  // Active Main View Tab: 'RULES' | 'SURGE' | 'SANDBOX'
  const [activeTab, setActiveTab] = useState<'RULES' | 'SURGE' | 'SANDBOX'>('RULES');

  // Fare Rules Filters & View State
  const [search, setSearch] = useState('');
  const [activeScopeTab, setActiveScopeTab] = useState<'ALL' | 'INTER_STATION' | 'OUTSTATION'>('ALL');
  const [activeServiceTab, setActiveServiceTab] = useState<'ALL' | 'DROP_TAXI' | 'GOODS_TRUCK'>('ALL');
  const [viewMode, setViewMode] = useState<'TABLE' | 'CARDS'>('TABLE');

  // Modals & Rule Form State
  const [editingRule, setEditingRule] = useState<FareRule | null>(null);
  const [isCreateRuleModalOpen, setIsCreateRuleModalOpen] = useState(false);
  const [ruleModalTab, setRuleModalTab] = useState<'PRICING' | 'WAITING' | 'COMMISSION' | 'DISPATCH' | 'CANCELLATION' | 'INCENTIVES'>('PRICING');
  const [isSurgeModalOpen, setIsSurgeModalOpen] = useState(false);

  // New Rule Form State (Note: Tolls are calculated dynamically via Google Maps API, so no manual toll rate)
  const [newRule, setNewRule] = useState<Partial<FareRule>>({
    category: 'TAXI_SEDAN',
    serviceType: 'DROP_TAXI',
    tripScope: 'INTER_STATION',
    title: 'Sedan Cab (City Local Drop)',
    baseFare: 150,
    baseDistanceKm: 2,
    perKmRate: 15,
    minimumFare: 150,
    driverBata: 0,
    perMinuteRate: 2,
    waitingChargePerMin: 3,
    freeWaitingMins: 5,
    nightChargeMultiplier: 1.25,
    nightStartTime: '22:00',
    nightEndTime: '05:00',
    cancellationFee: 50,
    cancellationPercentage: 10,
    customerCancellationTimeHours: 1,
    driverCancellationTimeHours: 2,
    driverDailyMaxCancellations: 3,
    driverCommissionPercentage: 15,
    bookingRadiusKm: 15,
    walletMinAmount: 500,
    extraStopCharge: 50,
    taxPercentage: 5,
    isActive: true,
    incentives: {
      daily: [{ targetBookings: 5, rewardAmount: 200 }, { targetBookings: 10, rewardAmount: 500 }],
      weekly: [{ targetBookings: 35, rewardAmount: 1800 }],
      monthly: [{ targetBookings: 120, rewardAmount: 6000 }],
    },
  });

  // Surge Form State
  const [surgeZone, setSurgeZone] = useState('');
  const [surgeMultiplier, setSurgeMultiplier] = useState(1.25);
  const [surgeReason, setSurgeReason] = useState<'DEMAND' | 'WEATHER' | 'PEAK_HOURS' | 'FESTIVAL' | 'CUSTOM'>('DEMAND');

  // Sandbox Tester State
  const [testCat, setTestCat] = useState('TAXI_SEDAN');
  const [testScope, setTestScope] = useState<TripScope>('OUTSTATION');
  const [testDist, setTestDist] = useState(25);
  const [testExtraStops, setTestExtraStops] = useState(0);
  const [testCoupon, setTestCoupon] = useState('');
  const [calcResult, setCalcResult] = useState<any>(null);
  const [calcLoading, setCalcLoading] = useState(false);

  // Incentive Tier Input States for Modal
  const [incentivePeriod, setIncentivePeriod] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [newTierTarget, setNewTierTarget] = useState(5);
  const [newTierReward, setNewTierReward] = useState(250);

  // 1. Fetch Fare Rules
  const { data: fareRules, isLoading: loadingRules } = useQuery({
    queryKey: ['fare-rules'],
    queryFn: () => api.get('/fares/rules').then((res: any) => res.data),
  });

  // 2. Fetch Surge Rules
  const { data: surgeRules, isLoading: loadingSurges } = useQuery({
    queryKey: ['surge-rules'],
    queryFn: () => api.get('/fares/surges').then((res: any) => res.data),
  });

  // 3. Fetch Dynamic Vehicle Types for dropdowns
  const { data: vehicleTypesData } = useQuery({
    queryKey: ['public-vehicle-types'],
    queryFn: () => api.get('/vehicle-types/public').then((res: any) => res.data),
  });
  const vehicleTypesList = vehicleTypesData || [];

  // Create Fare Rule Mutation
  const createRuleMutation = useMutation({
    mutationFn: (data: any) => api.post('/fares/rules', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fare-rules'] });
      setIsCreateRuleModalOpen(false);
    },
    onError: (err: any) => {
      alert(err.response?.data?.message || err.message || 'Error creating fare rule');
    },
  });

  // Update Fare Rule Mutation
  const updateRuleMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => api.put(`/fares/rules/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fare-rules'] });
      setEditingRule(null);
    },
    onError: (err: any) => {
      alert(err.response?.data?.message || err.message || 'Error updating fare rule');
    },
  });

  // Delete Fare Rule Mutation
  const deleteRuleMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/fares/rules/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fare-rules'] });
    },
  });

  // Toggle Fare Rule Active Mutation
  const toggleRuleActiveMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      api.put(`/fares/rules/${id}`, { isActive }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fare-rules'] });
    },
  });

  // Create Surge Mutation
  const createSurgeMutation = useMutation({
    mutationFn: (data: any) => api.post('/fares/surges', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['surge-rules'] });
      setIsSurgeModalOpen(false);
      setSurgeZone('');
      setSurgeMultiplier(1.25);
    },
  });

  // Toggle Surge Active Mutation
  const toggleSurgeMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      api.put(`/fares/surges/${id}`, { isActive }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['surge-rules'] });
    },
  });

  // Delete Surge Mutation
  const deleteSurgeMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/fares/surges/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['surge-rules'] });
    },
  });

  // Handle Sandbox Calculation
  const handleTestCalculation = async () => {
    setCalcLoading(true);
    try {
      const selectedType = vehicleTypesList.find((vt: any) => vt.code === testCat);
      const computedServiceType = selectedType?.serviceType || (testCat.startsWith('TAXI') ? 'DROP_TAXI' : 'GOODS_TRUCK');

      const res: any = await api.post('/bookings/calculate-fare', {
        vehicleCategory: testCat,
        serviceType: computedServiceType,
        tripScope: testScope,
        pickupLocation: { address: 'Origin Zone', lat: 13.0827, lng: 80.2707 },
        dropLocation: {
          address: 'Destination Zone',
          lat: 13.0827 + testDist * 0.009,
          lng: 80.2707 + testDist * 0.009,
        },
        extraStopsCount: Number(testExtraStops),
        couponCode: testCoupon || undefined,
      });
      setCalcResult(res.data);
    } catch (err: any) {
      alert(err.message || 'Calculation error');
    } finally {
      setCalcLoading(false);
    }
  };

  // Helper to add incentive tier
  const handleAddIncentiveTier = (isEditing: boolean) => {
    if (newTierTarget <= 0 || newTierReward <= 0) return;
    const targetObj = isEditing ? editingRule : newRule;
    if (!targetObj) return;

    const currentIncentives = targetObj.incentives || { daily: [], weekly: [], monthly: [] };
    const periodList = [...(currentIncentives[incentivePeriod] || [])];

    const updatedPeriodList = periodList.filter((t) => t.targetBookings !== newTierTarget);
    updatedPeriodList.push({ targetBookings: newTierTarget, rewardAmount: newTierReward });
    updatedPeriodList.sort((a, b) => a.targetBookings - b.targetBookings);

    const updatedIncentives = {
      ...currentIncentives,
      [incentivePeriod]: updatedPeriodList,
    };

    if (isEditing && editingRule) {
      setEditingRule({ ...editingRule, incentives: updatedIncentives });
    } else {
      setNewRule({ ...newRule, incentives: updatedIncentives });
    }
  };

  // Helper to remove incentive tier
  const handleRemoveIncentiveTier = (period: 'daily' | 'weekly' | 'monthly', targetBookings: number, isEditing: boolean) => {
    const targetObj = isEditing ? editingRule : newRule;
    if (!targetObj || !targetObj.incentives) return;

    const currentIncentives = targetObj.incentives;
    const periodList = currentIncentives[period] || [];
    const updatedPeriodList = periodList.filter((t) => t.targetBookings !== targetBookings);

    const updatedIncentives = {
      ...currentIncentives,
      [period]: updatedPeriodList,
    };

    if (isEditing && editingRule) {
      setEditingRule({ ...editingRule, incentives: updatedIncentives });
    } else {
      setNewRule({ ...newRule, incentives: updatedIncentives });
    }
  };

  // KPI Calculations
  const allRules: FareRule[] = fareRules || [];
  const allSurges: SurgeRule[] = surgeRules || [];
  const totalRulesCount = allRules.length;
  const taxiRulesCount = allRules.filter((r) => r.serviceType === 'DROP_TAXI').length;
  const truckRulesCount = allRules.filter((r) => r.serviceType === 'GOODS_TRUCK').length;
  const activeSurgesCount = allSurges.filter((s) => s.isActive).length;

  // Filter fare rules based on search & tabs
  const filteredFareRules = allRules.filter((rule: FareRule) => {
    if (activeScopeTab !== 'ALL' && rule.tripScope !== activeScopeTab) return false;
    if (activeServiceTab !== 'ALL' && rule.serviceType !== activeServiceTab) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchTitle = rule.title?.toLowerCase().includes(q);
      const matchCat = rule.category?.toLowerCase().includes(q);
      if (!matchTitle && !matchCat) return false;
    }
    return true;
  });

  // Active rule in modal (either editing or new)
  const currentModalRule = editingRule || newRule;

  // Columns for Fare Rules Table
  const ruleColumns: Column<FareRule>[] = [
    {
      key: 'category',
      header: 'Vehicle & Service',
      className: 'whitespace-nowrap min-w-[200px]',
      render: (r) => (
        <div>
          <span className="font-extrabold text-slate-950 dark:text-white text-xs block leading-tight">
            {r.title}
          </span>
          <div className="flex items-center gap-1.5 mt-1">
            <Badge variant={r.serviceType === 'DROP_TAXI' ? 'brand' : 'info'} size="sm">
              {r.serviceType === 'DROP_TAXI' ? '🚕 Drop Taxi' : '🚚 Goods Truck'}
            </Badge>
            <span className="text-[10px] text-slate-500 font-mono font-semibold">{r.category}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'tripScope',
      header: 'Trip Scope',
      className: 'whitespace-nowrap min-w-[130px]',
      render: (r) => {
        const isInter = r.tripScope === 'INTER_STATION';
        return (
          <span
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold ${
              isInter
                ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                : 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
            }`}
          >
            {isInter ? '🏙️ Inter-Station' : '🛣️ Outstation'}
          </span>
        );
      },
    },
    {
      key: 'baseFare',
      header: 'Base & Per KM',
      className: 'whitespace-nowrap min-w-[130px]',
      render: (r) => (
        <div>
          <span className="font-black text-slate-950 dark:text-white text-xs font-mono">
            {formatCurrency(r.baseFare)}
          </span>
          <span className="text-[10px] text-slate-500 font-medium block">
            ({r.baseDistanceKm} km incl.) • <strong className="text-brand-600 dark:text-brand-400 font-mono">{formatCurrency(r.perKmRate)}/km</strong>
          </span>
        </div>
      ),
    },
    {
      key: 'driverBata',
      header: 'Driver Bata',
      className: 'whitespace-nowrap min-w-[120px]',
      render: (r) => {
        const isInter = r.tripScope === 'INTER_STATION';
        return isInter ? (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 font-extrabold text-[11px] border border-emerald-200 dark:border-emerald-800">
            ₹0 (No Bata)
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 font-bold text-[11px] border border-amber-200 dark:border-amber-800 font-mono">
            {formatCurrency(r.driverBata || 350)}/day
          </span>
        );
      },
    },
    {
      key: 'commission',
      header: 'Commission & Wallet',
      className: 'whitespace-nowrap min-w-[140px]',
      render: (r) => (
        <div>
          <span className="inline-flex items-center gap-1 text-xs font-extrabold text-indigo-700 dark:text-indigo-400 font-mono">
            <Percent className="w-3 h-3 text-indigo-500" />
            {r.driverCommissionPercentage ?? 15}% Comm
          </span>
          <span className="text-[10px] text-slate-500 font-medium block font-mono">
            Min Wallet: {formatCurrency(r.walletMinAmount ?? 500)}
          </span>
        </div>
      ),
    },
    {
      key: 'radius',
      header: 'Radius & Waiting',
      className: 'whitespace-nowrap min-w-[140px]',
      render: (r) => (
        <div>
          <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-800 dark:text-slate-200 font-mono">
            <Radio className="w-3 h-3 text-sky-500" />
            {r.bookingRadiusKm ?? 15} KM Radius
          </span>
          <span className="text-[10px] text-slate-500 font-medium block">
            {r.freeWaitingMins ?? 5}m free ({formatCurrency(r.waitingChargePerMin)}/m)
          </span>
        </div>
      ),
    },
    {
      key: 'cancellation',
      header: 'Cancellation SLA',
      className: 'whitespace-nowrap min-w-[150px]',
      render: (r) => (
        <div>
          <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-600 dark:text-rose-400 font-mono">
            {r.cancellationPercentage ?? 10}% fee
          </span>
          <span className="text-[10px] text-slate-500 font-medium block">
            Cust: {r.customerCancellationTimeHours ?? 1}h • Drv: {r.driverCancellationTimeHours ?? 2}h (Max {r.driverDailyMaxCancellations ?? 3}/d)
          </span>
        </div>
      ),
    },
    {
      key: 'incentives',
      header: 'Incentives',
      className: 'whitespace-nowrap min-w-[110px]',
      render: (r) => {
        const dCount = r.incentives?.daily?.length || 0;
        const wCount = r.incentives?.weekly?.length || 0;
        const mCount = r.incentives?.monthly?.length || 0;
        const totalTiers = dCount + wCount + mCount;

        return (
          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[11px] font-bold ${
              totalTiers > 0
                ? 'bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-400 border border-slate-200 dark:border-slate-700'
            }`}
          >
            <Award className="w-3 h-3 text-purple-500" />
            {totalTiers > 0 ? `${totalTiers} Tiers` : 'None'}
          </span>
        );
      },
    },
    {
      key: 'status',
      header: 'Status',
      className: 'whitespace-nowrap min-w-[90px]',
      render: (r) => (
        <button
          type="button"
          onClick={() => toggleRuleActiveMutation.mutate({ id: r._id, isActive: !r.isActive })}
          className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold cursor-pointer transition-all ${
            r.isActive
              ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-400 border border-slate-200 dark:border-slate-700'
          }`}
        >
          {r.isActive ? 'Active' : 'Disabled'}
        </button>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      className: 'whitespace-nowrap min-w-[120px]',
      render: (r) => (
        <div className="flex items-center justify-end gap-1.5">
          <button
            type="button"
            onClick={() => {
              setEditingRule({ ...r });
              setRuleModalTab('PRICING');
            }}
            className="px-2.5 py-1 rounded-lg bg-brand-50 hover:bg-brand-600 text-brand-700 hover:text-white dark:bg-brand-950/60 dark:hover:bg-brand-600 dark:text-brand-300 dark:hover:text-white border border-brand-200 dark:border-brand-800 transition-all font-bold text-xs flex items-center gap-1 shadow-sm active:scale-95 cursor-pointer"
          >
            <Edit2 className="w-3 h-3" />
            <span>Edit</span>
          </button>
          <button
            type="button"
            onClick={() => {
              if (confirm(`Delete fare rule "${r.title}"?`)) {
                deleteRuleMutation.mutate(r._id);
              }
            }}
            className="p-1 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
            title="Delete rule"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      ),
    },
  ];

  // Columns for Surge Rules Table
  const surgeColumns: Column<SurgeRule>[] = [
    {
      key: 'zoneName',
      header: 'Surge Zone / Corridor',
      className: 'whitespace-nowrap min-w-[220px]',
      render: (s) => (
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 flex items-center justify-center text-amber-600 shrink-0">
            <Zap className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="font-extrabold text-slate-950 dark:text-white text-xs block leading-tight">
              {s.zoneName}
            </span>
            <span className="text-[10px] text-slate-500 font-medium block">
              Reason: {s.reason.replace(/_/g, ' ')}
            </span>
          </div>
        </div>
      ),
    },
    {
      key: 'multiplier',
      header: 'Surge Multiplier',
      className: 'whitespace-nowrap min-w-[130px]',
      render: (s) => (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/10 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 font-extrabold font-mono text-xs border border-amber-500/30">
          <Zap className="w-3 h-3 text-amber-500 fill-amber-500" />
          {s.multiplier}x Rate
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Active State',
      className: 'whitespace-nowrap min-w-[130px]',
      render: (s) => (
        <button
          type="button"
          onClick={() => toggleSurgeMutation.mutate({ id: s._id, isActive: !s.isActive })}
          className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
            s.isActive
              ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-500 border border-slate-300 dark:border-slate-700 hover:bg-slate-200'
          }`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${s.isActive ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
          <span>{s.isActive ? 'Active Multiplier' : 'Disabled'}</span>
        </button>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      className: 'whitespace-nowrap min-w-[90px]',
      render: (s) => (
        <button
          type="button"
          onClick={() => {
            if (confirm(`Delete surge zone "${s.zoneName}"?`)) {
              deleteSurgeMutation.mutate(s._id);
            }
          }}
          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors ml-auto"
          title="Delete Surge Zone"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-5">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-950 dark:text-white flex items-center gap-2">
            Fare & Incentive Management
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Dynamic pricing matrix, driver commissions, booking radius, cancellation policies, and milestone incentives.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            icon={<Zap className="w-4 h-4 text-amber-500" />}
            onClick={() => setIsSurgeModalOpen(true)}
            className="font-bold border-amber-300 text-amber-700 dark:text-amber-300 hover:bg-amber-50"
          >
            Add Surge Zone
          </Button>

          <Button
            variant="primary"
            size="sm"
            icon={<Plus className="w-4 h-4" />}
            onClick={() => {
              setNewRule({
                category: vehicleTypesList[0]?.code || 'TAXI_SEDAN',
                serviceType: vehicleTypesList[0]?.serviceType || 'DROP_TAXI',
                tripScope: 'INTER_STATION',
                title: 'New Vehicle Fare Rule',
                baseFare: 150,
                baseDistanceKm: 2,
                perKmRate: 15,
                minimumFare: 150,
                driverBata: 0,
                perMinuteRate: 2,
                waitingChargePerMin: 3,
                freeWaitingMins: 5,
                nightChargeMultiplier: 1.25,
                nightStartTime: '22:00',
                nightEndTime: '05:00',
                cancellationFee: 50,
                cancellationPercentage: 10,
                customerCancellationTimeHours: 1,
                driverCancellationTimeHours: 2,
                driverDailyMaxCancellations: 3,
                driverCommissionPercentage: 15,
                bookingRadiusKm: 15,
                walletMinAmount: 500,
                extraStopCharge: 50,
                taxPercentage: 5,
                isActive: true,
                incentives: {
                  daily: [{ targetBookings: 5, rewardAmount: 200 }],
                  weekly: [{ targetBookings: 35, rewardAmount: 1800 }],
                  monthly: [{ targetBookings: 120, rewardAmount: 6000 }],
                },
              });
              setRuleModalTab('PRICING');
              setIsCreateRuleModalOpen(true);
            }}
            className="font-bold shadow-md shadow-brand-500/20"
          >
            Add Fare Rule
          </Button>
        </div>
      </div>

      {/* KPI Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="glass-panel p-3.5 rounded-2xl border border-cloudy-200 dark:border-slate-800 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-brand-50 dark:bg-brand-950/60 border border-brand-200 dark:border-brand-800 flex items-center justify-center text-brand-600 dark:text-brand-400 shrink-0">
            <CircleDollarSign className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
              Total Fare Rules
            </span>
            <span className="text-base font-black text-slate-950 dark:text-white font-mono leading-tight">
              {totalRulesCount}
            </span>
          </div>
        </div>

        <div className="glass-panel p-3.5 rounded-2xl border border-cloudy-200 dark:border-slate-800 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800 flex items-center justify-center text-sky-600 dark:text-sky-400 shrink-0">
            <Car className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
              Drop Taxi Slabs
            </span>
            <span className="text-base font-black text-sky-700 dark:text-sky-400 font-mono leading-tight">
              {taxiRulesCount}
            </span>
          </div>
        </div>

        <div className="glass-panel p-3.5 rounded-2xl border border-cloudy-200 dark:border-slate-800 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 flex items-center justify-center text-teal-600 dark:text-teal-400 shrink-0">
            <Truck className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
              Goods Truck Slabs
            </span>
            <span className="text-base font-black text-teal-700 dark:text-teal-400 font-mono leading-tight">
              {truckRulesCount}
            </span>
          </div>
        </div>

        <div className="glass-panel p-3.5 rounded-2xl border border-cloudy-200 dark:border-slate-800 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
              Active Surges
            </span>
            <span className="text-base font-black text-amber-700 dark:text-amber-400 font-mono leading-tight">
              {activeSurgesCount} Active
            </span>
          </div>
        </div>
      </div>

      {/* Main View Segmented Tabs */}
      <div className="flex items-center gap-2 border-b border-cloudy-200 dark:border-slate-800 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab('RULES')}
          className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'RULES'
              ? 'bg-brand-600 text-white shadow-md shadow-brand-500/20'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-cloudy-100 dark:hover:bg-slate-800'
          }`}
        >
          <CircleDollarSign className="w-4 h-4" />
          <span>Fare & Operational Matrix</span>
          <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${activeTab === 'RULES' ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-600'}`}>
            {totalRulesCount}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('SURGE')}
          className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'SURGE'
              ? 'bg-amber-600 text-white shadow-md shadow-amber-500/20'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-cloudy-100 dark:hover:bg-slate-800'
          }`}
        >
          <Zap className="w-4 h-4" />
          <span>Surge Multipliers</span>
          <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${activeTab === 'SURGE' ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-600'}`}>
            {allSurges.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('SANDBOX')}
          className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'SANDBOX'
              ? 'bg-sky-600 text-white shadow-md shadow-sky-500/20'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-cloudy-100 dark:hover:bg-slate-800'
          }`}
        >
          <Calculator className="w-4 h-4" />
          <span>Fare Calculator Sandbox</span>
        </button>
      </div>

      {/* TAB 1: FARE RULES MATRIX */}
      {activeTab === 'RULES' && (
        <div className="space-y-4">
          {/* Information banner regarding dynamic Google Maps FASTag tolls */}
          <div className="p-3 bg-emerald-50/80 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200 dark:border-emerald-800 flex items-center justify-between text-xs text-emerald-900 dark:text-emerald-300">
            <div className="flex items-center gap-2">
              <span className="text-base">🛣️</span>
              <span>
                <strong>Dynamic Highway Tolls:</strong> FASTag corridor tolls are calculated automatically in real-time via Google Maps Routes & Directions APIs. No manual toll slab required.
              </span>
            </div>
            <span className="px-2 py-0.5 rounded-md bg-emerald-200/60 dark:bg-emerald-900/80 font-bold text-[10px] uppercase tracking-wider">
              Live Google Maps API
            </span>
          </div>

          {/* Filters Bar */}
          <div className="glass-panel p-3.5 rounded-2xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 border border-cloudy-200 dark:border-slate-800 shadow-card">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
              <input
                type="text"
                placeholder="Search category, vehicle..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-white dark:bg-slate-900 border border-cloudy-300 dark:border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs font-bold text-slate-950 dark:text-white placeholder-slate-500 outline-none focus:border-brand-500 shadow-sm"
              />
            </div>

            <select
              value={activeServiceTab}
              onChange={(e) => setActiveServiceTab(e.target.value as any)}
              className="bg-white dark:bg-slate-900 border border-cloudy-300 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 dark:text-slate-100 outline-none focus:border-brand-500 shadow-sm"
            >
              <option value="ALL">All Services (Taxi & Truck)</option>
              <option value="DROP_TAXI">🚕 Drop Taxi Only</option>
              <option value="GOODS_TRUCK">🚚 Goods Truck Only</option>
            </select>

            <select
              value={activeScopeTab}
              onChange={(e) => setActiveScopeTab(e.target.value as any)}
              className="bg-white dark:bg-slate-900 border border-cloudy-300 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 dark:text-slate-100 outline-none focus:border-brand-500 shadow-sm"
            >
              <option value="ALL">All Trip Scopes</option>
              <option value="INTER_STATION">🏙️ Inter-Station (Local - ₹0 Bata)</option>
              <option value="OUTSTATION">🛣️ Outstation (Intercity Drop)</option>
            </select>

            <div className="flex items-center justify-end gap-1.5">
              <span className="text-xs font-bold text-slate-500 mr-1">View:</span>
              <button
                type="button"
                onClick={() => setViewMode('TABLE')}
                className={`p-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                  viewMode === 'TABLE'
                    ? 'bg-brand-50 dark:bg-brand-950/60 border-brand-300 text-brand-600'
                    : 'bg-white dark:bg-slate-900 border-cloudy-300 dark:border-slate-800 text-slate-500'
                }`}
                title="Table View"
              >
                <TableIcon className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('CARDS')}
                className={`p-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                  viewMode === 'CARDS'
                    ? 'bg-brand-50 dark:bg-brand-950/60 border-brand-300 text-brand-600'
                    : 'bg-white dark:bg-slate-900 border-cloudy-300 dark:border-slate-800 text-slate-500'
                }`}
                title="Cards Grid View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Table View */}
          {viewMode === 'TABLE' ? (
            <DataTable
              columns={ruleColumns}
              data={filteredFareRules}
              isLoading={loadingRules}
              compact={true}
              emptyMessage="No fare rules match the selected filters."
            />
          ) : (
            /* Cards Grid View */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredFareRules.map((rule: FareRule) => {
                const isInter = rule.tripScope === 'INTER_STATION';
                return (
                  <div
                    key={rule._id}
                    className="glass-panel p-4 rounded-2xl border border-cloudy-200 dark:border-slate-800 space-y-3 hover:border-brand-400 dark:hover:border-slate-700 transition-all shadow-card flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <Badge variant={rule.serviceType === 'DROP_TAXI' ? 'brand' : 'info'} size="sm">
                              {rule.serviceType === 'DROP_TAXI' ? '🚕 Drop Taxi' : '🚚 Goods Truck'}
                            </Badge>
                            <Badge variant={isInter ? 'info' : 'warning'} size="sm">
                              {isInter ? '🏙️ Inter-Station' : '🛣️ Outstation'}
                            </Badge>
                          </div>
                          <h4 className="text-xs font-black text-slate-950 dark:text-white mt-1.5">
                            {rule.title}
                          </h4>
                          <p className="text-[10px] text-slate-500 font-mono">{rule.category}</p>
                        </div>

                        <Button
                          variant="outline"
                          size="sm"
                          icon={<Edit2 className="w-3 h-3" />}
                          onClick={() => {
                            setEditingRule({ ...rule });
                            setRuleModalTab('PRICING');
                          }}
                          className="text-xs py-1 font-bold shrink-0"
                        >
                          Edit
                        </Button>
                      </div>

                      {/* Pricing Grid */}
                      <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 dark:bg-slate-950/60 p-3 rounded-xl border border-cloudy-200 dark:border-slate-800 mt-3">
                        <div>
                          <span className="text-[10px] text-slate-500 font-bold uppercase block">Base Fare</span>
                          <span className="font-black text-slate-950 dark:text-white font-mono text-sm">
                            {formatCurrency(rule.baseFare)}
                          </span>
                          <span className="text-[10px] text-slate-400 font-semibold block">({rule.baseDistanceKm} km incl.)</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-500 font-bold uppercase block">Rate / KM</span>
                          <span className="font-black text-brand-700 dark:text-brand-400 font-mono text-sm">
                            {formatCurrency(rule.perKmRate)}/km
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-500 font-bold uppercase block">Driver Bata</span>
                          {isInter ? (
                            <span className="font-black text-emerald-600 dark:text-emerald-400 text-xs">₹0 (No Bata)</span>
                          ) : (
                            <span className="font-black text-amber-600 dark:text-amber-400 font-mono text-xs">{formatCurrency(rule.driverBata || 350)}/day</span>
                          )}
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-500 font-bold uppercase block">Commission</span>
                          <span className="font-black text-indigo-600 dark:text-indigo-400 font-mono text-xs">
                            {rule.driverCommissionPercentage ?? 15}% Platform
                          </span>
                        </div>
                      </div>

                      {/* SLA Specs */}
                      <div className="mt-2.5 space-y-1.5 text-[11px] text-slate-600 dark:text-slate-400">
                        <div className="flex justify-between">
                          <span>Dispatch Radius:</span>
                          <strong className="text-slate-900 dark:text-white font-mono">{rule.bookingRadiusKm ?? 15} KM</strong>
                        </div>
                        <div className="flex justify-between">
                          <span>Free Waiting Time:</span>
                          <strong className="text-slate-900 dark:text-white font-mono">{rule.freeWaitingMins ?? 5} Mins ({formatCurrency(rule.waitingChargePerMin)}/m)</strong>
                        </div>
                        <div className="flex justify-between">
                          <span>Min Driver Wallet:</span>
                          <strong className="text-slate-900 dark:text-white font-mono">{formatCurrency(rule.walletMinAmount ?? 500)}</strong>
                        </div>
                        <div className="flex justify-between">
                          <span>Cancellation:</span>
                          <strong className="text-rose-600 dark:text-rose-400 font-mono">{rule.cancellationPercentage ?? 10}% ({rule.customerCancellationTimeHours ?? 1}h SLA)</strong>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-400 font-semibold pt-2 border-t border-cloudy-200 dark:border-slate-800 mt-2">
                      <span className="flex items-center gap-1 text-purple-600 dark:text-purple-400 font-bold">
                        <Award className="w-3.5 h-3.5" />
                        {(rule.incentives?.daily?.length || 0) + (rule.incentives?.weekly?.length || 0) + (rule.incentives?.monthly?.length || 0)} Incentive Tiers
                      </span>
                      <span>GST: <strong className="text-slate-950 dark:text-white">{rule.taxPercentage}%</strong></span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: SURGE MULTIPLIERS */}
      {activeTab === 'SURGE' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-extrabold text-slate-950 dark:text-white flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
                Active Surge Pricing Zones ({allSurges.length})
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Dynamic pricing multiplier overrides applied during high demand, bad weather, or peak hours.
              </p>
            </div>

            <Button
              variant="primary"
              size="sm"
              icon={<Plus className="w-4 h-4" />}
              onClick={() => setIsSurgeModalOpen(true)}
              className="font-bold shadow-md shadow-brand-500/20"
            >
              Add Surge Zone
            </Button>
          </div>

          <DataTable
            columns={surgeColumns}
            data={allSurges}
            isLoading={loadingSurges}
            compact={true}
            emptyMessage="No surge pricing zones configured. Click 'Add Surge Zone' to create one."
          />
        </div>
      )}

      {/* TAB 3: PRICING SANDBOX CALCULATOR */}
      {activeTab === 'SANDBOX' && (
        <div className="glass-panel p-5 rounded-2xl border border-cloudy-200 dark:border-slate-800 shadow-card space-y-4">
          <div>
            <h3 className="text-sm font-black text-slate-950 dark:text-white flex items-center gap-1.5">
              <Calculator className="w-4 h-4 text-brand-600" />
              Dynamic Fare & Commission Calculation Sandbox
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Simulate live customer fares, platform commission cuts, driver bata allowances, and fastag highway tolls computed dynamically.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-xs">
            {/* Input Controls */}
            <div className="p-4 bg-slate-50 dark:bg-slate-950/60 rounded-2xl border border-cloudy-200 dark:border-slate-800 space-y-3.5">
              <h4 className="font-extrabold text-xs uppercase tracking-wider text-brand-700 dark:text-brand-400">
                Simulation Parameters
              </h4>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1 font-bold">Trip Scope</label>
                  <select
                    value={testScope}
                    onChange={(e) => setTestScope(e.target.value as TripScope)}
                    className="w-full bg-white dark:bg-slate-900 border border-cloudy-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white outline-none focus:border-brand-500 font-bold shadow-sm"
                  >
                    <option value="INTER_STATION">🏙️ Inter-Station (Local - ₹0 Bata)</option>
                    <option value="OUTSTATION">🛣️ Outstation (Intercity Drop)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1 font-bold">Vehicle Category</label>
                  <select
                    value={testCat}
                    onChange={(e) => setTestCat(e.target.value)}
                    className="w-full bg-white dark:bg-slate-900 border border-cloudy-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white outline-none focus:border-brand-500 font-bold shadow-sm"
                  >
                    {vehicleTypesList.length > 0 ? (
                      vehicleTypesList.map((vt: any) => (
                        <option key={vt.code} value={vt.code}>
                          {vt.serviceType === 'DROP_TAXI' ? '🚕' : '🚚'} {vt.name} ({vt.wheelType || `${vt.wheelCount}W`})
                        </option>
                      ))
                    ) : (
                      <>
                        <option value="TAXI_SEDAN">Taxi Sedan (Dzire / Etios)</option>
                        <option value="TAXI_SUV">Taxi SUV (Ertiga / Marazzo)</option>
                        <option value="TAXI_INNOVA">Taxi Premium Innova</option>
                        <option value="TRUCK_MINI_1TON">Truck Tata Ace (1-Ton)</option>
                        <option value="TRUCK_MEDIUM_3TON">Truck Bolero Pickup (3-Ton)</option>
                        <option value="TRUCK_HEAVY_7TON">Truck Tata 407 (7-Ton)</option>
                      </>
                    )}
                  </select>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-slate-700 dark:text-slate-300 font-bold">Estimated Distance (KM)</label>
                  <span className="font-mono font-black text-brand-600 text-sm">{testDist} KM</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="500"
                  value={testDist}
                  onChange={(e) => setTestDist(Number(e.target.value))}
                  className="w-full accent-brand-600 cursor-pointer"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1 font-bold">Extra Stops Count</label>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    value={testExtraStops}
                    onChange={(e) => setTestExtraStops(Number(e.target.value))}
                    className="w-full bg-white dark:bg-slate-900 border border-cloudy-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white outline-none focus:border-brand-500 shadow-sm font-bold"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1 font-bold">Coupon Code (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. WELCOME50"
                    value={testCoupon}
                    onChange={(e) => setTestCoupon(e.target.value.toUpperCase())}
                    className="w-full bg-white dark:bg-slate-900 border border-cloudy-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white outline-none focus:border-brand-500 uppercase shadow-sm font-bold"
                  />
                </div>
              </div>

              <Button
                variant="primary"
                size="sm"
                className="w-full mt-2 font-bold shadow-md shadow-brand-500/20"
                isLoading={calcLoading}
                onClick={handleTestCalculation}
              >
                Compute Dynamic Pricing Breakdown
              </Button>
            </div>

            {/* Live Calculation Output Receipt */}
            <div className="p-4 bg-white dark:bg-slate-950 rounded-2xl border border-cloudy-200 dark:border-slate-800 space-y-3 flex flex-col justify-between shadow-sm">
              <div>
                <h4 className="font-extrabold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300 pb-2 border-b border-cloudy-200 dark:border-slate-800 flex items-center justify-between">
                  <span>Fare Calculation Receipt</span>
                  <span className="text-[10px] text-brand-600 font-mono font-bold">Live Dynamic Engine</span>
                </h4>

                {calcResult ? (
                  <div className="mt-3 space-y-2 text-xs font-semibold">
                    <div className="flex justify-between text-slate-600 dark:text-slate-400">
                      <span>Base Fare & Distance Slab</span>
                      <span className="font-mono text-slate-950 dark:text-white font-bold">
                        {formatCurrency(calcResult.fareBreakdown?.subtotal)}
                      </span>
                    </div>

                    <div className="flex justify-between text-slate-600 dark:text-slate-400">
                      <span>Toll Estimate (Live FASTag via Google Maps)</span>
                      <span className="font-mono text-slate-950 dark:text-white font-bold">
                        {formatCurrency(calcResult.fareBreakdown?.tollFee || 0)}
                      </span>
                    </div>

                    <div className="flex justify-between text-slate-600 dark:text-slate-400">
                      <span>Driver Bata Allowance</span>
                      <span className={testScope === 'INTER_STATION' ? 'text-emerald-600 font-bold' : 'text-amber-600 font-bold font-mono'}>
                        {testScope === 'INTER_STATION' ? '₹0 (No Bata for Inter-Station)' : formatCurrency(calcResult.fareBreakdown?.driverBata || 0)}
                      </span>
                    </div>

                    {calcResult.fareBreakdown?.discount > 0 && (
                      <div className="flex justify-between text-emerald-600">
                        <span>Coupon Discount</span>
                        <span className="font-mono font-bold">-{formatCurrency(calcResult.fareBreakdown?.discount)}</span>
                      </div>
                    )}

                    <div className="flex justify-between text-slate-600 dark:text-slate-400">
                      <span>GST Tax (5%)</span>
                      <span className="font-mono text-slate-950 dark:text-white font-bold">
                        {formatCurrency(calcResult.fareBreakdown?.tax)}
                      </span>
                    </div>

                    <div className="pt-2 border-t border-cloudy-200 dark:border-slate-800 flex justify-between items-baseline font-black text-sm text-slate-950 dark:text-white">
                      <span>Total Customer Fare:</span>
                      <span className="text-brand-600 dark:text-brand-400 text-lg font-mono">
                        {formatCurrency(calcResult.fareBreakdown?.finalFare)}
                      </span>
                    </div>

                    {/* Driver Earnings Breakdown Preview */}
                    <div className="mt-3 p-2.5 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/60 space-y-1 text-[11px]">
                      <div className="flex justify-between text-indigo-900 dark:text-indigo-300 font-bold">
                        <span>Platform Commission (15% est):</span>
                        <span className="font-mono">-{formatCurrency(Number(((calcResult.fareBreakdown?.subtotal || 0) * 0.15).toFixed(2)))}</span>
                      </div>
                      <div className="flex justify-between text-emerald-700 dark:text-emerald-300 font-black">
                        <span>Net Driver Take-Home Pay:</span>
                        <span className="font-mono">
                          {formatCurrency(
                            Number(
                              (
                                (calcResult.fareBreakdown?.finalFare || 0) -
                                (calcResult.fareBreakdown?.tax || 0) -
                                ((calcResult.fareBreakdown?.subtotal || 0) * 0.15)
                              ).toFixed(2)
                            )
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="py-12 text-center text-slate-400 text-xs">
                    <Calculator className="w-8 h-8 mx-auto mb-2 opacity-40" />
                    <p className="font-bold">Select parameters and click "Compute" to see instant breakdown.</p>
                  </div>
                )}
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 font-medium leading-relaxed">
                ℹ️ <strong>Rule Notice:</strong> Inter-station local city trips strictly carry <strong>₹0 Driver Bata</strong>. Outstation trips include daily bata, dynamic live FASTag tolls, and return allowances.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CREATE & EDIT FARE RULE MODAL */}
      <Modal
        isOpen={Boolean(editingRule || isCreateRuleModalOpen)}
        onClose={() => {
          setEditingRule(null);
          setIsCreateRuleModalOpen(false);
        }}
        title={
          editingRule
            ? `Edit Pricing Rule: ${editingRule.title} (${editingRule.tripScope === 'INTER_STATION' ? 'Inter-Station' : 'Outstation'})`
            : 'Create New Fare & Operational Rule'
        }
        size="lg"
      >
        {currentModalRule && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (editingRule) {
                updateRuleMutation.mutate({
                  id: editingRule._id,
                  data: editingRule,
                });
              } else {
                createRuleMutation.mutate(newRule);
              }
            }}
            className="space-y-4 text-xs"
          >
            {/* Modal Internal Tabs */}
            <div className="flex items-center gap-1.5 border-b border-cloudy-200 dark:border-slate-800 pb-2 overflow-x-auto text-xs">
              <button
                type="button"
                onClick={() => setRuleModalTab('PRICING')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                  ruleModalTab === 'PRICING'
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <CircleDollarSign className="w-3.5 h-3.5" />
                <span>Base & KM Rates</span>
              </button>

              <button
                type="button"
                onClick={() => setRuleModalTab('WAITING')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                  ruleModalTab === 'WAITING'
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Waiting & Time</span>
              </button>

              <button
                type="button"
                onClick={() => setRuleModalTab('COMMISSION')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                  ruleModalTab === 'COMMISSION'
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Wallet className="w-3.5 h-3.5" />
                <span>Commission & Wallet</span>
              </button>

              <button
                type="button"
                onClick={() => setRuleModalTab('DISPATCH')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                  ruleModalTab === 'DISPATCH'
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Radio className="w-3.5 h-3.5" />
                <span>Booking Radius</span>
              </button>

              <button
                type="button"
                onClick={() => setRuleModalTab('CANCELLATION')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                  ruleModalTab === 'CANCELLATION'
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <UserX className="w-3.5 h-3.5" />
                <span>Cancellation SLA</span>
              </button>

              <button
                type="button"
                onClick={() => setRuleModalTab('INCENTIVES')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                  ruleModalTab === 'INCENTIVES'
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Award className="w-3.5 h-3.5" />
                <span>Incentives</span>
              </button>
            </div>

            {/* TAB CONTENT: 1. PRICING */}
            {ruleModalTab === 'PRICING' && (
              <div className="space-y-3.5">
                {/* Notice on Dynamic Tolls */}
                <div className="p-2.5 bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-400 flex items-center gap-2">
                  <span>🛣️</span>
                  <span><strong>Note on Tolls:</strong> FASTag highway tolls are computed dynamically via Google Maps live routing. No manual toll rate needed here.</span>
                </div>

                {/* Scope & Service selector if creating */}
                {!editingRule && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                    <div>
                      <label className="block text-slate-700 dark:text-slate-300 mb-1 font-bold">Vehicle Type</label>
                      <select
                        value={newRule.category}
                        onChange={(e) => {
                          const cat = e.target.value;
                          const matched = vehicleTypesList.find((v: any) => v.code === cat);
                          setNewRule({
                            ...newRule,
                            category: cat,
                            serviceType: matched?.serviceType || (cat.startsWith('TAXI') ? 'DROP_TAXI' : 'GOODS_TRUCK'),
                            title: matched ? `${matched.name} (${newRule.tripScope === 'INTER_STATION' ? 'City Local' : 'Outstation'})` : newRule.title,
                          });
                        }}
                        className="w-full bg-white dark:bg-slate-900 border border-cloudy-300 dark:border-slate-700 rounded-xl px-2.5 py-1.5 text-xs font-bold"
                      >
                        {vehicleTypesList.map((vt: any) => (
                          <option key={vt.code} value={vt.code}>
                            {vt.name} ({vt.code})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-700 dark:text-slate-300 mb-1 font-bold">Service Type</label>
                      <select
                        value={newRule.serviceType}
                        onChange={(e) => setNewRule({ ...newRule, serviceType: e.target.value as any })}
                        className="w-full bg-white dark:bg-slate-900 border border-cloudy-300 dark:border-slate-700 rounded-xl px-2.5 py-1.5 text-xs font-bold"
                      >
                        <option value="DROP_TAXI">🚕 Drop Taxi</option>
                        <option value="GOODS_TRUCK">🚚 Goods Truck</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-700 dark:text-slate-300 mb-1 font-bold">Trip Scope</label>
                      <select
                        value={newRule.tripScope}
                        onChange={(e) => {
                          const scope = e.target.value as TripScope;
                          setNewRule({
                            ...newRule,
                            tripScope: scope,
                            driverBata: scope === 'INTER_STATION' ? 0 : 350,
                          });
                        }}
                        className="w-full bg-white dark:bg-slate-900 border border-cloudy-300 dark:border-slate-700 rounded-xl px-2.5 py-1.5 text-xs font-bold"
                      >
                        <option value="INTER_STATION">🏙️ Inter-Station (Local)</option>
                        <option value="OUTSTATION">🛣️ Outstation (Intercity)</option>
                      </select>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1 font-bold">Rule Display Title</label>
                  <input
                    type="text"
                    value={currentModalRule.title || ''}
                    onChange={(e) => {
                      if (editingRule) setEditingRule({ ...editingRule, title: e.target.value });
                      else setNewRule({ ...newRule, title: e.target.value });
                    }}
                    required
                    className="w-full bg-white dark:bg-slate-900 border border-cloudy-300 dark:border-slate-700 rounded-xl px-3 py-2 font-bold"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 mb-1 font-bold">Base Fare (₹)</label>
                    <input
                      type="number"
                      value={currentModalRule.baseFare}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        if (editingRule) setEditingRule({ ...editingRule, baseFare: val });
                        else setNewRule({ ...newRule, baseFare: val });
                      }}
                      required
                      className="w-full bg-white dark:bg-slate-900 border border-cloudy-300 dark:border-slate-700 rounded-xl px-3 py-2 font-bold font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 mb-1 font-bold">Base Distance (KM Included)</label>
                    <input
                      type="number"
                      value={currentModalRule.baseDistanceKm}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        if (editingRule) setEditingRule({ ...editingRule, baseDistanceKm: val });
                        else setNewRule({ ...newRule, baseDistanceKm: val });
                      }}
                      required
                      className="w-full bg-white dark:bg-slate-900 border border-cloudy-300 dark:border-slate-700 rounded-xl px-3 py-2 font-bold font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 mb-1 font-bold">Rate per KM (₹/KM)</label>
                    <input
                      type="number"
                      value={currentModalRule.perKmRate}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        if (editingRule) setEditingRule({ ...editingRule, perKmRate: val });
                        else setNewRule({ ...newRule, perKmRate: val });
                      }}
                      required
                      className="w-full bg-white dark:bg-slate-900 border border-cloudy-300 dark:border-slate-700 rounded-xl px-3 py-2 font-bold font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 mb-1 font-bold">Minimum Fare (₹)</label>
                    <input
                      type="number"
                      value={currentModalRule.minimumFare}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        if (editingRule) setEditingRule({ ...editingRule, minimumFare: val });
                        else setNewRule({ ...newRule, minimumFare: val });
                      }}
                      required
                      className="w-full bg-white dark:bg-slate-900 border border-cloudy-300 dark:border-slate-700 rounded-xl px-3 py-2 font-bold font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1 font-bold">
                    Driver Bata / Day (₹) {currentModalRule.tripScope === 'INTER_STATION' && '(₹0 for Inter-Station Local)'}
                  </label>
                  <input
                    type="number"
                    value={currentModalRule.tripScope === 'INTER_STATION' ? 0 : currentModalRule.driverBata}
                    disabled={currentModalRule.tripScope === 'INTER_STATION'}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      if (editingRule) setEditingRule({ ...editingRule, driverBata: val });
                      else setNewRule({ ...newRule, driverBata: val });
                    }}
                    required
                    className={`w-full border rounded-xl px-3 py-2 font-bold font-mono ${
                      currentModalRule.tripScope === 'INTER_STATION'
                        ? 'bg-slate-100 dark:bg-slate-800 text-slate-500 cursor-not-allowed border-slate-300 dark:border-slate-700'
                        : 'bg-white dark:bg-slate-900 border-cloudy-300 dark:border-slate-700 text-slate-900 dark:text-white focus:border-brand-500'
                    }`}
                  />
                  <span className="text-[10px] text-slate-500 mt-1 block">
                    {currentModalRule.tripScope === 'INTER_STATION'
                      ? 'Local city trips carry ₹0 Bata allowance.'
                      : 'Daily driver allowance for outstation journey.'}
                  </span>
                </div>
              </div>
            )}

            {/* TAB CONTENT: 2. WAITING & TIME */}
            {ruleModalTab === 'WAITING' && (
              <div className="space-y-3.5">
                <div className="p-3 bg-blue-50 dark:bg-blue-950/40 rounded-xl border border-blue-200 dark:border-blue-900 text-blue-900 dark:text-blue-300 text-xs">
                  ℹ️ <strong>Waiting Policy:</strong> Customers are given a free waiting grace period upon driver arrival. Once exceeded, waiting charges accrue per minute.
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 mb-1 font-bold">
                      Free Waiting Time (Minutes)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={currentModalRule.freeWaitingMins ?? 5}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        if (editingRule) setEditingRule({ ...editingRule, freeWaitingMins: val });
                        else setNewRule({ ...newRule, freeWaitingMins: val });
                      }}
                      required
                      className="w-full bg-white dark:bg-slate-900 border border-cloudy-300 dark:border-slate-700 rounded-xl px-3 py-2 font-bold font-mono"
                    />
                    <span className="text-[10px] text-slate-500 mt-0.5 block">Grace period before billing begins</span>
                  </div>

                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 mb-1 font-bold">
                      Waiting Charge / Minute (₹/min)
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      value={currentModalRule.waitingChargePerMin}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        if (editingRule) setEditingRule({ ...editingRule, waitingChargePerMin: val });
                        else setNewRule({ ...newRule, waitingChargePerMin: val });
                      }}
                      required
                      className="w-full bg-white dark:bg-slate-900 border border-cloudy-300 dark:border-slate-700 rounded-xl px-3 py-2 font-bold font-mono"
                    />
                    <span className="text-[10px] text-slate-500 mt-0.5 block">Applied after free minutes elapsed</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 mb-1 font-bold">
                      Ride In-Transit Time Rate (₹/min)
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      value={currentModalRule.perMinuteRate}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        if (editingRule) setEditingRule({ ...editingRule, perMinuteRate: val });
                        else setNewRule({ ...newRule, perMinuteRate: val });
                      }}
                      required
                      className="w-full bg-white dark:bg-slate-900 border border-cloudy-300 dark:border-slate-700 rounded-xl px-3 py-2 font-bold font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 mb-1 font-bold">
                      Night Surcharge Multiplier (e.g. 1.25x)
                    </label>
                    <input
                      type="number"
                      step="0.05"
                      min="1.0"
                      value={currentModalRule.nightChargeMultiplier}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        if (editingRule) setEditingRule({ ...editingRule, nightChargeMultiplier: val });
                        else setNewRule({ ...newRule, nightChargeMultiplier: val });
                      }}
                      required
                      className="w-full bg-white dark:bg-slate-900 border border-cloudy-300 dark:border-slate-700 rounded-xl px-3 py-2 font-bold font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 mb-1 font-bold">Night Window Start</label>
                    <input
                      type="time"
                      value={currentModalRule.nightStartTime || '22:00'}
                      onChange={(e) => {
                        if (editingRule) setEditingRule({ ...editingRule, nightStartTime: e.target.value });
                        else setNewRule({ ...newRule, nightStartTime: e.target.value });
                      }}
                      className="w-full bg-white dark:bg-slate-900 border border-cloudy-300 dark:border-slate-700 rounded-xl px-3 py-2 font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 mb-1 font-bold">Night Window End</label>
                    <input
                      type="time"
                      value={currentModalRule.nightEndTime || '05:00'}
                      onChange={(e) => {
                        if (editingRule) setEditingRule({ ...editingRule, nightEndTime: e.target.value });
                        else setNewRule({ ...newRule, nightEndTime: e.target.value });
                      }}
                      className="w-full bg-white dark:bg-slate-900 border border-cloudy-300 dark:border-slate-700 rounded-xl px-3 py-2 font-bold"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT: 3. COMMISSION & WALLET */}
            {ruleModalTab === 'COMMISSION' && (
              <div className="space-y-3.5">
                <div className="p-3 bg-indigo-50 dark:bg-indigo-950/40 rounded-xl border border-indigo-200 dark:border-indigo-900 text-indigo-900 dark:text-indigo-300 text-xs">
                  💼 <strong>Platform Commission:</strong> Automatically deducted from gross ride fare. Drivers must hold minimum wallet balance to receive incoming ride bookings.
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 mb-1 font-bold">
                      Driver Platform Commission (%)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={currentModalRule.driverCommissionPercentage ?? 15}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        if (editingRule) setEditingRule({ ...editingRule, driverCommissionPercentage: val });
                        else setNewRule({ ...newRule, driverCommissionPercentage: val });
                      }}
                      required
                      className="w-full bg-white dark:bg-slate-900 border border-cloudy-300 dark:border-slate-700 rounded-xl px-3 py-2 font-bold font-mono"
                    />
                    <span className="text-[10px] text-slate-500 mt-0.5 block">e.g. 15% platform fee deduction</span>
                  </div>

                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 mb-1 font-bold">
                      Driver Min Wallet Balance (₹)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={currentModalRule.walletMinAmount ?? 500}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        if (editingRule) setEditingRule({ ...editingRule, walletMinAmount: val });
                        else setNewRule({ ...newRule, walletMinAmount: val });
                      }}
                      required
                      className="w-full bg-white dark:bg-slate-900 border border-cloudy-300 dark:border-slate-700 rounded-xl px-3 py-2 font-bold font-mono"
                    />
                    <span className="text-[10px] text-slate-500 mt-0.5 block">Threshold needed to receive trip broadcasts</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 mb-1 font-bold">Tax / GST Percentage (%)</label>
                    <input
                      type="number"
                      value={currentModalRule.taxPercentage ?? 5}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        if (editingRule) setEditingRule({ ...editingRule, taxPercentage: val });
                        else setNewRule({ ...newRule, taxPercentage: val });
                      }}
                      required
                      className="w-full bg-white dark:bg-slate-900 border border-cloudy-300 dark:border-slate-700 rounded-xl px-3 py-2 font-bold font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 mb-1 font-bold">Extra Stop Charge (₹)</label>
                    <input
                      type="number"
                      value={currentModalRule.extraStopCharge ?? 50}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        if (editingRule) setEditingRule({ ...editingRule, extraStopCharge: val });
                        else setNewRule({ ...newRule, extraStopCharge: val });
                      }}
                      required
                      className="w-full bg-white dark:bg-slate-900 border border-cloudy-300 dark:border-slate-700 rounded-xl px-3 py-2 font-bold font-mono"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT: 4. DISPATCH RADIUS */}
            {ruleModalTab === 'DISPATCH' && (
              <div className="space-y-3.5">
                <div className="p-3 bg-sky-50 dark:bg-sky-950/40 rounded-xl border border-sky-200 dark:border-sky-900 text-sky-900 dark:text-sky-300 text-xs">
                  📡 <strong>Driver Booking Radius:</strong> Radius in Kilometers around the customer pickup coordinate used by the dispatch engine to locate and notify eligible drivers.
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1 font-bold">
                    Driver Dispatch Search Radius (KM)
                  </label>
                  <div className="flex items-center gap-4">
                    <input
                      type="range"
                      min="3"
                      max="100"
                      value={currentModalRule.bookingRadiusKm ?? 15}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        if (editingRule) setEditingRule({ ...editingRule, bookingRadiusKm: val });
                        else setNewRule({ ...newRule, bookingRadiusKm: val });
                      }}
                      className="w-full accent-brand-600 cursor-pointer"
                    />
                    <span className="font-mono font-black text-brand-600 text-base min-w-[70px]">
                      {currentModalRule.bookingRadiusKm ?? 15} KM
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500 mt-1 block">
                    Recommended: 10-15 KM for city local, 25-50 KM for outstation pickups
                  </span>
                </div>
              </div>
            )}

            {/* TAB CONTENT: 5. CANCELLATION */}
            {ruleModalTab === 'CANCELLATION' && (
              <div className="space-y-3.5">
                <div className="p-3 bg-rose-50 dark:bg-rose-950/40 rounded-xl border border-rose-200 dark:border-rose-900 text-rose-900 dark:text-rose-300 text-xs">
                  🚫 <strong>Cancellation Policy:</strong> Defines customer/driver cancellation time windows and penalization percentages for late ride cancellations.
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 mb-1 font-bold">
                      Cancellation Penalty (%)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={currentModalRule.cancellationPercentage ?? 10}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        if (editingRule) setEditingRule({ ...editingRule, cancellationPercentage: val });
                        else setNewRule({ ...newRule, cancellationPercentage: val });
                      }}
                      required
                      className="w-full bg-white dark:bg-slate-900 border border-cloudy-300 dark:border-slate-700 rounded-xl px-3 py-2 font-bold font-mono"
                    />
                    <span className="text-[10px] text-slate-500 mt-0.5 block">% of fare levied on late cancellation</span>
                  </div>

                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 mb-1 font-bold">
                      Flat Minimum Cancellation Fee (₹)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={currentModalRule.cancellationFee ?? 50}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        if (editingRule) setEditingRule({ ...editingRule, cancellationFee: val });
                        else setNewRule({ ...newRule, cancellationFee: val });
                      }}
                      required
                      className="w-full bg-white dark:bg-slate-900 border border-cloudy-300 dark:border-slate-700 rounded-xl px-3 py-2 font-bold font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 mb-1 font-bold">
                      Customer Free Cancel Window (Hours)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={currentModalRule.customerCancellationTimeHours ?? 1}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        if (editingRule) setEditingRule({ ...editingRule, customerCancellationTimeHours: val });
                        else setNewRule({ ...newRule, customerCancellationTimeHours: val });
                      }}
                      required
                      className="w-full bg-white dark:bg-slate-900 border border-cloudy-300 dark:border-slate-700 rounded-xl px-3 py-2 font-bold font-mono"
                    />
                    <span className="text-[10px] text-slate-500 mt-0.5 block">Hours before pickup with zero penalty</span>
                  </div>

                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 mb-1 font-bold">
                      Driver Cancellation Window (Hours)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={currentModalRule.driverCancellationTimeHours ?? 2}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        if (editingRule) setEditingRule({ ...editingRule, driverCancellationTimeHours: val });
                        else setNewRule({ ...newRule, driverCancellationTimeHours: val });
                      }}
                      required
                      className="w-full bg-white dark:bg-slate-900 border border-cloudy-300 dark:border-slate-700 rounded-xl px-3 py-2 font-bold font-mono"
                    />
                    <span className="text-[10px] text-slate-500 mt-0.5 block">Advance notice required from driver</span>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1 font-bold">
                    Driver Daily Max Cancellations Allowed
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={currentModalRule.driverDailyMaxCancellations ?? 3}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      if (editingRule) setEditingRule({ ...editingRule, driverDailyMaxCancellations: val });
                      else setNewRule({ ...newRule, driverDailyMaxCancellations: val });
                    }}
                    required
                    className="w-full bg-white dark:bg-slate-900 border border-cloudy-300 dark:border-slate-700 rounded-xl px-3 py-2 font-bold font-mono"
                  />
                  <span className="text-[10px] text-slate-500 mt-0.5 block">Driver gets auto-flagged/blocked if daily count exceeded</span>
                </div>
              </div>
            )}

            {/* TAB CONTENT: 6. INCENTIVES */}
            {ruleModalTab === 'INCENTIVES' && (
              <div className="space-y-4">
                <div className="p-3 bg-purple-50 dark:bg-purple-950/40 rounded-xl border border-purple-200 dark:border-purple-900 text-purple-900 dark:text-purple-300 text-xs">
                  🎁 <strong>Tiered Driver Incentives:</strong> Motivate driver fleet with milestone bonuses based on completed booking counts (Daily, Weekly, Monthly).
                </div>

                {/* Sub Tab: Daily / Weekly / Monthly */}
                <div className="flex items-center gap-2 border-b border-cloudy-200 dark:border-slate-800 pb-2">
                  {(['daily', 'weekly', 'monthly'] as const).map((period) => (
                    <button
                      key={period}
                      type="button"
                      onClick={() => setIncentivePeriod(period)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold uppercase transition-all ${
                        incentivePeriod === period
                          ? 'bg-purple-600 text-white shadow-sm'
                          : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      {period} Goals
                    </button>
                  ))}
                </div>

                {/* Add Tier Form */}
                <div className="flex items-end gap-3 p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-cloudy-200 dark:border-slate-800">
                  <div className="flex-1">
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                      Target Completed Rides
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={newTierTarget}
                      onChange={(e) => setNewTierTarget(Number(e.target.value))}
                      className="w-full bg-white dark:bg-slate-950 border border-cloudy-300 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs font-bold font-mono"
                    />
                  </div>

                  <div className="flex-1">
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                      Bonus Reward Amount (₹)
                    </label>
                    <input
                      type="number"
                      min="10"
                      value={newTierReward}
                      onChange={(e) => setNewTierReward(Number(e.target.value))}
                      className="w-full bg-white dark:bg-slate-950 border border-cloudy-300 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs font-bold font-mono"
                    />
                  </div>

                  <Button
                    type="button"
                    variant="primary"
                    size="sm"
                    onClick={() => handleAddIncentiveTier(Boolean(editingRule))}
                    className="font-bold text-xs"
                  >
                    Add Tier
                  </Button>
                </div>

                {/* Active Tiers Display */}
                <div className="space-y-2">
                  <h5 className="font-extrabold text-xs text-slate-800 dark:text-slate-200">
                    Configured ${incentivePeriod.toUpperCase()} Milestone Rewards:
                  </h5>

                  {(!currentModalRule.incentives?.[incentivePeriod] || currentModalRule.incentives[incentivePeriod]!.length === 0) ? (
                    <div className="p-4 text-center text-slate-400 text-xs border border-dashed rounded-xl">
                      No ${incentivePeriod} incentives added yet. Enter target rides and reward above to add one.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {currentModalRule.incentives[incentivePeriod]!.map((tier: IIncentiveTier, idx: number) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-2.5 rounded-xl bg-purple-50/60 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/80 text-xs"
                        >
                          <div>
                            <span className="font-black text-purple-950 dark:text-purple-200 font-mono">
                              ${tier.targetBookings} Completed Rides
                            </span>
                            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold block">
                              Reward: ${formatCurrency(tier.rewardAmount)}
                            </span>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleRemoveIncentiveTier(incentivePeriod, tier.targetBookings, Boolean(editingRule))}
                            className="p-1 rounded-md text-slate-400 hover:text-rose-600 transition-colors"
                            title="Remove tier"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Modal Actions */}
            <div className="pt-3 flex justify-between items-center border-t border-cloudy-200 dark:border-slate-800">
              <span className="text-[11px] text-slate-500 font-medium">
                Scope: <strong className="text-slate-900 dark:text-white">${currentModalRule.tripScope}</strong> • Service: <strong className="text-slate-900 dark:text-white">${currentModalRule.serviceType}</strong>
              </span>

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setEditingRule(null);
                    setIsCreateRuleModalOpen(false);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  isLoading={updateRuleMutation.isPending || createRuleMutation.isPending}
                  className="font-bold shadow-md shadow-brand-500/20"
                >
                  {editingRule ? 'Save Pricing Rule' : 'Create Fare Rule'}
                </Button>
              </div>
            </div>
          </form>
        )}
      </Modal>

      {/* Add Surge Zone Modal */}
      <Modal
        isOpen={isSurgeModalOpen}
        onClose={() => setIsSurgeModalOpen(false)}
        title="Add Dynamic Surge Pricing Zone"
        size="md"
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            createSurgeMutation.mutate({
              zoneName: surgeZone,
              multiplier: Number(surgeMultiplier),
              reason: surgeReason,
              isActive: true,
            });
          }}
          className="space-y-4 text-xs"
        >
          <div>
            <label className="block text-slate-700 dark:text-slate-300 mb-1 font-bold">Zone / Corridor Name</label>
            <input
              type="text"
              placeholder="e.g. Chennai Central to OMR Corridor"
              value={surgeZone}
              onChange={(e) => setSurgeZone(e.target.value)}
              required
              className="w-full bg-white dark:bg-slate-900 border border-cloudy-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white outline-none focus:border-brand-500 shadow-sm font-bold"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 dark:text-slate-300 mb-1 font-bold">Multiplier (e.g. 1.25x)</label>
              <input
                type="number"
                step="0.05"
                min="1.0"
                max="3.0"
                value={surgeMultiplier}
                onChange={(e) => setSurgeMultiplier(Number(e.target.value))}
                required
                className="w-full bg-white dark:bg-slate-900 border border-cloudy-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white outline-none focus:border-brand-500 shadow-sm font-black font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 mb-1 font-bold">Trigger Reason</label>
              <select
                value={surgeReason}
                onChange={(e) => setSurgeReason(e.target.value as any)}
                className="w-full bg-white dark:bg-slate-900 border border-cloudy-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white outline-none focus:border-brand-500 shadow-sm font-bold"
              >
                <option value="DEMAND">High Passenger Demand</option>
                <option value="PEAK_HOURS">Peak Traffic Hours</option>
                <option value="WEATHER">Heavy Rain / Weather</option>
                <option value="FESTIVAL">Festival / Weekend Rush</option>
                <option value="CUSTOM">Custom Multiplier</option>
              </select>
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-3 border-t border-cloudy-200 dark:border-slate-800">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsSurgeModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" isLoading={createSurgeMutation.isPending} className="font-bold">
              Create Surge Zone
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
