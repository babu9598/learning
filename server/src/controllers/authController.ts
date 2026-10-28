import { Request, Response } from 'express';
import { AuthService } from '../services/authService';
import { DashboardService } from '../services/dashboardService';
import { AuthenticatedRequest } from '../middleware/auth';
import { logAuditEvent } from '../middleware/auditLogger';
import { AuditAction, AuditModule } from '../config/constants';
import { successResponse, errorResponse } from '../utils/response';

export class AuthController {
  static async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      const result = await AuthService.login(email, password);

      await logAuditEvent(req as AuthenticatedRequest, {
        module: AuditModule.AUTH,
        action: AuditAction.CREATE,
        description: `Admin login successful for ${email}`,
      });

      successResponse(res, result, 'Login successful');
    } catch (error: any) {
      errorResponse(res, error.message, 401, 'Authentication failed');
    }
  }

  static async customerLogin(req: Request, res: Response): Promise<void> {
    try {
      const { mobile, name, email } = req.body;
      if (!mobile) {
        errorResponse(res, 'Mobile number is required', 400);
        return;
      }
      const result = await AuthService.customerLogin(mobile, name, email);
      successResponse(res, result, 'Customer login verified');
    } catch (error: any) {
      errorResponse(res, error.message, 500);
    }
  }

  static async driverLogin(req: Request, res: Response): Promise<void> {
    try {
      const { mobile } = req.body;
      if (!mobile) {
        errorResponse(res, 'Mobile number is required', 400);
        return;
      }
      const result = await AuthService.driverLogin(mobile);
      successResponse(res, result, 'Driver login verified');
    } catch (error: any) {
      errorResponse(res, error.message, 500);
    }
  }

  static async driverRegister(req: Request, res: Response): Promise<void> {
    try {
      const { name, mobile } = req.body;
      if (!name || !mobile) {
        errorResponse(res, 'Name and mobile number are required', 400);
        return;
      }
      const result = await AuthService.driverRegister(req.body);
      successResponse(res, result, result.message || 'Driver registered successfully', 201);
    } catch (error: any) {
      errorResponse(res, error.message, 500);
    }
  }

  static async getMe(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        errorResponse(res, 'User not authenticated', 401);
        return;
      }
      const user = await AuthService.getProfile(req.user._id.toString());
      successResponse(res, user, 'Profile fetched successfully');
    } catch (error: any) {
      errorResponse(res, error.message, 400);
    }
  }
}

export class DashboardController {
  static async getKpis(req: Request, res: Response): Promise<void> {
    try {
      const period = (req.query.period as string) || 'today';
      const startDate = req.query.startDate as string;
      const endDate = req.query.endDate as string;
      const data = await DashboardService.getKpiMetrics(period, startDate, endDate);
      successResponse(res, data, 'Dashboard KPIs fetched successfully');
    } catch (error: any) {
      errorResponse(res, error.message, 500);
    }
  }

  static async getBookingAnalytics(req: Request, res: Response): Promise<void> {
    try {
      const timeframe = (req.query.timeframe as any) || (req.query.period as any) || 'today';
      const startDate = req.query.startDate as string;
      const endDate = req.query.endDate as string;
      const data = await DashboardService.getBookingAnalytics(timeframe, startDate, endDate);
      successResponse(res, data, 'Booking analytics fetched');
    } catch (error: any) {
      errorResponse(res, error.message, 500);
    }
  }

  static async getRevenueAnalytics(req: Request, res: Response): Promise<void> {
    try {
      const timeframe = (req.query.timeframe as string) || (req.query.period as string) || 'today';
      const startDate = req.query.startDate as string;
      const endDate = req.query.endDate as string;
      const days = req.query.days ? parseInt(req.query.days as string, 10) : undefined;
      const data = await DashboardService.getRevenueAnalytics(days || timeframe, startDate, endDate);
      successResponse(res, data, 'Revenue analytics fetched');
    } catch (error: any) {
      errorResponse(res, error.message, 500);
    }
  }

  static async getStatusDistribution(req: Request, res: Response): Promise<void> {
    try {
      const period = (req.query.period as string) || (req.query.timeframe as string) || 'today';
      const startDate = req.query.startDate as string;
      const endDate = req.query.endDate as string;
      const data = await DashboardService.getBookingStatusDistribution(period, startDate, endDate);
      successResponse(res, data, 'Booking status distribution fetched');
    } catch (error: any) {
      errorResponse(res, error.message, 500);
    }
  }

  static async getVehicleCategoryUsage(req: Request, res: Response): Promise<void> {
    try {
      const period = (req.query.period as string) || (req.query.timeframe as string) || 'today';
      const startDate = req.query.startDate as string;
      const endDate = req.query.endDate as string;
      const data = await DashboardService.getVehicleCategoryAnalytics(period, startDate, endDate);
      successResponse(res, data, 'Vehicle category usage fetched');
    } catch (error: any) {
      errorResponse(res, error.message, 500);
    }
  }

  static async getCustomerGrowth(req: Request, res: Response): Promise<void> {
    try {
      const days = parseInt(req.query.days as string, 10) || 14;
      const data = await DashboardService.getCustomerAnalytics(days);
      successResponse(res, data, 'Customer analytics fetched');
    } catch (error: any) {
      errorResponse(res, error.message, 500);
    }
  }
}
