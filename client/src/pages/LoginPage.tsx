import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/common/Button';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('superadmin@ridenload.com');
  const [password, setPassword] = useState('adminPassword123!');
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(email, password);
      navigate('/admin/dashboard');
    } catch (err: any) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row antialiased font-sans bg-slate-50 selection:bg-blue-600 selection:text-white">

      {/* ========================================================= */}
      {/* LEFT PORTION: BRAND & TAXI + GOODS TRUCK FLEET VISUAL */}
      {/* ========================================================= */}
      <div className="lg:w-[50%] xl:w-[52%] bg-gradient-to-br from-[#061727] via-[#0A2540] to-[#0F4471] p-8 sm:p-12 lg:p-14 flex flex-col justify-between text-white relative overflow-hidden">

        {/* Subtle Ambient Backdrops */}
        <div className="absolute -top-24 -left-24 w-80 h-80 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-sky-400/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Spacer */}
        <div className="relative z-10" />

        {/* Center: Hero Fleet Showcase (Taxi + Goods Truck) */}
        <div className="relative z-10 my-auto py-8 flex flex-col items-center">
          <div className="w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl shadow-black/40 border border-white/15 bg-slate-900/40 backdrop-blur-sm group">
            <img
              src="/login_fleet_banner.jpg"
              alt="RideNLoad Drop Taxi and Goods Truck Fleet"
              className="w-full h-auto object-cover transform transition-transform duration-700 ease-out group-hover:scale-[1.02]"
            />
          </div>

          <div className="text-center mt-6 space-y-1">
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Drop Taxi & Goods Truck Mobility
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 font-medium">
              Unified outstation cab dispatch & commercial freight management
            </p>
          </div>
        </div>

        {/* Bottom: Subtle Footer Line */}
        <div className="relative z-10 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
          <span>RideNLoad Technologies</span>
          <span>Porur, Chennai</span>
        </div>
      </div>

      {/* ========================================================= */}
      {/* RIGHT PORTION: CLEAN & QUIET LOGIN CARD */}
      {/* ========================================================= */}
      <div className="flex-1 flex flex-col justify-between p-6 sm:p-10 lg:p-14 bg-white relative">

        {/* Top Spacer */}
        <div className="relative z-10" />

        {/* Center Form Container */}
        <div className="max-w-[380px] w-full mx-auto my-auto space-y-6">

          {/* Logo Directly Above Sign In (10rem on >=640px) */}
          <div className="space-y-4 text-left">
            <Link to="/" className="inline-block hover:opacity-90 transition-opacity">
              <img
                src="/ridenload_logo.png"
                alt="RideNLoad"
                className="h-16 sm:h-20 sm:h-[10rem] w-auto object-contain"
              />
            </Link>
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
                Sign In
              </h1>
              <p className="text-xs text-slate-500 font-medium">
                Enter your credentials to access the admin panel
              </p>
            </div>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">

            {/* Email Field */}
            <div className="space-y-1.5 text-left">
              <label className="block text-xs font-bold text-slate-700">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@ridenload.com"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 hover:bg-slate-50/70 focus:bg-white border border-slate-200 rounded-xl text-slate-900 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#0F4471] focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Password Field (Clean & perfectly fitted) */}
            <div className="space-y-1.5 text-left">
              <label className="block text-xs font-bold text-slate-700">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 hover:bg-slate-50/70 focus:bg-white border border-slate-200 rounded-xl text-slate-900 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#0F4471] focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between pt-0.5">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded text-[#0F4471] border-slate-300 focus:ring-[#0F4471]"
                />
                <span className="text-xs font-medium text-slate-600">Remember me</span>
              </label>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              isLoading={loading}
              className="w-full py-3 rounded-xl font-bold bg-[#0F4471] hover:bg-[#0A3050] text-white shadow-md shadow-blue-900/10 transition-all text-sm mt-2"
            >
              Sign In
            </Button>
          </form>

        </div>

        {/* Bottom Security Note */}
        <div className="text-center text-[11px] text-slate-400">
          Secure Administrator Access
        </div>

      </div>

    </div>
  );
};
