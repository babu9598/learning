import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AdminLayout } from '../components/layout/AdminLayout';
import { LandingPage } from '../pages/LandingPage';
import { LoginPage } from '../pages/LoginPage';
import { DriverRegisterPage } from '../pages/DriverRegisterPage';
import { DashboardPage } from '../pages/DashboardPage';
import { DriversPage } from '../pages/DriversPage';
import { VehiclesPage } from '../pages/VehiclesPage';
import { VehicleTypesPage } from '../pages/VehicleTypesPage';
import { CustomersPage } from '../pages/CustomersPage';
import { BookingsPage } from '../pages/BookingsPage';
import { FaresPage } from '../pages/FaresPage';
import { CouponsPage } from '../pages/CouponsPage';
import { FinancePage } from '../pages/FinancePage';
import { FleetTrackingPage } from '../pages/FleetTrackingPage';
import { ReportsPage } from '../pages/ReportsPage';
import { NotificationsPage } from '../pages/NotificationsPage';
import { SupportPage } from '../pages/SupportPage';
import { AdminUsersPage } from '../pages/AdminUsersPage';
import { SettingsPage } from '../pages/SettingsPage';
import { AuditLogsPage } from '../pages/AuditLogsPage';

const ProtectedRoute: React.FC<{ children: React.ReactNode; requiredPermission?: string }> = ({
  children,
  requiredPermission,
}) => {
  const { token, isLoading, hasPermission } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">
        Authenticating session...
      </div>
    );
  }

  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }

  if (requiredPermission && !hasPermission(requiredPermission)) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <>{children}</>;
};

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* 1. Public Landing & Mobile App Redirection Hub (NO AUTH REQUIRED) */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/home" element={<LandingPage />} />
      <Route path="/apps" element={<LandingPage />} />
      <Route path="/landing" element={<LandingPage />} />

      {/* Driver Registration & 7 KYC Documents Onboarding Portal */}
      <Route path="/driver-register" element={<DriverRegisterPage />} />
      <Route path="/driver/register" element={<DriverRegisterPage />} />
      <Route path="/driver/onboarding" element={<DriverRegisterPage />} />

      {/* 2. Admin Authentication */}
      <Route path="/admin/login" element={<LoginPage />} />
      <Route path="/login" element={<Navigate to="/admin/login" replace />} />

      {/* 3. Protected Admin Operations & Fleet Console under /admin/* */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="tracking" element={<FleetTrackingPage />} />
        <Route path="drivers" element={<DriversPage />} />
        <Route path="vehicles" element={<VehiclesPage />} />
        <Route path="vehicle-types" element={<VehicleTypesPage />} />
        <Route path="customers" element={<CustomersPage />} />
        <Route path="bookings" element={<BookingsPage />} />
        <Route path="fares" element={<FaresPage />} />
        <Route path="coupons" element={<CouponsPage />} />
        <Route path="finance" element={<FinancePage />} />
        <Route path="reports" element={<ReportsPage />} />
        <Route path="notifications" element={<NotificationsPage />} />
        <Route path="support" element={<SupportPage />} />
        <Route path="admin-users" element={<AdminUsersPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="audit-logs" element={<AuditLogsPage />} />
      </Route>

      {/* 4. Backward Compatibility Aliases for direct legacy paths */}
      <Route path="/dashboard" element={<Navigate to="/admin/dashboard" replace />} />
      <Route path="/tracking" element={<Navigate to="/admin/tracking" replace />} />
      <Route path="/drivers" element={<Navigate to="/admin/drivers" replace />} />
      <Route path="/vehicles" element={<Navigate to="/admin/vehicles" replace />} />
      <Route path="/customers" element={<Navigate to="/admin/customers" replace />} />
      <Route path="/bookings" element={<Navigate to="/admin/bookings" replace />} />
      <Route path="/fares" element={<Navigate to="/admin/fares" replace />} />
      <Route path="/coupons" element={<Navigate to="/admin/coupons" replace />} />
      <Route path="/finance" element={<Navigate to="/admin/finance" replace />} />
      <Route path="/reports" element={<Navigate to="/admin/reports" replace />} />
      <Route path="/notifications" element={<Navigate to="/admin/notifications" replace />} />
      <Route path="/support" element={<Navigate to="/admin/support" replace />} />
      <Route path="/admin-users" element={<Navigate to="/admin/admin-users" replace />} />
      <Route path="/settings" element={<Navigate to="/admin/settings" replace />} />
      <Route path="/audit-logs" element={<Navigate to="/admin/audit-logs" replace />} />

      {/* 5. Catch all fallback to Public Landing Page */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
