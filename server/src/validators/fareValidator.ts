import { z } from 'zod';
import { ServiceType, TripScope, VehicleCategory } from '../config/constants';

const incentiveTierSchema = z.object({
  targetBookings: z.number().min(1),
  rewardAmount: z.number().min(0),
});

const incentivesSchema = z.object({
  daily: z.array(incentiveTierSchema).optional(),
  weekly: z.array(incentiveTierSchema).optional(),
  monthly: z.array(incentiveTierSchema).optional(),
});

export const updateFareRuleSchema = z.object({
  body: z.object({
    category: z.string().optional(),
    serviceType: z.nativeEnum(ServiceType).optional(),
    tripScope: z.nativeEnum(TripScope).optional(),
    title: z.string().min(2).optional(),
    baseFare: z.number().min(0).optional(),
    baseDistanceKm: z.number().min(0).optional(),
    perKmRate: z.number().min(0).optional(),
    driverBata: z.number().min(0).optional(),
    estimatedTollPerKm: z.number().min(0).optional(),
    perMinuteRate: z.number().min(0).optional(),
    minimumFare: z.number().min(0).optional(),
    waitingChargePerMin: z.number().min(0).optional(),
    freeWaitingMins: z.number().min(0).optional(),
    nightChargeMultiplier: z.number().min(1).optional(),
    nightStartTime: z.string().optional(),
    nightEndTime: z.string().optional(),
    cancellationFee: z.number().min(0).optional(),
    cancellationPercentage: z.number().min(0).max(100).optional(),
    customerCancellationTimeHours: z.number().min(0).optional(),
    driverCancellationTimeHours: z.number().min(0).optional(),
    driverDailyMaxCancellations: z.number().min(0).optional(),
    driverCommissionPercentage: z.number().min(0).max(100).optional(),
    bookingRadiusKm: z.number().min(1).optional(),
    walletMinAmount: z.number().min(0).optional(),
    incentives: incentivesSchema.optional(),
    extraStopCharge: z.number().min(0).optional(),
    taxPercentage: z.number().min(0).optional(),
    isActive: z.boolean().optional(),
  }),
});

export const createFareRuleSchema = z.object({
  body: z.object({
    category: z.string().min(1, 'Category is required'),
    serviceType: z.nativeEnum(ServiceType),
    tripScope: z.nativeEnum(TripScope).default(TripScope.OUTSTATION),
    title: z.string().min(2, 'Title is required'),
    baseFare: z.number().min(0),
    baseDistanceKm: z.number().min(0).default(2),
    perKmRate: z.number().min(0),
    driverBata: z.number().min(0).default(0),
    estimatedTollPerKm: z.number().min(0).default(1.35),
    perMinuteRate: z.number().min(0).default(2),
    minimumFare: z.number().min(0).default(100),
    waitingChargePerMin: z.number().min(0).default(3),
    freeWaitingMins: z.number().min(0).default(5),
    nightChargeMultiplier: z.number().min(1).default(1.25),
    nightStartTime: z.string().default('22:00'),
    nightEndTime: z.string().default('05:00'),
    cancellationFee: z.number().min(0).default(50),
    cancellationPercentage: z.number().min(0).max(100).default(10),
    customerCancellationTimeHours: z.number().min(0).default(1),
    driverCancellationTimeHours: z.number().min(0).default(2),
    driverDailyMaxCancellations: z.number().min(0).default(3),
    driverCommissionPercentage: z.number().min(0).max(100).default(15),
    bookingRadiusKm: z.number().min(1).default(15),
    walletMinAmount: z.number().min(0).default(500),
    incentives: incentivesSchema.optional(),
    extraStopCharge: z.number().min(0).default(50),
    taxPercentage: z.number().min(0).default(5),
    isActive: z.boolean().default(true),
  }),
});

export const createSurgeRuleSchema = z.object({
  body: z.object({
    zoneName: z.string().min(2, 'Zone name is required'),
    multiplier: z.number().min(1.0).max(4.0),
    reason: z.enum(['DEMAND', 'WEATHER', 'PEAK_HOURS', 'FESTIVAL', 'CUSTOM']),
    startTime: z.string().or(z.date()).optional(),
    endTime: z.string().or(z.date()).optional(),
    affectedCategories: z.array(z.string()).default([]),
    isActive: z.boolean().default(true),
  }),
});
