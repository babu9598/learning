import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Settings, Save, CheckCircle, Building, Map, CreditCard, Shield, Clock } from 'lucide-react';
import api from '../api/axiosClient';
import { Button } from '../components/common/Button';

export const SettingsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'general' | 'booking' | 'payment' | 'maps' | 'tax'>('general');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Fetch Settings
  const { data: settingsData, isLoading } = useQuery({
    queryKey: ['app-settings'],
    queryFn: () => api.get('/settings').then((res: any) => res.data),
  });

  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    if (settingsData) {
      setFormData(settingsData);
    }
  }, [settingsData]);

  // Update Settings Mutation
  const updateMutation = useMutation({
    mutationFn: (data: any) => api.put('/settings', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['app-settings'] });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate(formData);
  };

  if (isLoading) {
    return <div className="p-8 text-center text-slate-500">Loading system configurations...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-950 dark:text-white flex items-center gap-2">
            System & Enterprise Platform Settings
          </h1>
          <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mt-1">
            Configure platform parameters, dispatch thresholds, payment gateway keys, and tax compliance.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          icon={<Save className="w-4 h-4" />}
          isLoading={updateMutation.isPending}
          onClick={handleSubmit}
          className="font-bold shadow-md shadow-brand-500/20"
        >
          Save All Changes
        </Button>
      </div>

      {savedSuccess && (
        <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 rounded-2xl text-xs font-bold flex items-center gap-2">
          <CheckCircle className="w-4 h-4" /> System settings updated successfully!
        </div>
      )}

      {/* Tabs Strip */}
      <div className="flex items-center gap-2 border-b border-cloudy-200 dark:border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('general')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
            activeTab === 'general'
              ? 'bg-brand-600 text-white shadow-sm'
              : 'text-slate-800 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white bg-white dark:bg-slate-800 border border-cloudy-300 dark:border-transparent'
          }`}
        >
          <Building className="w-4 h-4" /> Business Profile
        </button>

        <button
          onClick={() => setActiveTab('booking')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
            activeTab === 'booking'
              ? 'bg-brand-600 text-white shadow-sm'
              : 'text-slate-800 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white bg-white dark:bg-slate-800 border border-cloudy-300 dark:border-transparent'
          }`}
        >
          <Clock className="w-4 h-4" /> Dispatch Policies
        </button>

        <button
          onClick={() => setActiveTab('payment')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
            activeTab === 'payment'
              ? 'bg-brand-600 text-white shadow-sm'
              : 'text-slate-800 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white bg-white dark:bg-slate-800 border border-cloudy-300 dark:border-transparent'
          }`}
        >
          <CreditCard className="w-4 h-4" /> Payment Gateways
        </button>

        <button
          onClick={() => setActiveTab('tax')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
            activeTab === 'tax'
              ? 'bg-brand-600 text-white shadow-sm'
              : 'text-slate-800 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white bg-white dark:bg-slate-800 border border-cloudy-300 dark:border-transparent'
          }`}
        >
          <Shield className="w-4 h-4" /> Tax & GST Compliance
        </button>
      </div>

      {/* Form Body */}
      <form onSubmit={handleSubmit} className="glass-panel p-6 rounded-2xl border border-cloudy-200 dark:border-slate-800 shadow-card space-y-6 text-xs font-medium">
        {/* Tab 1: General Business Profile */}
        {activeTab === 'general' && (
          <div className="space-y-4">
            <h3 className="text-sm font-extrabold text-slate-950 dark:text-white uppercase tracking-wider">
              Company & Brand Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-800 dark:text-slate-200 mb-1 font-bold">Company Name</label>
                <input
                  type="text"
                  value={formData.general?.companyName || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      general: { ...formData.general, companyName: e.target.value },
                    })
                  }
                  className="w-full bg-white dark:bg-slate-900 border border-cloudy-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-white outline-none focus:border-brand-500 shadow-sm"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1 font-semibold">Tagline</label>
                <input
                  type="text"
                  value={formData.general?.tagline || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      general: { ...formData.general, tagline: e.target.value },
                    })
                  }
                  className="w-full bg-white dark:bg-slate-900 border border-cloudy-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-white outline-none focus:border-brand-500 shadow-sm"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1 font-semibold">Customer Support Email</label>
                <input
                  type="email"
                  value={formData.general?.supportEmail || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      general: { ...formData.general, supportEmail: e.target.value },
                    })
                  }
                  className="w-full bg-white dark:bg-slate-900 border border-cloudy-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-white outline-none focus:border-brand-500 shadow-sm"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1 font-semibold">Support Helpline Phone</label>
                <input
                  type="text"
                  value={formData.general?.supportPhone || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      general: { ...formData.general, supportPhone: e.target.value },
                    })
                  }
                  className="w-full bg-white dark:bg-slate-900 border border-cloudy-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-white outline-none focus:border-brand-500 shadow-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 mb-1 font-semibold">Registered Office Address</label>
              <input
                type="text"
                value={formData.general?.officeAddress || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    general: { ...formData.general, officeAddress: e.target.value },
                  })
                }
                className="w-full bg-white dark:bg-slate-900 border border-cloudy-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-white outline-none focus:border-brand-500 shadow-sm"
              />
            </div>
          </div>
        )}

        {/* Tab 2: Dispatch Policies */}
        {activeTab === 'booking' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Automated Dispatch & Scheduling Rules
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1 font-semibold">
                  Max Driver Search Radius (KM)
                </label>
                <input
                  type="number"
                  value={formData.booking?.maxSearchRadiusKm || 15}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      booking: { ...formData.booking, maxSearchRadiusKm: Number(e.target.value) },
                    })
                  }
                  className="w-full bg-white dark:bg-slate-900 border border-cloudy-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-white outline-none focus:border-brand-500 shadow-sm"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1 font-semibold">
                  Driver Acceptance Timeout (Seconds)
                </label>
                <input
                  type="number"
                  value={formData.booking?.driverAcceptTimeoutSec || 45}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      booking: { ...formData.booking, driverAcceptTimeoutSec: Number(e.target.value) },
                    })
                  }
                  className="w-full bg-white dark:bg-slate-900 border border-cloudy-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-white outline-none focus:border-brand-500 shadow-sm"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1 font-semibold">
                  Free Customer Cancellation Window (Mins)
                </label>
                <input
                  type="number"
                  value={formData.booking?.freeCancellationMins || 5}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      booking: { ...formData.booking, freeCancellationMins: Number(e.target.value) },
                    })
                  }
                  className="w-full bg-white dark:bg-slate-900 border border-cloudy-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-white outline-none focus:border-brand-500 shadow-sm"
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Payment Gateways */}
        {activeTab === 'payment' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Payment Gateway Integration Config
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-cloudy-50 dark:bg-slate-950 rounded-xl border border-cloudy-200 dark:border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 dark:text-white">Razorpay Payments</span>
                  <input
                    type="checkbox"
                    checked={formData.paymentGateways?.razorpayEnabled || false}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        paymentGateways: {
                          ...formData.paymentGateways,
                          razorpayEnabled: e.target.checked,
                        },
                      })
                    }
                    className="rounded text-brand-500 focus:ring-brand-500"
                  />
                </div>
                <input
                  type="text"
                  placeholder="Key ID"
                  value={formData.paymentGateways?.razorpayKeyId || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      paymentGateways: {
                        ...formData.paymentGateways,
                        razorpayKeyId: e.target.value,
                      },
                    })
                  }
                  className="w-full bg-white dark:bg-slate-900 border border-cloudy-200 dark:border-slate-700 rounded-xl px-3 py-1.5 text-slate-900 dark:text-white font-mono text-xs shadow-sm"
                />
              </div>

              <div className="p-4 bg-cloudy-50 dark:bg-slate-950 rounded-xl border border-cloudy-200 dark:border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 dark:text-white">Cash on Delivery / UPI Direct</span>
                  <input
                    type="checkbox"
                    checked={formData.paymentGateways?.cashOnDeliveryEnabled || false}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        paymentGateways: {
                          ...formData.paymentGateways,
                          cashOnDeliveryEnabled: e.target.checked,
                        },
                      })
                    }
                    className="rounded text-brand-500 focus:ring-brand-500"
                  />
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-[11px]">
                  Allows customers to pay directly to driver partner upon destination arrival.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Tax & GST */}
        {activeTab === 'tax' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              GST, PAN & Statutory Deductions
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1 font-semibold">Company GSTIN Number</label>
                <input
                  type="text"
                  value={formData.tax?.gstNumber || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      tax: { ...formData.tax, gstNumber: e.target.value },
                    })
                  }
                  className="w-full bg-white dark:bg-slate-900 border border-cloudy-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-white font-mono outline-none focus:border-brand-500 shadow-sm"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1 font-semibold">Standard GST Rate (%)</label>
                <input
                  type="number"
                  value={formData.tax?.gstRate || 5}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      tax: { ...formData.tax, gstRate: Number(e.target.value) },
                    })
                  }
                  className="w-full bg-white dark:bg-slate-900 border border-cloudy-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-white outline-none focus:border-brand-500 shadow-sm"
                />
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};
