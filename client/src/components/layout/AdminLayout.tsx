import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { MobileBottomNav } from './MobileBottomNav';
import { QuickActionsModal } from './QuickActions';

export const AdminLayout: React.FC = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-cloudy-50 dark:bg-darkbg-950 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200">
      {/* Collapsible / Slide-over Sidebar */}
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        isMobileOpen={isMobileSidebarOpen}
        onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden min-w-0">
        <Header
          onToggleSidebar={() => {
            if (window.innerWidth < 1024) {
              setIsMobileSidebarOpen(!isMobileSidebarOpen);
            } else {
              setIsSidebarCollapsed(!isSidebarCollapsed);
            }
          }}
        />

        {/* Scrollable Page Body (with pb-20 on mobile to accommodate native bottom nav) */}
        <main className="flex-1 overflow-y-auto p-3.5 sm:p-5 lg:p-7 pb-20 md:pb-8 bg-cloudy-50/60 dark:bg-darkbg-950/60 transition-colors duration-200">
          <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Mobile Bottom Native Navigation Bar */}
      <MobileBottomNav onOpenMobileMenu={() => setIsMobileSidebarOpen(true)} />
    </div>
  );
};
