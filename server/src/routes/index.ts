import { Router } from 'express';
import { authRouter, dashboardRouter, driverRouter, vehicleRouter } from './driverRoutes';
import { vehicleTypeRouter } from './vehicleTypeRoutes';
import {
  customerRouter,
  bookingRouter,
  fareRouter,
  couponRouter,
  financeRouter,
  trackingRouter,
  reportRouter,
  notificationRouter,
  supportRouter,
  adminUserRouter,
  settingsRouter,
  auditLogRouter,
  paymentRouter,
  webhookRouter,
} from './apiRouters';
import { googleMapsRouter } from './googleMapsRoutes';
import { uploadRouter } from './uploadRoutes';

export const apiRouter = Router();

apiRouter.use('/auth', authRouter);
apiRouter.use('/upload', uploadRouter);
apiRouter.use('/dashboard', dashboardRouter);
apiRouter.use('/drivers', driverRouter);
apiRouter.use('/vehicles', vehicleRouter);
apiRouter.use('/vehicle-types', vehicleTypeRouter);
apiRouter.use('/customers', customerRouter);
apiRouter.use('/bookings', bookingRouter);
apiRouter.use('/fares', fareRouter);
apiRouter.use('/coupons', couponRouter);
apiRouter.use('/finance', financeRouter);
apiRouter.use('/payments', paymentRouter);
apiRouter.use('/webhooks', webhookRouter);
apiRouter.use('/tracking', trackingRouter);
apiRouter.use('/maps', googleMapsRouter);
apiRouter.use('/reports', reportRouter);
apiRouter.use('/notifications', notificationRouter);
apiRouter.use('/support', supportRouter);
apiRouter.use('/admin-users', adminUserRouter);
apiRouter.use('/settings', settingsRouter);
apiRouter.use('/audit-logs', auditLogRouter);

apiRouter.get('/health', (req, res) => {
  res.json({ status: 'ok', time: new Date(), service: 'DropTaxi & Goods Truck API' });
});
