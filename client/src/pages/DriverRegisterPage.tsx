import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Clock,
  Car,
  Truck,
  Upload,
  UserCheck,
  ArrowRight,
  Phone,
  CheckCircle,
  FileText,
  Camera,
  Search,
  ExternalLink,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import api from '../api/axiosClient';
import { COMPANY_CONTACT } from './LandingPage';
import { FileUploadCard } from '../components/common/FileUploadCard';

export const DriverRegisterPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'REGISTER' | 'STATUS_CHECK'>('REGISTER');

  // Registration Form State
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
    serviceType: 'DROP_TAXI',
    vehicleNumber: '',
    vehicleModel: '',
    vehicleCategory: 'TAXI_SEDAN',

    // 1) Driving Licence
    licenseNumber: '',
    licenseExpiry: '',
    licenseUrl: '',

    // 2) RC
    rcNumber: '',
    rcExpiry: '',
    rcUrl: '',

    // 3) FC (Fitness Certificate)
    fcNumber: '',
    fcExpiry: '',
    fcUrl: '',

    // 4) Insurance
    insuranceNumber: '',
    insuranceExpiry: '',
    insuranceUrl: '',

    // 5) Aadhar
    aadhaarNumber: '',
    aadhaarUrl: '',

    // 6) Pan Card
    panNumber: '',
    panUrl: '',

    // 7) Live Picture (Selfie)
    livePhotoUrl: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState<any | null>(null);
  const [submitError, setSubmitError] = useState('');

  // Status Check State
  const [lookupMobile, setLookupMobile] = useState('');
  const [isLookingUp, setIsLookingUp] = useState(false);
  const [lookupResult, setLookupResult] = useState<any | null>(null);
  const [lookupError, setLookupError] = useState('');
  const [vehicleTypes, setVehicleTypes] = useState<any[]>([]);

  React.useEffect(() => {
    api.get('/vehicle-types/public')
      .then((res: any) => {
        if (res?.data && Array.isArray(res.data)) {
          setVehicleTypes(res.data);
        }
      })
      .catch(() => {});
  }, []);

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');

    // Check all 7 mandatory documents have uploaded files
    const missingDocs: string[] = [];
    if (!formData.licenseUrl) missingDocs.push('1. Driving Licence');
    if (!formData.rcUrl) missingDocs.push('2. RC Book');
    if (!formData.fcUrl) missingDocs.push('3. FC Certificate');
    if (!formData.insuranceUrl) missingDocs.push('4. Insurance Policy');
    if (!formData.aadhaarUrl) missingDocs.push('5. Aadhaar Card');
    if (!formData.panUrl) missingDocs.push('6. PAN Card');
    if (!formData.livePhotoUrl) missingDocs.push('7. Live Selfie Photo');

    if (missingDocs.length > 0) {
      setSubmitError(`Please upload files for all 7 required KYC documents. Missing: ${missingDocs.join(', ')}`);
      return;
    }

    setIsSubmitting(true);

    try {
      const res: any = await api.post('/auth/driver-register', formData);
      if (res.success) {
        setRegistrationSuccess(res.data);
      } else {
        setSubmitError(res.message || 'Failed to complete registration.');
      }
    } catch (err: any) {
      setSubmitError(err.message || 'Error connecting to server. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLookupError('');
    setIsLookingUp(true);
    setLookupResult(null);

    const clean = lookupMobile.replace(/\D/g, '').slice(-10);
    if (clean.length < 10) {
      setLookupError('Please enter a valid 10-digit mobile number.');
      setIsLookingUp(false);
      return;
    }

    try {
      const res: any = await api.get(`/auth/driver-status/${clean}`);
      if (res.success && res.data) {
        setLookupResult(res.data);
      } else {
        setLookupError('No driver registration found for this mobile number.');
      }
    } catch (err: any) {
      setLookupError(err.message || 'No registered driver found for this number.');
    } finally {
      setIsLookingUp(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col selection:bg-emerald-500 selection:text-white">
      {/* Top Header */}
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3.5 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center font-black text-white text-base shadow-lg shadow-emerald-500/20">
              R
            </div>
            <div>
              <span className="text-lg font-black tracking-tight text-white">Ride<span className="text-emerald-400">N</span>Load</span>
              <span className="block text-[10px] font-bold uppercase tracking-wider text-emerald-400/90 -mt-1">
                Driver Onboarding & KYC
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-4 text-xs">
            <a
              href={`tel:${COMPANY_CONTACT.phone1Raw}`}
              className="hidden sm:flex items-center gap-1.5 text-slate-300 hover:text-emerald-400 font-semibold transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-400" />
              <span>Partner Helpdesk: {COMPANY_CONTACT.phone1}</span>
            </a>
            <Link
              to="/admin/login"
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold border border-slate-700 text-xs transition-colors"
            >
              Admin Portal
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-8 sm:py-10">
        {/* Banner */}
        <div className="bg-gradient-to-r from-emerald-950/80 via-slate-900 to-teal-950/80 border border-emerald-500/30 rounded-3xl p-6 sm:p-8 mb-8 shadow-2xl relative overflow-hidden">
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold mb-3">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Official Driver Partner Registration & KYC
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight mb-2">
              Join RideNLoad: Drop Taxi & Freight Goods Fleet
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-4">
              To guarantee safety and verified standards for passengers and commercial shippers, drivers must submit <strong className="text-emerald-400">all 7 mandatory KYC documents</strong>. Once verified and approved by the Admin dispatch desk, trip bookings will be immediately enabled on your Driver App.
            </p>
            <div className="flex flex-wrap gap-2 text-[11px] font-bold text-emerald-300/90">
              <span className="px-2.5 py-1 rounded-lg bg-emerald-950/60 border border-emerald-500/30">1. Driving Licence</span>
              <span className="px-2.5 py-1 rounded-lg bg-emerald-950/60 border border-emerald-500/30">2. RC</span>
              <span className="px-2.5 py-1 rounded-lg bg-emerald-950/60 border border-emerald-500/30">3. FC</span>
              <span className="px-2.5 py-1 rounded-lg bg-emerald-950/60 border border-emerald-500/30">4. Insurance</span>
              <span className="px-2.5 py-1 rounded-lg bg-emerald-950/60 border border-emerald-500/30">5. Aadhaar</span>
              <span className="px-2.5 py-1 rounded-lg bg-emerald-950/60 border border-emerald-500/30">6. PAN Card</span>
              <span className="px-2.5 py-1 rounded-lg bg-emerald-950/60 border border-emerald-500/30">7. Live Selfie Picture</span>
            </div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-3 border-b border-slate-800 pb-4 mb-8">
          <button
            type="button"
            onClick={() => setActiveTab('REGISTER')}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 ${
              activeTab === 'REGISTER'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                : 'bg-slate-800/80 text-slate-400 hover:text-slate-200'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>1. New Driver KYC Registration</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('STATUS_CHECK')}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 ${
              activeTab === 'STATUS_CHECK'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                : 'bg-slate-800/80 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Search className="w-4 h-4" />
            <span>2. Track My KYC Approval Status</span>
          </button>
        </div>

        {/* TAB 1: REGISTRATION FLOW */}
        {activeTab === 'REGISTER' && (
          <div>
            {registrationSuccess ? (
              <div className="bg-slate-950 border-2 border-emerald-500/50 rounded-3xl p-6 sm:p-8 text-center max-w-xl mx-auto shadow-2xl space-y-5">
                <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-9 h-9" />
                </div>

                <div>
                  <h3 className="text-xl font-black text-white">Registration Submitted Successfully!</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Your driver account and all 7 KYC documents have been logged in the RideNLoad Dispatch System.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-left space-y-2 text-xs">
                  <div className="flex justify-between pb-1 border-b border-slate-800">
                    <span className="text-slate-400 font-semibold">Assigned Driver ID:</span>
                    <span className="font-mono font-black text-emerald-400">{registrationSuccess.driver?.driverId}</span>
                  </div>
                  <div className="flex justify-between pb-1 border-b border-slate-800">
                    <span className="text-slate-400 font-semibold">Registered Driver:</span>
                    <span className="font-bold text-white">{registrationSuccess.driver?.name} ({registrationSuccess.driver?.mobile})</span>
                  </div>
                  <div className="flex justify-between pb-1 border-b border-slate-800">
                    <span className="text-slate-400 font-semibold">KYC Verification State:</span>
                    <span className="font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 uppercase text-[10px]">
                      {registrationSuccess.driver?.kycStatus}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-semibold">Booking Dispatch Access:</span>
                    <span className="font-bold text-rose-400">Blocked until Admin Approves</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs text-left leading-relaxed">
                  <strong>Important Notice:</strong> Our Admin operations desk in Porur, Chennai verifies all 7 uploaded documents against RTO & Government registries. Once all 7 documents are approved, your Driver App will automatically switch to "Eligible for Bookings".
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setLookupMobile(registrationSuccess.driver?.mobile);
                      setActiveTab('STATUS_CHECK');
                    }}
                    className="flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 font-bold text-xs text-white shadow-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <span>Check Live Approval Status</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setRegistrationSuccess(null);
                      setFormData({
                        name: '',
                        mobile: '',
                        email: '',
                        serviceType: 'DROP_TAXI',
                        vehicleNumber: '',
                        vehicleModel: '',
                        vehicleCategory: 'TAXI_SEDAN',
                        licenseNumber: '',
                        licenseExpiry: '',
                        licenseUrl: '',
                        rcNumber: '',
                        rcExpiry: '',
                        rcUrl: '',
                        fcNumber: '',
                        fcExpiry: '',
                        fcUrl: '',
                        insuranceNumber: '',
                        insuranceExpiry: '',
                        insuranceUrl: '',
                        aadhaarNumber: '',
                        aadhaarUrl: '',
                        panNumber: '',
                        panUrl: '',
                        livePhotoUrl: '',
                      });
                    }}
                    className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 font-bold text-xs text-slate-300 transition-colors"
                  >
                    Register Another Driver
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleRegisterSubmit} className="space-y-8">
                {submitError && (
                  <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{submitError}</span>
                  </div>
                )}

                {/* Section 1: Driver Contact & Service */}
                <div className="bg-slate-950/80 border border-slate-800 rounded-3xl p-6 sm:p-7 space-y-4">
                  <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800">
                    <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
                      1
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white">Driver Partner & Contact Details</h3>
                      <p className="text-[11px] text-slate-400">Personal information for SMS OTP login and payment transfers</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                    <div>
                      <label className="block text-slate-300 mb-1 font-semibold">Full Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Ramesh Kumar"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 mb-1 font-semibold">10-Digit Mobile Number *</label>
                      <input
                        type="tel"
                        required
                        placeholder="e.g. 9876543210"
                        value={formData.mobile}
                        onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 mb-1 font-semibold">Email Address (Optional)</label>
                      <input
                        type="email"
                        placeholder="e.g. driver@ridenload.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-300 mb-1.5 font-semibold text-xs">Operating Fleet Type *</label>
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, serviceType: 'DROP_TAXI', vehicleCategory: 'TAXI_SEDAN' })}
                        className={`p-3.5 rounded-2xl border text-left flex items-center gap-3 transition-all ${
                          formData.serviceType === 'DROP_TAXI'
                            ? 'bg-emerald-950/60 border-emerald-500 text-white shadow-md'
                            : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <Car className="w-5 h-5 text-emerald-400" />
                        <div>
                          <p className="font-bold text-white">🚕 Drop Taxi</p>
                          <p className="text-[10px] text-slate-400">One-way Outstation Cabs & City Drops</p>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, serviceType: 'GOODS_TRUCK', vehicleCategory: 'TRUCK_MINI_1TON' })}
                        className={`p-3.5 rounded-2xl border text-left flex items-center gap-3 transition-all ${
                          formData.serviceType === 'GOODS_TRUCK'
                            ? 'bg-emerald-950/60 border-emerald-500 text-white shadow-md'
                            : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <Truck className="w-5 h-5 text-emerald-400" />
                        <div>
                          <p className="font-bold text-white">🚚 Goods Truck</p>
                          <p className="text-[10px] text-slate-400">Commercial Cargo & Freight Logistics</p>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Section 2: Vehicle Details */}
                <div className="bg-slate-950/80 border border-slate-800 rounded-3xl p-6 sm:p-7 space-y-4">
                  <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800">
                    <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
                      2
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white">Registered Vehicle Information</h3>
                      <p className="text-[11px] text-slate-400">Vehicle details as per your RTO registration</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                    <div>
                      <label className="block text-slate-300 mb-1 font-semibold">Vehicle Plate Number *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. TN-09-AB-1234"
                        value={formData.vehicleNumber}
                        onChange={(e) => setFormData({ ...formData, vehicleNumber: e.target.value.toUpperCase() })}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-emerald-500 font-mono font-bold uppercase"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 mb-1 font-semibold">Vehicle Brand & Model *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Maruti Dzire / Tata Ace"
                        value={formData.vehicleModel}
                        onChange={(e) => setFormData({ ...formData, vehicleModel: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 mb-1 font-semibold">Vehicle Category *</label>
                      <select
                        value={formData.vehicleCategory}
                        onChange={(e) => setFormData({ ...formData, vehicleCategory: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-emerald-500 font-bold"
                      >
                        {vehicleTypes.length > 0 ? (
                          vehicleTypes
                            .filter((t) => t.serviceType === formData.serviceType)
                            .map((t) => (
                              <option key={t.code} value={t.code}>
                                {t.name} ({t.wheelCount} Wheels - {t.wheelType})
                              </option>
                            ))
                        ) : formData.serviceType === 'DROP_TAXI' ? (
                          <>
                            <option value="TAXI_SEDAN">Sedan (Swift Dzire, Etios, Aura)</option>
                            <option value="TAXI_SUV">SUV (Innova, Ertiga, Marazzo)</option>
                            <option value="TAXI_MINI">Mini Hatchback (WagonR, Swift)</option>
                            <option value="TAXI_INNOVA">Premium Innova Crysta</option>
                          </>
                        ) : (
                          <>
                            <option value="TRUCK_MINI_1TON">Mini Truck 1-Ton (Tata Ace / Chhota Hathi)</option>
                            <option value="TRUCK_MEDIUM_3TON">Medium Cargo 3-Ton (Pickup 8ft / Bolero)</option>
                            <option value="TRUCK_HEAVY_7TON">Heavy Freight 7-Ton (Tata 407 / Eicher)</option>
                          </>
                        )}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Section 3: The 7 Mandatory KYC Documents */}
                <div className="bg-slate-950/80 border-2 border-emerald-500/40 rounded-3xl p-6 sm:p-7 space-y-6">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
                        3
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                          7 Mandatory KYC Documents
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-extrabold uppercase">
                            Required by Admin
                          </span>
                        </h3>
                        <p className="text-[11px] text-slate-400">
                          Please enter the numbers and upload clear photos of all 7 documents.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    {/* 1. Driving Licence */}
                    <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white flex items-center gap-2">
                          <span className="text-base">🪪</span> 1. Driving Licence
                        </span>
                        <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded">Mandatory</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[11px] text-slate-400 mb-1">License No. *</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. TN-07-20180004921"
                            value={formData.licenseNumber}
                            onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value.toUpperCase() })}
                            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white font-mono uppercase text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] text-slate-400 mb-1">Expiry Date *</label>
                          <input
                            type="date"
                            required
                            value={formData.licenseExpiry}
                            onChange={(e) => setFormData({ ...formData, licenseExpiry: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white text-xs"
                          />
                        </div>
                      </div>
                      <FileUploadCard
                        label="Upload Driving Licence Photo/PDF"
                        value={formData.licenseUrl}
                        onChange={(url) => setFormData({ ...formData, licenseUrl: url })}
                        subtitle="Front & Back scan"
                        required
                      />
                    </div>

                    {/* 2. RC Book */}
                    <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white flex items-center gap-2">
                          <span className="text-base">📄</span> 2. Vehicle RC
                        </span>
                        <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded">Mandatory</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[11px] text-slate-400 mb-1">RC Number *</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. TN-09-AB-1234"
                            value={formData.rcNumber}
                            onChange={(e) => setFormData({ ...formData, rcNumber: e.target.value.toUpperCase() })}
                            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white font-mono uppercase text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] text-slate-400 mb-1">Fitness Expiry *</label>
                          <input
                            type="date"
                            required
                            value={formData.rcExpiry}
                            onChange={(e) => setFormData({ ...formData, rcExpiry: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white text-xs"
                          />
                        </div>
                      </div>
                      <FileUploadCard
                        label="Upload RC Book Photo/PDF"
                        value={formData.rcUrl}
                        onChange={(url) => setFormData({ ...formData, rcUrl: url })}
                        subtitle="RC Card scan"
                        required
                      />
                    </div>

                    {/* 3. FC (Fitness Certificate) */}
                    <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white flex items-center gap-2">
                          <span className="text-base">📋</span> 3. FC (Fitness Certificate)
                        </span>
                        <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded">Mandatory</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[11px] text-slate-400 mb-1">FC Certificate No. *</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. FC-TN09-48201"
                            value={formData.fcNumber}
                            onChange={(e) => setFormData({ ...formData, fcNumber: e.target.value.toUpperCase() })}
                            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white font-mono uppercase text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] text-slate-400 mb-1">Valid Till *</label>
                          <input
                            type="date"
                            required
                            value={formData.fcExpiry}
                            onChange={(e) => setFormData({ ...formData, fcExpiry: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white text-xs"
                          />
                        </div>
                      </div>
                      <FileUploadCard
                        label="Upload FC Certificate File"
                        value={formData.fcUrl}
                        onChange={(url) => setFormData({ ...formData, fcUrl: url })}
                        subtitle="Commercial transport FC"
                        required
                      />
                    </div>

                    {/* 4. Vehicle Insurance */}
                    <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white flex items-center gap-2">
                          <span className="text-base">🛡️</span> 4. Vehicle Insurance
                        </span>
                        <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded">Mandatory</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[11px] text-slate-400 mb-1">Policy Number *</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. POL-HDFC-9948291"
                            value={formData.insuranceNumber}
                            onChange={(e) => setFormData({ ...formData, insuranceNumber: e.target.value.toUpperCase() })}
                            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white font-mono uppercase text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] text-slate-400 mb-1">Policy Expiry *</label>
                          <input
                            type="date"
                            required
                            value={formData.insuranceExpiry}
                            onChange={(e) => setFormData({ ...formData, insuranceExpiry: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white text-xs"
                          />
                        </div>
                      </div>
                      <FileUploadCard
                        label="Upload Insurance Policy Document"
                        value={formData.insuranceUrl}
                        onChange={(url) => setFormData({ ...formData, insuranceUrl: url })}
                        subtitle="Active insurance policy sheet"
                        required
                      />
                    </div>

                    {/* 5. Aadhaar Card */}
                    <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white flex items-center gap-2">
                          <span className="text-base">🆔</span> 5. Aadhaar Card
                        </span>
                        <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded">Mandatory</span>
                      </div>
                      <div>
                        <label className="block text-[11px] text-slate-400 mb-1">12-Digit Aadhaar No. *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. 5489 1234 8901"
                          value={formData.aadhaarNumber}
                          onChange={(e) => setFormData({ ...formData, aadhaarNumber: e.target.value })}
                          className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white font-mono text-xs"
                        />
                      </div>
                      <FileUploadCard
                        label="Upload Aadhaar Card Photo/PDF"
                        value={formData.aadhaarUrl}
                        onChange={(url) => setFormData({ ...formData, aadhaarUrl: url })}
                        subtitle="Front & Back of Aadhaar"
                        required
                      />
                    </div>

                    {/* 6. PAN Card */}
                    <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white flex items-center gap-2">
                          <span className="text-base">💳</span> 6. PAN Card
                        </span>
                        <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded">Mandatory</span>
                      </div>
                      <div>
                        <label className="block text-[11px] text-slate-400 mb-1">10-Digit PAN Number *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. ABCDE1234F"
                          value={formData.panNumber}
                          onChange={(e) => setFormData({ ...formData, panNumber: e.target.value.toUpperCase() })}
                          className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white font-mono uppercase text-xs"
                        />
                      </div>
                      <FileUploadCard
                        label="Upload PAN Card Photo"
                        value={formData.panUrl}
                        onChange={(url) => setFormData({ ...formData, panUrl: url })}
                        subtitle="PAN card copy"
                        required
                      />
                    </div>

                    {/* 7. Live Picture (Face Selfie) */}
                    <div className="md:col-span-2 p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white flex items-center gap-2">
                          <span className="text-base">📸</span> 7. Live Picture (Face Selfie Verification)
                        </span>
                        <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded">Mandatory</span>
                      </div>
                      <p className="text-[11px] text-slate-400">
                        Take a clear front selfie photo using your device camera or upload a recent photo. Used for passenger identification.
                      </p>
                      <FileUploadCard
                        label="Capture Live Photo (Selfie)"
                        value={formData.livePhotoUrl}
                        onChange={(url) => setFormData({ ...formData, livePhotoUrl: url })}
                        subtitle="Direct camera selfie or portrait"
                        isCamera={true}
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Submit Action */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-500 font-black text-sm text-white shadow-xl shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span>Submitting 7 KYC Documents to Admin...</span>
                    ) : (
                      <>
                        <ShieldCheck className="w-5 h-5" />
                        <span>Submit All 7 Documents for Admin KYC Approval</span>
                      </>
                    )}
                  </button>
                  <p className="text-center text-[11px] text-slate-500 mt-2.5">
                    By submitting, you certify that all 7 documents are genuine and valid under Motor Vehicles Act, 1988.
                  </p>
                </div>
              </form>
            )}
          </div>
        )}

        {/* TAB 2: LIVE KYC STATUS TRACKER */}
        {activeTab === 'STATUS_CHECK' && (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="bg-slate-950/80 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-xl">
              <h3 className="text-base font-bold text-white mb-1">Track Driver KYC Verification</h3>
              <p className="text-xs text-slate-400 mb-5">
                Enter the mobile number used during registration to inspect your live verification status.
              </p>

              <form onSubmit={handleStatusLookup} className="flex gap-2.5">
                <div className="relative flex-1">
                  <span className="absolute left-3.5 top-2.5 text-xs font-bold text-slate-500">+91</span>
                  <input
                    type="tel"
                    required
                    placeholder="Enter 10-digit mobile number"
                    value={lookupMobile}
                    onChange={(e) => setLookupMobile(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-12 pr-3.5 py-2.5 text-xs text-white outline-none focus:border-emerald-500 font-mono"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLookingUp}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-colors flex items-center gap-1.5"
                >
                  <Search className="w-4 h-4" />
                  <span>{isLookingUp ? 'Searching...' : 'Check Status'}</span>
                </button>
              </form>

              {lookupError && (
                <div className="mt-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{lookupError}</span>
                </div>
              )}
            </div>

            {/* Lookup Result Card */}
            {lookupResult && (
              <div className="bg-slate-950/90 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-5 animate-in fade-in duration-300">
                <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                  <div className="flex items-center gap-3">
                    <img
                      src={lookupResult.driver.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200'}
                      alt="Driver"
                      className="w-12 h-12 rounded-2xl object-cover border border-slate-700"
                    />
                    <div>
                      <h4 className="font-bold text-white text-sm">{lookupResult.driver.name}</h4>
                      <p className="text-xs text-slate-400 font-mono">{lookupResult.driver.driverId} • {lookupResult.driver.mobile}</p>
                    </div>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                      lookupResult.driver.kycStatus === 'APPROVED'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                        : lookupResult.driver.kycStatus === 'REJECTED'
                        ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                        : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                    }`}
                  >
                    KYC: {lookupResult.driver.kycStatus}
                  </span>
                </div>

                {/* Dispatch Status Box */}
                <div
                  className={`p-4 rounded-2xl border ${
                    lookupResult.canTakeBookings
                      ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200'
                      : 'bg-amber-950/40 border-amber-500/50 text-amber-200'
                  } text-xs space-y-1`}
                >
                  <p className="font-bold flex items-center gap-2">
                    {lookupResult.canTakeBookings ? (
                      <>
                        <CheckCircle className="w-4 h-4 text-emerald-400" />
                        <span>Bookings Enabled: You are Approved to Receive Trips!</span>
                      </>
                    ) : (
                      <>
                        <Clock className="w-4 h-4 text-amber-400" />
                        <span>Bookings Blocked: KYC Pending Admin Approval</span>
                      </>
                    )}
                  </p>
                  <p className="text-[11px] opacity-90 leading-relaxed">
                    {lookupResult.canTakeBookings
                      ? 'All 7 mandatory KYC documents have been reviewed and approved by the RideNLoad Admin Team. Open your Driver App and turn online to start receiving instant bookings!'
                      : 'Our admin team in Chennai is currently reviewing your 7 documents. You will receive an SMS as soon as the verification is finalized.'}
                  </p>
                </div>

                {/* 7 Documents Checklist */}
                <div>
                  <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                    Verification Checklist (7 Mandatory Documents)
                  </h5>
                  <div className="space-y-2 text-xs">
                    {(lookupResult.documents || []).map((doc: any) => (
                      <div
                        key={doc._id}
                        className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between"
                      >
                        <div>
                          <p className="font-bold text-slate-200">
                            {doc.documentName || doc.documentType.replace(/_/g, ' ')}
                          </p>
                          <p className="text-[11px] font-mono text-slate-400">{doc.documentNumber}</p>
                        </div>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                            doc.status === 'APPROVED'
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : doc.status === 'REJECTED'
                              ? 'bg-rose-500/20 text-rose-400'
                              : 'bg-amber-500/20 text-amber-400'
                          }`}
                        >
                          {doc.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <p>© 2026 RideNLoad Technologies Pvt Ltd. All rights reserved.</p>
        <p className="mt-1 text-[11px]">
          Headquarters: {COMPANY_CONTACT.address}
        </p>
      </footer>
    </div>
  );
};
