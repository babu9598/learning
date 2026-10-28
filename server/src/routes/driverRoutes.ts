import { Router } from 'express';
import { AuthController, DashboardController } from '../controllers/authController';
import { DriverController, VehicleController } from '../controllers/driverController';
import { authenticate } from '../middleware/auth';
import { requirePermission } from '../middleware/rbac';
import { Permission } from '../config/constants';
import { validateRequest } from '../middleware/validate';
import { loginSchema } from '../validators/authValidator';
import {
  createDriverSchema,
  updateDriverStatusSchema,
  assignVehicleSchema,
} from '../validators/driverValidator';
import { createVehicleSchema } from '../validators/vehicleValidator';

// Auth Routes
export const authRouter = Router();
authRouter.post('/login', validateRequest(loginSchema), AuthController.login);
authRouter.post('/customer-login', AuthController.customerLogin);
authRouter.post('/driver-login', AuthController.driverLogin);
authRouter.post('/driver-register', AuthController.driverRegister);
authRouter.get('/driver-status/:mobile', DriverController.getDriverStatusByMobile);
authRouter.get('/me', authenticate, AuthController.getMe);

// Dashboard Routes
export const dashboardRouter = Router();
dashboardRouter.use(authenticate);
dashboardRouter.get('/kpis', DashboardController.getKpis);
dashboardRouter.get('/bookings-analytics', DashboardController.getBookingAnalytics);
dashboardRouter.get('/revenue-analytics', DashboardController.getRevenueAnalytics);
dashboardRouter.get('/status-distribution', DashboardController.getStatusDistribution);
dashboardRouter.get('/vehicle-usage', DashboardController.getVehicleCategoryUsage);
dashboardRouter.get('/customer-growth', DashboardController.getCustomerGrowth);

// Driver Routes
export const driverRouter = Router();

// Public / Mobile driver status & lookup
driverRouter.patch('/:id/online-status', DriverController.updateOnlineStatus);
driverRouter.get('/public/profile/:id', DriverController.getDriverById);
driverRouter.get('/status/by-mobile/:mobile', DriverController.getDriverStatusByMobile);

// Admin-protected driver routes
driverRouter.get('/', authenticate, requirePermission(Permission.DRIVERS_VIEW), DriverController.getDrivers);
driverRouter.get('/:id', authenticate, requirePermission(Permission.DRIVERS_VIEW), DriverController.getDriverById);
driverRouter.post(
  '/',
  authenticate,
  requirePermission(Permission.DRIVERS_CREATE),
  validateRequest(createDriverSchema),
  DriverController.createDriver
);
driverRouter.put('/:id', authenticate, requirePermission(Permission.DRIVERS_EDIT), DriverController.updateDriver);
driverRouter.patch(
  '/:id/kyc',
  authenticate,
  requirePermission(Permission.DRIVERS_APPROVE),
  validateRequest(updateDriverStatusSchema),
  DriverController.updateKycStatus
);
driverRouter.post(
  '/:id/approve-all-kyc',
  authenticate,
  requirePermission(Permission.DRIVERS_APPROVE),
  DriverController.approveAllKycDocuments
);
driverRouter.post(
  '/:id/assign-vehicle',
  authenticate,
  requirePermission(Permission.DRIVERS_EDIT),
  validateRequest(assignVehicleSchema),
  DriverController.assignVehicle
);
driverRouter.post(
  '/:id/documents',
  authenticate,
  requirePermission(Permission.DRIVERS_EDIT),
  DriverController.addDocument
);
driverRouter.patch(
  '/:id/documents/:docId',
  authenticate,
  requirePermission(Permission.DRIVERS_APPROVE),
  DriverController.updateDocument
);

// Vehicle Routes
export const vehicleRouter = Router();
vehicleRouter.use(authenticate);
vehicleRouter.get('/', requirePermission(Permission.VEHICLES_VIEW), VehicleController.getVehicles);
vehicleRouter.get('/:id', requirePermission(Permission.VEHICLES_VIEW), VehicleController.getVehicleById);
vehicleRouter.post(
  '/',
  requirePermission(Permission.VEHICLES_CREATE),
  validateRequest(createVehicleSchema),
  VehicleController.createVehicle
);
vehicleRouter.put('/:id', requirePermission(Permission.VEHICLES_EDIT), VehicleController.updateVehicle);
vehicleRouter.delete('/:id', requirePermission(Permission.VEHICLES_DELETE), VehicleController.deleteVehicle);
