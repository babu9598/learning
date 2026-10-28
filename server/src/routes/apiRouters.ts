import { Router } from 'express';
import { CustomerController, BookingController, FareController } from '../controllers/customerController';
import { CouponController, FinanceController } from '../controllers/financeController';
import { TrackingController, ReportController } from '../controllers/reportController';
import { NotificationController, SupportController } from '../controllers/supportController';
import { AdminUserController, SettingsController, AuditLogController } from '../controllers/settingsController';
import { PaymentController } from '../controllers/paymentController';
import { WebhookController } from '../controllers/webhookController';
import { authenticate } from '../middleware/auth';
import { requirePermission } from '../middleware/rbac';
import { Permission } from '../config/constants';
import { validateRequest } from '../middleware/validate';
import {
  createBookingSchema,
  updateBookingStatusSchema,
  calculateFarePreviewSchema,
} from '../validators/bookingValidator';
import { updateFareRuleSchema, createFareRuleSchema, createSurgeRuleSchema } from '../validators/fareValidator';
import { createCouponSchema, updateCouponSchema } from '../validators/couponValidator';
import { processPayoutSchema, generatePayoutBatchSchema } from '../validators/payoutValidator';
import { createAdminUserSchema, updateAdminUserSchema } from '../validators/authValidator';

// Customer Routes
export const customerRouter = Router();
customerRouter.use(authenticate);
customerRouter.get('/', requirePermission(Permission.CUSTOMERS_VIEW), CustomerController.getCustomers);
customerRouter.get('/:id', requirePermission(Permission.CUSTOMERS_VIEW), CustomerController.getCustomerById);
customerRouter.patch('/:id/status', requirePermission(Permission.CUSTOMERS_BLOCK), CustomerController.updateStatus);

// Booking Routes
export const bookingRouter = Router();

// Public / Mobile Client Endpoints
bookingRouter.post('/calculate-fare', BookingController.calculateFarePreview);
bookingRouter.post('/customer-book', BookingController.customerBook);
bookingRouter.get('/public/:id', BookingController.getBookingById);
bookingRouter.get('/driver/:driverId/trips', BookingController.getDriverTrips);
bookingRouter.post('/:id/accept', BookingController.acceptTrip);
bookingRouter.post('/:id/start', BookingController.startTrip);
bookingRouter.post('/:id/complete', BookingController.completeTrip);

// Admin-Protected Endpoints
bookingRouter.get('/', authenticate, requirePermission(Permission.BOOKINGS_VIEW), BookingController.getBookings);
bookingRouter.get('/:id', authenticate, requirePermission(Permission.BOOKINGS_VIEW), BookingController.getBookingById);
bookingRouter.post(
  '/',
  authenticate,
  requirePermission(Permission.BOOKINGS_CREATE),
  validateRequest(createBookingSchema),
  BookingController.createBooking
);
bookingRouter.patch(
  '/:id/status',
  authenticate,
  requirePermission(Permission.BOOKINGS_EDIT),
  validateRequest(updateBookingStatusSchema),
  BookingController.updateStatus
);

// Fare Routes
export const fareRouter = Router();
fareRouter.get('/public-rules', FareController.getPublicFareRules);
fareRouter.post('/calculate', BookingController.calculateFarePreview);
fareRouter.get('/rules', authenticate, requirePermission(Permission.FARES_VIEW), FareController.getFareRules);
fareRouter.post(
  '/rules',
  authenticate,
  requirePermission(Permission.FARES_MANAGE),
  validateRequest(createFareRuleSchema),
  FareController.createFareRule
);
fareRouter.put(
  '/rules/:id',
  authenticate,
  requirePermission(Permission.FARES_MANAGE),
  validateRequest(updateFareRuleSchema),
  FareController.updateFareRule
);
fareRouter.delete(
  '/rules/:id',
  authenticate,
  requirePermission(Permission.FARES_MANAGE),
  FareController.deleteFareRule
);
fareRouter.get('/surges', requirePermission(Permission.FARES_VIEW), FareController.getSurgeRules);
fareRouter.post(
  '/surges',
  requirePermission(Permission.FARES_MANAGE),
  validateRequest(createSurgeRuleSchema),
  FareController.createSurgeRule
);
fareRouter.put(
  '/surges/:id',
  requirePermission(Permission.FARES_MANAGE),
  validateRequest(createSurgeRuleSchema),
  FareController.updateSurgeRule
);
fareRouter.delete('/surges/:id', requirePermission(Permission.FARES_MANAGE), FareController.deleteSurgeRule);

// Coupon Routes
export const couponRouter = Router();
couponRouter.use(authenticate);
couponRouter.get('/', requirePermission(Permission.COUPONS_VIEW), CouponController.getCoupons);
couponRouter.post(
  '/',
  requirePermission(Permission.COUPONS_MANAGE),
  validateRequest(createCouponSchema),
  CouponController.createCoupon
);
couponRouter.put(
  '/:id',
  requirePermission(Permission.COUPONS_MANAGE),
  validateRequest(updateCouponSchema),
  CouponController.updateCoupon
);
couponRouter.delete('/:id', requirePermission(Permission.COUPONS_MANAGE), CouponController.deleteCoupon);
couponRouter.post('/validate', CouponController.validateCoupon);

