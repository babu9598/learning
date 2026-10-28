import { Response } from 'express';
import { TrackingService } from '../services/trackingService';
import { ReportService } from '../services/reportService';
import { AuthenticatedRequest } from '../middleware/auth';
import { successResponse, errorResponse } from '../utils/response';

export class TrackingController {
  static async getLiveFleet(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { serviceType, status } = req.query;
      const data = await TrackingService.getLiveFleet(serviceType as string, status as string);
      successResponse(res, data, 'Live fleet positions fetched');
    } catch (error: any) {
      errorResponse(res, error.message);
    }
  }

  static async updateDriverLocation(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { driverId, lat, lng, heading, speed, address } = req.body;
      const driver = await TrackingService.updateDriverLocation(
        driverId,
        lat,
        lng,
        heading,
        speed,
        address
      );
      successResponse(res, driver, 'Driver location updated');
    } catch (error: any) {
      errorResponse(res, error.message);
    }
  }
}

export class ReportController {
  static async getBookingReport(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { startDate, endDate } = req.query;
      const report = await ReportService.getBookingReport(startDate as string, endDate as string);
      successResponse(res, report, 'Booking report generated');
    } catch (error: any) {
      errorResponse(res, error.message);
    }
  }

  static async getRevenueReport(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { startDate, endDate } = req.query;
      const report = await ReportService.getRevenueReport(startDate as string, endDate as string);
      successResponse(res, report, 'Revenue report generated');
    } catch (error: any) {
      errorResponse(res, error.message);
    }
  }

  static async getDriverReport(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const report = await ReportService.getDriverReport();
      successResponse(res, report, 'Driver performance report generated');
    } catch (error: any) {
      errorResponse(res, error.message);
    }
  }

  static async getVehicleReport(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const report = await ReportService.getVehicleReport();
      successResponse(res, report, 'Vehicle fleet report generated');
    } catch (error: any) {
      errorResponse(res, error.message);
    }
  }
}
