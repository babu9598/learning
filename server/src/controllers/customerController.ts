import { Request, Response } from 'express';
import { Customer } from '../models/Customer';
import { CustomerService } from '../services/customerService';
import { BookingService } from '../services/bookingService';
import { FareService } from '../services/fareService';
import { AuthenticatedRequest } from '../middleware/auth';
import { logAuditEvent } from '../middleware/auditLogger';
import { AuditAction, AuditModule } from '../config/constants';
import { successResponse, errorResponse } from '../utils/response';

export class CustomerController {
  static async getCustomers(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const result = await CustomerService.getCustomers(req.query as any);
      successResponse(res, result.customers, 'Customers fetched', 200, result.meta);
    } catch (error: any) {
      errorResponse(res, error.message);
    }
  }

  static async getCustomerById(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const id = String(req.params.id);
      const result = await CustomerService.getCustomerById(id);
      successResponse(res, result, 'Customer profile fetched');
    } catch (error: any) {
      errorResponse(res, error.message, 404);
    }
  }

  static async updateStatus(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const id = String(req.params.id);
      const { status } = req.body;
      const customer = await CustomerService.updateStatus(id, status);
      await logAuditEvent(req, {
        module: AuditModule.CUSTOMERS,
        action: status === 'BLOCKED' ? AuditAction.BLOCK : AuditAction.UNBLOCK,
        recordId: customer._id.toString(),
        targetModel: 'Customer',
        newValue: { status },
        description: `Updated customer status for ${customer.name} to ${status}`,
      });
      successResponse(res, customer, `Customer status updated to ${status}`);
    } catch (error: any) {
      errorResponse(res, error.message);
    }
  }
}

export class BookingController {
  static async getBookings(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const result = await BookingService.getBookings(req.query as any);
      successResponse(res, result.bookings, 'Bookings fetched', 200, result.meta);
    } catch (error: any) {
      errorResponse(res, error.message);
    }
  }

  static async getBookingById(req: Request, res: Response): Promise<void> {
    try {
      const id = String(req.params.id);
      const result = await BookingService.getBookingById(id);
      successResponse(res, result, 'Booking details fetched');
    } catch (error: any) {
      errorResponse(res, error.message, 404);
    }
  }

  static async createBooking(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const booking = await BookingService.createBooking(req.body);
      await logAuditEvent(req, {
        module: AuditModule.BOOKINGS,
        action: AuditAction.CREATE,
        recordId: booking._id.toString(),
        targetModel: 'Booking',
        newValue: booking,
        description: `Created booking ${booking.bookingId}`,
      });
      successResponse(res, booking, 'Booking created successfully', 201);
    } catch (error: any) {
      errorResponse(res, error.message);
    }
  }

  /**
   * Mobile Customer direct booking endpoint
   */
  static async customerBook(req: Request, res: Response): Promise<void> {
    try {
      const { mobile, customerName, ...bookingPayload } = req.body;
      let customerId = bookingPayload.customerId;

      if (!customerId && mobile) {
        const result = await CustomerService.getCustomers({ search: mobile, limit: 1 });
        if (result && result.customers && result.customers.length > 0) {
          customerId = result.customers[0]._id;
        } else {
          const newCust = await Customer.create({
            customerId: `CUST-${Date.now().toString().slice(-4)}`,
            name: customerName || 'Valued Customer',
            mobile: mobile.replace(/\D/g, '').slice(-10),
            email: `cust_${mobile.replace(/\D/g, '').slice(-10)}@droptaxi.com`,
          });
          customerId = newCust._id;
        }
      }

      const booking = await BookingService.createBooking({
        ...bookingPayload,
        customerId,
      });

      successResponse(res, booking, 'Booking created successfully', 201);
    } catch (error: any) {
      errorResponse(res, error.message, 500);
    }
  }

  static async getDriverTrips(req: Request, res: Response): Promise<void> {
    try {
      const driverId = String(req.params.driverId);
      const result = await BookingService.getDriverTrips(driverId);
      successResponse(res, result, 'Driver trips fetched');
    } catch (error: any) {
      errorResponse(res, error.message, 500);
    }
  }

  static async acceptTrip(req: Request, res: Response): Promise<void> {
    try {
      const id = String(req.params.id);
      const { driverId } = req.body;
      const booking = await BookingService.acceptTrip(id, driverId);
      successResponse(res, booking, 'Trip accepted successfully');
    } catch (error: any) {
      errorResponse(res, error.message, 500);
    }
  }

  static async startTrip(req: Request, res: Response): Promise<void> {
    try {
      const id = String(req.params.id);
      const booking = await BookingService.startTrip(id);
      successResponse(res, booking, 'Trip started successfully');
    } catch (error: any) {
      errorResponse(res, error.message, 500);
    }
  }

  static async completeTrip(req: Request, res: Response): Promise<void> {
    try {
      const id = String(req.params.id);
      const { otp, actualToll, driverBata, actualDistanceKm } = req.body;
      const booking = await BookingService.completeTrip(id, {
        otp,
        actualToll: actualToll !== undefined ? Number(actualToll) : undefined,
        driverBata: driverBata !== undefined ? Number(driverBata) : undefined,
        actualDistanceKm: actualDistanceKm !== undefined ? Number(actualDistanceKm) : undefined,
      });
      successResponse(res, booking, 'Trip completed successfully with final price locked');
    } catch (error: any) {
      errorResponse(res, error.message, 500);
    }
  }

  static async updateStatus(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const id = String(req.params.id);
      const {
        status,
        driverId,
        note,
        cancellationReason,
        cancelledBy,
        actualToll,
        driverBata,
        actualDistanceKm,
      } = req.body;
      const booking = await BookingService.updateStatus(id, status, {
        driverId,
        note,
        cancellationReason,
        cancelledBy,
        actualToll: actualToll !== undefined ? Number(actualToll) : undefined,
        driverBata: driverBata !== undefined ? Number(driverBata) : undefined,
        actualDistanceKm: actualDistanceKm !== undefined ? Number(actualDistanceKm) : undefined,
      });

      await logAuditEvent(req, {
        module: AuditModule.BOOKINGS,
        action: AuditAction.STATUS_CHANGE,
        recordId: booking._id.toString(),
        targetModel: 'Booking',
        newValue: { status, driverId, note, cancellationReason, actualToll, driverBata },
        description: `Updated booking ${booking.bookingId} status to ${status}`,
      });

      successResponse(res, booking, `Booking status updated to ${status}`);
    } catch (error: any) {
      errorResponse(res, error.message);
    }
  }

  static async calculateFarePreview(req: Request, res: Response): Promise<void> {
    try {
      const preview = await FareService.calculateFare(req.body);
      successResponse(res, preview, 'Fare calculated successfully');
    } catch (error: any) {
      errorResponse(res, error.message);
    }
  }
}

