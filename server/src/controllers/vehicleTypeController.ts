import { Request, Response } from 'express';
import { VehicleTypeService } from '../services/vehicleTypeService';
import { AuthenticatedRequest } from '../middleware/auth';
import { logAuditEvent } from '../middleware/auditLogger';
import { AuditAction, AuditModule } from '../config/constants';
import { successResponse, errorResponse } from '../utils/response';

export class VehicleTypeController {
  static async getVehicleTypes(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const result = await VehicleTypeService.getVehicleTypes(req.query as any);
      successResponse(res, result.types, 'Vehicle types fetched', 200, result.meta);
    } catch (error: any) {
      errorResponse(res, error.message);
    }
  }

  static async getActiveVehicleTypes(req: Request, res: Response): Promise<void> {
    try {
      const serviceType = req.query.serviceType as any;
      const types = await VehicleTypeService.getActiveVehicleTypes(serviceType);
      successResponse(res, types, 'Active vehicle types fetched');
    } catch (error: any) {
      errorResponse(res, error.message);
    }
  }

  static async getVehicleTypeById(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const id = String(req.params.id);
      const vehicleType = await VehicleTypeService.getVehicleTypeById(id);
      successResponse(res, vehicleType, 'Vehicle type details fetched');
    } catch (error: any) {
      errorResponse(res, error.message, 404);
    }
  }

  static async createVehicleType(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const vehicleType = await VehicleTypeService.createVehicleType(req.body);
      await logAuditEvent(req, {
        module: AuditModule.VEHICLES,
        action: AuditAction.CREATE,
        recordId: vehicleType._id.toString(),
        targetModel: 'VehicleType',
        newValue: vehicleType,
        description: `Created dynamic vehicle type ${vehicleType.name} (${vehicleType.wheelType}) with live fare sync`,
      });
      successResponse(res, vehicleType, 'Vehicle type created and fare rules synchronized', 201);
    } catch (error: any) {
      errorResponse(res, error.message);
    }
  }

  static async updateVehicleType(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const id = String(req.params.id);
      const vehicleType = await VehicleTypeService.updateVehicleType(id, req.body);
      await logAuditEvent(req, {
        module: AuditModule.VEHICLES,
        action: AuditAction.UPDATE,
        recordId: vehicleType._id.toString(),
        targetModel: 'VehicleType',
        newValue: vehicleType,
        description: `Updated dynamic vehicle type ${vehicleType.name} and synced fare rules`,
      });
      successResponse(res, vehicleType, 'Vehicle type updated and fare rules synchronized');
    } catch (error: any) {
      errorResponse(res, error.message);
    }
  }

  static async toggleStatus(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const id = String(req.params.id);
      const vehicleType = await VehicleTypeService.toggleStatus(id);
      await logAuditEvent(req, {
        module: AuditModule.VEHICLES,
        action: AuditAction.UPDATE,
        recordId: vehicleType._id.toString(),
        targetModel: 'VehicleType',
        newValue: { isActive: vehicleType.isActive },
        description: `Toggled vehicle type ${vehicleType.name} status to ${vehicleType.isActive ? 'ACTIVE' : 'INACTIVE'}`,
      });
      successResponse(res, vehicleType, `Vehicle type marked ${vehicleType.isActive ? 'ACTIVE' : 'INACTIVE'}`);
    } catch (error: any) {
      errorResponse(res, error.message);
    }
  }

  static async deleteVehicleType(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const id = String(req.params.id);
      const result = await VehicleTypeService.deleteVehicleType(id);
      await logAuditEvent(req, {
        module: AuditModule.VEHICLES,
        action: AuditAction.DELETE,
        recordId: id,
        targetModel: 'VehicleType',
        description: `Deleted vehicle type ${id}`,
      });
      successResponse(res, result, 'Vehicle type deleted');
    } catch (error: any) {
      errorResponse(res, error.message);
    }
  }
}
