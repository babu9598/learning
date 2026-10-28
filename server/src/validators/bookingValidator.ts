import { z } from 'zod';
import {
  BookingStatus,
  BookingType,
  PaymentMethod,
  ServiceType,
  TripScope,
  VehicleCategory,
} from '../config/constants';

const locationPointSchema = z.object({
  address: z.string().min(3, 'Address is required'),
  lat: z.number(),
  lng: z.number(),
  city: z.string().optional(),
  state: z.string().optional(),
  pincode: z.string().optional(),
});

export const createBookingSchema = z.object({
  body: z.object({
    customerId: z.string().min(1, 'Customer ID is required'),
    serviceType: z.nativeEnum(ServiceType),
    vehicleCategory: z.string(),
    tripScope: z.nativeEnum(TripScope).default(TripScope.OUTSTATION),
    bookingType: z.nativeEnum(BookingType).default(BookingType.INSTANT),
    scheduledTime: z.string().or(z.date()).optional(),
    pickupLocation: locationPointSchema,
    dropLocation: locationPointSchema,
    extraStops: z.array(locationPointSchema).optional(),
    couponCode: z.string().optional(),
    paymentMethod: z.nativeEnum(PaymentMethod).default(PaymentMethod.UPI),
    goodsDetails: z
      .object({
        itemType: z.string().optional(),
        approxWeightKg: z.number().optional(),
        receiverName: z.string().optional(),
        receiverMobile: z.string().optional(),
        notes: z.string().optional(),
      })
      .optional(),
  }),
});

export const updateBookingStatusSchema = z.object({
  body: z.object({
    status: z.nativeEnum(BookingStatus),
    driverId: z.string().optional(),
    note: z.string().optional(),
    cancellationReason: z.string().optional(),
    cancelledBy: z.enum(['CUSTOMER', 'DRIVER', 'ADMIN', 'SYSTEM']).optional(),
    actualToll: z.number().min(0).optional(),
    driverBata: z.number().min(0).optional(),
    actualDistanceKm: z.number().min(0).optional(),
  }),
});

export const completeTripSchema = z.object({
  body: z.object({
    otp: z.string().optional(),
    actualToll: z.number().min(0).optional(),
    driverBata: z.number().min(0).optional(),
    actualDistanceKm: z.number().min(0).optional(),
  }),
});

export const calculateFarePreviewSchema = z.object({
  body: z.object({
    vehicleCategory: z.string(),
    serviceType: z.nativeEnum(ServiceType),
    tripScope: z.nativeEnum(TripScope).optional().default(TripScope.OUTSTATION),
    pickupLocation: locationPointSchema,
    dropLocation: locationPointSchema,
    extraStopsCount: z.number().default(0),
    couponCode: z.string().optional(),
    scheduledTime: z.string().or(z.date()).optional(),
  }),
});
