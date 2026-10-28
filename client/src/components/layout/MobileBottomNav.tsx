import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  CalendarCheck,
  Navigation,
  UserCheck,
  Menu,
} from 'lucide-react';
import { cn } from '../../utils/formatters';

interface MobileBottomNavProps {
  onOpenMobileMenu: () => void;
}

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<any>;
  isLive?: boolean;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ onOpenMobileMenu }) => {
  const location = useLocation();

  const navItems: NavItem[] = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Trips', href: '/admin/bookings', icon: CalendarCheck },
    // { name: 'Radar', href: '/admin/tracking', icon: Navigation, isLive: true }, // Hidden: can be re-enabled later
    { name: 'Drivers', href: '/admin/drivers', icon: UserCheck },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/90 dark:bg-slate-950/90 backdrop-blur-xl border-t border-cloudy-200 dark:border-slate-800/80 px-2 py-1.5 shadow-2xl safe-area-bottom">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const isActive = location.pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <NavLink
              key={item.name}
              to={item.href}
              className={cn(
                'flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all duration-200 relative min-w-[58px]',
                isActive
                  ? 'text-brand-600 dark:text-sky-400 font-bold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 font-medium'
              )}
            >
              {/* Active Indicator Top Pill */}
              {isActive && (
                <span className="absolute -top-1.5 w-6 h-1 rounded-full bg-brand-600 dark:bg-sky-400 shadow-sm" />
              )}

              <div className="relative">
                <Icon
                  className={cn(
                    'w-5 h-5 transition-transform duration-200',
                    isActive ? 'scale-110 stroke-[2.5]' : 'stroke-[1.8]'
                  )}
                />
                {item.isLive && (
                  <span className="absolute -top-0.5 -right-1 w-2 h-2 rounded-full bg-emerald-500 live-pulse ring-2 ring-white dark:ring-slate-950" />
                )}
              </div>

              <span className="text-[10px] mt-0.5 tracking-tight truncate max-w-[62px]">
                {item.name}
              </span>
            </NavLink>
          );
        })}

        {/* More / Menu Button to open slide-over drawer */}
        <button
          onClick={onOpenMobileMenu}
          className="flex flex-col items-center justify-center py-1 px-3 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 font-medium transition-all duration-200 min-w-[58px]"
        >
          <Menu className="w-5 h-5 stroke-[1.8]" />
          <span className="text-[10px] mt-0.5 tracking-tight">More</span>
        </button>
      </div>
    </nav>
  );
};
