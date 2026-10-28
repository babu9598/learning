import { Response } from 'express';
import { DriverService } from '../services/driverService';
import { VehicleService } from '../services/vehicleService';
import { AuthenticatedRequest } from '../middleware/auth';
import { logAuditEvent } from '../middleware/auditLogger';
import { AuditAction, AuditModule } from '../config/constants';
import { successResponse, errorResponse } from '../utils/response';

export class DriverController {
  static async getDrivers(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const result = await DriverService.getDrivers(req.query as any);
      successResponse(res, result.drivers, 'Drivers fetched', 200, result.meta);
    } catch (error: any) {
      errorResponse(res, error.message);
    }
  }

  static async getDriverById(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const id = String(req.params.id);
      const result = await DriverService.getDriverById(id);
      successResponse(res, result, 'Driver details fetched');
    } catch (error: any) {
      errorResponse(res, error.message, 404);
    }
  }

  static async createDriver(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const driver = await DriverService.createDriver(req.body);
      await logAuditEvent(req, {
        module: AuditModule.DRIVERS,
        action: AuditAction.CREATE,
        recordId: driver._id.toString(),
        targetModel: 'Driver',
        newValue: driver,
        description: `Created driver ${driver.name} (${driver.driverId})`,
      });
      successResponse(res, driver, 'Driver created successfully', 201);
    } catch (error: any) {
      errorResponse(res, error.message);
    }
  }

  static async updateDriver(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const id = String(req.params.id);
      const driver = await DriverService.updateDriver(id, req.body);
      await logAuditEvent(req, {
        module: AuditModule.DRIVERS,
        action: AuditAction.UPDATE,
        recordId: driver._id.toString(),
        targetModel: 'Driver',
        newValue: driver,
        description: `Updated driver ${driver.name}`,
      });
      successResponse(res, driver, 'Driver updated successfully');
    } catch (error: any) {
      errorResponse(res, error.message);
    }
  }

  static async updateKycStatus(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const id = String(req.params.id);
      const { kycStatus, rejectionReason } = req.body;
      const driver = await DriverService.updateKycStatus(id, kycStatus, rejectionReason);
      await logAuditEvent(req, {
        module: AuditModule.DRIVERS,
        action: kycStatus === 'APPROVED' ? AuditAction.APPROVE : AuditAction.REJECT,
        recordId: driver._id.toString(),
        targetModel: 'Driver',
        newValue: { kycStatus, rejectionReason },
        description: `Updated KYC status for ${driver.name} to ${kycStatus}`,
      });
      successResponse(res, driver, `KYC status updated to ${kycStatus}`);
    } catch (error: any) {
      errorResponse(res, error.message);
    }
  }

  static async assignVehicle(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const id = String(req.params.id);
      const { vehicleId } = req.body;
      const driver = await DriverService.assignVehicle(id, vehicleId);
      await logAuditEvent(req, {
        module: AuditModule.DRIVERS,
        action: AuditAction.UPDATE,
        recordId: driver._id.toString(),
        targetModel: 'Driver',
        description: `Assigned vehicle to driver ${driver.name}`,
      });
      successResponse(res, driver, 'Vehicle assigned successfully');
    } catch (error: any) {
      errorResponse(res, error.message);
    }
  }

  static async updateOnlineStatus(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const id = String(req.params.id);
      const { onlineStatus } = req.body;
      const driver = await DriverService.updateOnlineStatus(id, onlineStatus);
      successResponse(res, driver, `Driver online status updated to ${onlineStatus}`);
    } catch (error: any) {
      errorResponse(res, error.message);
    }
  }

  static async addDocument(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const id = String(req.params.id);
      const doc = await DriverService.addDriverDocument(id, req.body);
      await logAuditEvent(req, {
        module: AuditModule.DRIVERS,
        action: AuditAction.CREATE,
        recordId: doc._id.toString(),
        targetModel: 'DriverDocument',
        description: `Uploaded KYC document ${doc.documentType} for driver ${id}`,
      });
      successResponse(res, doc, 'Document uploaded successfully', 201);
    } catch (error: any) {
      errorResponse(res, error.message);
    }
  }

  static async updateDocument(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const docId = String(req.params.docId);
      const { status, rejectionReason } = req.body;
      const doc = await DriverService.updateDocumentStatus(docId, status, rejectionReason);
      await logAuditEvent(req, {
        module: AuditModule.DRIVERS,
        action: status === 'APPROVED' ? AuditAction.APPROVE : AuditAction.REJECT,
        recordId: docId,
        targetModel: 'DriverDocument',
        description: `Updated document verification status to ${status}`,
      });
      successResponse(res, doc, 'Document verification updated');
    } catch (error: any) {
      errorResponse(res, error.message);
    }
  }

  static async approveAllKycDocuments(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const id = String(req.params.id);
      const driver = await DriverService.approveAllKycDocuments(id);
      await logAuditEvent(req, {
        module: AuditModule.DRIVERS,
        action: AuditAction.APPROVE,
        recordId: driver._id.toString(),
        targetModel: 'Driver',
        description: `Approved all 7 KYC documents and activated driver ${driver.name} for bookings`,
      });
      successResponse(res, driver, 'All 7 KYC documents approved. Driver activated for bookings.');
    } catch (error: any) {
      errorResponse(res, error.message);
    }
  }

  static async getDriverStatusByMobile(req: any, res: Response): Promise<void> {
    try {
      const mobile = String(req.params.mobile || req.query.mobile);
      if (!mobile) {
        errorResponse(res, 'Mobile number is required', 400);
        return;
      }
      const result = await DriverService.getDriverStatusByMobile(mobile);
      if (!result) {
        errorResponse(res, 'No registered driver found for this mobile number', 404);
        return;
      }
      successResponse(res, result, 'Driver KYC status retrieved');
    } catch (error: any) {
      errorResponse(res, error.message);
    }
  }
}

