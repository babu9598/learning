import { Driver, IDriver } from '../models/Driver';
import { DriverDocument } from '../models/DriverDocument';
import { Vehicle } from '../models/Vehicle';
import { Booking } from '../models/Booking';
import { DriverEarning } from '../models/Commission';
import {
  DriverStatus,
  KycStatus,
  OnlineStatus,
  ServiceType,
  VehicleCategory,
  DriverDocumentType,
  MANDATORY_KYC_DOCUMENTS,
} from '../config/constants';

export interface DriverFilterParams {
  search?: string;
  status?: DriverStatus;
  kycStatus?: KycStatus;
  onlineStatus?: OnlineStatus;
  serviceType?: ServiceType;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export class DriverService {
  static async getDrivers(params: DriverFilterParams) {
    const page = Math.max(1, params.page || 1);
    const limit = Math.min(100, Math.max(1, params.limit || 10));
    const skip = (page - 1) * limit;

    const query: any = {};

    if (params.search) {
      query.$or = [
        { name: { $regex: params.search, $options: 'i' } },
        { email: { $regex: params.search, $options: 'i' } },
        { mobile: { $regex: params.search, $options: 'i' } },
        { driverId: { $regex: params.search, $options: 'i' } },
      ];
    }

    if (params.status) query.status = params.status;
    if (params.kycStatus) query.kycStatus = params.kycStatus;
    if (params.onlineStatus) query.onlineStatus = params.onlineStatus;
    if (params.serviceType) query.serviceType = params.serviceType;

    const sortField = params.sortBy || 'createdAt';
    const sortOrder = params.sortOrder === 'asc' ? 1 : -1;

    const [drivers, total] = await Promise.all([
      Driver.find(query)
        .populate('assignedVehicle')
        .sort({ [sortField]: sortOrder })
        .skip(skip)
        .limit(limit),
      Driver.countDocuments(query),
    ]);

    return {
      drivers,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  static async getDriverById(driverId: string) {
    const driver = await Driver.findById(driverId).populate('assignedVehicle');
    if (!driver) throw new Error('Driver not found');

    const [documents, recentTrips, earnings] = await Promise.all([
      DriverDocument.find({ driver: driver._id }),
      Booking.find({ driver: driver._id }).sort({ createdAt: -1 }).limit(10),
      DriverEarning.find({ driver: driver._id }).sort({ earnedAt: -1 }).limit(15),
    ]);

    return {
      driver,
      documents,
      recentTrips,
      earnings,
    };
  }

  static async createDriver(data: any) {
    const count = await Driver.countDocuments();
    const driverId = `DRV-${String(count + 1).padStart(5, '0')}`;

    let vehicleId = undefined;
    if (data.vehicleNumber) {
      const vCount = await Vehicle.countDocuments();
      const futureDate = new Date(Date.now() + 365 * 24 * 3600 * 1000 * 3);
      const vehicle = await Vehicle.create({
        vehicleId: `VEH-${String(vCount + 1).padStart(4, '0')}`,
        vehicleNumber: String(data.vehicleNumber).toUpperCase().trim(),
        brand: data.vehicleBrand || data.vehicleModel?.split(' ')[0] || 'Maruti',
        model: data.vehicleModel || 'Dzire',
        category: data.vehicleCategory || (data.serviceType === ServiceType.GOODS_TRUCK ? VehicleCategory.TRUCK_MINI_1TON : VehicleCategory.TAXI_SEDAN),
        serviceType: data.serviceType || ServiceType.DROP_TAXI,
        year: 2023,
        fuelType: 'DIESEL',
        documents: {
          rc: { docNumber: String(data.vehicleNumber).toUpperCase().trim(), docUrl: '', expiryDate: futureDate, status: 'VALID' },
          insurance: { docNumber: `INS-${String(data.vehicleNumber).toUpperCase().trim()}`, docUrl: '', expiryDate: futureDate, status: 'VALID' },
          fitness: { docNumber: `FC-${String(data.vehicleNumber).toUpperCase().trim()}`, docUrl: '', expiryDate: futureDate, status: 'VALID' },
          permit: { docNumber: `PRM-${String(data.vehicleNumber).toUpperCase().trim()}`, docUrl: '', expiryDate: futureDate, status: 'VALID' },
        },
        status: 'ACTIVE',
      });
      vehicleId = vehicle._id;
    }

    const driver = await Driver.create({
      ...data,
      driverId,
      assignedVehicle: vehicleId,
      status: DriverStatus.PENDING_APPROVAL,
      kycStatus: KycStatus.PENDING,
      onlineStatus: OnlineStatus.OFFLINE,
    });

    if (vehicleId) {
      await Vehicle.findByIdAndUpdate(vehicleId, { assignedDriver: driver._id });
    }

    // Provision all 7 Mandatory KYC Documents
    const mandatoryDocSeeds = [
      {
        type: DriverDocumentType.DRIVING_LICENSE,
        number: data.licenseNumber ? String(data.licenseNumber).toUpperCase().trim() : `DL-${driver.driverId}`,
        expiry: data.licenseExpiry ? new Date(data.licenseExpiry) : new Date(Date.now() + 365 * 24 * 3600 * 1000 * 3),
        url: data.licenseUrl || 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800',
        name: 'Driving Licence',
      },
      {
        type: DriverDocumentType.RC_BOOK,
        number: data.rcNumber || data.vehicleNumber || `RC-${driver.driverId}`,
        expiry: data.rcExpiry ? new Date(data.rcExpiry) : new Date(Date.now() + 365 * 24 * 3600 * 1000 * 4),
        url: data.rcUrl || 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800',
        name: 'RC (Registration Certificate)',
      },
      {
        type: DriverDocumentType.FITNESS_CERTIFICATE,
        number: data.fcNumber || `FC-${driver.driverId}`,
        expiry: data.fcExpiry ? new Date(data.fcExpiry) : new Date(Date.now() + 365 * 24 * 3600 * 1000 * 1),
        url: data.fcUrl || 'https://images.unsplash.com/photo-1450133064473-71024230f91b?w=800',
        name: 'FC (Fitness Certificate)',
      },
      {
        type: DriverDocumentType.INSURANCE,
        number: data.insuranceNumber || `INS-${driver.driverId}`,
        expiry: data.insuranceExpiry ? new Date(data.insuranceExpiry) : new Date(Date.now() + 365 * 24 * 3600 * 1000 * 1),
        url: data.insuranceUrl || 'https://images.unsplash.com/photo-1450133064473-71024230f91b?w=800',
        name: 'Vehicle Insurance Policy',
      },
      {
        type: DriverDocumentType.AADHAAR_CARD,
        number: data.aadhaarNumber ? String(data.aadhaarNumber).trim() : `AADHAAR-${driver.driverId}`,
        expiry: undefined,
        url: data.aadhaarUrl || 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800',
        name: 'Aadhaar Card',
      },
      {
        type: DriverDocumentType.PAN_CARD,
        number: data.panNumber ? String(data.panNumber).toUpperCase().trim() : `PAN-${driver.driverId}`,
        expiry: undefined,
        url: data.panUrl || 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800',
        name: 'PAN Card',
      },
      {
        type: DriverDocumentType.LIVE_PHOTO,
        number: `LIVE-PIC-${driver.driverId}`,
        expiry: undefined,
        url: data.livePhotoUrl || driver.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
        name: 'Live Picture (Face Selfie)',
      },
    ];

    for (const doc of mandatoryDocSeeds) {
      await DriverDocument.create({
        driver: driver._id,
        documentType: doc.type,
        documentNumber: doc.number,
        documentUrl: doc.url,
        documentName: doc.name,
        expiryDate: doc.expiry,
        status: KycStatus.PENDING,
      });
    }

    return driver.populate('assignedVehicle');
  }

  static async updateDriver(id: string, data: any) {
    const driver = await Driver.findByIdAndUpdate(id, data, { new: true });
    if (!driver) throw new Error('Driver not found');
    return driver;
  }

  static async updateKycStatus(id: string, kycStatus: KycStatus, rejectionReason?: string) {
    const driver = await Driver.findById(id);
    if (!driver) throw new Error('Driver not found');

    if (kycStatus === KycStatus.APPROVED) {
      driver.kycStatus = KycStatus.APPROVED;
      driver.status = DriverStatus.ACTIVE;
      // Also approve all pending documents
      await DriverDocument.updateMany(
        { driver: driver._id },
        {
          status: KycStatus.APPROVED,
          rejectionReason: '',
          verifiedAt: new Date(),
        }
      );
    } else if (kycStatus === KycStatus.REJECTED) {
      driver.kycStatus = KycStatus.REJECTED;
      driver.status = DriverStatus.SUSPENDED;
      await DriverDocument.updateMany(
        { driver: driver._id, status: KycStatus.PENDING },
        {
          status: KycStatus.REJECTED,
          rejectionReason: rejectionReason || 'KYC Rejected by Admin',
          verifiedAt: new Date(),
        }
      );
    } else {
      driver.kycStatus = kycStatus;
    }

    await driver.save();
    return driver;
  }

  static async approveAllKycDocuments(driverId: string) {
    const driver = await Driver.findById(driverId);
    if (!driver) throw new Error('Driver not found');

    // Approve all documents
    await DriverDocument.updateMany(
      { driver: driver._id },
      {
        status: KycStatus.APPROVED,
        rejectionReason: '',
        verifiedAt: new Date(),
      }
    );

    driver.kycStatus = KycStatus.APPROVED;
    driver.status = DriverStatus.ACTIVE;
    await driver.save();

    return driver;
  }

  static async getDriverStatusByMobile(mobile: string) {
    const cleanMobile = mobile.replace(/\D/g, '').slice(-10);
    const driver = await Driver.findOne({
      $or: [{ mobile: cleanMobile }, { mobile: `+91${cleanMobile}` }],
    }).populate('assignedVehicle');

    if (!driver) return null;

    const documents = await DriverDocument.find({ driver: driver._id }).sort({ createdAt: 1 });
    return {
      driver,
      documents,
      isApproved: driver.kycStatus === KycStatus.APPROVED,
      canTakeBookings: driver.kycStatus === KycStatus.APPROVED && driver.status === DriverStatus.ACTIVE,
    };
  }

  static async assignVehicle(driverId: string, vehicleId: string) {
    const [driver, vehicle] = await Promise.all([
      Driver.findById(driverId),
      Vehicle.findById(vehicleId),
    ]);

    if (!driver) throw new Error('Driver not found');
    if (!vehicle) throw new Error('Vehicle not found');

    // Unassign previous vehicle if any
    if (driver.assignedVehicle) {
      await Vehicle.findByIdAndUpdate(driver.assignedVehicle, { $unset: { assignedDriver: 1 } });
    }

    driver.assignedVehicle = vehicle._id as any;
    await driver.save();

    vehicle.assignedDriver = driver._id as any;
    await vehicle.save();

    return driver.populate('assignedVehicle');
  }

  static async updateOnlineStatus(driverId: string, onlineStatus: OnlineStatus) {
    const driver = await Driver.findById(driverId);
    if (!driver) throw new Error('Driver not found');

    if (onlineStatus === OnlineStatus.ONLINE) {
      if (driver.kycStatus !== KycStatus.APPROVED) {
        throw new Error(
          'Cannot go online: Your KYC documents (Driving licence, RC, FC, Insurance, Aadhar, PAN, Live Photo) are pending admin verification. Bookings are only allowed after KYC approval.'
        );
      }
      if (driver.status !== DriverStatus.ACTIVE) {
        throw new Error('Only active and approved drivers can go online');
      }
    }

    driver.onlineStatus = onlineStatus;
    await driver.save();
    return driver;
  }

  static async addDriverDocument(driverId: string, data: any) {
    const driver = await Driver.findById(driverId);
    if (!driver) throw new Error('Driver not found');

    const doc = await DriverDocument.create({
      driver: driver._id,
      documentType: data.documentType,
      documentNumber: data.documentNumber,
      documentName: data.documentName,
      documentUrl: data.documentUrl || 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600',
      status: data.status || KycStatus.PENDING,
      expiryDate: data.expiryDate ? new Date(data.expiryDate) : undefined,
    });

    return doc;
  }

  static async updateDocumentStatus(docId: string, status: KycStatus, rejectionReason?: string) {
    const doc = await DriverDocument.findByIdAndUpdate(
      docId,
      {
        status,
        rejectionReason: rejectionReason || '',
        verifiedAt: new Date(),
      },
      { new: true }
    );
    if (!doc) throw new Error('Document not found');

    // Check driver's overall documents status
    const driver = await Driver.findById(doc.driver);
    if (driver) {
      if (status === KycStatus.REJECTED) {
        driver.kycStatus = KycStatus.REJECTED;
        driver.status = DriverStatus.SUSPENDED;
        await driver.save();
      } else if (status === KycStatus.APPROVED) {
        const allDriverDocs = await DriverDocument.find({ driver: driver._id });
        const approvedTypes = new Set(
          allDriverDocs.filter((d) => d.status === KycStatus.APPROVED).map((d) => d.documentType)
        );

        // Check if all 7 mandatory documents are approved
        const all7Approved = MANDATORY_KYC_DOCUMENTS.every((t) => approvedTypes.has(t));
        if (all7Approved) {
          driver.kycStatus = KycStatus.APPROVED;
          driver.status = DriverStatus.ACTIVE;
        } else {
          driver.kycStatus = KycStatus.UNDER_REVIEW;
        }
        await driver.save();
      }
    }

    return doc;
  }
}