export class FareController {
  static async getFareRules(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const rules = await FareService.getFareRules();
      successResponse(res, rules, 'Fare rules fetched');
    } catch (error: any) {
      errorResponse(res, error.message);
    }
  }

  static async getPublicFareRules(req: Request, res: Response): Promise<void> {
    try {
      const rules = await FareService.getPublicFareRules();
      successResponse(res, rules, 'Public fare rules fetched');
    } catch (error: any) {
      errorResponse(res, error.message);
    }
  }

  static async createFareRule(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const rule = await FareService.createFareRule(req.body);
      await logAuditEvent(req, {
        module: AuditModule.FARES,
        action: AuditAction.CREATE,
        recordId: rule._id.toString(),
        targetModel: 'FareRule',
        newValue: req.body,
        description: `Created fare rule for ${rule.category} (${rule.tripScope})`,
      });
      successResponse(res, rule, 'Fare rule created', 201);
    } catch (error: any) {
      errorResponse(res, error.message);
    }
  }

  static async updateFareRule(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const id = String(req.params.id);
      const rule = await FareService.updateFareRule(id, req.body);
      await logAuditEvent(req, {
        module: AuditModule.FARES,
        action: AuditAction.UPDATE,
        recordId: rule._id.toString(),
        targetModel: 'FareRule',
        newValue: req.body,
        description: `Updated fare rule for ${rule.category}`,
      });
      successResponse(res, rule, 'Fare rule updated');
    } catch (error: any) {
      errorResponse(res, error.message);
    }
  }

  static async deleteFareRule(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const id = String(req.params.id);
      await FareService.deleteFareRule(id);
      await logAuditEvent(req, {
        module: AuditModule.FARES,
        action: AuditAction.DELETE,
        recordId: id,
        targetModel: 'FareRule',
        description: `Deleted fare rule ${id}`,
      });
      successResponse(res, { success: true }, 'Fare rule deleted');
    } catch (error: any) {
      errorResponse(res, error.message);
    }
  }

  static async getSurgeRules(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const surges = await FareService.getSurgeRules();
      successResponse(res, surges, 'Surge rules fetched');
    } catch (error: any) {
      errorResponse(res, error.message);
    }
  }

  static async createSurgeRule(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const surge = await FareService.createSurgeRule(req.body);
      await logAuditEvent(req, {
        module: AuditModule.FARES,
        action: AuditAction.CREATE,
        recordId: surge._id.toString(),
        targetModel: 'SurgeRule',
        newValue: surge,
        description: `Created surge rule ${surge.zoneName} (${surge.multiplier}x)`,
      });
      successResponse(res, surge, 'Surge rule created', 201);
    } catch (error: any) {
      errorResponse(res, error.message);
    }
  }

  static async updateSurgeRule(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const id = String(req.params.id);
      const surge = await FareService.updateSurgeRule(id, req.body);
      await logAuditEvent(req, {
        module: AuditModule.FARES,
        action: AuditAction.UPDATE,
        recordId: surge._id.toString(),
        targetModel: 'SurgeRule',
        newValue: req.body,
        description: `Updated surge rule ${surge.zoneName}`,
      });
      successResponse(res, surge, 'Surge rule updated');
    } catch (error: any) {
      errorResponse(res, error.message);
    }
  }

  static async deleteSurgeRule(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const id = String(req.params.id);
      await FareService.deleteSurgeRule(id);
      await logAuditEvent(req, {
        module: AuditModule.FARES,
        action: AuditAction.DELETE,
        recordId: id,
        targetModel: 'SurgeRule',
        description: `Deleted surge rule ${id}`,
      });
      successResponse(res, { success: true }, 'Surge rule deleted');
    } catch (error: any) {
      errorResponse(res, error.message);
    }
  }
}