export class VehicleController {
  static async getVehicles(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const result = await VehicleService.getVehicles(req.query as any);
      successResponse(res, result.vehicles, 'Vehicles fetched', 200, result.meta);
    } catch (error: any) {
      errorResponse(res, error.message);
    }
  }

  static async getVehicleById(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const id = String(req.params.id);
      const vehicle = await VehicleService.getVehicleById(id);
      successResponse(res, vehicle, 'Vehicle fetched');
    } catch (error: any) {
      errorResponse(res, error.message, 404);
    }
  }

  static async createVehicle(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const vehicle = await VehicleService.createVehicle(req.body);
      await logAuditEvent(req, {
        module: AuditModule.VEHICLES,
        action: AuditAction.CREATE,
        recordId: vehicle._id.toString(),
        targetModel: 'Vehicle',
        newValue: vehicle,
        description: `Created vehicle ${vehicle.vehicleNumber} (${vehicle.brand} ${vehicle.model})`,
      });
      successResponse(res, vehicle, 'Vehicle created successfully', 201);
    } catch (error: any) {
      errorResponse(res, error.message);
    }
  }

  static async updateVehicle(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const id = String(req.params.id);
      const vehicle = await VehicleService.updateVehicle(id, req.body);
      await logAuditEvent(req, {
        module: AuditModule.VEHICLES,
        action: AuditAction.UPDATE,
        recordId: vehicle._id.toString(),
        targetModel: 'Vehicle',
        newValue: vehicle,
        description: `Updated vehicle ${vehicle.vehicleNumber}`,
      });
      successResponse(res, vehicle, 'Vehicle updated successfully');
    } catch (error: any) {
      errorResponse(res, error.message);
    }
  }

  static async deleteVehicle(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const id = String(req.params.id);
      const result = await VehicleService.deleteVehicle(id);
      await logAuditEvent(req, {
        module: AuditModule.VEHICLES,
        action: AuditAction.DELETE,
        recordId: id,
        targetModel: 'Vehicle',
        description: `Deleted vehicle ${id}`,
      });
      successResponse(res, result, 'Vehicle deleted');
    } catch (error: any) {
      errorResponse(res, error.message);
    }
  }
}
