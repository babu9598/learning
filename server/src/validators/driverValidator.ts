import { z } from 'zod';
import { DriverStatus, KycStatus, OnlineStatus, ServiceType } from '../config/constants';

export const createDriverSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name is required'),
    email: z.string().email('Invalid email address'),
    mobile: z.string().min(10, 'Valid 10-digit mobile required'),
    serviceType: z.nativeEnum(ServiceType),
    assignedVehicle: z.string().optional(),
    bankDetails: z
      .object({
        accountNumber: z.string().optional(),
        ifscCode: z.string().optional(),
        bankName: z.string().optional(),
        holderName: z.string().optional(),
        upiId: z.string().optional(),
      })
      .optional(),
  }),
});

export const updateDriverStatusSchema = z.object({
  body: z.object({
    status: z.nativeEnum(DriverStatus).optional(),
    kycStatus: z.nativeEnum(KycStatus).optional(),
    onlineStatus: z.nativeEnum(OnlineStatus).optional(),
    rejectionReason: z.string().optional(),
  }),
});

export const assignVehicleSchema = z.object({
  body: z.object({
    vehicleId: z.string().min(1, 'Vehicle ID is required'),
  }),
});
