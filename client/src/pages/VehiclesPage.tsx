import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Truck, Search, AlertTriangle, CheckCircle, ShieldAlert, Trash2, FileText, ExternalLink, Calendar, XCircle } from 'lucide-react';
import api from '../api/axiosClient';
import { DataTable, Column } from '../components/common/DataTable';
import { Badge, StatusBadge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { Vehicle } from '../types';
import { formatCurrency, formatDate } from '../utils/formatters';

export const VehiclesPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [serviceType, setServiceType] = useState('');
  const [docExpiredOnly, setDocExpiredOnly] = useState(false);

  // Fetch Vehicles
  const { data, isLoading } = useQuery({
    queryKey: ['vehicles', page, search, category, serviceType, docExpiredOnly],
    queryFn: () =>
      api
        .get('/vehicles', {
          params: {
            page,
            limit: 10,
            search,
            category,
            serviceType,
            documentExpiredOnly: docExpiredOnly || undefined,
          },
        })
        .then((res: any) => res),
    refetchInterval: 10000,
  });

  const { data: vehicleTypesRes } = useQuery({
    queryKey: ['active-vehicle-types'],
    queryFn: () => api.get('/vehicle-types/public').then((res: any) => res.data),
  });
  const dynamicTypes: any[] = vehicleTypesRes || [];

  const deleteVehicleMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/vehicles/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
    },
  });

  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);

  // Expiry check helper (real-time timestamp comparison + status check)
  const isDocExpired = (doc?: { status?: string; expiryDate?: string | Date }) => {
    if (!doc) return false;
    if (doc.status === 'EXPIRED') return true;
    if (doc.expiryDate) {
      return new Date(doc.expiryDate).getTime() < Date.now();
    }
    return false;
  };

  const getDocDaysRemaining = (expiryDate?: string | Date) => {
    if (!expiryDate) return null;
    const diff = new Date(expiryDate).getTime() - Date.now();
    return Math.round(diff / (1000 * 60 * 60 * 24));
  };

  const columns: Column<Vehicle>[] = [
    {
      key: 'vehicleNumber',
      header: 'Plate & Model',
      className: 'whitespace-nowrap min-w-[170px]',
      render: (v) => (
        <div className="flex items-center gap-2 whitespace-nowrap">
          <div className="w-7 h-7 rounded-lg bg-cloudy-100 dark:bg-slate-800 border border-cloudy-200 dark:border-slate-700 flex items-center justify-center shrink-0">
            <Truck className="w-3.5 h-3.5 text-slate-700 dark:text-slate-300" />
          </div>
          <div className="whitespace-nowrap">
            <span className="font-extrabold text-slate-950 dark:text-white font-mono text-xs block leading-tight">
              {v.vehicleNumber}
            </span>
            <span className="text-[10px] text-slate-600 dark:text-slate-400 font-bold block leading-tight">
              {v.brand} {v.model} ({v.year})
            </span>
          </div>
        </div>
      ),
    },
    {
      key: 'serviceType',
      header: 'Category & Fuel',
      className: 'whitespace-nowrap min-w-[180px]',
      render: (v) => (
        <div className="flex items-center gap-1.5 whitespace-nowrap">
          <Badge variant={v.serviceType === 'DROP_TAXI' ? 'brand' : 'info'} size="sm">
            {v.category.replace(/_/g, ' ')}
          </Badge>
          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-cloudy-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-cloudy-200 dark:border-slate-700">
            {v.fuelType}
          </span>
        </div>
      ),
    },
    {
      key: 'assignedDriver',
      header: 'Assigned Driver',
      className: 'whitespace-nowrap min-w-[150px]',
      render: (v) =>
        v.assignedDriver ? (
          <div className="flex items-center gap-1.5 whitespace-nowrap">
            <span className="font-extrabold text-xs text-slate-950 dark:text-white leading-tight">
              {v.assignedDriver.name}
            </span>
            <span className="text-[10px] text-brand-700 dark:text-brand-400 font-bold font-mono">
              ({(v.assignedDriver as any).driverId})
            </span>
          </div>
        ) : (
          <span className="text-[11px] text-amber-700 dark:text-amber-400 italic font-bold whitespace-nowrap">
            Unassigned
          </span>
        ),
    },
    {
      key: 'documents',
      header: 'Statutory Docs',
      className: 'whitespace-nowrap min-w-[240px]',
      render: (v) => {
        const rcExp = isDocExpired(v.documents?.rc);
        const insExp = isDocExpired(v.documents?.insurance);
        const fitExp = isDocExpired(v.documents?.fitness);
        const prmExp = isDocExpired(v.documents?.permit);
        const anyExp = rcExp || insExp || fitExp || prmExp || v.isDocumentExpired;

        return (
          <div className="flex items-center gap-1 whitespace-nowrap">
            <span
              title={`RC: ${rcExp ? 'EXPIRED' : 'VALID'} (${v.documents?.rc?.expiryDate ? formatDate(v.documents.rc.expiryDate) : 'N/A'})`}
              className={`px-1.5 py-0.5 rounded text-[10px] border font-bold ${
                rcExp
                  ? 'bg-rose-50 text-rose-800 dark:bg-rose-950/70 dark:text-rose-300 border-rose-300 dark:border-rose-700 font-extrabold'
                  : 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
              }`}
            >
              RC {rcExp ? '⚠' : '✓'}
            </span>
            <span
              title={`Insurance: ${insExp ? 'EXPIRED' : 'VALID'} (${v.documents?.insurance?.expiryDate ? formatDate(v.documents.insurance.expiryDate) : 'N/A'})`}
              className={`px-1.5 py-0.5 rounded text-[10px] border font-bold ${
                insExp
                  ? 'bg-rose-50 text-rose-800 dark:bg-rose-950/70 dark:text-rose-300 border-rose-300 dark:border-rose-700 font-extrabold'
                  : 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
              }`}
            >
              INS {insExp ? '⚠' : '✓'}
            </span>
            <span
              title={`Fitness: ${fitExp ? 'EXPIRED' : 'VALID'} (${v.documents?.fitness?.expiryDate ? formatDate(v.documents.fitness.expiryDate) : 'N/A'})`}
              className={`px-1.5 py-0.5 rounded text-[10px] border font-bold ${
                fitExp
                  ? 'bg-rose-50 text-rose-800 dark:bg-rose-950/70 dark:text-rose-300 border-rose-300 dark:border-rose-700 font-extrabold'
                  : 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
              }`}
            >
              FC {fitExp ? '⚠' : '✓'}
            </span>
            <span
              title={`Permit: ${prmExp ? 'EXPIRED' : 'VALID'} (${v.documents?.permit?.expiryDate ? formatDate(v.documents.permit.expiryDate) : 'N/A'})`}
              className={`px-1.5 py-0.5 rounded text-[10px] border font-bold ${
                prmExp
                  ? 'bg-rose-50 text-rose-800 dark:bg-rose-950/70 dark:text-rose-300 border-rose-300 dark:border-rose-700 font-extrabold'
                  : 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
              }`}
            >
              PRM {prmExp ? '⚠' : '✓'}
            </span>
            {anyExp && (
              <span className="text-[10px] text-rose-600 dark:text-rose-400 font-extrabold ml-1">
                Expired
              </span>
            )}
          </div>
        );
      },
    },
    {
      key: 'status',
      header: 'Status',
      className: 'whitespace-nowrap min-w-[110px]',
      render: (v) => <StatusBadge status={v.status} />,
    },
    {
      key: 'revenue',
      header: 'Trips & Revenue',
      className: 'whitespace-nowrap min-w-[140px]',
      render: (v) => (
        <div className="flex items-center gap-1.5 whitespace-nowrap">
          <span className="font-extrabold text-xs text-slate-950 dark:text-white">
            {formatCurrency(v.totalRevenue)}
          </span>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold">
            ({v.totalTrips} trips)
          </span>
        </div>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      className: 'whitespace-nowrap min-w-[140px]',
      render: (v) => (
        <div className="flex items-center justify-end gap-1.5 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            onClick={() => setSelectedVehicle(v)}
            className="px-2 py-1 rounded-lg bg-sky-50 hover:bg-sky-600 text-sky-700 hover:text-white dark:bg-sky-950/60 dark:hover:bg-sky-600 dark:text-sky-300 dark:hover:text-white border border-sky-200 dark:border-sky-800 transition-all font-bold text-[11px] flex items-center gap-1 shadow-sm active:scale-95 cursor-pointer"
            title="Inspect Vehicle Documents"
          >
            <ShieldAlert className="w-3 h-3 shrink-0" />
            <span>Docs</span>
          </button>
          <button
            type="button"
            onClick={() => {
              if (confirm(`Delete vehicle ${v.vehicleNumber}?`)) {
                deleteVehicleMutation.mutate(v._id);
              }
            }}
            className="px-2 py-1 rounded-lg bg-rose-50 hover:bg-rose-600 text-rose-700 hover:text-white dark:bg-rose-950/60 dark:hover:bg-rose-600 dark:text-rose-300 dark:hover:text-white border border-rose-200 dark:border-rose-800 transition-all font-bold text-[11px] flex items-center gap-1 shadow-sm active:scale-95 cursor-pointer"
            title="Delete Vehicle"
          >
            <Trash2 className="w-3 h-3 shrink-0" />
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
            Vehicle Management
          </h1>
        </div>
      </div>

      {/* Filters Strip */}
      <div className="glass-panel p-4 rounded-2xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 border border-cloudy-200 dark:border-slate-800 shadow-card">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
          <input
            type="text"
            placeholder="Search license plate, model..."
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
          <option value="DROP_TAXI">DropTaxi Vehicles</option>
          <option value="GOODS_TRUCK">Goods Truck Vehicles</option>
        </select>

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="bg-white dark:bg-slate-900 border border-cloudy-300 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 dark:text-slate-100 outline-none focus:border-brand-500 shadow-sm"
        >
          <option value="">All Categories</option>
          {dynamicTypes.map((t) => (
            <option key={t.code} value={t.code}>
              {t.name} ({t.wheelCount}W)
            </option>
          ))}
        </select>

        <div className="flex items-center">
          <label className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={docExpiredOnly}
              onChange={(e) => setDocExpiredOnly(e.target.checked)}
              className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500 border-cloudy-300"
            />
            <span className="flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
              Expired Docs Only
            </span>
          </label>
        </div>
      </div>

      {/* Vehicle Data Table */}
      <DataTable
        columns={columns}
        data={data?.data || []}
        isLoading={isLoading}
        compact={true}
        onRowClick={(veh) => setSelectedVehicle(veh)}
        pagination={{
          page,
          limit: 10,
          total: data?.meta?.total || 0,
          totalPages: data?.meta?.totalPages || 1,
          onPageChange: setPage,
        }}
      />



      {/* Statutory Document Compliance Inspection Modal */}
      <Modal
        isOpen={!!selectedVehicle}
        onClose={() => setSelectedVehicle(null)}
        title={selectedVehicle ? `Vehicle Compliance: ${selectedVehicle.vehicleNumber}` : 'Vehicle Compliance'}
        size="lg"
      >
        {selectedVehicle && (
          <div className="space-y-5 text-xs">
            {/* Vehicle Overview Bar */}
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-cloudy-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-black text-slate-950 dark:text-white">
                    {selectedVehicle.vehicleNumber}
                  </span>
                  <Badge variant={selectedVehicle.serviceType === 'DROP_TAXI' ? 'brand' : 'info'} size="sm">
                    {selectedVehicle.category.replace(/_/g, ' ')}
                  </Badge>
                  <StatusBadge status={selectedVehicle.status} />
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 font-bold mt-0.5">
                  {selectedVehicle.brand} {selectedVehicle.model} ({selectedVehicle.year}) • Fuel: {selectedVehicle.fuelType}
                </p>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold block">Assigned Driver</span>
                <span className="font-extrabold text-slate-950 dark:text-white text-xs">
                  {selectedVehicle.assignedDriver ? (selectedVehicle.assignedDriver as any).name : 'No Driver Assigned'}
                </span>
              </div>
            </div>

            {/* Document Expiry Status Overview Banner */}
            {(() => {
              const rcExp = isDocExpired(selectedVehicle.documents?.rc);
              const insExp = isDocExpired(selectedVehicle.documents?.insurance);
              const fitExp = isDocExpired(selectedVehicle.documents?.fitness);
              const prmExp = isDocExpired(selectedVehicle.documents?.permit);
              const isAnyExpired = rcExp || insExp || fitExp || prmExp || selectedVehicle.isDocumentExpired;

              return isAnyExpired ? (
                <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-300 dark:border-rose-800 flex items-start gap-2.5 text-rose-800 dark:text-rose-200">
                  <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-extrabold text-xs">Statutory Documents Expired / Overdue</h5>
                    <p className="text-[11px] text-rose-700 dark:text-rose-300 mt-0.5">
                      This vehicle has expired statutory documents. In active operations, vehicles with expired documents cannot be dispatched for passenger rides or freight bookings.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 flex items-center gap-2.5 text-emerald-800 dark:text-emerald-200">
                  <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <div>
                    <h5 className="font-extrabold text-xs">All 4 Statutory Documents Valid</h5>
                    <p className="text-[11px] text-emerald-700 dark:text-emerald-300">
                      RC, Insurance, Fitness Certificate, and Commercial Permit are currently within legal validity.
                    </p>
                  </div>
                </div>
              );
            })()}

            {/* 4 Statutory Document Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { key: 'rc', title: 'RC Book (Registration)', doc: selectedVehicle.documents?.rc },
                { key: 'insurance', title: 'Comprehensive Insurance', doc: selectedVehicle.documents?.insurance },
                { key: 'fitness', title: 'Fitness Certificate (FC)', doc: selectedVehicle.documents?.fitness },
                { key: 'permit', title: 'Commercial Permit', doc: selectedVehicle.documents?.permit },
              ].map(({ key, title, doc }) => {
                const expired = isDocExpired(doc);
                const daysRemaining = getDocDaysRemaining(doc?.expiryDate);

                return (
                  <div
                    key={key}
                    className={`p-3.5 rounded-xl border transition-all ${
                      expired
                        ? 'bg-rose-50/70 dark:bg-rose-950/30 border-rose-300 dark:border-rose-800/80'
                        : 'bg-white dark:bg-slate-900 border-cloudy-200 dark:border-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-1.5">
                        <FileText className={`w-3.5 h-3.5 ${expired ? 'text-rose-600 dark:text-rose-400' : 'text-slate-600 dark:text-slate-400'}`} />
                        <span className="font-extrabold text-slate-950 dark:text-white text-xs">{title}</span>
                      </div>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold border ${
                          expired
                            ? 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 border-rose-300 dark:border-rose-700'
                            : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700'
                        }`}
                      >
                        {expired ? 'EXPIRED' : 'VALID'}
                      </span>
                    </div>

                    <div className="space-y-1 text-[11px]">
                      <div className="flex justify-between">
                        <span className="text-slate-500 dark:text-slate-400 font-medium">Doc Number:</span>
                        <span className="font-mono font-bold text-slate-900 dark:text-slate-100">{doc?.docNumber || '—'}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500 dark:text-slate-400 font-medium">Expiry Date:</span>
                        <span className={`font-bold flex items-center gap-1 ${expired ? 'text-rose-600 dark:text-rose-400' : 'text-slate-900 dark:text-slate-100'}`}>
                          <Calendar className="w-3 h-3" />
                          {doc?.expiryDate ? formatDate(doc.expiryDate) : 'Not specified'}
                        </span>
                      </div>
                      {daysRemaining !== null && (
                        <div className="flex justify-between">
                          <span className="text-slate-500 dark:text-slate-400 font-medium">Validity Period:</span>
                          <span className={`font-extrabold text-[10px] ${expired ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-700 dark:text-emerald-400'}`}>
                            {daysRemaining < 0 ? `Expired ${Math.abs(daysRemaining)} days ago` : `${daysRemaining} days remaining`}
                          </span>
                        </div>
                      )}
                    </div>

                    {doc?.docUrl && (
                      <div className="mt-2.5 pt-2 border-t border-cloudy-200 dark:border-slate-800 flex justify-end">
                        <a
                          href={doc.docUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-[10px] font-bold text-brand-600 dark:text-brand-400 hover:underline"
                        >
                          <ExternalLink className="w-3 h-3" />
                          View Document File
                        </a>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="pt-2 flex justify-end">
              <Button variant="outline" size="sm" onClick={() => setSelectedVehicle(null)}>
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
