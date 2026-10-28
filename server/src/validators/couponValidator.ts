import { z } from 'zod';
import { VehicleCategory } from '../config/constants';

export const createCouponSchema = z.object({
  body: z.object({
    code: z.string().min(3).max(20).toUpperCase(),
    title: z.string().min(2),
    description: z.string().optional(),
    discountType: z.enum(['PERCENTAGE', 'FLAT']),
    discountValue: z.number().positive(),
    maxDiscountAmount: z.number().positive().default(500),
    minBookingAmount: z.number().min(0).default(0),
    applicableCategories: z.array(z.nativeEnum(VehicleCategory)).default([]),
    usageLimit: z.number().int().positive().default(1000),
    perCustomerLimit: z.number().int().positive().default(1),
    startDate: z.string().or(z.date()),
    endDate: z.string().or(z.date()),
    isActive: z.boolean().default(true),
  }),
});

export const updateCouponSchema = z.object({
  body: z.object({
    title: z.string().min(2).optional(),
    description: z.string().optional(),
    discountType: z.enum(['PERCENTAGE', 'FLAT']).optional(),
    discountValue: z.number().positive().optional(),
    maxDiscountAmount: z.number().positive().optional(),
    minBookingAmount: z.number().min(0).optional(),
    applicableCategories: z.array(z.nativeEnum(VehicleCategory)).optional(),
    usageLimit: z.number().int().positive().optional(),
    perCustomerLimit: z.number().int().positive().optional(),
    startDate: z.string().or(z.date()).optional(),
    endDate: z.string().or(z.date()).optional(),
    isActive: z.boolean().optional(),
  }),
});
