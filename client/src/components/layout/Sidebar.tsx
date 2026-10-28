import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  UserCheck,
  CalendarCheck,
  CircleDollarSign,
  Tag,
  CreditCard,
  FileBarChart,
  Bell,
  Headphones,
  ShieldCheck,
  Settings,
  History,
  Truck,
  Sliders,
  X,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { cn } from '../../utils/formatters';

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
  permission?: string;
  badge?: string;
  badgeColor?: string;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

interface SidebarProps {
  isCollapsed: boolean;
  isMobileOpen: boolean;
  onToggle: () => void;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isCollapsed,
  isMobileOpen,
  onToggle,
  onCloseMobile,
}) => {
  const { hasPermission } = useAuth();
  const location = useLocation();

  const navSections: NavSection[] = [
    {
      title: 'Operations',
      items: [
        { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
        // { name: 'Live Fleet Radar', href: '/admin/tracking', icon: Navigation, badge: 'LIVE', badgeColor: 'bg-emerald-500' }, // Hidden: can be re-enabled later
        { name: 'Bookings & Trips', href: '/admin/bookings', icon: CalendarCheck },
        { name: 'Driver Management', href: '/admin/drivers', icon: UserCheck },
        { name: 'Vehicle Management', href: '/admin/vehicles', icon: Truck },
        { name: 'Vehicle Types', href: '/admin/vehicle-types', icon: Sliders },
        { name: 'Customer Management', href: '/admin/customers', icon: Users },
      ],
    },
    {
      title: 'Finance & Growth',
      items: [
        { name: 'Fare & Surge Rules', href: '/admin/fares', icon: CircleDollarSign },
        { name: 'Coupons & Promos', href: '/admin/coupons', icon: Tag },
        { name: 'Finance & Payouts', href: '/admin/finance', icon: CreditCard },
        { name: 'Reports & Analytics', href: '/admin/reports', icon: FileBarChart },
      ],
    },
    {
      title: 'System & Support',
      items: [
        { name: 'Notifications', href: '/admin/notifications', icon: Bell },
        { name: 'Support Tickets', href: '/admin/support', icon: Headphones },
        { name: 'Team & RBAC', href: '/admin/admin-users', icon: ShieldCheck },
        { name: 'Settings', href: '/admin/settings', icon: Settings },
        { name: 'Audit Logs', href: '/admin/audit-logs', icon: History },
      ],
    },
  ];

  const handleNavClick = () => {
    if (isMobileOpen) {
      onCloseMobile();
    }
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          className="lg:hidden fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-40 transition-opacity animate-in fade-in"
        />
      )}

      <aside
        className={cn(
          'app-sidebar flex flex-col justify-between transition-all duration-300 select-none z-50',
          // Desktop sizing
          'hidden lg:flex',
          isCollapsed ? 'w-20' : 'w-64',
          // Mobile Slide-over Drawer
          isMobileOpen && '!flex fixed inset-y-0 left-0 w-72 max-w-[85vw] shadow-2xl bg-white dark:bg-slate-950'
        )}
      >
        {/* Brand Header */}
        <div>
          <div className="h-16 px-4 border-b border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between">
            {(!isCollapsed || isMobileOpen) ? (
              <NavLink
                to="/admin/dashboard"
                onClick={handleNavClick}
                className="flex items-center focus:outline-none group py-1"
              >
                <img
                  src="/ridenload_horizontal_logo.png"
                  alt="RideNLoad"
                  className="h-10 sm:h-11 w-auto max-w-[210px] object-contain transition-transform duration-200 group-hover:scale-102 dark:bg-white dark:py-1 dark:px-2.5 dark:rounded-xl"
                />
              </NavLink>
            ) : (
              <NavLink
                to="/admin/dashboard"
                className="mx-auto group focus:outline-none flex items-center justify-center"
                title="RideNLoad Admin"
              >
                <div className="w-10 h-10 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/90 dark:border-slate-800 flex items-center justify-center p-1.5 shadow-xs group-hover:border-[#0F4471] dark:group-hover:border-blue-400 group-hover:scale-105 transition-all">
                  <img
                    src="/ridenload_icon.png"
                    alt="RideNLoad"
                    className="w-full h-full object-contain rounded-lg"
                  />
                </div>
              </NavLink>
            )}

            {/* Mobile Close Button */}
            {isMobileOpen && (
              <button
                onClick={onCloseMobile}
                className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Navigation Sections */}
          <nav className="p-2.5 space-y-3.5 overflow-y-auto max-h-[calc(100vh-125px)]">
            {navSections.map((section) => {
              const filteredItems = section.items.filter((item) => {
                if (!item.permission) return true;
                return hasPermission(item.permission);
              });

              if (filteredItems.length === 0) return null;

              return (
                <div key={section.title} className="space-y-0.5">
                  {(!isCollapsed || isMobileOpen) && (
                    <p className="px-2.5 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">
                      {section.title}
                    </p>
                  )}

                  {filteredItems.map((item) => {
                    const isActive = location.pathname.startsWith(item.href);
                    const Icon = item.icon;

                    return (
                      <NavLink
                        key={item.name}
                        to={item.href}
                        onClick={handleNavClick}
                        className={cn(
                          'sidebar-nav-item flex items-center rounded-xl text-xs font-semibold transition-all duration-200 group relative',
                          isCollapsed && !isMobileOpen ? 'justify-center w-11 h-10 mx-auto px-0' : 'gap-3 px-3 py-2.5',
                          isActive
                            ? 'bg-[#0F4471] text-white shadow-md shadow-[#0F4471]/25 font-bold'
                            : 'text-slate-600 dark:text-slate-300 hover:text-[#0F4471] dark:hover:text-white hover:bg-blue-50/70 dark:hover:bg-slate-800/60'
                        )}
                        title={isCollapsed && !isMobileOpen ? item.name : undefined}
                      >
                        <Icon
                          className={cn(
                            'w-4 h-4 shrink-0 transition-transform duration-200 group-hover:scale-110',
                            isActive ? 'text-white' : 'text-slate-400 dark:text-slate-400 group-hover:text-[#0F4471] dark:group-hover:text-blue-300'
                          )}
                        />

                        {(!isCollapsed || isMobileOpen) && (
                          <div className="flex-1 flex items-center justify-between truncate">
                            <span className="truncate">{item.name}</span>
                            {item.badge && (
                              <span
                                className={cn(
                                  'text-[9px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider',
                                  isActive
                                    ? 'bg-white/20 text-white'
                                    : 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                                )}
                              >
                                {item.badge}
                              </span>
                            )}
                          </div>
                        )}

                        {/* Active Indicator dot */}
                        {isActive && (!isCollapsed || isMobileOpen) && (
                          <span className="w-1.5 h-1.5 rounded-full bg-white ml-auto shrink-0 shadow-xs" />
                        )}
                      </NavLink>
                    );
                  })}
                </div>
              );
            })}
          </nav>
        </div>

        {/* Footer Compact Banner */}
        {(!isCollapsed || isMobileOpen) ? (
          <div className="p-3 m-2.5 rounded-2xl bg-gradient-to-br from-blue-50/90 to-slate-50/90 dark:from-slate-900/90 dark:to-slate-900/50 border border-blue-100/90 dark:border-slate-800/90 flex flex-col gap-1.5 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200">
                  RideNLoad Dispatch
                </span>
              </div>
              <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-[#0F4471] dark:text-blue-300 border border-blue-200/60 dark:border-blue-900">
                PRO
              </span>
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
              Intercity Taxi & Freight Platform
            </p>
          </div>
        ) : (
          <div className="p-3 flex justify-center" title="RideNLoad Dispatch Enterprise (Active)">
            <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-slate-900 border border-blue-100 dark:border-slate-800 flex items-center justify-center">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
          </div>
        )}
      </aside>
    </>
  );
};
