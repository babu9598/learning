import { z } from 'zod';
import { ServiceType, VehicleCategory, VehicleStatus } from '../config/constants';

const documentSchema = z.object({
  docNumber: z.string().default(''),
  docUrl: z.string().default(''),
  expiryDate: z.string().or(z.date()),
  status: z.enum(['VALID', 'EXPIRED', 'PENDING']).default('VALID'),
});

export const createVehicleSchema = z.object({
  body: z.object({
    vehicleNumber: z.string().min(4, 'Valid vehicle plate number required'),
    category: z.string().min(1, 'Vehicle category / type is required'),
    serviceType: z.nativeEnum(ServiceType),
    brand: z.string().min(2, 'Brand is required'),
    model: z.string().min(1, 'Model is required'),
    year: z.number().int().min(2000).max(2030),
    capacity: z.object({
      passengers: z.number().optional(),
      weightTons: z.number().optional(),
      volumeCubicFt: z.number().optional(),
    }),
    fuelType: z.enum(['PETROL', 'DIESEL', 'CNG', 'ELECTRIC']),
    assignedDriver: z.string().optional(),
    documents: z.object({
      rc: documentSchema,
      insurance: documentSchema,
      fitness: documentSchema,
      permit: documentSchema,
    }),
    status: z.nativeEnum(VehicleStatus).optional(),
  }),
});