// Finance Routes
export const financeRouter = Router();
financeRouter.use(authenticate);
financeRouter.get('/transactions', requirePermission(Permission.FINANCE_VIEW), FinanceController.getTransactions);
financeRouter.get('/payouts', requirePermission(Permission.FINANCE_VIEW), FinanceController.getPayouts);
financeRouter.post(
  '/payouts/batch',
  requirePermission(Permission.PAYOUTS_MANAGE),
  validateRequest(generatePayoutBatchSchema),
  FinanceController.generatePayoutBatch
);
financeRouter.patch(
  '/payouts/:id',
  requirePermission(Permission.PAYOUTS_MANAGE),
  validateRequest(processPayoutSchema),
  FinanceController.processPayout
);
financeRouter.get('/commissions', requirePermission(Permission.FINANCE_VIEW), FinanceController.getCommissionRules);
financeRouter.put(
  '/commissions/:id',
  requirePermission(Permission.COMMISSIONS_MANAGE),
  FinanceController.updateCommissionRule
);

// Tracking Routes
export const trackingRouter = Router();
trackingRouter.use(authenticate);
trackingRouter.get('/fleet', requirePermission(Permission.TRACKING_VIEW), TrackingController.getLiveFleet);
trackingRouter.post('/location', TrackingController.updateDriverLocation);

// Report Routes
export const reportRouter = Router();
reportRouter.use(authenticate);
reportRouter.get('/bookings', requirePermission(Permission.REPORTS_VIEW), ReportController.getBookingReport);
reportRouter.get('/revenue', requirePermission(Permission.REPORTS_VIEW), ReportController.getRevenueReport);
reportRouter.get('/drivers', requirePermission(Permission.REPORTS_VIEW), ReportController.getDriverReport);
reportRouter.get('/vehicles', requirePermission(Permission.REPORTS_VIEW), ReportController.getVehicleReport);

// Notification Routes
export const notificationRouter = Router();
notificationRouter.use(authenticate);
notificationRouter.get('/', requirePermission(Permission.NOTIFICATIONS_VIEW), NotificationController.getNotifications);
notificationRouter.post(
  '/send',
  requirePermission(Permission.NOTIFICATIONS_SEND),
  NotificationController.sendBroadcast
);
notificationRouter.get('/templates', requirePermission(Permission.NOTIFICATIONS_VIEW), NotificationController.getTemplates);
notificationRouter.post('/templates', requirePermission(Permission.NOTIFICATIONS_SEND), NotificationController.createTemplate);
notificationRouter.put('/templates/:id', requirePermission(Permission.NOTIFICATIONS_SEND), NotificationController.updateTemplate);
notificationRouter.delete('/templates/:id', requirePermission(Permission.NOTIFICATIONS_SEND), NotificationController.deleteTemplate);

// Support Routes
export const supportRouter = Router();
supportRouter.use(authenticate);
supportRouter.get('/tickets', requirePermission(Permission.SUPPORT_VIEW), SupportController.getTickets);
supportRouter.get('/tickets/:id', requirePermission(Permission.SUPPORT_VIEW), SupportController.getTicketById);
supportRouter.post('/tickets', SupportController.createTicket);
supportRouter.post('/tickets/:id/messages', SupportController.addMessage);
supportRouter.patch(
  '/tickets/:id/status',
  requirePermission(Permission.SUPPORT_MANAGE),
  SupportController.updateStatus
);

// Admin User Routes
export const adminUserRouter = Router();
adminUserRouter.use(authenticate);
adminUserRouter.get('/', requirePermission(Permission.ADMIN_USERS_MANAGE), AdminUserController.getAdminUsers);
adminUserRouter.get('/roles', requirePermission(Permission.ADMIN_USERS_MANAGE), AdminUserController.getRoles);
adminUserRouter.post(
  '/',
  requirePermission(Permission.ADMIN_USERS_MANAGE),
  validateRequest(createAdminUserSchema),
  AdminUserController.createAdminUser
);
adminUserRouter.put(
  '/:id',
  requirePermission(Permission.ADMIN_USERS_MANAGE),
  validateRequest(updateAdminUserSchema),
  AdminUserController.updateAdminUser
);
adminUserRouter.put(
  '/roles/:id/permissions',
  requirePermission(Permission.ADMIN_USERS_MANAGE),
  AdminUserController.updateRolePermissions
);

// Settings Routes
export const settingsRouter = Router();
settingsRouter.use(authenticate);
settingsRouter.get('/', requirePermission(Permission.SETTINGS_MANAGE), SettingsController.getSettings);
settingsRouter.put('/', requirePermission(Permission.SETTINGS_MANAGE), SettingsController.updateSettings);

// Audit Logs Routes
export const auditLogRouter = Router();
auditLogRouter.use(authenticate);
auditLogRouter.get('/', requirePermission(Permission.AUDIT_LOGS_VIEW), AuditLogController.getAuditLogs);

// Payment Routes (Mobile & Web)
export const paymentRouter = Router();
paymentRouter.post('/create-order', PaymentController.createOrder);
paymentRouter.post('/verify', PaymentController.verifyPayment);
paymentRouter.post('/wallet-pay', PaymentController.payWithWallet);
paymentRouter.post('/cash-confirm', PaymentController.confirmCashPayment);
paymentRouter.get('/history/:customerId', PaymentController.getCustomerPayments);

// Webhook Routes (External Gateways & Telematics)
export const webhookRouter = Router();
webhookRouter.post('/razorpay', WebhookController.handleRazorpayWebhook);
webhookRouter.post('/telematics', WebhookController.handleTelematicsWebhook);
webhookRouter.post('/sms', WebhookController.handleSmsWebhook);
