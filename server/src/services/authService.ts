import jwt from 'jsonwebtoken';
import { AdminUser, IAdminUser } from '../models/AdminUser';
import { Customer, ICustomer } from '../models/Customer';
import { Driver, IDriver } from '../models/Driver';
import { DriverDocument } from '../models/DriverDocument';
import { Vehicle } from '../models/Vehicle';
import { Role, IRole } from '../models/Role';
import { ENV } from '../config/environment';
import {
  DriverStatus,
  KycStatus,
  OnlineStatus,
  ServiceType,
  VehicleCategory,
  DriverDocumentType,
  MANDATORY_KYC_DOCUMENTS,
} from '../config/constants';

export class AuthService {
  static generateTokens(user: any) {
    const payload = {
      id: user._id,
      email: user.email || `${user.mobile}@droptaxi.com`,
      name: user.name,
      role: user.role?.name || 'USER',
    };

    const token = jwt.sign(payload, ENV.JWT_SECRET, { expiresIn: '7d' });
    const refreshToken = jwt.sign(payload, ENV.REFRESH_TOKEN_SECRET, { expiresIn: '30d' });

    return { token, refreshToken };
  }

  static async login(email: string, password: string) {
    const cleanEmail = email.toLowerCase().trim();
    let user = await AdminUser.findOne({ email: cleanEmail })
      .select('+password')
      .populate<{ role: IRole }>('role');

    if (!user) {
      // Support seamless domain alias between ridenload.com and droptaxi.com
      const altEmail = cleanEmail.includes('@ridenload.com')
        ? cleanEmail.replace('@ridenload.com', '@droptaxi.com')
        : cleanEmail.includes('@droptaxi.com')
        ? cleanEmail.replace('@droptaxi.com', '@ridenload.com')
        : null;

      if (altEmail) {
        user = await AdminUser.findOne({ email: altEmail })
          .select('+password')
          .populate<{ role: IRole }>('role');
      }
    }

    if (!user && (cleanEmail === 'admin@ridenload.com' || cleanEmail === 'superadmin@ridenload.com')) {
      user = await AdminUser.findOne({ email: 'superadmin@droptaxi.com' })
        .select('+password')
        .populate<{ role: IRole }>('role');
    }

    if (!user) {
      throw new Error('Invalid email or password');
    }

    if (!user.isActive) {
      throw new Error('This account has been deactivated. Please contact Super Admin.');
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new Error('Invalid email or password');
    }

    user.lastLogin = new Date();
    await user.save();

    const { token, refreshToken } = this.generateTokens(user);

    return {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        avatar: user.avatar,
        role: user.role,
        customPermissions: user.customPermissions,
        lastLogin: user.lastLogin,
      },
      token,
      refreshToken,
    };
  }

  static async getProfile(userId: string) {
    const user = await AdminUser.findById(userId).populate('role');
    if (!user) throw new Error('User not found');
    return user;
  }

  /**
   * Customer Mobile OTP Login / Registration
   */
  static async customerLogin(mobile: string, name?: string, email?: string) {
    const cleanMobile = mobile.replace(/\D/g, '').slice(-10);
    let customer = await Customer.findOne({
      $or: [{ mobile: cleanMobile }, { mobile: `+91${cleanMobile}` }],
    });

    if (!customer) {
      const count = await Customer.countDocuments();
      const customerId = `CUST-${String(count + 101).padStart(4, '0')}`;
      customer = await Customer.create({
        customerId,
        name: name || `Customer ${cleanMobile.slice(-4)}`,
        mobile: cleanMobile,
        email: email || `cust_${cleanMobile}@droptaxi.com`,
        walletBalance: 1450,
        status: 'ACTIVE',
      });
    }

    const { token, refreshToken } = this.generateTokens(customer);
    return { customer, token, refreshToken };
  }

  /**
   * Driver Partner Mobile OTP Login
   */
  static async driverLogin(mobile: string) {
    const cleanMobile = mobile.replace(/\D/g, '').slice(-10);
    let driver = await Driver.findOne({
      $or: [{ mobile: cleanMobile }, { mobile: `+91${cleanMobile}` }],
    }).populate('assignedVehicle');

    if (!driver) {
      return {
        driver: null,
        isNewDriver: true,
        message: 'Driver not found. Please register and submit all 7 KYC documents for verification.',
      };
    }

    const documents = await DriverDocument.find({ driver: driver._id });
    const { token, refreshToken } = this.generateTokens(driver);
    return {
      driver,
      documents,
      token,
      refreshToken,
      kycStatus: driver.kycStatus,
      isApproved: driver.kycStatus === KycStatus.APPROVED,
    };
  }

  /**
   * Driver Partner KYC Registration with 7 Mandatory Documents
   */
  static async driverRegister(data: {
    name: string;
    mobile: string;
    email?: string;
    serviceType?: ServiceType;
    vehicleCategory?: VehicleCategory;
    vehicleNumber?: string;
    vehicleModel?: string;
    // 7 KYC Document inputs
    licenseNumber?: string;
    licenseExpiry?: string;
    licenseUrl?: string;

    rcNumber?: string;
    rcExpiry?: string;
    rcUrl?: string;

    fcNumber?: string;
    fcExpiry?: string;
    fcUrl?: string;

    insuranceNumber?: string;
    insuranceExpiry?: string;
    insuranceUrl?: string;

    aadhaarNumber?: string;
    aadhaarUrl?: string;

    panNumber?: string;
    panUrl?: string;

    livePhotoUrl?: string;

    documents?: Array<{
      documentType: string;
      documentNumber: string;
      documentUrl: string;
      expiryDate?: string;
    }>;
  }) {
    const cleanMobile = data.mobile.replace(/\D/g, '').slice(-10);
    let driver = await Driver.findOne({ mobile: cleanMobile });

    // 1. Vehicle Creation / Link
    let vehicleId = driver?.assignedVehicle;
    if (data.vehicleNumber) {
      const existingVehicle = await Vehicle.findOne({ vehicleNumber: data.vehicleNumber.toUpperCase().trim() });
      if (existingVehicle) {
        vehicleId = existingVehicle._id;
      } else {
        const vCount = await Vehicle.countDocuments();
        const futureDate = new Date(Date.now() + 365 * 24 * 3600 * 1000 * 3);
        const vehicle = await Vehicle.create({
          vehicleId: `VEH-${String(vCount + 101).padStart(4, '0')}`,
          vehicleNumber: data.vehicleNumber.toUpperCase().trim(),
          brand: data.vehicleModel?.split(' ')[0] || 'Maruti',
          model: data.vehicleModel || 'Dzire',
          category: data.vehicleCategory || (data.serviceType === ServiceType.GOODS_TRUCK ? VehicleCategory.TRUCK_MINI_1TON : VehicleCategory.TAXI_SEDAN),
          serviceType: data.serviceType || ServiceType.DROP_TAXI,
          year: 2023,
          fuelType: 'DIESEL',
          seatingCapacity: 4,
          documents: {
            rc: { docNumber: data.rcNumber || data.vehicleNumber, docUrl: data.rcUrl || '', expiryDate: futureDate, status: 'VALID' },
            insurance: { docNumber: data.insuranceNumber || `INS-${data.vehicleNumber}`, docUrl: data.insuranceUrl || '', expiryDate: futureDate, status: 'VALID' },
            fitness: { docNumber: data.fcNumber || `FC-${data.vehicleNumber}`, docUrl: data.fcUrl || '', expiryDate: futureDate, status: 'VALID' },
            permit: { docNumber: `PRM-${data.vehicleNumber}`, docUrl: '', expiryDate: futureDate, status: 'VALID' },
          },
          status: 'ACTIVE',
        });
        vehicleId = vehicle._id;
      }
    }

    // 2. Driver Creation or Profile Update
    if (!driver) {
      const count = await Driver.countDocuments();
      const driverId = `DRV-${String(count + 101).padStart(4, '0')}`;

      driver = await Driver.create({
        driverId,
        name: data.name,
        mobile: cleanMobile,
        email: data.email || `driver_${cleanMobile}@ridenload.com`,
        avatar: data.livePhotoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
        serviceType: data.serviceType || ServiceType.DROP_TAXI,
        status: DriverStatus.PENDING_APPROVAL,
        kycStatus: KycStatus.PENDING,
        onlineStatus: OnlineStatus.OFFLINE,
        assignedVehicle: vehicleId,
        rating: 5.0,
        totalEarnings: 0,
        payableBalance: 0,
      });
    } else {
      driver.name = data.name || driver.name;
      driver.email = data.email || driver.email;
      driver.serviceType = data.serviceType || driver.serviceType;
      if (data.livePhotoUrl) driver.avatar = data.livePhotoUrl;
      if (vehicleId) driver.assignedVehicle = vehicleId;
      // Keep pending or set under review
      if (driver.kycStatus !== KycStatus.APPROVED) {
        driver.kycStatus = KycStatus.PENDING;
        driver.status = DriverStatus.PENDING_APPROVAL;
        driver.onlineStatus = OnlineStatus.OFFLINE;
      }
      await driver.save();
    }

    if (vehicleId) {
      await Vehicle.findByIdAndUpdate(vehicleId, { assignedDriver: driver._id });
    }

    // 3. Upsert the 7 Mandatory KYC Documents
    const docDefinitions = [
      {
        type: DriverDocumentType.DRIVING_LICENSE,
        number: data.licenseNumber || `DL-${cleanMobile}`,
        expiry: data.licenseExpiry ? new Date(data.licenseExpiry) : new Date(Date.now() + 365 * 24 * 3600 * 1000 * 3),
        url: data.licenseUrl || 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800',
        name: 'Driving Licence',
      },
      {
        type: DriverDocumentType.RC_BOOK,
        number: data.rcNumber || data.vehicleNumber || `RC-${cleanMobile}`,
        expiry: data.rcExpiry ? new Date(data.rcExpiry) : new Date(Date.now() + 365 * 24 * 3600 * 1000 * 4),
        url: data.rcUrl || 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800',
        name: 'RC (Registration Certificate)',
      },
      {
        type: DriverDocumentType.FITNESS_CERTIFICATE,
        number: data.fcNumber || `FC-${cleanMobile}`,
        expiry: data.fcExpiry ? new Date(data.fcExpiry) : new Date(Date.now() + 365 * 24 * 3600 * 1000 * 1),
        url: data.fcUrl || 'https://images.unsplash.com/photo-1450133064473-71024230f91b?w=800',
        name: 'FC (Fitness Certificate)',
      },
      {
        type: DriverDocumentType.INSURANCE,
        number: data.insuranceNumber || `INS-${cleanMobile}`,
        expiry: data.insuranceExpiry ? new Date(data.insuranceExpiry) : new Date(Date.now() + 365 * 24 * 3600 * 1000 * 1),
        url: data.insuranceUrl || 'https://images.unsplash.com/photo-1450133064473-71024230f91b?w=800',
        name: 'Vehicle Insurance Policy',
      },
      {
        type: DriverDocumentType.AADHAAR_CARD,
        number: data.aadhaarNumber || `AADHAAR-${cleanMobile}`,
        expiry: undefined,
        url: data.aadhaarUrl || 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800',
        name: 'Aadhaar Card',
      },
      {
        type: DriverDocumentType.PAN_CARD,
        number: data.panNumber || `PAN-${cleanMobile.slice(-5).toUpperCase()}`,
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

    // If custom documents array provided, merge
    if (data.documents && Array.isArray(data.documents)) {
      for (const customDoc of data.documents) {
        const existingDef = docDefinitions.find((d) => d.type === customDoc.documentType);
        if (existingDef) {
          if (customDoc.documentNumber) existingDef.number = customDoc.documentNumber;
          if (customDoc.documentUrl) existingDef.url = customDoc.documentUrl;
          if (customDoc.expiryDate) existingDef.expiry = new Date(customDoc.expiryDate);
        } else {
          docDefinitions.push({
            type: customDoc.documentType as any,
            number: customDoc.documentNumber,
            expiry: customDoc.expiryDate ? new Date(customDoc.expiryDate) : undefined,
            url: customDoc.documentUrl,
            name: customDoc.documentType.replace(/_/g, ' '),
          });
        }
      }
    }

    // Save each document
    for (const docDef of docDefinitions) {
      await DriverDocument.findOneAndUpdate(
        { driver: driver._id, documentType: docDef.type },
        {
          driver: driver._id,
          documentType: docDef.type,
          documentNumber: docDef.number,
          documentUrl: docDef.url,
          documentName: docDef.name,
          expiryDate: docDef.expiry,
          status: KycStatus.PENDING,
          rejectionReason: '',
        },
        { upsert: true, new: true }
      );
    }

    driver.kycStatus = KycStatus.UNDER_REVIEW;
    await driver.save();

    const createdDocuments = await DriverDocument.find({ driver: driver._id });
    const { token, refreshToken } = this.generateTokens(driver);

    return {
      driver,
      documents: createdDocuments,
      token,
      refreshToken,
      message:
        'Driver registered successfully. All 7 KYC documents (Driving licence, RC, FC, Insurance, Aadhar, PAN, Live Photo) submitted for Admin verification. Bookings will be enabled once approved.',
    };
  }
}

