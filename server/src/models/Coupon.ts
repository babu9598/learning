import mongoose, { Document, Schema } from 'mongoose';
import { VehicleCategory } from '../config/constants';

export interface ICoupon extends Document {
  code: string;
  title: string;
  description?: string;
  discountType: 'PERCENTAGE' | 'FLAT';
  discountValue: number;
  maxDiscountAmount: number;
  minBookingAmount: number;
  applicableCategories: VehicleCategory[];
  usageLimit: number;
  perCustomerLimit: number;
  currentUses: number;
  totalDiscountGiven: number;
  revenueGenerated: number;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CouponSchema = new Schema<ICoupon>(
  {
    code: { type: String, required: true, unique: true, uppercase: true, trim: true, index: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    discountType: { type: String, enum: ['PERCENTAGE', 'FLAT'], required: true },
    discountValue: { type: Number, required: true },
    maxDiscountAmount: { type: Number, default: 500 },
    minBookingAmount: { type: Number, default: 0 },
    applicableCategories: [{ type: String, enum: Object.values(VehicleCategory) }],
    usageLimit: { type: Number, default: 1000 },
    perCustomerLimit: { type: Number, default: 1 },
    currentUses: { type: Number, default: 0 },
    totalDiscountGiven: { type: Number, default: 0 },
    revenueGenerated: { type: Number, default: 0 },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    isActive: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);

export const Coupon = mongoose.model<ICoupon>('Coupon', CouponSchema);
