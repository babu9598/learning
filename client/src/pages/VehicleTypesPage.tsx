import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Sliders,
  Plus,
  Search,
  Truck,
  Car,
  Trash2,
  Edit2,
  Layers,
  CircleDollarSign,
  ExternalLink,
} from 'lucide-react';
import api from '../api/axiosClient';
import { DataTable, Column } from '../components/common/DataTable';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { VehicleType } from '../types';

export const VehicleTypesPage: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [serviceFilter, setServiceFilter] = useState('');
  const [wheelFilter, setWheelFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingType, setEditingType] = useState<VehicleType | null>(null);

  // Form State - Specifications & Wheels Only (Pricing is managed in Fare Management)
  const [formServiceType, setFormServiceType] = useState<'DROP_TAXI' | 'GOODS_TRUCK'>('DROP_TAXI');
  const [formName, setFormName] = useState('');
  const [formCode, setFormCode] = useState('');
  const [formWheelCount, setFormWheelCount] = useState<number>(4);
  const [formWheelType, setFormWheelType] = useState('4-Wheeler');
  const [formPassengers, setFormPassengers] = useState<number>(4);
  const [formLuggageBags, setFormLuggageBags] = useState<number>(2);
  const [formWeightTons, setFormWeightTons] = useState<number>(1.0);
  const [formDimensions, setFormDimensions] = useState('8.0 x 5.0 ft');
  const [formModels, setFormModels] = useState('');
  const [formBadge, setFormBadge] = useState('');
  const [formImageUrl, setFormImageUrl] = useState('/vehicles/sedan_cab.jpg');

  // Fetch Vehicle Types
  const { data, isLoading } = useQuery({
    queryKey: ['vehicle-types', search, serviceFilter, wheelFilter, statusFilter],
    queryFn: () =>
      api
        .get('/vehicle-types', {
          params: {
            search,
            serviceType: serviceFilter || undefined,
            wheelCount: wheelFilter || undefined,
            isActive: statusFilter !== '' ? statusFilter : undefined,
          },
        })
        .then((res: any) => res),
    refetchInterval: 10000,
  });

  const typesList: VehicleType[] = data?.data || [];

  // Mutations
  const createMutation = useMutation({
    mutationFn: (newType: any) => api.post('/vehicle-types', newType),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicle-types'] });
      setIsModalOpen(false);
      resetForm();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => api.put(`/vehicle-types/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicle-types'] });
      setIsModalOpen(false);
      setEditingType(null);
      resetForm();
    },
  });

  const toggleStatusMutation = useMutation({
    mutationFn: (id: string) => api.patch(`/vehicle-types/${id}/status`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicle-types'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/vehicle-types/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicle-types'] });
    },
  });

  const resetForm = () => {
    setFormServiceType('DROP_TAXI');
    setFormName('');
    setFormCode('');
    setFormWheelCount(4);
    setFormWheelType('4-Wheeler');
    setFormPassengers(4);
    setFormLuggageBags(2);
    setFormWeightTons(1.0);
    setFormDimensions('8.0 x 5.0 ft');
    setFormModels('');
    setFormBadge('');
    setFormImageUrl('/vehicles/sedan_cab.jpg');
  };

  const openCreateModal = () => {
    resetForm();
    setEditingType(null);
    setIsModalOpen(true);
  };

  const openEditModal = (vt: VehicleType) => {
    setEditingType(vt);
    setFormServiceType(vt.serviceType);
    setFormName(vt.name);
    setFormCode(vt.code);
    setFormWheelCount(vt.wheelCount);
    setFormWheelType(vt.wheelType);
    setFormPassengers(vt.capacity?.passengers || 4);
    setFormLuggageBags(vt.capacity?.luggageBags || 2);
    setFormWeightTons(vt.capacity?.weightTons || 1.0);
    setFormDimensions(vt.capacity?.dimensions || '8.0 x 5.0 ft');
    setFormModels(vt.modelsExample || '');
    setFormBadge(vt.badge || '');
    setFormImageUrl(vt.imageUrl || '/vehicles/sedan_cab.jpg');
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      name: formName,
      code: formCode || formName.replace(/[^a-zA-Z0-9]/g, '_').toUpperCase(),
      serviceType: formServiceType,
      wheelCount: Number(formWheelCount),
      wheelType: formWheelType || `${formWheelCount}-Wheeler`,
      capacity:
        formServiceType === 'DROP_TAXI'
          ? { passengers: Number(formPassengers), luggageBags: Number(formLuggageBags) }
          : { weightTons: Number(formWeightTons), dimensions: formDimensions },
      modelsExample: formModels,
      badge: formBadge,
      imageUrl: formImageUrl,
    };

    if (editingType) {
      updateMutation.mutate({ id: editingType._id, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  // KPIs
  const totalCount = typesList.length;
  const taxiCount = typesList.filter((t) => t.serviceType === 'DROP_TAXI').length;
  const truckCount = typesList.filter((t) => t.serviceType === 'GOODS_TRUCK').length;
  const wheelsSet = new Set(typesList.map((t) => t.wheelCount));

  const columns: Column<VehicleType>[] = [
    {
      key: 'name',
      header: 'Vehicle Type & Code',
      className: 'whitespace-nowrap min-w-[200px]',
      render: (t) => (
        <div className="flex items-center gap-2.5 whitespace-nowrap">
          <div className="w-8 h-8 rounded-lg bg-cloudy-100 dark:bg-slate-800 border border-cloudy-200 dark:border-slate-700 flex items-center justify-center shrink-0">
            {t.serviceType === 'DROP_TAXI' ? (
              <Car className="w-4 h-4 text-sky-600 dark:text-sky-400" />
            ) : (
              <Truck className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            )}
          </div>
          <div className="whitespace-nowrap">
            <span className="font-extrabold text-slate-950 dark:text-white text-xs block leading-tight">
              {t.name}
            </span>
            <span className="text-[10px] text-brand-700 dark:text-brand-400 font-bold font-mono block leading-tight mt-0.5">
              {t.code}
            </span>
          </div>
        </div>
      ),
    },
    {
      key: 'serviceType',
      header: 'Service',
      className: 'whitespace-nowrap min-w-[120px]',
      render: (t) => (
        <Badge variant={t.serviceType === 'DROP_TAXI' ? 'brand' : 'info'} size="sm">
          {t.serviceType === 'DROP_TAXI' ? '🚕 Drop Taxi' : '🚚 Goods Truck'}
        </Badge>
      ),
    },
    {
      key: 'wheelType',
      header: 'Wheels & Class',
      className: 'whitespace-nowrap min-w-[130px]',
      render: (t) => (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-black bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
          <span>🛞</span>
          <span>{t.wheelCount}W</span>
          <span className="font-medium text-[10px] text-indigo-600/80 dark:text-indigo-400/80">({t.wheelType})</span>
        </span>
      ),
    },
    {
      key: 'capacity',
      header: 'Capacity Spec',
      className: 'whitespace-nowrap min-w-[160px]',
      render: (t) => (
        <div className="whitespace-nowrap text-xs font-bold text-slate-900 dark:text-slate-100">
          {t.serviceType === 'DROP_TAXI' ? (
            <span>
              {t.capacity?.passengers || 4} Seats • {t.capacity?.luggageBags || 2} Bags
            </span>
          ) : (
            <span>
              {t.capacity?.weightTons || 1} Ton • {t.capacity?.dimensions || 'Standard'}
            </span>
          )}
        </div>
      ),
    },
    {
      key: 'modelsExample',
      header: 'Example Models',
      className: 'whitespace-nowrap min-w-[200px]',
      render: (t) => (
        <span className="text-xs text-slate-700 dark:text-slate-300 font-medium truncate block max-w-[220px]">
          {t.modelsExample || '—'}
        </span>
      ),
    },
    {
      key: 'badge',
      header: 'Marketing Badge',
      className: 'whitespace-nowrap min-w-[140px]',
      render: (t) =>
        t.badge ? (
          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
            {t.badge}
          </span>
        ) : (
          <span className="text-slate-400 text-xs">—</span>
        ),
    },
    {
      key: 'status',
      header: 'Status',
      className: 'whitespace-nowrap min-w-[90px]',
      render: (t) => (
        <Badge variant={t.isActive ? 'success' : 'neutral'} size="sm" dot>
          {t.isActive ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      className: 'whitespace-nowrap min-w-[170px]',
      render: (t) => (
        <div className="flex items-center justify-end gap-1.5 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            onClick={() => openEditModal(t)}
            className="px-2 py-1 rounded-lg bg-sky-50 hover:bg-sky-600 text-sky-700 hover:text-white dark:bg-sky-950/60 dark:hover:bg-sky-600 dark:text-sky-300 dark:hover:text-white border border-sky-200 dark:border-sky-800 transition-all font-bold text-[11px] flex items-center gap-1 shadow-sm active:scale-95 cursor-pointer"
            title="Edit Vehicle Type"
          >
            <Edit2 className="w-3 h-3 shrink-0" />
            <span>Edit</span>
          </button>
          <button
            type="button"
            onClick={() => toggleStatusMutation.mutate(t._id)}
            className={`px-2 py-1 rounded-lg border transition-all font-bold text-[11px] flex items-center gap-1 shadow-sm active:scale-95 cursor-pointer ${
              t.isActive
                ? 'bg-amber-50 hover:bg-amber-600 text-amber-700 hover:text-white dark:bg-amber-950/60 dark:hover:bg-amber-600 dark:text-amber-300 dark:hover:text-white border-amber-200 dark:border-amber-800'
                : 'bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white dark:bg-emerald-950/60 dark:hover:bg-emerald-600 dark:text-emerald-300 dark:hover:text-white border-emerald-200 dark:border-emerald-800'
            }`}
            title={t.isActive ? 'Deactivate Vehicle Type' : 'Activate Vehicle Type'}
          >
            {t.isActive ? 'Disable' : 'Enable'}
          </button>
          <button
            type="button"
            onClick={() => {
              if (confirm(`Delete vehicle type "${t.name}"?`)) {
                deleteMutation.mutate(t._id);
              }
            }}
            className="px-2 py-1 rounded-lg bg-rose-50 hover:bg-rose-600 text-rose-700 hover:text-white dark:bg-rose-950/60 dark:hover:bg-rose-600 dark:text-rose-300 dark:hover:text-white border border-rose-200 dark:border-rose-800 transition-all font-bold text-[11px] flex items-center gap-1 shadow-sm active:scale-95 cursor-pointer"
            title="Delete Vehicle Type"
          >
            <Trash2 className="w-3 h-3 shrink-0" />
            <span>Delete</span>
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
            Vehicle Type Management
          </h1>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            icon={<CircleDollarSign className="w-4 h-4 text-emerald-600" />}
            onClick={() => navigate('/admin/fares')}
            className="font-bold border-emerald-300 hover:bg-emerald-50 dark:border-emerald-800 dark:hover:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300"
          >
            Fare Management
            <ExternalLink className="w-3.5 h-3.5 ml-1 opacity-70" />
          </Button>

          <Button
            variant="primary"
            size="sm"
            icon={<Plus className="w-4 h-4" />}
            onClick={openCreateModal}
            className="font-bold shadow-md shadow-brand-500/20"
          >
            Add Vehicle Type
          </Button>
        </div>
      </div>

      {/* KPI Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="glass-panel p-3.5 rounded-2xl border border-cloudy-200 dark:border-slate-800 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-brand-50 dark:bg-brand-950/60 border border-brand-200 dark:border-brand-800 flex items-center justify-center text-brand-600 dark:text-brand-400 shrink-0">
            <Sliders className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
              Total Types
            </span>
            <span className="text-base font-black text-slate-950 dark:text-white font-mono leading-tight">
              {totalCount}
            </span>
          </div>
        </div>

        <div className="glass-panel p-3.5 rounded-2xl border border-cloudy-200 dark:border-slate-800 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800 flex items-center justify-center text-sky-600 dark:text-sky-400 shrink-0">
            <Car className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
              Drop Taxi Cabs
            </span>
            <span className="text-base font-black text-sky-700 dark:text-sky-400 font-mono leading-tight">
              {taxiCount}
            </span>
          </div>
        </div>

        <div className="glass-panel p-3.5 rounded-2xl border border-cloudy-200 dark:border-slate-800 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
            <Truck className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
              Goods Trucks
            </span>
            <span className="text-base font-black text-amber-700 dark:text-amber-400 font-mono leading-tight">
              {truckCount}
            </span>
          </div>
        </div>

        <div className="glass-panel p-3.5 rounded-2xl border border-cloudy-200 dark:border-slate-800 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
              Wheel Classes
            </span>
            <span className="text-base font-black text-indigo-700 dark:text-indigo-400 font-mono leading-tight">
              {wheelsSet.size} Tiers
            </span>
          </div>
        </div>
      </div>

      {/* Filters Strip */}
      <div className="glass-panel p-3.5 rounded-2xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 border border-cloudy-200 dark:border-slate-800 shadow-card">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
          <input
            type="text"
            placeholder="Search vehicle type, wheels, code..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white dark:bg-slate-900 border border-cloudy-300 dark:border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs font-bold text-slate-950 dark:text-white placeholder-slate-500 outline-none focus:border-brand-500 shadow-sm"
          />
        </div>

        <select
          value={serviceFilter}
          onChange={(e) => setServiceFilter(e.target.value)}
          className="bg-white dark:bg-slate-900 border border-cloudy-300 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 dark:text-slate-100 outline-none focus:border-brand-500 shadow-sm"
        >
          <option value="">All Services (Taxi & Truck)</option>
          <option value="DROP_TAXI">Drop Taxi Only</option>
          <option value="GOODS_TRUCK">Goods Truck Only</option>
        </select>

        <select
          value={wheelFilter}
          onChange={(e) => setWheelFilter(e.target.value)}
          className="bg-white dark:bg-slate-900 border border-cloudy-300 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 dark:text-slate-100 outline-none focus:border-brand-500 shadow-sm"
        >
          <option value="">All Wheels</option>
          <option value="3">3 Wheels (Auto)</option>
          <option value="4">4 Wheels (Cars & Mini Trucks)</option>
          <option value="6">6 Wheels (Heavy 407)</option>
          <option value="10">10 Wheels (Multi-Axle)</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-white dark:bg-slate-900 border border-cloudy-300 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 dark:text-slate-100 outline-none focus:border-brand-500 shadow-sm"
        >
          <option value="">All Statuses</option>
          <option value="true">Active Only</option>
          <option value="false">Inactive Only</option>
        </select>
      </div>

      {/* Vehicle Types Compact Table */}
      <DataTable
        columns={columns}
        data={typesList}
        isLoading={isLoading}
        compact={true}
        pagination={{
          page: 1,
          limit: 50,
          total: totalCount,
          totalPages: 1,
          onPageChange: () => {},
        }}
      />

      {/* Add / Edit Vehicle Type Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingType ? `Edit Vehicle Type: ${editingType.name}` : 'Add Dynamic Vehicle Type'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-5 text-xs">
          {/* Section 1: Service Type Selection Cards */}
          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
              1. Fleet Service Type
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  setFormServiceType('DROP_TAXI');
                  if (!editingType) {
                    setFormWheelCount(4);
                    setFormWheelType('4-Wheeler');
                    setFormImageUrl('/vehicles/sedan_cab.jpg');
                  }
                }}
                className={`p-3.5 rounded-xl border flex items-center gap-3 transition-all cursor-pointer text-left ${
                  formServiceType === 'DROP_TAXI'
                    ? 'bg-sky-50 dark:bg-sky-950/50 border-sky-500 ring-2 ring-sky-500/20 text-sky-950 dark:text-sky-100 shadow-sm'
                    : 'bg-white dark:bg-slate-900 border-cloudy-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    formServiceType === 'DROP_TAXI'
                      ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20'
                      : 'bg-cloudy-100 dark:bg-slate-800 text-slate-500'
                  }`}
                >
                  <Car className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-extrabold text-sm block">🚕 Drop Taxi</span>
                  <span className="text-[11px] opacity-80 block font-medium">Passenger Cabs & Autos</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setFormServiceType('GOODS_TRUCK');
                  if (!editingType) {
                    setFormWheelCount(4);
                    setFormWheelType('4-Wheeler');
                    setFormImageUrl('/vehicles/tata_ace_truck.jpg');
                  }
                }}
                className={`p-3.5 rounded-xl border flex items-center gap-3 transition-all cursor-pointer text-left ${
                  formServiceType === 'GOODS_TRUCK'
                    ? 'bg-amber-50 dark:bg-amber-950/50 border-amber-500 ring-2 ring-amber-500/20 text-amber-950 dark:text-amber-100 shadow-sm'
                    : 'bg-white dark:bg-slate-900 border-cloudy-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    formServiceType === 'GOODS_TRUCK'
                      ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20'
                      : 'bg-cloudy-100 dark:bg-slate-800 text-slate-500'
                  }`}
                >
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-extrabold text-sm block">🚚 Goods Truck</span>
                  <span className="text-[11px] opacity-80 block font-medium">Logistics & Freight mini-trucks</span>
                </div>
              </button>
            </div>
          </div>

          {/* Section 2: Fleet Classification & Name */}
          <div className="pt-3 border-t border-cloudy-200 dark:border-slate-800 space-y-3">
            <h4 className="font-extrabold text-xs uppercase tracking-wider text-brand-700 dark:text-brand-400">
              2. Vehicle Name & Identifier
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1 font-bold">
                  Vehicle Type Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Sedan, SUV, Tata Ace, 3-Wheeler Auto"
                  value={formName}
                  onChange={(e) => {
                    setFormName(e.target.value);
                    if (!editingType && !formCode) {
                      setFormCode(
                        e.target.value
                          .replace(/[^a-zA-Z0-9]/g, '_')
                          .toUpperCase()
                      );
                    }
                  }}
                  required
                  className="w-full bg-white dark:bg-slate-900 border border-cloudy-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-slate-950 dark:text-white outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 shadow-sm font-bold text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1 font-bold">
                  Vehicle Type Code <span className="text-slate-400 font-normal text-[10px]">(Unique Key)</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. TAXI_SEDAN, AUTO_3WHEEL"
                  value={formCode}
                  onChange={(e) => setFormCode(e.target.value.toUpperCase())}
                  required
                  className="w-full bg-white dark:bg-slate-900 border border-cloudy-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-slate-950 dark:text-white outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 font-mono font-bold shadow-sm text-xs"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Wheel Configuration & Badge */}
          <div className="pt-3 border-t border-cloudy-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-extrabold text-xs uppercase tracking-wider text-brand-700 dark:text-brand-400">
                3. Wheels Configuration & Badge
              </h4>
              <span className="text-[11px] text-slate-500">Quick Wheel Presets:</span>
            </div>

            {/* Quick Wheel Presets */}
            <div className="flex flex-wrap items-center gap-1.5">
              {[
                { count: 3, label: '3-Wheeler Auto' },
                { count: 4, label: '4-Wheeler' },
                { count: 6, label: '6-Wheeler Heavy' },
                { count: 10, label: '10-Wheeler Multi-Axle' },
              ].map((preset) => (
                <button
                  key={preset.count}
                  type="button"
                  onClick={() => {
                    setFormWheelCount(preset.count);
                    setFormWheelType(preset.label);
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all border ${
                    formWheelCount === preset.count
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                      : 'bg-cloudy-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-cloudy-200 dark:border-slate-700 hover:bg-cloudy-200'
                  }`}
                >
                  🛞 {preset.count}W ({preset.label})
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-1">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1 font-bold">
                  Number of Wheels
                </label>
                <input
                  type="number"
                  min={2}
                  max={24}
                  value={formWheelCount}
                  onChange={(e) => {
                    const count = Number(e.target.value);
                    setFormWheelCount(count);
                    setFormWheelType(count === 3 ? '3-Wheeler Auto' : `${count}-Wheeler`);
                  }}
                  required
                  className="w-full bg-white dark:bg-slate-900 border border-cloudy-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-slate-950 dark:text-white outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 shadow-sm font-bold text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1 font-bold">
                  Wheel Class Label
                </label>
                <input
                  type="text"
                  placeholder="e.g. 4-Wheeler, 3-Wheeler Auto"
                  value={formWheelType}
                  onChange={(e) => setFormWheelType(e.target.value)}
                  required
                  className="w-full bg-white dark:bg-slate-900 border border-cloudy-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-slate-950 dark:text-white outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 shadow-sm font-semibold text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1 font-bold">
                  Marketing Badge
                </label>
                <input
                  type="text"
                  placeholder="e.g. Family Favorite, Express Cargo"
                  value={formBadge}
                  onChange={(e) => setFormBadge(e.target.value)}
                  className="w-full bg-white dark:bg-slate-900 border border-cloudy-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-slate-950 dark:text-white outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 shadow-sm text-xs font-semibold"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Capacity & Models */}
          <div className="pt-3 border-t border-cloudy-200 dark:border-slate-800 space-y-3">
            <h4 className="font-extrabold text-xs uppercase tracking-wider text-brand-700 dark:text-brand-400">
              4. Capacity Specs & Example Models
            </h4>

            {formServiceType === 'DROP_TAXI' ? (
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 mb-1 font-bold">
                      Seating Capacity (Passengers)
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={50}
                      value={formPassengers}
                      onChange={(e) => setFormPassengers(Number(e.target.value))}
                      className="w-full bg-white dark:bg-slate-900 border border-cloudy-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-slate-950 dark:text-white outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 shadow-sm font-bold text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 mb-1 font-bold">
                      Luggage Bags Capacity
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={20}
                      value={formLuggageBags}
                      onChange={(e) => setFormLuggageBags(Number(e.target.value))}
                      className="w-full bg-white dark:bg-slate-900 border border-cloudy-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-slate-950 dark:text-white outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 shadow-sm font-bold text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1 font-bold">
                    Example Cab Models
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Maruti Swift Dzire, Toyota Etios, Hyundai Aura"
                    value={formModels}
                    onChange={(e) => setFormModels(e.target.value)}
                    className="w-full bg-white dark:bg-slate-900 border border-cloudy-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-slate-950 dark:text-white outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 shadow-sm text-xs"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 mb-1 font-bold">
                      Payload Capacity (Tons)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min={0.1}
                      value={formWeightTons}
                      onChange={(e) => setFormWeightTons(Number(e.target.value))}
                      className="w-full bg-white dark:bg-slate-900 border border-cloudy-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-slate-950 dark:text-white outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 shadow-sm font-bold text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 mb-1 font-bold">
                      Cargo Bed Dimensions (LxW ft)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 8.0 x 5.0 ft"
                      value={formDimensions}
                      onChange={(e) => setFormDimensions(e.target.value)}
                      className="w-full bg-white dark:bg-slate-900 border border-cloudy-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-slate-950 dark:text-white outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 shadow-sm font-bold text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1 font-bold">
                    Example Truck Models
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Tata Ace Gold, Mahindra Bolero Maxi Truck, Dost Strong"
                    value={formModels}
                    onChange={(e) => setFormModels(e.target.value)}
                    className="w-full bg-white dark:bg-slate-900 border border-cloudy-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-slate-950 dark:text-white outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 shadow-sm text-xs"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Pricing Management Note */}
          <div className="p-3.5 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <CircleDollarSign className="w-5 h-5 text-emerald-600 shrink-0" />
              <p className="text-xs text-emerald-900 dark:text-emerald-200 leading-snug">
                Base fare, per-KM rates, driver allowances, waiting charges, and tolls are configured in{' '}
                <strong>Fare Management</strong>.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setIsModalOpen(false);
                navigate('/admin/fares');
              }}
              className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] whitespace-nowrap shadow-sm transition-all cursor-pointer shrink-0"
            >
              Open Fares →
            </button>
          </div>

          {/* Modal Actions */}
          <div className="pt-2 flex justify-end gap-3 border-t border-cloudy-200 dark:border-slate-800">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsModalOpen(false)} className="font-bold">
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              isLoading={createMutation.isPending || updateMutation.isPending}
              className="font-bold px-5 shadow-md shadow-brand-500/20"
            >
              {editingType ? 'Update Vehicle Type' : 'Save Vehicle Type'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
