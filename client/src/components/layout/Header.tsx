import React, { useState } from 'react';
import {
  Menu,
  Bell,
  LogOut,
  Sun,
  Moon,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Badge } from '../common/Badge';

export const Header: React.FC<{
  onToggleSidebar: () => void;
  onOpenQuickAction?: () => void;
}> = ({ onToggleSidebar }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    { id: 1, title: 'New DropTaxi Booking TX-100024', time: '2 mins ago', type: 'booking' },
    { id: 2, title: 'Driver Murugan S KYC Submitted', time: '15 mins ago', type: 'driver' },
    { id: 3, title: 'Payout Batch #PAY-50004 Processed', time: '1 hour ago', type: 'finance' },
  ];

  return (
    <header className="app-header h-16 px-6 flex items-center justify-between z-30 select-none transition-colors duration-200">
      {/* Left side: Toggle & Live Indicator */}
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="header-icon-btn w-9 h-9 rounded-xl bg-white dark:bg-darkbg-900 border border-cloudy-200 dark:border-slate-800/80 hover:bg-cloudy-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition-colors shadow-sm cursor-pointer"
        >
          <Menu className="w-4 h-4" />
        </button>
      </div>

      {/* Right side: Theme Toggle, Alerts, Profile */}
      <div className="flex items-center gap-3">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="header-icon-btn w-9 h-9 rounded-xl bg-white dark:bg-darkbg-900 border border-cloudy-200 dark:border-slate-800/80 hover:bg-cloudy-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition-colors shadow-sm"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-brand-600" />
          )}
        </button>

        {/* Notification Bell Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="header-icon-btn w-9 h-9 rounded-xl bg-white dark:bg-darkbg-900 border border-cloudy-200 dark:border-slate-800/80 hover:bg-cloudy-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition-colors relative shadow-sm"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-brand-500" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 glass-panel-elevated rounded-2xl p-4 shadow-2xl border border-cloudy-200 dark:border-slate-800 space-y-3 z-50 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between pb-2 border-b border-cloudy-200 dark:border-slate-800">
                <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Live Notifications
                </span>
                <span className="text-[10px] bg-brand-500/20 text-brand-600 dark:text-brand-300 px-2 py-0.5 rounded-full font-bold">
                  3 New
                </span>
              </div>
              <div className="space-y-2">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className="p-2.5 rounded-xl bg-cloudy-50 hover:bg-cloudy-100 dark:bg-slate-800/50 dark:hover:bg-slate-800 border border-cloudy-200/60 dark:border-slate-800/60 transition-colors"
                  >
                    <p className="text-xs font-medium text-slate-800 dark:text-slate-200">{n.title}</p>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 block">{n.time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Admin Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2.5 p-1.5 pr-3 rounded-xl bg-white dark:bg-darkbg-900 border border-cloudy-200 dark:border-slate-800/80 hover:bg-cloudy-100 dark:hover:bg-slate-800 transition-colors shadow-sm"
          >
            <img
              src={
                user?.avatar ||
                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'
              }
              alt={user?.name}
              className="w-7 h-7 rounded-lg object-cover ring-1 ring-brand-500/50"
            />
            <div className="text-left hidden lg:block">
              <p className="text-xs font-bold text-slate-900 dark:text-white leading-tight truncate max-w-[120px]">
                {user?.name || 'Administrator'}
              </p>
              <p className="text-[10px] text-brand-600 dark:text-brand-300 font-semibold leading-tight">
                {user?.role?.name || 'Super Admin'}
              </p>
            </div>
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-56 glass-panel-elevated rounded-2xl p-2 shadow-2xl border border-cloudy-200 dark:border-slate-800 space-y-1 z-50 animate-in fade-in zoom-in-95">
              <div className="px-3 py-2 border-b border-cloudy-200 dark:border-slate-800">
                <p className="text-xs font-bold text-slate-900 dark:text-white">{user?.name}</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{user?.email}</p>
                <Badge variant="brand" size="sm" className="mt-1.5">
                  {user?.role?.name}
                </Badge>
              </div>

              <button
                onClick={logout}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-rose-500 hover:bg-rose-500/10 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
