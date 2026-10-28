import { Vehicle, IVehicle } from '../models/Vehicle';
import { Driver } from '../models/Driver';
import { ServiceType, VehicleCategory, VehicleStatus } from '../config/constants';

export interface VehicleFilterParams {
  search?: string;
  category?: VehicleCategory;
  serviceType?: ServiceType;
  status?: VehicleStatus;
  documentExpiredOnly?: boolean;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export class VehicleService {
  static async getVehicles(params: VehicleFilterParams) {
    const page = Math.max(1, params.page || 1);
    const limit = Math.min(100, Math.max(1, params.limit || 10));
    const skip = (page - 1) * limit;

    const query: any = {};

    if (params.search) {
      query.$or = [
        { vehicleNumber: { $regex: params.search, $options: 'i' } },
        { brand: { $regex: params.search, $options: 'i' } },
        { model: { $regex: params.search, $options: 'i' } },
        { vehicleId: { $regex: params.search, $options: 'i' } },
      ];
    }

    if (params.category) query.category = params.category;
    if (params.serviceType) query.serviceType = params.serviceType;
    if (params.status) query.status = params.status;

    if (params.documentExpiredOnly) {
      const now = new Date();
      const expiredCond = {
        $or: [
          { isDocumentExpired: true },
          { status: VehicleStatus.DOCUMENTS_EXPIRED },
          { 'documents.rc.expiryDate': { $lt: now } },
          { 'documents.insurance.expiryDate': { $lt: now } },
          { 'documents.fitness.expiryDate': { $lt: now } },
          { 'documents.permit.expiryDate': { $lt: now } },
          { 'documents.rc.status': 'EXPIRED' },
          { 'documents.insurance.status': 'EXPIRED' },
          { 'documents.fitness.status': 'EXPIRED' },
          { 'documents.permit.status': 'EXPIRED' },
        ],
      };

      if (query.$or) {
        query.$and = [{ $or: query.$or }, expiredCond];
        delete query.$or;
      } else {
        query.$or = expiredCond.$or;
      }
    }

    const sortField = params.sortBy || 'createdAt';
    const sortOrder = params.sortOrder === 'asc' ? 1 : -1;

    const [rawVehicles, total] = await Promise.all([
      Vehicle.find(query)
        .populate('assignedDriver')
        .sort({ [sortField]: sortOrder })
        .skip(skip)
        .limit(limit),
      Vehicle.countDocuments(query),
    ]);

    const now = new Date();
    const vehicles = rawVehicles.map((v) => {
      const doc = v.toObject ? v.toObject() : v;
      const isExpired =
        Boolean(doc.isDocumentExpired) ||
        doc.status === VehicleStatus.DOCUMENTS_EXPIRED ||
        Boolean(doc.documents?.rc?.expiryDate && new Date(doc.documents.rc.expiryDate) < now) ||
        Boolean(doc.documents?.insurance?.expiryDate && new Date(doc.documents.insurance.expiryDate) < now) ||
        Boolean(doc.documents?.fitness?.expiryDate && new Date(doc.documents.fitness.expiryDate) < now) ||
        Boolean(doc.documents?.permit?.expiryDate && new Date(doc.documents.permit.expiryDate) < now) ||
        doc.documents?.rc?.status === 'EXPIRED' ||
        doc.documents?.insurance?.status === 'EXPIRED' ||
        doc.documents?.fitness?.status === 'EXPIRED' ||
        doc.documents?.permit?.status === 'EXPIRED';

      return {
        ...doc,
        isDocumentExpired: isExpired,
      };
    });

    return {
      vehicles,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  static async getVehicleById(id: string) {
    const vehicle = await Vehicle.findById(id).populate('assignedDriver');
    if (!vehicle) throw new Error('Vehicle not found');
    return vehicle;
  }

  static async createVehicle(data: any) {
    const count = await Vehicle.countDocuments();
    const vehicleId = `VEH-${String(count + 1).padStart(5, '0')}`;

    const vehicle = await Vehicle.create({
      ...data,
      vehicleId,
    });

    if (data.assignedDriver) {
      await Driver.findByIdAndUpdate(data.assignedDriver, { assignedVehicle: vehicle._id });
    }

    return vehicle;
  }

  static async updateVehicle(id: string, data: any) {
    const vehicle = await Vehicle.findById(id);
    if (!vehicle) throw new Error('Vehicle not found');

    // Handle driver change
    if (data.assignedDriver && String(vehicle.assignedDriver) !== String(data.assignedDriver)) {
      if (vehicle.assignedDriver) {
        await Driver.findByIdAndUpdate(vehicle.assignedDriver, { $unset: { assignedVehicle: 1 } });
      }
      await Driver.findByIdAndUpdate(data.assignedDriver, { assignedVehicle: vehicle._id });
    }

    Object.assign(vehicle, data);
    await vehicle.save();

    return vehicle.populate('assignedDriver');
  }

  static async deleteVehicle(id: string) {
    const vehicle = await Vehicle.findById(id);
    if (!vehicle) throw new Error('Vehicle not found');

    if (vehicle.assignedDriver) {
      await Driver.findByIdAndUpdate(vehicle.assignedDriver, { $unset: { assignedVehicle: 1 } });
    }

    await vehicle.deleteOne();
    return { success: true, message: 'Vehicle deleted successfully' };
  }
}
