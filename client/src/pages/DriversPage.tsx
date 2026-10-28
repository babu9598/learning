import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Users,
  Search,
  Plus,
  Car,
  Truck,
  CheckCircle,
  XCircle,
  Shield,
  Phone,
  Mail,
  FileText,
  Star,
  ExternalLink,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  Camera,
  Trash2,
} from 'lucide-react';
import api from '../api/axiosClient';
import { DataTable, Column } from '../components/common/DataTable';
import { Badge, StatusBadge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { FileUploadCard } from '../components/common/FileUploadCard';
import { Driver } from '../types';
import { formatDate } from '../utils/formatters';

export const MANDATORY_KYC_DOCS = [
  { key: 'DRIVING_LICENSE', label: '1. Driving Licence', icon: '🪪' },
  { key: 'RC_BOOK', label: '2. RC Book (Registration)', icon: '📄' },
  { key: 'FITNESS_CERTIFICATE', label: '3. FC (Fitness Certificate)', icon: '📋' },
  { key: 'INSURANCE', label: '4. Vehicle Insurance Policy', icon: '🛡️' },
  { key: 'AADHAAR_CARD', label: '5. Aadhaar Card', icon: '🆔' },
  { key: 'PAN_CARD', label: '6. PAN Card', icon: '💳' },
  { key: 'LIVE_PHOTO', label: '7. Live Picture (Selfie)', icon: '📸' },
];

export const DriversPage: React.FC = () => {
  const queryClient = useQueryClient();

  // Filter States
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [kycStatus, setKycStatus] = useState('');
  const [onlineStatus, setOnlineStatus] = useState('');
  const [serviceType, setServiceType] = useState('');

  // Modals
  const [isAddDriverOpen, setIsAddDriverOpen] = useState(false);
  const [inspectingDriver, setInspectingDriver] = useState<Driver | null>(null);

  // Form State for Adding Driver (Upload files directly, no manual URLs)
  const [formName, setFormName] = useState('');
  const [formMobile, setFormMobile] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formServiceType, setFormServiceType] = useState<'DROP_TAXI' | 'GOODS_TRUCK'>('DROP_TAXI');
  const [formVehNumber, setFormVehNumber] = useState('');
  const [formVehModel, setFormVehModel] = useState('');
  const [formVehCategory, setFormVehCategory] = useState('TAXI_SEDAN');

  // 7 Document files and metadata
  const [licenseNumber, setLicenseNumber] = useState('');
  const [licenseExpiry, setLicenseExpiry] = useState('');
  const [licenseFileUrl, setLicenseFileUrl] = useState('');

  const [rcNumber, setRcNumber] = useState('');
  const [rcExpiry, setRcExpiry] = useState('');
  const [rcFileUrl, setRcFileUrl] = useState('');

  const [fcNumber, setFcNumber] = useState('');
  const [fcExpiry, setFcExpiry] = useState('');
  const [fcFileUrl, setFcFileUrl] = useState('');

  const [insNumber, setInsNumber] = useState('');
  const [insExpiry, setInsExpiry] = useState('');
  const [insFileUrl, setInsFileUrl] = useState('');

  const [aadhaarNumber, setAadhaarNumber] = useState('');
  const [aadhaarFileUrl, setAadhaarFileUrl] = useState('');

  const [panNumber, setPanNumber] = useState('');
  const [panFileUrl, setPanFileUrl] = useState('');

  const [livePhotoUrl, setLivePhotoUrl] = useState('');

  // Fetch Drivers
  const { data, isLoading } = useQuery({
    queryKey: ['drivers', page, search, status, kycStatus, onlineStatus, serviceType],
    queryFn: () =>
      api
        .get('/drivers', {
          params: {
            page,
            limit: 10,
            search: search || undefined,
            status: status || undefined,
            kycStatus: kycStatus || undefined,
            onlineStatus: onlineStatus || undefined,
            serviceType: serviceType || undefined,
          },
        })
        .then((res: any) => res),
    refetchInterval: 10000,
  });

  const driversList: Driver[] = data?.data || [];

  // Fetch Driver Full Documents when inspecting
  const { data: driverDetails, isLoading: loadingDetails } = useQuery({
    queryKey: ['driver-detail', inspectingDriver?._id],
    queryFn: () => api.get(`/drivers/${inspectingDriver?._id}`).then((res: any) => res.data),
    enabled: !!inspectingDriver?._id,
  });

  // Fetch dynamic vehicle types for category dropdown
  const { data: dynamicTypesData } = useQuery({
    queryKey: ['active-vehicle-types'],
    queryFn: () => api.get('/vehicle-types/public').then((res: any) => res.data),
  });
  const vehicleTypesList = dynamicTypesData || [];

  // Mutations
  const approveKycMutation = useMutation({
    mutationFn: (driverId: string) =>
      api.patch(`/drivers/${driverId}/kyc`, { kycStatus: 'APPROVED' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['drivers'] });
      queryClient.invalidateQueries({ queryKey: ['driver-detail', inspectingDriver?._id] });
    },
  });

  const rejectKycMutation = useMutation({
    mutationFn: ({ driverId, reason }: { driverId: string; reason: string }) =>
      api.patch(`/drivers/${driverId}/kyc`, { kycStatus: 'REJECTED', rejectionReason: reason }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['drivers'] });
      queryClient.invalidateQueries({ queryKey: ['driver-detail', inspectingDriver?._id] });
    },
  });

  const updateDocStatusMutation = useMutation({
    mutationFn: ({
      driverId,
      docId,
      status,
      reason,
    }: {
      driverId: string;
      docId: string;
      status: string;
      reason?: string;
    }) => api.patch(`/drivers/${driverId}/documents/${docId}`, { status, rejectionReason: reason }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['drivers'] });
      queryClient.invalidateQueries({ queryKey: ['driver-detail', inspectingDriver?._id] });
    },
  });

  const createDriverMutation = useMutation({
    mutationFn: (payload: any) => api.post('/drivers', payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['drivers'] });
      setIsAddDriverOpen(false);
      resetAddForm();
    },
  });

  const deleteDriverMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/drivers/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['drivers'] });
      if (inspectingDriver?._id) setInspectingDriver(null);
    },
  });

  const resetAddForm = () => {
    setFormName('');
    setFormMobile('');
    setFormEmail('');
    setFormServiceType('DROP_TAXI');
    setFormVehNumber('');
    setFormVehModel('');
    setFormVehCategory('TAXI_SEDAN');
    setLicenseNumber('');
    setLicenseExpiry('');
    setLicenseFileUrl('');
    setRcNumber('');
    setRcExpiry('');
    setRcFileUrl('');
    setFcNumber('');
    setFcExpiry('');
    setFcFileUrl('');
    setInsNumber('');
    setInsExpiry('');
    setInsFileUrl('');
    setAadhaarNumber('');
    setAadhaarFileUrl('');
    setPanNumber('');
    setPanFileUrl('');
    setLivePhotoUrl('');
  };

  const handleAddDriverSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      name: formName,
      mobile: formMobile,
      email: formEmail,
      serviceType: formServiceType,
      vehicleNumber: formVehNumber,
      vehicleModel: formVehModel,
      vehicleCategory: formVehCategory,

      // 7 Uploaded KYC Documents
      licenseNumber,
      licenseExpiry,
      licenseUrl: licenseFileUrl,

      rcNumber,
      rcExpiry,
      rcUrl: rcFileUrl,

      fcNumber,
      fcExpiry,
      fcUrl: fcFileUrl,

      insuranceNumber: insNumber,
      insuranceExpiry: insExpiry,
      insuranceUrl: insFileUrl,

      aadhaarNumber,
      aadhaarUrl: aadhaarFileUrl,

      panNumber,
      panUrl: panFileUrl,

      livePhotoUrl,
    };

    createDriverMutation.mutate(payload);
  };

  // KPIs
  const totalDrivers = data?.meta?.total || driversList.length;
  const taxiDrivers = driversList.filter((d) => d.serviceType === 'DROP_TAXI').length;
  const truckDrivers = driversList.filter((d) => d.serviceType === 'GOODS_TRUCK').length;
  const kycPendingCount = driversList.filter((d) => d.kycStatus === 'PENDING' || d.kycStatus === 'UNDER_REVIEW').length;

  const columns: Column<Driver>[] = [
    {
      key: 'driver',
      header: 'Driver & ID',
      className: 'whitespace-nowrap min-w-[200px]',
      render: (d) => (
        <div className="flex items-center gap-2.5 whitespace-nowrap">
          <img
            src={
              d.avatar ||
              `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100`
            }
            alt={d.name}
            className="w-8 h-8 rounded-lg object-cover ring-1 ring-slate-300 dark:ring-slate-700 shrink-0 bg-slate-100"
          />
          <div className="whitespace-nowrap">
            <span className="font-extrabold text-slate-950 dark:text-white text-xs block leading-tight">
              {d.name}
            </span>
            <span className="text-[10px] text-brand-700 dark:text-brand-400 font-bold font-mono block leading-tight mt-0.5">
              {d.driverId}
            </span>
          </div>
        </div>
      ),
    },
    {
      key: 'contact',
      header: 'Contact Info',
      className: 'whitespace-nowrap min-w-[170px]',
      render: (d) => (
        <div className="whitespace-nowrap text-xs">
          <div className="flex items-center gap-1 font-bold text-slate-900 dark:text-slate-100">
            <Phone className="w-3 h-3 text-slate-400" />
            <span>{d.mobile}</span>
          </div>
          {d.email && (
            <div className="flex items-center gap-1 text-[11px] text-slate-500 font-medium mt-0.5">
              <Mail className="w-3 h-3 text-slate-400" />
              <span>{d.email}</span>
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'serviceType',
      header: 'Service',
      className: 'whitespace-nowrap min-w-[120px]',
      render: (d) => (
        <Badge variant={d.serviceType === 'DROP_TAXI' ? 'brand' : 'info'} size="sm">
          {d.serviceType === 'DROP_TAXI' ? '🚕 Drop Taxi' : '🚚 Goods Truck'}
        </Badge>
      ),
    },
    {
      key: 'vehicle',
      header: 'Assigned Vehicle',
      className: 'whitespace-nowrap min-w-[170px]',
      render: (d) =>
        d.assignedVehicle ? (
          <div className="whitespace-nowrap text-xs">
            <span className="font-bold text-slate-950 dark:text-white font-mono block leading-tight">
              {(d.assignedVehicle as any).vehicleNumber}
            </span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium block">
              {(d.assignedVehicle as any).brand} {(d.assignedVehicle as any).model}
            </span>
          </div>
        ) : (
          <span className="text-xs text-slate-400 italic">No Vehicle</span>
        ),
    },
    {
      key: 'kycStatus',
      header: 'KYC Status & Bookings',
      className: 'whitespace-nowrap min-w-[180px]',
      render: (d) => (
        <div className="whitespace-nowrap space-y-1">
          <StatusBadge status={d.kycStatus} />
          <div>
            {d.kycStatus === 'APPROVED' ? (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 dark:text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Receives Bookings
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-600 dark:text-amber-400">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                Bookings Locked (KYC Pending)
              </span>
            )}
          </div>
        </div>
      ),
    },
    {
      key: 'onlineStatus',
      header: 'Online State',
      className: 'whitespace-nowrap min-w-[100px]',
      render: (d) => <StatusBadge status={d.onlineStatus} />,
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      className: 'whitespace-nowrap min-w-[160px]',
      render: (d) => (
        <div className="flex items-center justify-end gap-1.5 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            onClick={() => setInspectingDriver(d)}
            className="px-2.5 py-1 rounded-lg bg-sky-50 hover:bg-sky-600 text-sky-700 hover:text-white dark:bg-sky-950/60 dark:hover:bg-sky-600 dark:text-sky-300 dark:hover:text-white border border-sky-200 dark:border-sky-800 transition-all font-bold text-[11px] flex items-center gap-1 shadow-sm active:scale-95 cursor-pointer"
            title="Inspect Uploaded KYC Documents"
          >
            <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
            <span>KYC Docs</span>
          </button>

          {d.kycStatus !== 'APPROVED' && (
            <button
              type="button"
              onClick={() => approveKycMutation.mutate(d._id)}
              className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] transition-all shadow-sm active:scale-95 cursor-pointer"
              title="Quick Approve KYC"
            >
              Approve
            </button>
          )}

          <button
            type="button"
            onClick={() => {
              if (confirm(`Delete driver "${d.name}"?`)) {
                deleteDriverMutation.mutate(d._id);
              }
            }}
            className="p-1 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
            title="Delete Driver"
          >
            <Trash2 className="w-3.5 h-3.5" />
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
            Driver Management
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="primary"
            size="sm"
            icon={<Plus className="w-4 h-4" />}
            onClick={() => setIsAddDriverOpen(true)}
            className="font-bold shadow-md shadow-brand-500/20"
          >
            Add New Driver
          </Button>
        </div>
      </div>

      {/* KPI Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="glass-panel p-3.5 rounded-2xl border border-cloudy-200 dark:border-slate-800 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-brand-50 dark:bg-brand-950/60 border border-brand-200 dark:border-brand-800 flex items-center justify-center text-brand-600 dark:text-brand-400 shrink-0">
            <Users className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
              Total Drivers
            </span>
            <span className="text-base font-black text-slate-950 dark:text-white font-mono leading-tight">
              {totalDrivers}
            </span>
          </div>
        </div>

        <div className="glass-panel p-3.5 rounded-2xl border border-cloudy-200 dark:border-slate-800 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800 flex items-center justify-center text-sky-600 dark:text-sky-400 shrink-0">
            <Car className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
              Drop Taxi Drivers
            </span>
            <span className="text-base font-black text-sky-700 dark:text-sky-400 font-mono leading-tight">
              {taxiDrivers}
            </span>
          </div>
        </div>

        <div className="glass-panel p-3.5 rounded-2xl border border-cloudy-200 dark:border-slate-800 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
            <Truck className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
              Goods Truck Drivers
            </span>
            <span className="text-base font-black text-amber-700 dark:text-amber-400 font-mono leading-tight">
              {truckDrivers}
            </span>
          </div>
        </div>

        <div className="glass-panel p-3.5 rounded-2xl border border-cloudy-200 dark:border-slate-800 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 flex items-center justify-center text-rose-600 dark:text-rose-400 shrink-0">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
              Pending KYC
            </span>
            <span className="text-base font-black text-rose-700 dark:text-rose-400 font-mono leading-tight">
              {kycPendingCount} Needs Review
            </span>
          </div>
        </div>
      </div>

      {/* Filters Strip */}
      <div className="glass-panel p-3.5 rounded-2xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 border border-cloudy-200 dark:border-slate-800 shadow-card">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
          <input
            type="text"
            placeholder="Search driver name, ID, phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white dark:bg-slate-900 border border-cloudy-300 dark:border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs font-bold text-slate-950 dark:text-white placeholder-slate-500 outline-none focus:border-brand-500 shadow-sm"
          />
        </div>

        <select
          value={serviceType}
          onChange={(e) => setServiceType(e.target.value)}
          className="bg-white dark:bg-slate-900 border border-cloudy-300 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 dark:text-slate-100 outline-none focus:border-brand-500 shadow-sm"
        >
          <option value="">All Services (Taxi & Truck)</option>
          <option value="DROP_TAXI">DropTaxi Only</option>
          <option value="GOODS_TRUCK">Goods Truck Only</option>
        </select>

        <select
          value={kycStatus}
          onChange={(e) => setKycStatus(e.target.value)}
          className="bg-white dark:bg-slate-900 border border-cloudy-300 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 dark:text-slate-100 outline-none focus:border-brand-500 shadow-sm"
        >
          <option value="">All KYC Statuses</option>
          <option value="PENDING">KYC Pending</option>
          <option value="UNDER_REVIEW">Under Review</option>
          <option value="APPROVED">KYC Approved</option>
          <option value="REJECTED">KYC Rejected</option>
        </select>

        <select
          value={onlineStatus}
          onChange={(e) => setOnlineStatus(e.target.value)}
          className="bg-white dark:bg-slate-900 border border-cloudy-300 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 dark:text-slate-100 outline-none focus:border-brand-500 shadow-sm"
        >
          <option value="">All Online States</option>
          <option value="ONLINE">Online (Available)</option>
          <option value="ON_TRIP">On Live Trip</option>
          <option value="OFFLINE">Offline</option>
        </select>

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="bg-white dark:bg-slate-900 border border-cloudy-300 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 dark:text-slate-100 outline-none focus:border-brand-500 shadow-sm"
        >
          <option value="">All Account Statuses</option>
          <option value="ACTIVE">Active</option>
          <option value="PENDING_APPROVAL">Pending Approval</option>
          <option value="SUSPENDED">Suspended</option>
          <option value="BLOCKED">Blocked</option>
        </select>
      </div>

      {/* Driver Data Table */}
      <DataTable
        columns={columns}
        data={driversList}
        isLoading={isLoading}
        compact={true}
        pagination={{
          page,
          limit: 10,
          total: data?.meta?.total || driversList.length,
          totalPages: data?.meta?.totalPages || 1,
          onPageChange: setPage,
        }}
        onRowClick={(d) => setInspectingDriver(d)}
      />

      {/* Add New Driver Modal (With Image Uploads - No URLs) */}
      <Modal
        isOpen={isAddDriverOpen}
        onClose={() => setIsAddDriverOpen(false)}
        title="Add New Driver & Upload KYC Documents"
        size="lg"
      >
        <form onSubmit={handleAddDriverSubmit} className="space-y-4 text-xs">
          {/* Section 1: Basic Information */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-cloudy-200 dark:border-slate-800 space-y-3">
            <h4 className="font-extrabold text-xs uppercase tracking-wider text-brand-700 dark:text-brand-400">
              1. Driver Profile & Vehicle Pairing
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1 font-bold">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Ramesh Kumar"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  required
                  className="w-full bg-white dark:bg-slate-900 border border-cloudy-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white outline-none focus:border-brand-500 shadow-sm font-bold text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1 font-bold">
                  Mobile Number <span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  placeholder="+91 98401 23456"
                  value={formMobile}
                  onChange={(e) => setFormMobile(e.target.value)}
                  required
                  className="w-full bg-white dark:bg-slate-900 border border-cloudy-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white outline-none focus:border-brand-500 shadow-sm font-bold text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1 font-bold">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="ramesh@example.com"
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  className="w-full bg-white dark:bg-slate-900 border border-cloudy-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white outline-none focus:border-brand-500 shadow-sm text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1 font-bold">
                  Service Type <span className="text-rose-500">*</span>
                </label>
                <select
                  value={formServiceType}
                  onChange={(e: any) => setFormServiceType(e.target.value)}
                  className="w-full bg-white dark:bg-slate-900 border border-cloudy-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white outline-none focus:border-brand-500 shadow-sm font-bold text-xs"
                >
                  <option value="DROP_TAXI">🚕 Drop Taxi (Passenger)</option>
                  <option value="GOODS_TRUCK">🚚 Goods Truck (Logistics)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1 font-bold">
                  Vehicle Category Tier <span className="text-rose-500">*</span>
                </label>
                <select
                  value={formVehCategory}
                  onChange={(e) => setFormVehCategory(e.target.value)}
                  className="w-full bg-white dark:bg-slate-900 border border-cloudy-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white outline-none focus:border-brand-500 shadow-sm font-bold text-xs"
                >
                  {vehicleTypesList
                    .filter((t: any) => t.serviceType === formServiceType)
                    .map((t: any) => (
                      <option key={t.code} value={t.code}>
                        {t.name} ({t.wheelType || `${t.wheelCount}W`})
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1 font-bold">
                  Vehicle Registration Number <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. TN 01 AB 1234"
                  value={formVehNumber}
                  onChange={(e) => setFormVehNumber(e.target.value.toUpperCase())}
                  required
                  className="w-full bg-white dark:bg-slate-900 border border-cloudy-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white outline-none focus:border-brand-500 shadow-sm font-mono font-bold text-xs uppercase"
                />
              </div>
            </div>
          </div>

          {/* Section 2: 7 Mandatory KYC Document Uploads */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-extrabold text-xs uppercase tracking-wider text-brand-700 dark:text-brand-400">
                2. Mandatory KYC Document Uploads (Images stored securely)
              </h4>
              <span className="text-[10px] text-slate-500 font-semibold">Images & PDFs supported</span>
            </div>

            {/* 1. Driving Licence */}
            <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-cloudy-200 dark:border-slate-800 space-y-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 text-[11px] font-bold">
                    DL Number <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. TN-09-20150001234"
                    value={licenseNumber}
                    onChange={(e) => setLicenseNumber(e.target.value.toUpperCase())}
                    required
                    className="w-full bg-white dark:bg-slate-900 border border-cloudy-300 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs font-mono font-bold uppercase"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 text-[11px] font-bold">
                    DL Expiry Date <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={licenseExpiry}
                    onChange={(e) => setLicenseExpiry(e.target.value)}
                    required
                    className="w-full bg-white dark:bg-slate-900 border border-cloudy-300 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs font-bold"
                  />
                </div>
              </div>
              <FileUploadCard
                label="1. Upload Driving Licence Document"
                icon="🪪"
                value={licenseFileUrl}
                onChange={setLicenseFileUrl}
                required
              />
            </div>

            {/* 2. RC Book */}
            <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-cloudy-200 dark:border-slate-800 space-y-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 text-[11px] font-bold">
                    RC Registration Number
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. TN 01 AB 1234"
                    value={rcNumber}
                    onChange={(e) => setRcNumber(e.target.value.toUpperCase())}
                    className="w-full bg-white dark:bg-slate-900 border border-cloudy-300 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs font-mono font-bold uppercase"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 text-[11px] font-bold">
                    RC Expiry Date
                  </label>
                  <input
                    type="date"
                    value={rcExpiry}
                    onChange={(e) => setRcExpiry(e.target.value)}
                    className="w-full bg-white dark:bg-slate-900 border border-cloudy-300 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs font-bold"
                  />
                </div>
              </div>
              <FileUploadCard
                label="2. Upload Vehicle RC Book"
                icon="📄"
                value={rcFileUrl}
                onChange={setRcFileUrl}
                required
              />
            </div>

            {/* 3. FC (Fitness Cert) & 4. Insurance in 2 Columns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* FC */}
              <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-cloudy-200 dark:border-slate-800 space-y-2">
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 text-[11px] font-bold">
                    FC Certificate Number
                  </label>
                  <input
                    type="text"
                    placeholder="FC Number"
                    value={fcNumber}
                    onChange={(e) => setFcNumber(e.target.value.toUpperCase())}
                    className="w-full bg-white dark:bg-slate-900 border border-cloudy-300 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs font-mono font-bold uppercase"
                  />
                </div>
                <FileUploadCard
                  label="3. Fitness Cert (FC)"
                  icon="📋"
                  value={fcFileUrl}
                  onChange={setFcFileUrl}
                  required
                />
              </div>

              {/* Insurance */}
              <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-cloudy-200 dark:border-slate-800 space-y-2">
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 text-[11px] font-bold">
                    Insurance Policy Number
                  </label>
                  <input
                    type="text"
                    placeholder="Policy Number"
                    value={insNumber}
                    onChange={(e) => setInsNumber(e.target.value.toUpperCase())}
                    className="w-full bg-white dark:bg-slate-900 border border-cloudy-300 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs font-mono font-bold uppercase"
                  />
                </div>
                <FileUploadCard
                  label="4. Vehicle Insurance"
                  icon="🛡️"
                  value={insFileUrl}
                  onChange={setInsFileUrl}
                  required
                />
              </div>
            </div>

            {/* 5. Aadhaar Card & 6. PAN Card */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Aadhaar */}
              <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-cloudy-200 dark:border-slate-800 space-y-2">
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 text-[11px] font-bold">
                    Aadhaar Number (12 Digits)
                  </label>
                  <input
                    type="text"
                    placeholder="1234 5678 9012"
                    value={aadhaarNumber}
                    onChange={(e) => setAadhaarNumber(e.target.value)}
                    className="w-full bg-white dark:bg-slate-900 border border-cloudy-300 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs font-mono font-bold"
                  />
                </div>
                <FileUploadCard
                  label="5. Aadhaar Card"
                  icon="🆔"
                  value={aadhaarFileUrl}
                  onChange={setAadhaarFileUrl}
                  required
                />
              </div>

              {/* PAN */}
              <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-cloudy-200 dark:border-slate-800 space-y-2">
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 text-[11px] font-bold">
                    PAN Number (10 Alphanumeric)
                  </label>
                  <input
                    type="text"
                    placeholder="ABCDE1234F"
                    value={panNumber}
                    onChange={(e) => setPanNumber(e.target.value.toUpperCase())}
                    className="w-full bg-white dark:bg-slate-900 border border-cloudy-300 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs font-mono font-bold uppercase"
                  />
                </div>
                <FileUploadCard
                  label="6. PAN Card"
                  icon="💳"
                  value={panFileUrl}
                  onChange={setPanFileUrl}
                  required
                />
              </div>
            </div>

            {/* 7. Live Selfie Photo */}
            <div className="p-3 rounded-xl bg-sky-50/60 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800">
              <FileUploadCard
                label="7. Driver Live Picture / Face Selfie"
                icon={<Camera className="w-4 h-4 text-sky-600" />}
                subtitle="Real-time face photo for identity verification"
                value={livePhotoUrl}
                onChange={setLivePhotoUrl}
                isCamera={true}
                required
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-3 border-t border-cloudy-200 dark:border-slate-800">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsAddDriverOpen(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              isLoading={createDriverMutation.isPending}
              className="font-bold px-5 shadow-md shadow-brand-500/20"
            >
              Register & Upload Documents
            </Button>
          </div>
        </form>
      </Modal>

      {/* KYC Documents Inspection & Verification Modal */}
      <Modal
        isOpen={!!inspectingDriver}
        onClose={() => setInspectingDriver(null)}
        title={inspectingDriver ? `KYC Verification: ${inspectingDriver.name} (${inspectingDriver.driverId})` : 'KYC Verification'}
        size="lg"
      >
        {inspectingDriver && (
          <div className="space-y-4 text-xs">
            {/* Status overview banner */}
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-cloudy-200 dark:border-slate-800 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <img
                  src={inspectingDriver.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'}
                  alt={inspectingDriver.name}
                  className="w-10 h-10 rounded-xl object-cover ring-2 ring-brand-500"
                />
                <div>
                  <h4 className="font-extrabold text-slate-950 dark:text-white text-sm">{inspectingDriver.name}</h4>
                  <p className="text-[11px] text-slate-500 font-mono">
                    {inspectingDriver.mobile} • Service: {inspectingDriver.serviceType.replace(/_/g, ' ')}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <StatusBadge status={inspectingDriver.kycStatus} />
                {inspectingDriver.kycStatus !== 'APPROVED' ? (
                  <Button
                    variant="success"
                    size="sm"
                    icon={<CheckCircle className="w-3.5 h-3.5" />}
                    onClick={() => approveKycMutation.mutate(inspectingDriver._id)}
                    isLoading={approveKycMutation.isPending}
                    className="font-bold"
                  >
                    Approve KYC & Allow Bookings
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    icon={<XCircle className="w-3.5 h-3.5 text-rose-500" />}
                    onClick={() => {
                      const reason = prompt('Enter reason for revoking KYC approval:');
                      if (reason) rejectKycMutation.mutate({ driverId: inspectingDriver._id, reason });
                    }}
                    className="font-bold text-rose-600 border-rose-300"
                  >
                    Revoke KYC
                  </Button>
                )}
              </div>
            </div>

            {/* List of 7 Uploaded KYC Documents */}
            <div className="space-y-2">
              <h5 className="font-extrabold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Uploaded Statutory KYC Documents (7 Required)
              </h5>

              {loadingDetails ? (
                <div className="p-8 text-center text-slate-500 font-bold">Loading driver documents...</div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {(driverDetails?.documents || []).map((doc: any) => {
                    const docDef = MANDATORY_KYC_DOCS.find((d) => d.key === doc.documentType) || {
                      label: doc.documentType,
                      icon: '📄',
                    };
                    const isApproved = doc.status === 'APPROVED';

                    return (
                      <div
                        key={doc._id}
                        className="p-3 rounded-xl border border-cloudy-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-start justify-between gap-3 shadow-xs"
                      >
                        <div className="flex items-start gap-2.5 overflow-hidden">
                          {doc.documentUrl && doc.documentUrl.endsWith('.pdf') ? (
                            <div className="w-12 h-12 rounded-lg bg-rose-50 dark:bg-rose-950 flex items-center justify-center shrink-0 border border-rose-200">
                              <FileText className="w-6 h-6 text-rose-600" />
                            </div>
                          ) : doc.documentUrl ? (
                            <img
                              src={doc.documentUrl}
                              alt={docDef.label}
                              className="w-12 h-12 rounded-lg object-cover border border-cloudy-200 dark:border-slate-700 shrink-0 bg-slate-50"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xl shrink-0">
                              {docDef.icon}
                            </div>
                          )}

                          <div className="overflow-hidden space-y-0.5">
                            <span className="font-extrabold text-slate-950 dark:text-white text-xs block truncate">
                              {docDef.label}
                            </span>
                            <span className="text-[10px] font-mono font-bold text-slate-600 dark:text-slate-400 block truncate">
                              {doc.documentNumber || 'No Number'}
                            </span>
                            {doc.expiryDate && (
                              <span className="text-[10px] text-slate-500 block">
                                Exp: {formatDate(doc.expiryDate)}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-col items-end gap-1.5 shrink-0">
                          <StatusBadge status={doc.status} />

                          <div className="flex items-center gap-1">
                            {doc.documentUrl && (
                              <a
                                href={doc.documentUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="p-1 rounded bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300"
                                title="Open full image in new tab"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                            )}

                            {!isApproved && (
                              <button
                                type="button"
                                onClick={() =>
                                  updateDocStatusMutation.mutate({
                                    driverId: inspectingDriver._id,
                                    docId: doc._id,
                                    status: 'APPROVED',
                                  })
                                }
                                className="px-2 py-0.5 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px]"
                                title="Verify Document"
                              >
                                Verify
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="pt-3 flex justify-end gap-2 border-t border-cloudy-200 dark:border-slate-800">
              <Button variant="outline" size="sm" onClick={() => setInspectingDriver(null)}>
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
